import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

import { UsuarioAddFormComponent } from './usuario-add-form/usuario-add-form.component';
import { UsuarioEditFormComponent } from './usuario-edit-form/usuario-edit-form.component';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { AlertService } from '@app/_services';

import { Plan, User } from '@app/_models';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  _userSub: Subscription;
  currentUser: User;
  currentPlan: Plan;

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  displayedColumns: string[] = ['select', 'name', 'last_name', 'area', 'email', 'actions'];//, 'role'
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);

  constructor(
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog,
    private alert: AlertService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._userSub = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.loadUsers();
    this.loadPlan();
  }

  ngOnDestroy():void {
    this._userSub.unsubscribe();
  }

  loadUsers(){
    let params = new HttpParams();//.set('role', '4')
    this.http.get<User[]>(`${environment.apiUrl}/users`, { params }).subscribe(
      (response: User[])=>{
        this.dataSource.data = response;
      },
      (err)=>{}
    );
  }

  loadPlan(){
    this.http.get<Plan>(`${environment.apiUrl}/plans/${this.currentUser.supplier?.plan}`).subscribe(
      (response: Plan)=>{
        this.currentPlan = response;
      },
      (err)=>{}
    );
  }

  openAdd(): void {
    const dialogRef = this.dialog.open(UsuarioAddFormComponent, {
      width: '644px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        this.dataSource.data.push(result);
        this.table.renderRows();
      }
    });
  }

  openEdit(row: User): void {
    const dialogRef = this.dialog.open(UsuarioEditFormComponent, {
      width: '644px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(result){
        let i = this.dataSource.data.findIndex( (r)=>{ return r.id == result.id } );
        this.dataSource.data[i] = result;
        this.table.renderRows();
      }
    });
  }

  public delete(row: User){
    if( row.role.id == 3 || row.id == this.currentUser.id ){
      console.error("No se puede borrar el usuario!");
      return;
    }

    this.alert.open({
      title: "¿Estás seguro de eliminar este Usuario?",
      text: "Una vez eliminado el usuario no podra recuperar sus cotizaciónes, las cotizaciónes actuales seran traspasadas al administrador.",
    }).then(result=>{
      if(result){
        console.log("borrando usuario:", result);
        this.http.delete<any>(`${environment.apiUrl}/users/${row.id}`).subscribe(
          (response: Plan)=>{
            console.log(response);

            let i = this.dataSource.data.findIndex( (r)=>{ return r.id == row.id } );
            if (i > -1) {
              this.dataSource.data.splice(i, 1);
            }
            this.table.renderRows();
          },
          (err)=>{}
        );
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
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** bulk selection action */
  bulkAction(){
    console.log(this.selection.isEmpty());
  }

  public avalibleUsers(){
    return this.currentPlan?.users - this.dataSource.data.length;
  }
}
