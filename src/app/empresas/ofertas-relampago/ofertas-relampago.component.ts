import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { OfferRequest, QuotationStatus, User } from '@app/_models';

@Component({
  selector: 'app-ofertas-relampago',
  templateUrl: './ofertas-relampago.component.html',
  styleUrls: ['./ofertas-relampago.component.scss']
})
export class OfertasRelampagoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  querySubscription;

  currentUser: User;

  displayedColumns: string[] = ['select', 'id', 'supplier', 'offer', 'date', 'status', 'price', 'badges', 'actions'];
  dataSource = new MatTableDataSource<OfferRequest>([]);
  selection = new SelectionModel<OfferRequest>(true, []);

  users: any[] = [];
  motives: any[] = [];
  statuses: QuotationStatus[] = [];

  filters: any = {
    _q: null,
    status: null,
    unread: null,
    tab: 'open'
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
        case 'supplier': return item.supplier?.name;
        case 'offer': return item.offer?.name;
        case 'date': return item.created_at;
        case 'status': return item.status?.id;
        case 'price': return item.offer?.price;
        default: return (item as any)[property];
      }
    };

    this.dataSource.filterPredicate = (data: any, filter: any) => {
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
        if (!data.chat_room?.unread_a) return false;
      }
      // filter string
      if(filter?._q && filter._q.trim()) {
        const dataStr = JSON.stringify([
          data.id,
          data.supplier?.name,
          data.offer?.name
        ]).toLowerCase();
        return dataStr.indexOf(filter._q.toLowerCase()) != -1;
      }

      return true;
    }
  }

  ngOnInit(): void {
    this.loadQuotationStatuses();
    this.loadUsers();
    this.loadDiscardMotives();
    this.loadRequests();
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  ngAfterViewInit() {
    //this.sort.disableClear = true;
    this.sort.sort(({id: 'date', start: 'desc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadRequests(){
    const params = new HttpParams();
    this.http.get<OfferRequest[]>(`${environment.apiUrl}/offer-requests`, { params }).subscribe(
      (response: OfferRequest[])=>{
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
  checkboxLabel(row?: OfferRequest): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
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
