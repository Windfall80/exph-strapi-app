import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '@environments/environment';
import { Category, Service } from '@app/_models';

@Component({
  selector: 'app-servicio-create',
  templateUrl: './servicio-create.component.html',
  styleUrls: ['./servicio-create.component.scss']
})
export class ServicioCreateComponent implements OnInit {
  public serviceForm: FormGroup;
  public categories: Category[] = [];
  public sub_categories: Category[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.serviceForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      image: [null, [Validators.required]],
      image_source: [null],
      main_category: [null, [Validators.required]],
      categories: [null],
      description: [null, [Validators.required]],

      open: [false, [Validators.requiredTrue]],
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
    this.serviceForm.get('categories')?.patchValue(null);
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

    this.http.post<Service>(`${environment.apiUrl}/services`, formData).subscribe(
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
