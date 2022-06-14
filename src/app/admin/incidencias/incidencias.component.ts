import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { IncidenciaReportarComponent } from './incidencia-reportar/incidencia-reportar.component';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { AlertService } from '@app/_services/alert.service';

import { Issue, User } from '@app/_models';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.scss']
})
export class IncidenciasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<Issue>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentUser: User;

  displayedColumns: string[] = ['id', 'user', 'date', 'name', 'status', 'badges', 'actions'];
  dataSource = new MatTableDataSource<Issue>([]);

  statuses: any[] = [];
  users: any[] = [];

  filters: any = {
    status: null,
    user: null,
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
  ) {
    this.currentUser = authenticationService.currentUserValue;

    this.route.queryParamMap.subscribe(params => {
      this.filters._q = params.get('_q')? params.get('_q'): null;
      this.filters.status = params.get('status')? Number(params.get('status')): null;
      this.filters.user = params.get('user')? Number(params.get('user')): null;
      if( params.get('tab') ) this.filters.tab = params.get('tab');
      this.applyFilter(false);
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'id': return item.id;
        case 'user': return item.user?.username;
        case 'date': return item.created_at;
        case 'name': return item.type?.name;
        case 'status': return item.status?.id;
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
      // filter string
      if(filter?._q && filter._q.trim()) {
        const dataStr = JSON.stringify([
          data.id
        ]).toLowerCase();
        return dataStr.indexOf(filter._q.toLowerCase()) != -1;
      }

      return true;
    }
  }

  ngOnInit(): void {
    this.loadIssues();
    this.loadStatuses()
    //this.loadUsers();
  }

  ngAfterViewInit() {
    //this.sort.disableClear = true;
    //this.sort.sort(({id: 'date', start: 'desc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadIssues(){ 
    this.http.get<Issue[]>(`${environment.apiUrl}/issues`).subscribe(
      (response: Issue[])=>{
        this.dataSource.data = response;
      },
      (err)=>{}
    );
  }

  loadStatuses(){
    this.http.get<any[]>(`${environment.apiUrl}/issue-statuses`).subscribe(
      (response: any[])=>{
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

  openReport(): void {
    const dialogRef = this.dialog.open(IncidenciaReportarComponent, {
      width: '677px',
      panelClass: ['dialog-py-48', 'dialog-px-75'],
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.dataSource.data.push(result);
        this.table.renderRows();
        this.applyFilter(false);
      }
    });
  }

}
