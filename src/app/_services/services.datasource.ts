import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subscription } from "rxjs";
import { catchError, finalize, skip } from "rxjs/operators";
import { MatPaginator } from "@angular/material/paginator";

import { FiltersService, ServicesService } from "@app/_services"
import { Service } from "@app/_models";

export class ServicesDatasource implements DataSource<Service> {
  filtersSub: Subscription;

  private servicesSubject = new BehaviorSubject<Service[]>([]);
  public get data() {
    return this.servicesSubject.value;
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
    private servicesService: ServicesService,
    private filterService?: FiltersService,
    private _rootFilter: any = {},
  ) {
    let initialLoad = true;
    if(filterService){
      this.filtersSub = filterService.filters.subscribe((_f: any) => {
        this._sideFilters = _f;
        if(!initialLoad){
          //console.log('LOADING POR LA SUBSCRIPCION DE FILTROS EN DATASOURCE');
          this.load();
        }
      });
    }
    initialLoad = false;
  }

  load(_filters:any = {}) {
    // load root filters set on init
    Object.keys(this._rootFilter).forEach((key) => {
      if(this._rootFilter[key]) _filters[key] = this._rootFilter[key];
    });
    //load filters set on page component
    Object.keys(this.filter).forEach((key) => {
      if(this.filter[key]) _filters[key] = this.filter[key];
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
    this.servicesService.findServices(_filters, this.sort, _start, _limit)
      .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(response => {
        this.servicesSubject.next(response.data);
        this.countSubject.next(response.count);
      });
  }

  connect(collectionViewer?: CollectionViewer): Observable<Service[]> {
    console.log("Connecting data source");
    return this.servicesSubject.asObservable();
  }

  disconnect(collectionViewer?: CollectionViewer): void {
    this.servicesSubject.complete();
    this.loadingSubject.complete();

    if(this.filtersSub && !this.filtersSub.closed) this.filtersSub.unsubscribe();
  }

}
