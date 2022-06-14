import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { Service } from '@app/_models';
import { FiltersService, QuotationService, ServicesDatasource, ServicesService } from '@app/_services';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss']
})
export class BusquedaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  navSubscription;
  querySubscription;

  dataSource: ServicesDatasource;
  selection = new SelectionModel<number>(true, []);

  filters: any = {
    _q: null,
  }
  sort: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private quotationService: QuotationService,
    private servicesService: ServicesService,
    private filterService: FiltersService,
  ) {
    this.querySubscription = this.route.queryParamMap.subscribe(params => {
      this.filters._q = params.get('_q')? params.get('_q'): null;
      this.sort = params.get('sort')? params.get('sort'): null;
    });

    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites(): void {
    console.log('init invites');
    this.dataSource = new ServicesDatasource(this.servicesService, this.filterService, {});
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.applyFilter(true);
  }

  ngOnInit(): void {
    console.log('init');
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
    this.navSubscription.unsubscribe();

    this.dataSource.disconnect();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
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

  bulkRequest(){
    this.quotationService.openQuotationForm(this.selection.selected).then(result => {
      console.log(result);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data?.length;
    if(numRows)
      for(let _r of this.dataSource.data) {
        if(!this.selection.selected.includes(_r.id)) return false;
      }
    return true;
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
