import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { QuotationService } from '@app/_services/quotation.service';
import { Service } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotation-request-form',
  templateUrl: './quotation-request-form.component.html',
  styleUrls: ['./quotation-request-form.component.scss']
})
export class QuotationRequestFormComponent implements OnInit {
  public quotationForm: FormGroup;
  public bulk = false;
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private quotationService: QuotationService,
    private dialogRef: MatDialogRef<QuotationRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public services: Service | number[]
  ) {
    if(Array.isArray(services))
      this.bulk = true;
  }

  ngOnInit(): void {
    this.quotationForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      qty: [null, [Validators.required, Validators.min(1)]],
      details: [null, [Validators.required]],

      file: [null],//, [Validators.required]
      file_source: [null],
      open: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit(){
    if (this.quotationForm.invalid) {
      console.log("form invalid");
      this.quotationForm.markAllAsTouched();
      return;
    }

    if(this.bulk){
      this.submitBulk();
    } else {
      this.submitSingle();
    }

    //this.dialogRef.close(true);
  }

  private async submitBulk(){
    this.wait = true;
    console.log('preparing data...');
    //const _services = (this.services as Service[]).map(_s => { return _s.id });

    const quotationData = this.quotationForm.getRawValue();
    quotationData._services = this.services;
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
    this.http.post<any>(`${environment.apiUrl}/quotations/bulk-create`, quotationData).subscribe(
      (response: any) => {
        this.wait = false;
        console.log(response);
        this.dialogRef.close(true);
        this.router.navigateByUrl("/empresas/cotizaciones");
      },
      (err)=>{
        this.wait = false;
        console.log("Error savin quotations.")
        console.log(err.error);
      }
    );
  }

  private submitSingle(){
    this.wait = true;
    console.log('preparing data...');

    const formData = new FormData();
    const quotationData = this.quotationForm.getRawValue();
    quotationData.service = (this.services as Service).id;
    delete quotationData.file;
    delete quotationData.file_source;

    // apend all data
    formData.append('data', JSON.stringify(quotationData) );
    // append file
    if(this.quotationForm.get('file')?.value)
      formData.append(`files.file`, this.quotationForm.get('file_source')?.value, this.quotationForm.get('file')?.value.split("\\").pop());

    this.http.post<any>(`${environment.apiUrl}/quotations`, formData).subscribe(
      (response: any) => {
        this.wait = false;
        console.log(response);
        this.dialogRef.close(true);
        this.router.navigateByUrl("/empresas/cotizaciones");
      },
      (err)=>{
        this.wait = false;
        console.log("Error saving quotations.")
        console.log(err.error);
      }
    );
  }

}
