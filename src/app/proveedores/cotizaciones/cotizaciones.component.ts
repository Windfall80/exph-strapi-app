import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { Quotation, QuotationGroup, QuotationStatus, User } from '@app/_models';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  querySubscription;

  currentUser: User;

  displayedColumns: string[] = ['select', 'id', 'company', 'service', 'date', 'status', 'price', 'badges', 'actions'];
  dataSource = new MatTableDataSource<Quotation>([]);
  selection = new SelectionModel<Quotation>(true, []);

  users: any[] = [];
  motives: any[] = [];
  statuses: QuotationStatus[] = [];

  filters: any = {
    _q: null,
    status: null,
    unread: null,
    tab: 'open'
  }

  _statusInTab: any = {
    open: [1,3,5],
    pending: [2],
    discarded: [4,6],
    finalized: [7],
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    this. querySubscription = this.route.queryParamMap.subscribe(params => {
      this.filters._q = params.get('_q')? params.get('_q'): null;
      this.filters.status = params.get('status')? Number(params.get('status')): null;
      this.filters.user = params.get('user')? Number(params.get('user')): null;
      this.filters.unread = params.get('unread')? params.get('unread')=='true': null;
      if( params.get('tab') ) this.filters.tab = params.get('tab');
      this.applyFilter(false);
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'id': return item.id;
        case 'company': return item.company?.name;
        case 'service': return item.service?.name;
        case 'date': return item.created_at;
        case 'status': return item.status?.id;
        case 'price': return item.offer?.amount;
        default: return (item as any)[property];
      }
    };

    this.dataSource.filterPredicate = (data: any, filter: any) => {
      //filter tab
      if( !this.statusInTab(data.status?.id) ) {
        return false;
      }
      //filter status
      if( this.filters.status !== null ) {
        if (data.status.id != this.filters.status) return false;
      }
      //filter user
      if( this.filters.user !== null ) {
        if (data.user.id != this.filters.user) return false;
      }
      // filter unread
      if( this.filters.unread ) {
        if (!data.chat_room?.unread_b) return false;
      }
      // filter string
      if(filter?._q && filter._q.trim()) {
        const dataStr = JSON.stringify([
          data.id,
          data.company?.name,
          data.service?.name
        ]).toLowerCase();
        return dataStr.indexOf(filter._q.toLowerCase()) != -1;
      }

      return true;
    }
  }

  ngOnInit(): void {
    this.loadQuotations();
    this.loadQuotationStatuses();
    this.loadUsers();
    this.loadDiscardMotives();
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  ngAfterViewInit() {
    //this.sort.disableClear = true;
    //this.sort.sort(({id: 'status', start: 'asc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadQuotations(){
    const params = new HttpParams().append('_sort', 'status:ASC,published_at:DESC');
    this.http.get<Quotation[]>(`${environment.apiUrl}/quotations`, { params }).subscribe(
      (response: Quotation[])=>{
        this.dataSource.data = response;
      },
      (err)=>{}
    );
  }

  loadQuotationStatuses(){
    this.http.get<QuotationStatus[]>(`${environment.apiUrl}/quotation-statuses`).subscribe(
      (response: QuotationStatus[])=>{
        this.statuses = response;
      },
      (err)=>{}
    );
  }

  loadUsers(){
    //const params = new HttpParams().set('id_ne', this.currentUser.id);
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe(
      (response: User[])=>{
        this.users = response.map(x => { return {id: x.id, name: x.username} });
      },
      (err)=>{}
    );
  }

  loadDiscardMotives(){
    const params = new HttpParams();
    this.http.get<any[]>(`${environment.apiUrl}/discard-motives`, { params }).subscribe(
      (response: any[])=>{
        this.motives = response;
      },
      (err)=>{}
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Quotation): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  statusInTab(id: number): boolean{
    if( this.filters.tab !== null && this._statusInTab[this.filters.tab] !== undefined ) {
      return this._statusInTab[this.filters.tab].includes(id);
    }
    return false;
  }


  tabChangue( event: any ) {
    this.filters.status = null;
    this.applyFilter();
  }

  applyFilter( writeRoute = true ) {
    this.dataSource.filter = this.filters;

    if(writeRoute){
      this.router.navigate([],{
        queryParams: this.filters,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  /** bulk selection action */
  bulkAction(){
    console.log(this.selection.isEmpty());
  }

}
