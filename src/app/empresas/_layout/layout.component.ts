import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  public sidebar = 'nav';
  private sidebarSub: Subscription;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public route: ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.sidebarSub = this.route.data.subscribe(data => this.sidebar = data.sidebar);

    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sidebarSub.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
