import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    await this.authenticationService.checkToken();
    let mod = route.data.module;

    // on landing page redirect to other module if already authenticated
    if( mod == 'landing' ) {
      if(this.authenticationService.isAuthenticated) {
        const currentUser = this.authenticationService.currentUserValue;
        if(currentUser.type == 'company'){
          this.router.navigate(['/empresas']);
          return false;
        }
        if(currentUser.type == 'supplier'){
          this.router.navigate(['/proveedores']);
          return false;
        }
        if(currentUser.type == 'admin'){
          this.router.navigate(['/admin/incidencias']);
          return false;
        }
      }
      return true;
    }

    // for anything else redirect to login or module depending if authenticated and user type
    if (this.authenticationService.isAuthenticated) {
      const currentUser = this.authenticationService.currentUserValue;
      if(mod === 'company'){
        if(currentUser.type == 'supplier'){
          this.router.navigate(['/proveedores']);
          return false;
        }
        if(currentUser.type == 'admin'){
          this.router.navigate(['/admin/incidencias']);
          return false;
        }
      }
      if(mod === 'supplier'){
        if(currentUser.type == 'company'){
          this.router.navigate(['/empresas']);
          return false;
        }
        if(currentUser.type == 'admin'){
          this.router.navigate(['/admin/incidencias']);
          return false;
        }
      }
      if(mod === 'admin'){
        if(currentUser.type){
          if(currentUser.type == 'company'){
            this.router.navigate(['/proveedores']);
            return false;
          }
          if(currentUser.type == 'supplier'){
            this.router.navigate(['/empresas']);
            return false;
          }
        }
      }
      return true;
    }
    // not logged in so redirect to login page with the return url: , {queryParams: { returnUrl: state.url }}
    this.router.navigate(['/login']);
    return false;
  }
}
