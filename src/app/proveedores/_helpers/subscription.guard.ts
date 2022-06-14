import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as moment from 'moment';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'any' })
export class SubscriptionGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentUser = this.authenticationService.currentUserValue;

    if(currentUser.supplier?.subscription_status != 'active' ){
      this.router.navigate(['/proveedores/subscripcion-expirada']);
      return false;
    }

    if(!currentUser.supplier?.current_period_end){
      this.router.navigate(['/proveedores/subscripcion-expirada']);
      return false;
    }

    if(!moment().isSameOrBefore(moment(currentUser.supplier?.current_period_end), 'minute')) {
      this.router.navigate(['/proveedores/subscripcion-expirada']);
      return false;
    }

    return true;
  }
}
