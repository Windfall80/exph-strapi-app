import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';

import { environment } from '@environments/environment';
import { Supplier } from '@app/_models';
import { QuotationService, ServicesDatasource, ServicesService, SuppliersService } from '@app/_services';

@Component({
  selector: 'app-proveedor-detalles',
  templateUrl: './proveedor-detalles.component.html',
  styleUrls: ['./proveedor-detalles.component.scss']
})
export class ProveedorDetallesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private id: string;
  supplier: Supplier;
  public wait = false;
  dataSource: ServicesDatasource;
  selection = new SelectionModel<any>(true, []);

  filters: any = {}
  sort: any;

  matStars = {
    empty: `${environment.basehref}assets/images/star_outline.svg`,
    half: `${environment.basehref}assets/images/star_half.svg`,
    full: `${environment.basehref}assets/images/star.svg`,
  };
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private suppliersService: SuppliersService,
    private quotationService: QuotationService,
    private servicesService: ServicesService,
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
    });

    this.dataSource = new ServicesDatasource(this.servicesService, undefined, { supplier: this.id });

    this.route.queryParamMap.subscribe(params => {
      this.sort = params.get('sort')? params.get('sort'): null;

      this.applyFilter(false);
    });

  }

  ngOnInit(): void {
    this.loadSupplier();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.load();
  }

  private loadSupplier(){
    this.suppliersService.findById(this.id).subscribe(
      (response: Supplier)=>{
        this.supplier = response;
      },
      (err)=>{ }
    );
  }

  addFav(){
    this.wait = true;
    this.suppliersService.addFav(this.supplier.id).subscribe((res: any)=>{
      this.wait = false;
      this.supplier.isFav = true;
    });
  }

  removeFav(){
    this.wait = true;
    this.suppliersService.removeFav(this.supplier.id).subscribe((res: any)=>{
      this.wait = false;
      this.supplier.isFav = false;
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

  publicUrl(url: string){
    return `${environment.apiUrl}${url}`;
  }

  assetUrl(url: string){
    return `${environment.basehref}${url}`;
  }

}
