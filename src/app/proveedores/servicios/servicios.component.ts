import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { AlertService, AuthenticationService, ServicesDatasource, ServicesService } from '@app/_services';
import { Category, Service, User } from '@app/_models';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentUser: User;

  dataSource: ServicesDatasource;
  selection = new SelectionModel<number>(true, []);

  categories: Category[] = [];

  filters: any = {
    _q: null,
    main_category: null,
  }
  sort: any;

  count: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
    private authenticationService: AuthenticationService,
    private servicesService: ServicesService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    this.dataSource = new ServicesDatasource(this.servicesService);

    this.route.queryParamMap.subscribe(params => {
      this.filters._q = params.get('_q')? params.get('_q'): null;
      this.filters.main_category = params.get('main_category')? Number(params.get('main_category')): null;
      this.sort = params.get('sort')? params.get('sort'): null;

      this.applyFilter(false);
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.countAll()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
  }

  public countAll(){
    this.http.get<number>(`${environment.apiUrl}/services/count`).subscribe(
      (response: number)=>{
        this.count = response;
      },
      (err)=>{}
    );
  }

  loadCategories(){
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe(
      (response: Category[])=>{
        this.categories = response;
      },
      (err)=>{}
    );
  }

  public delete(row: Service){
    this.alert.open({
      title: "¿Estás seguro de eliminar este servicio?",
      text: "Una vez eliminado este servicio ya no se podrás recibir solicitudes de cotizacion para este.",
    }).then(result=>{
      if(result){
        console.log("borrando servicio:", result);
        this.http.delete<any>(`${environment.apiUrl}/services/${row.id}`).subscribe(
          (response: any)=>{
            console.log(response);

            let i = this.dataSource.data.findIndex( (r)=>{ return r.id == row.id } );
            if (i > -1) {
              this.dataSource.data.splice(i, 1);
            }
          },
          (err)=>{}
        );
      }
    });
  }

  applyFilter( update = true ) {
    this.selection.clear();
    if(this.paginator)
      this.paginator.firstPage();

    this.dataSource.filter = this.filters;
    this.dataSource.sort = this.sort;

    if( update ){
      this.dataSource.load();
      this.router.navigate([],{
        queryParams: {...this.filters, sort: this.sort},
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  /** bulk selection action */
  bulkAction(){
    console.log(this.selection.selected);
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

    this.selection.select(...this.dataSource.data.map(x=> {return x.id}));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row.id) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}
