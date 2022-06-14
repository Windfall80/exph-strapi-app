import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { FiltersService, SuppliersDatasource, SuppliersService } from '@app/_services';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  navSubscription;
  //paramSubscription;
  querySubscription;

  dataSource: SuppliersDatasource;
  selection = new SelectionModel<number>(true, []);

  sort: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private suppliersService: SuppliersService,
    private filterService: FiltersService,
  ) {
    this.querySubscription = this.route.queryParamMap.subscribe(params => {
      this.sort = params.get('sort')? params.get('sort'): null;
    });

    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites(): void {
    //console.log('init invites');
    if(this.dataSource) this.dataSource.disconnect();
    this.dataSource = new SuppliersDatasource(this.suppliersService, this.filterService);
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.applyFilter(true);
  }

  ngOnInit(): void {
    //this.loadSuppliersList();
  }

  ngOnDestroy(): void {
    //this.paramSubscription.unsubscribe();
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

    this.dataSource.sort = this.sort;

    if( update ){
      this.dataSource.load();
      this.router.navigate([],{
        queryParams: { sort: this.sort },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

}
