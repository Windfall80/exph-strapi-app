import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService } from '@app/_services';
import { Quotation, QuotationGroup, QuotationStatus, User } from '@app/_models';

@Component({
  selector: 'app-cotizacion-grupo',
  templateUrl: './cotizacion-grupo.component.html',
  styleUrls: ['./cotizacion-grupo.component.scss']
})
export class CotizacionGrupoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentUser: User;

  private id: string;
  group: QuotationGroup;

  displayedColumns: string[] = ['select', 'id', 'supplier', 'user', 'service', 'date', 'status', 'price', 'badges', 'actions'];
  dataSource = new MatTableDataSource<Quotation>([]);
  selection = new SelectionModel<Quotation>(true, []);

  users: any[] = [];
  motives: any[] = [];
  statuses: QuotationStatus[] = [];

  filters: any = {
    _q: null,
    status: null,
    user: null,
    unread: null,
    notrated: null,
    tab: 'open'
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
    //private formBuilder: FormBuilder,
    private alert: AlertService,
    private authenticationService: AuthenticationService
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('grupoId')!;
    });
    this.currentUser = this.authenticationService.currentUserValue;

    this.route.queryParamMap.subscribe(params => {
      this.filters._q = params.get('_q')? params.get('_q'): null;
      this.filters.status = params.get('status')? Number(params.get('status')): null;
      this.filters.user = params.get('user')? Number(params.get('user')): null;
      this.filters.unread = params.get('unread')? params.get('unread')=='true': null;
      this.filters.notrated = params.get('notrated')? params.get('notrated')=='true': null;
      if( params.get('tab') ) this.filters.tab = params.get('tab');

      console.log(this.filters);
      this.applyFilter(false);
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'id': return item.group?.id + '-' + item.id;
        case 'supplier': return item.supplier?.name;
        case 'user': return item.user?.firstname;
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
        if (!data.chat_room?.unread_a) return false;
      }
      // filter not rated
      if( this.filters.notrated ) {
        if (!(data.status.id==5 && data.rating==null && data.offer?.deliver_at && !moment().isSameOrBefore(moment(data.offer.deliver_at), 'minute'))) return false;
      }

      // filter string
      if(filter?._q && filter._q.trim()) {
        const dataStr = JSON.stringify([
          data.group?.id+"-"+data.id,
          data.supplier?.name,
          data.service?.name
        ]).toLowerCase();
        return dataStr.indexOf(filter._q.toLowerCase()) != -1;
      }


      return true;
    }
  }

  ngOnInit(): void {
    this.loadQuotationGroup();
    this.loadQuotations();
    this.loadQuotationStatuses();
    this.loadUsers();
    this.loadDiscardMotives();
  }

  ngAfterViewInit() {
    //this.sort.disableClear = true;
    this.sort.sort(({id: 'date', start: 'desc'}) as MatSortable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadQuotationGroup(){
    this.http.get<QuotationGroup>(`${environment.apiUrl}/quotation-groups/${this.id}`).subscribe(
      (response: QuotationGroup)=>{
        this.group = response;
      },
      (err)=>{}
    );
  }

  loadQuotations(){
    const params = new HttpParams()
      .set('group', this.id);
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

  share(): void {
    this.alert.open({
      title: "¿Quieres compartir este Grupo?",
      text: "Puedes compartir este grupo de cotizaciones con alguien de tu equipo, sin embargo una vez la asignes ya no podrás contestar los mensajes del chat.",
      input: 'select',
      inputLabel: "Usuario",
      inputPlaceholder: "Nombre del usuario",
      inputOptions: this.users.filter(x => x.id != this.currentUser.id),
      inputRequired: true
    }).then(result=>{
      if(result){
        let {isConfirmed, value} = result;
        if(isConfirmed && value){

          this.http.post<any>(`${environment.apiUrl}/quotation-groups/share/${this.id}`, { user: value }).subscribe(
            (response: any)=>{
              console.log(response);
              this.router.navigateByUrl('/empresas/cotizaciones');
            },
            (err)=>{}
          );
        }
      }
    });
  }

  close(): void {
    this.alert.open({
      title: "¿Estás seguro de cerrar este grupo?",
      text: "Una vez cerrado todas tus cotizaciónes pendientes y me interesan se descartarán y ya no podrás continuar con los procesos.",
      input: 'pills',
      multiple: true,
      inputLabel: "Ayuda al proveedor a mejorar contandole el motivo de tu descarte:",
      inputOptions: this.motives,
      showDetails: (value: number[]) => {
        if(!value) return false;
        return value.includes(6);
      }
    }).then(result=>{
      if(result){
        let {isConfirmed, value, details} = result;
        if(isConfirmed){
          this.http.post<any>(`${environment.apiUrl}/quotation-groups/close/${this.id}`, { discard_motives: value, discard_details: details }).subscribe(
            (response: any)=>{
              window.location.reload();
            },
            (err)=>{}
          );
        }
      }
    });
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
