import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@environments/environment';
import { Category, User, Service } from '@app/_models';
import { AuthenticationService, ServicesService } from '@app/_services';

@Component({
  selector: 'app-servicio-update',
  templateUrl: './servicio-update.component.html',
  styleUrls: ['./servicio-update.component.scss']
})
export class ServicioUpdateComponent implements OnInit {
  currentUser: User;
  public id: string;
  public service: Service;

  public serviceForm: FormGroup;
  public categories: Category[] = [];
  public sub_categories: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servicesService: ServicesService,
    private authenticationService: AuthenticationService,
    ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });

    this.currentUser = authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadService();
  }

  private loadService(){
    this.servicesService.findById(this.id).subscribe(
      (response: Service) => {
        this.service = response;
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
        let c = this.categories.find(x=>x.id == this.service.main_category?.id);
        if(c) this.sub_categories = c.childrens!;
      },
      (err)=>{}
    );
  }

  public categoryChange($event: any) {
    this.sub_categories = this.categories.find( x=> x.id==$event.value)?.childrens!;
    this.serviceForm.get('categories')?.patchValue(null);
  }

  private initForm(){
    let _selAreas = this.service.categories?.map(x => x.id);
    this.serviceForm = this.formBuilder.group({
      name: [this.service.name, [Validators.required]],
      image: [null],
      image_source: [null],
      main_category: [this.service.main_category?.id, [Validators.required]],
      categories: [_selAreas],
      description: [this.service.description, [Validators.required]],
    });


  }

  onSubmit(): void {
    if (this.serviceForm.invalid) {
      console.log("form invalid");
      this.serviceForm.markAllAsTouched();
      return;
    }

    console.log('submit...');
    this.wait = true;

    const formData = new FormData();
    let data = this.serviceForm.getRawValue();
    delete data.image;
    delete data.image_source;
    // apend all data
    formData.append('data', JSON.stringify(data) );
    // files
    if(this.serviceForm.get('image')?.value)
      formData.append(`files.image`, this.serviceForm.get('image_source')?.value, this.serviceForm.get('image')?.value.split("\\").pop());

    this.http.put<Service>(`${environment.apiUrl}/services/${this.id}`, formData).subscribe(
      (response: Service)=>{
        this.wait = false;
        this.router.navigateByUrl('/proveedores/servicios');
      },
      (err)=>{
        this.wait = false;
        console.log(err);
      }
    );
  }

}
