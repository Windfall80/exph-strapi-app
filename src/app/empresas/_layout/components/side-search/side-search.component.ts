import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChip, MatChipListChange } from '@angular/material/chips';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { PaymentTerm, PaymentMethod, Category } from '@app/_models';
import { FiltersService } from '@app/_services';

@Component({
  selector: 'app-side-search',
  templateUrl: './side-search.component.html',
  styleUrls: ['./side-search.component.scss']
})
export class SideSearchComponent implements OnInit, OnDestroy {
  navSubscription;
  skipReload = false;
  is_cat_page = false;
  slug: string;

  public filterForm: FormGroup;
  get categoriesFormArray() { return this.filterForm.controls.categories as FormArray; }

  public categories: Map<Category, boolean> = new Map<Category, boolean>();
  public sub_categories: Map<Category, boolean> = new Map<Category, boolean>();
  public payment_methods: Map<PaymentMethod, boolean> = new Map<PaymentMethod, boolean>();
  public payment_terms:  Map<PaymentTerm, boolean> = new Map<PaymentTerm, boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private filterService: FiltersService
  ) {

    this.checkSlug();
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.checkSlug();
      }
    });

    let cv = this.filterService.currentFiltersValue;
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

  ngOnDestroy(): void {
    this.navSubscription.unsubscribe();
  }

  checkSlug(){
    let currentRoute = this.router.url;
    this.is_cat_page = currentRoute.startsWith('/empresas/catalogo/category');
    this.slug = this.route.children[0].snapshot.paramMap.get('slug')!;
  }

  toggleSelection(chip: MatChip) {
    chip.toggleSelected(true);
  }

  categoryChangue(){
    let selected = this.filterForm.get('categories')?.value;
    if(this.is_cat_page && selected.length && this.router.url.split('?')[0] != "/empresas/catalogo") {
      this.skipReload = true;
      this.router.navigate(["/empresas/catalogo"], {state: { ignoreInitial: true }});
      //this.location.replaceState('/empresas/catalogo');
      //this.filterService.killSlug(true);
    }
  }

}
