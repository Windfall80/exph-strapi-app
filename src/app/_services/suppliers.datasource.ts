import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subscription } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { MatPaginator } from "@angular/material/paginator";

import { FiltersService, SuppliersService } from "@app/_services"
import { Supplier } from "@app/_models";

export class SuppliersDatasource implements DataSource<Supplier> {
  filtersSub: Subscription;

  private dataSubject = new BehaviorSubject<Supplier[]>([]);
  public get data() {
    return this.dataSubject.value;
  }

  private countSubject = new BehaviorSubject<number>(0);
  public get count() {
    return this.countSubject.value;
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private _filter:any = {};
  get filter() { return this._filter; }
  set filter(_f: any) {
    this._filter = _f;
    //this.load();
  }

  private _sideFilters: any;

  private _sort: string;
  get sort() { return this._sort; }
  set sort(_s: any) {
    this._sort = _s;
    //this.load();
  }

  private _paginator: MatPaginator;
  get paginator() { return this._paginator; }
  set paginator(_p: MatPaginator) {
    this._paginator = _p;
    this._paginator.page.subscribe(next=>{this.load();});
  }

  constructor(
    private servicesService: SuppliersService,
    private filterService?: FiltersService,
    private _globalFilter: any = {}
  ) {
    if(filterService)
      this.filtersSub = filterService.filters.subscribe((_f: any) => {
        this._sideFilters = _f;
        this.load();
      });
  }

  load(_filters:any = {}) {
    // load root filters set on init
    Object.keys(this.filter).forEach((key) => {
      if(this.filter[key]) _filters[key] = this.filter[key];
    });
    //load filters set on page component
    Object.keys(this._globalFilter).forEach((key) => {
      if(this._globalFilter[key]) _filters[key] = this._globalFilter[key];
    });
    //load filters set on sidenav component
    if(this._sideFilters){
      Object.keys(this._sideFilters).forEach((key) => {
        if(this._sideFilters[key]) _filters[key] = Array.isArray(this._sideFilters[key])? JSON.stringify(this._sideFilters[key]) : this._sideFilters[key];
      });
    }

    let _start = this.paginator? (this.paginator.pageIndex) * this.paginator.pageSize : 0;
    let _limit = this.paginator? this.paginator.pageSize : 5;

    this.loadingSubject.next(true);
    this.servicesService.find(_filters, this.sort, _start, _limit)
      .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.dataSubject.next(response.data);
        this.countSubject.next(response.count);
      });
  }

  connect(collectionViewer?: CollectionViewer): Observable<Supplier[]> {
    console.log("Connecting data source");
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer?: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();

    if(this.filtersSub && !this.filtersSub.closed) this.filtersSub.unsubscribe();
  }

}
