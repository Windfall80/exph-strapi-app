import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@environments/environment';
import { Category, Service } from '@app/_models';

@Component({
  selector: 'app-oferta-create',
  templateUrl: './oferta-create.component.html',
  styleUrls: ['./oferta-create.component.scss']
})
export class OfertaCreateComponent implements OnInit {
  public formGroup: FormGroup;
  public categories: Category[] = [];
  public sub_categories: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      image: [null, [Validators.required]],
      image_source: [null],
      main_category: [null, [Validators.required]],
      categories: [null],
      description: [null, [Validators.required]],

      check: [false, [Validators.requiredTrue]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(){
    let params = new HttpParams()
      .append('depth', 0)
      .append('_sort', 'position:ASC');

    this.http.get<Category[]>(`${environment.apiUrl}/categories`, { params }).subscribe(
      (response: Category[])=>{
        this.categories = response;
      },
      (err)=>{}
    );
  }

  public categoryChange($event: any) {
    this.sub_categories = this.categories.find( x=> x.id==$event.value)?.childrens!;
    this.formGroup.get('categories')?.patchValue(null);
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

    this.http.post<Service>(`${environment.apiUrl}/offers`, formData).subscribe(
      (response: Service)=>{
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
