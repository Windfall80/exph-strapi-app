import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { AlertService } from '@app/_services/alert.service';

import { QuotationGroup, User } from '@app/_models';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['select', 'id', 'name', 'user', 'number', 'date', 'actions'];
  dataSource = new MatTableDataSource<QuotationGroup>([]);
  selection = new SelectionModel<QuotationGroup>(true, []);

  users: any[] = [];

  filters: any = {
    _q: null,
    status: null,
    user: null
  }

  _statusInTab: any = {
    open: [2,3,5],
    discarded: [4,6],
    finalized: [7],
    outbox: [1]
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParamMap.subscribe(params => {
        this.filters._q = params.get('_q')? params.get('_q'): null;
        this.filters.status = params.get('status')? Number(params.get('status')): null;
        this.filters.user = params.get('user')? Number(params.get('user')): null;

        this.applyFilter(false);
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'user': return item.user?.firstname;
        case 'number': return item.quotations?.length;
        case 'date': return item.created_at;
        default: return (item as any)[property];
      }
    };

    this.dataSource.filterPredicate = (data: any, filter: any) => {
      //filter status
      if( this.filters.status !== null ) {
        if (data.status != this.filters.status) return false;
      }
      //filter user
      if( this.filters.user !== null ) {
        if (data.user.id != this.filters.user) return false;
      }
      // filter string
      if(filter?._q && filter._q.trim()) {
        const dataStr = JSON.stringify([
          data.id,
          data.name
        ]).toLowerCase();
        return dataStr.indexOf(filter._q.toLowerCase()) != -1;
      }

      return true;
    }
  }

  ngOnInit(): void {
    this.loadQuotationGroups();
    this.loadUsers();
  }

  ngAfterViewInit() {
    //this.sort.disableClear = true;
    this.sort.sort(({id: 'date', start: 'desc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadQuotationGroups(){
    this.http.get<QuotationGroup[]>(`${environment.apiUrl}/quotation-groups`).subscribe(
      (response: QuotationGroup[])=>{
        this.dataSource.data = response;
      },
      (err)=>{}
    );
  }

  loadUsers(){
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe(
      (response: User[])=>{
        this.users = response.map(x => { return {id: x.id, name: x.username} });
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
  checkboxLabel(row?: QuotationGroup): string {
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

  countInTab(group: QuotationGroup, tab:string) {
    let ig = group.quotations?.filter(x => this._statusInTab[tab].includes(x.status));
    return ig?.length;
  }
}
