import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChip, MatChipListChange } from '@angular/material/chips';
import { forkJoin } from 'rxjs';

import { PaymentTerm, PaymentMethod, Category } from '@app/_models';
import { FiltersService } from '@app/_services';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.scss']
})
export class SideSearchComponent implements OnInit {
  public filterForm: FormGroup;
  get categoriesFormArray() { return this.filterForm.controls.categories as FormArray; }

  public categories: Map<Category, boolean> = new Map<Category, boolean>();
  public sub_categories: Map<Category, boolean> = new Map<Category, boolean>();
  public payment_methods: Map<PaymentMethod, boolean> = new Map<PaymentMethod, boolean>();
  public payment_terms:  Map<PaymentTerm, boolean> = new Map<PaymentTerm, boolean>();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private filterService: FiltersService
  ) {
    let cv =this.filterService.currentFiltersValue;
    this.filterForm = this.formBuilder.group({
      _q: [cv._q? cv._q:null],
      _favs: [cv._favs? cv._favs:false],
      categories: [cv.categories? cv.categories:null],
      payment_terms: [cv.payment_terms? cv.payment_terms:null],
      payment_methods: [cv.payment_methods? cv.payment_methods:null],
    });

    this.filterForm.valueChanges.pipe(debounceTime(500)).subscribe((event) => {
      let data = this.filterForm.getRawValue();
      this.filterService.setFilters(data);
    });
  }

  addCategories() {
    this.categories.forEach(() => this.categoriesFormArray.push(new FormControl(false)));
  }

  ngOnInit(): void {
    forkJoin([this.filterService.getCategories(), this.filterService.getPaymentMethods(), this.filterService.getPaymentTerms()]).subscribe(
      ([categories, methods, terms]) => {
        // categories
        categories.forEach(cat => {
          cat.depth==0 ? this.categories.set(cat, false) : this.sub_categories.set(cat, false);
        });
        //this.addCategories();

        // methods
        methods.forEach(pm => this.payment_methods.set(pm, false));

        // terms
        terms.forEach(pt => this.payment_terms.set(pt, false));

        //this.updateSelectedFilters();
      }
    );
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }

}
