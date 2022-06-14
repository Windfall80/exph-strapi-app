import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@environments/environment';
import { Category, User, Offer } from '@app/_models';
import { AuthenticationService, OffersService, ServicesService } from '@app/_services';

@Component({
  selector: 'app-oferta-update',
  templateUrl: './oferta-update.component.html',
  styleUrls: ['./oferta-update.component.scss']
})
export class OfertaUpdateComponent implements OnInit {
  currentUser: User;
  public id: string;
  public offer: Offer;

  public formGroup: FormGroup;
  public categories: Category[] = [];
  public sub_categories: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private authenticationService: AuthenticationService,
    ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });

    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadOffer();
  }

  private loadOffer(){
    this.offersService.findById(this.id).subscribe(
      (response: Offer) => {
        this.offer = response;
        this.loadCategories();
        this.initForm();
      });
  }

  private loadCategories(){
    let params = new HttpParams()
      .append('depth', 0)
      .append('_sort', 'position:ASC');

    this.http.get<Category[]>(`${environment.apiUrl}/categories`, { params }).subscribe(
      (response: Category[])=>{
        this.categories = response;
        let c = this.categories.find(x=>x.id == this.offer.main_category?.id);
        if(c) this.sub_categories = c.childrens!;
      },
      (err)=>{}
    );
  }

  public categoryChange($event: any) {
    this.sub_categories = this.categories.find( x=> x.id==$event.value)?.childrens!;
    this.formGroup.get('categories')?.patchValue(null);
  }

  private initForm(){
    let _selAreas = this.offer.categories?.map(x => x.id);
    this.formGroup = this.formBuilder.group({
      name: [this.offer.name, [Validators.required]],
      price: [this.offer.price, [Validators.required]],
      image: [null],
      image_source: [null],
      main_category: [this.offer.main_category?.id, [Validators.required]],
      categories: [_selAreas],
      description: [this.offer.description, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      console.log("form invalid");
      this.formGroup.markAllAsTouched();
      return;
    }

    console.log('submit...');
    this.wait = true;

    const formData = new FormData();
    let data = this.formGroup.getRawValue();
    delete data.image;
    delete data.image_source;
    // apend all data
    formData.append('data', JSON.stringify(data) );
    // files
    if(this.formGroup.get('image')?.value)
      formData.append(`files.image`, this.formGroup.get('image_source')?.value, this.formGroup.get('image')?.value.split("\\").pop());

    this.http.put<Offer>(`${environment.apiUrl}/offers/${this.id}`, formData).subscribe(
      (response: Offer)=>{
        this.wait = false;
        this.router.navigateByUrl('/proveedores/ofertas');
      },
      (err)=>{
        this.wait = false;
        console.log(err);
      }
    );
  }

}
