import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { OffersDatasource, OffersService, FiltersService, SocketioService } from '@app/_services';

@Component({
  selector: 'app-ofertas-relampago',
  templateUrl: './ofertas-relampago.component.html',
  styleUrls: ['./ofertas-relampago.component.scss']
})
export class OfertasRelampagoComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  navSubscription;
  paramSubscription;
  querySubscription;

  dataSource: OffersDatasource;

  requested: boolean;

  filters: any = {
    _q: null,
  }
  sort: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private offersService: OffersService,
    private filterService: FiltersService,
  ) {
    this.paramSubscription = this.route.paramMap.subscribe(params => {});

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
    //console.log('init invites');
    if(this.dataSource) this.dataSource.disconnect();
    this.dataSource = new OffersDatasource(this.offersService, this.filterService, {});
    if(this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.applyFilter(true);
  }

  ngOnInit(): void {
    //console.log('init');
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
    this.querySubscription.unsubscribe();
    this.navSubscription.unsubscribe();

    this.dataSource.disconnect();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.load();
  }

  applyFilter( update = true ) {
    // this.selection.clear();
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

}
