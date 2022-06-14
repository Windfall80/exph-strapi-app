
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Storage } from '@ionic/storage-angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { AlertService } from './alert.service';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { SocketioService } from './socketio.service';

const TOKEN_KEY = environment.TOKEN_KEY? environment.TOKEN_KEY:'access_token';
const USER_KEY = environment.USER_KEY? environment.USER_KEY:'user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public authenticationState = new BehaviorSubject(false);
  public tokenSubject = new BehaviorSubject<string>(null!);
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  // banderas para checar e inicializar solo una vez
  public tokenChecked = false;
  public storageInit = false;

  public get isAuthenticated() {
    return this.authenticationState.value;
  }

  public get _token() {
    return this.tokenSubject.value;
  }

  public get currentUserValue(): User {
      return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(null!);
    this.currentUser = this.currentUserSubject.asObservable();

    this.initStorage();
  }

  async initStorage(){
    if(!this.storageInit){
      await this.storage.create();
      this.storageInit = true;
    }
  }

  async checkToken() {
    if(!this.tokenChecked) {
      let token: string = await this.storage.get(TOKEN_KEY);
      if(token) {
        let isExpired = this.helper.isTokenExpired(token);

        if(!isExpired) {
          //user autenticated, get user info from storage
          let user: User = await this.storage.get(USER_KEY);
          if(user) {
            this.currentUserSubject.next(user);
          }
          this.authenticationState.next(true);
          this.tokenSubject.next(token);
          //preguntar servidor por actualizaciones
          //this.http.get(`${environment.apiUrl}request-user-refresh`).subscribe((_t: string) => this.refreshUserJWT(_t));
        } else {
          this.storage.remove(TOKEN_KEY);
          this.storage.remove(USER_KEY);
        }
      }
    }
    this.tokenChecked = true;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/local`, { identifier: email, password: password })
      .pipe(
        tap(res => {
          this.setStorage(res['user'], res['jwt']);
        }),
        catchError((e: HttpErrorResponse) => { throw e; })
      );
  }
  loginAdmin(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/admin/login`, { email: email, password: password })
      .pipe(
        tap(res => {
          res.data['user'].type = 'admin';
          this.setStorage(res.data['user'], res.data['token']);
        }),
        catchError((e: HttpErrorResponse) => { throw e; })
      );
  }

  async refreshMe() {
    console.log('CALLING ME');
    try{
      let me = await this.http.get<any>(`${environment.apiUrl}/users/me`).toPromise();
      console.log(me);
      if(me){
        await this.setStorageUser(me);
        return me;
      }
    } catch (err) {
      console.log('error loading me');
      console.log(err);
    }
    return false;
  }

  setStorage(user: any, jwt?: any) {
    if( user ) {
      this.storage.set(USER_KEY, user);
      this.currentUserSubject.next(user);
    }

    if( jwt ) {
      this.storage.set(TOKEN_KEY, jwt);
      this.tokenSubject.next(jwt);
    }

    this.authenticationState.next(true);
  }

  async setStorageUser(user: any) {
    if( user ) {
      await this.storage.set(USER_KEY, user);
      this.currentUserSubject.next(user);
    }
  }

  async logout() {
    //remove user storage
    await Promise.all([
      this.storage.remove(TOKEN_KEY),
      this.storage.remove(USER_KEY)
    ]).then(() => {
      this.authenticationState.next(false);
      this.tokenSubject.next(null!);
      this.currentUserSubject.next(null!);
    });
  }

  forgotPassword(email: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(code: string, password: string, passwordConfirmation: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/reset-password`, { code, password, passwordConfirmation })
    .pipe(
      tap(res => {
        this.setStorage(res['user'], res['jwt']);
      }),
      catchError((e: HttpErrorResponse) => { throw e; })
    );
  }

  refreshUserJWT(token: string){
      this.storage.set(TOKEN_KEY, token);

      //manejar como obserbable
      let decoded = this.helper.decodeToken(token);
      decoded.token = token;
      this.currentUserSubject.next(decoded);

      //this.authenticationState.next(true);
  }

  userNameAvailable(username: string, id?: number) {
    let params = new HttpParams().set('username', username);
    if(id) params = params.set('id_ne', id);
    return this.http.get<any>(`${environment.apiUrl}/users/count`, {params});
  }

  emailAvailable(email: string, id?: number) {
    let params = new HttpParams().set('email', email);
    if(id) params = params.set('id_ne', id);
    return this.http.get<any>(`${environment.apiUrl}/users/count`, {params});
  }

}
