import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { QuotationService } from '@app/_services/quotation.service';
import { Category, PaymentMethod, PaymentTerm, Service } from '@app/_models';
import { Router } from '@angular/router';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.scss']
})
export class CotizadorComponent implements OnInit {
  public quotationForm: FormGroup;
  get supplier_criteria() { return this.quotationForm.get('supplier_criteria') as FormGroup; }

  public categories: Category[] = [];
  public sub_categories: Category[] = [];
  public payment_terms: PaymentTerm[] = [];
  public payment_methods: PaymentMethod[] = [];
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private quotationService: QuotationService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPaymentTermsList();
    this.loadPaymentMethodsList();
    this.initForm();
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
    this.quotationForm.get('categories')?.patchValue(null);
  }

  private loadPaymentTermsList(){
    this.http.get<PaymentTerm[]>(`${environment.apiUrl}/payment-terms`).subscribe(
      (response: PaymentTerm[])=>{
        this.payment_terms = response;
      },
      (err)=>{}
    );
  }

  private loadPaymentMethodsList(){
    this.http.get<PaymentMethod[]>(`${environment.apiUrl}/payment-methods`).subscribe(
      (response: PaymentMethod[])=>{
        this.payment_methods = response;
      },
      (err)=>{}
    );
  }

  initForm() {
    this.quotationForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      qty: [null, [Validators.min(1)]],

      supplier_criteria: this.formBuilder.group({
        main_category: [ null , [Validators.required]],
        categories: [ null ],
        payment_methods: [null, [Validators.required]],
        payment_terms: [null, [Validators.required]],
      }),

      details: [null, [Validators.required]],
      file: [null],//, [Validators.required]
      file_source: [null],
      open: [false, [Validators.requiredTrue]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.quotationForm.invalid) {
      console.log("form invalid");
      this.markFormGroupTouched(this.quotationForm);
      return;
    }

    this.wait = true;
    console.log('preparing data...');
    //const _services = (this.services as Service[]).map(_s => { return _s.id });

    const quotationData = this.quotationForm.getRawValue();
    delete quotationData.file;
    delete quotationData.file_source;

    if(this.quotationForm.get('file')?.value){
      console.log("upload file...");
      const formData = new FormData();
      formData.append('files', this.quotationForm.get('file_source')?.value);

      try{
        let file = await this.http.post<any[]>(`${environment.apiUrl}/upload`, formData).toPromise();
        if(file && file.length){
          quotationData.file = file[0].id;
        }
      } catch(err) {
        console.log('error uploading file');
      }
    }

    console.log("saving quotations...");
    this.http.post<any>(`${environment.apiUrl}/quotations/auto-create`, quotationData).subscribe(
      (response: any) => {
        this.wait = false;
        console.log(response);
        this.router.navigateByUrl("/empresas/cotizaciones");
      },
      (err)=>{
        this.wait = false;
        console.log("Error saving quotations.")
        console.log(err.error);
      }
    );
  }

  public markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }

}
