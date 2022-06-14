import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Service } from '@app/_models';
import { ServicesService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  formGroup: FormGroup;

  filteredOptions: Service[];
  isLoading = false;
  errorMsg: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private servicesService: ServicesService
  ) {
    const _q = this.route.snapshot.queryParamMap.get('_q');

    this.formGroup = this.formBuilder.group({
      _q: [_q]
    });
  }

  ngOnInit(): void {
    this.formGroup.get('_q')?.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filteredOptions = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          if(!value) return of(null);
          return this.servicesService.findServices({_q: value}, 'id:DESC', 0, 10).pipe(
            finalize(() => {
              this.isLoading = false
            }),
          );
        })
      )
      .subscribe( (result: any) => {
        if(result) this.filteredOptions = result.data;
      },
      (err)=>{
        console.log(err);
      });
  }

  clear(){
    this.formGroup.reset();
  }

  onSubmit() {
    let _q = this.formGroup.get('_q')?.value;
    if(_q && _q.trim()){
      this.router.navigate(['/empresas/catalogo/busqueda'], {
        queryParams: { _q },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
