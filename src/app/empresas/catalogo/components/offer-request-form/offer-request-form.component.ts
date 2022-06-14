import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { environment } from '@environments/environment';
import { OffersService } from '@app/_services/offers.service';
import { Offer } from '@app/_models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-request-form',
  templateUrl: './offer-request-form.component.html',
  styleUrls: ['./offer-request-form.component.scss']
})
export class OfferRequestFormComponent implements OnInit {
  public requestForm: FormGroup;
  public wait = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private offerService: OffersService,
    private dialogRef: MatDialogRef<OfferRequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public offer: Offer
  ) {}

  ngOnInit(): void {
    this.requestForm = this.formBuilder.group({
      details: [null, [Validators.required]],
      check: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit(){
    if (this.requestForm.invalid) {
      console.log("form invalid");
      this.requestForm.markAllAsTouched();
      return;
    }

    this.submitSingle();

    //this.dialogRef.close(true);
  }

  private submitSingle(){
    this.wait = true;
    console.log('preparing data...');

    const data = this.requestForm.getRawValue();
    data.offer = this.offer.id;

    this.http.post<any>(`${environment.apiUrl}/offer-requests`, data).subscribe(
      (response: any) => {
        this.wait = false;
        console.log(response);
        this.dialogRef.close(response);
      },
      (err)=>{
        this.wait = false;
        console.log("Error savin offer-request.")
        console.log(err.error);
      }
    );
  }

}
