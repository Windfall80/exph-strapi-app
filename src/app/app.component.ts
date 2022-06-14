import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

import * as AOS from 'aos';

import { AuthenticationService } from './_services';
import { SocketioService } from '@app/_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'exph-app';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private socketService: SocketioService,
    ) {
    this.matIconRegistry.addSvgIcon("check", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/check.svg"));
    this.matIconRegistry.addSvgIcon("reject", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/reject.svg"));
    this.matIconRegistry.addSvgIcon("hands-home", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/hands-home.svg"));
    this.matIconRegistry.addSvgIcon("mnsg", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/mnsg.svg"));
    this.matIconRegistry.addSvgIcon("mnsg-disable", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/mnsg-disable.svg"));
    this.matIconRegistry.addSvgIcon("star", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/star.svg"));
    this.matIconRegistry.addSvgIcon("star-active", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/star-active.svg"));
    this.matIconRegistry.addSvgIcon("star-disable", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/star-disable.svg"));

    this.matIconRegistry.addSvgIcon("cotizacion", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizacion.svg"));
    this.matIconRegistry.addSvgIcon("cotizacion-active", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizacion-active.svg"));
    this.matIconRegistry.addSvgIcon("cotizacion-pending", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizacion-pending.svg"));
    this.matIconRegistry.addSvgIcon("cotizacion-reject", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizacion-reject.svg"));
    this.matIconRegistry.addSvgIcon("cotizacion-disable", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizacion-disable.svg"));
    this.matIconRegistry.addSvgIcon("cotizaciones-home", this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cotizaciones-home.svg"));

    this.authenticationService.authenticationState.subscribe(state => {
      //if(this.authenticationService.tokenChecked) {
        if( state ) {
          // setup socken on logged in state
          this.socketService.setupSocketConnection(
            this.authenticationService.currentUserValue.id,
            this.authenticationService.currentUserValue.type
          );
        } else { }
      //}
    });

    AOS.init();
  }


}
