import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Notification } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private _notificationsFull: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  public readonly notificationsFull: Observable<Notification[]> = this._notificationsFull.asObservable();

  private _notifications: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  public readonly notifications: Observable<Notification[]> = this._notifications.asObservable();

  private _unread: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly unread: Observable<number> = this._unread.asObservable();

  constructor(private http: HttpClient) { }

  public loadNotificationsFull(_sort: string, _start: number, _limit: number){
    const currentValue = this._notificationsFull.value;

    var promise = new Promise((resolve, reject) => {
      let params = new HttpParams();
        if(_sort) params = params.append('_sort', _sort);
        if(_start) params = params.append('_start', _start);
        if(_limit) params = params.append('_limit', _limit);
      this.http.get<any>(`${environment.apiUrl}/notifications`, { params }).subscribe(
        (response: any)=>{
          let rf = response as Notification[];
          const updatedValue = [...currentValue, ...rf];
          this._notificationsFull.next(updatedValue);
          resolve({});
        },
        (err)=>{
          reject('error al cargar notificaciones.');
        }
      );
    });
    return promise;
  }

  public refreshNotificationsFull(_sort: string, _start: number, _limit: number){
    var promise = new Promise((resolve, reject) => {
      let params = new HttpParams()
        if(_sort) params = params.append('_sort', _sort);
        if(_start) params = params.append('_start', _start);
        if(_limit) params = params.append('_limit', _limit);
      this.http.get<any>(`${environment.apiUrl}/notifications`, { params }).subscribe(
        (response: any)=>{
          let rf = response as Notification[];
          this._notificationsFull.next(rf);
          resolve({});
        },
        (err)=>{
          reject('error al cargar notificaciones.');
        }
      );
    });
    return promise;
  }

  public loadNotifications(_sort: string, _start: number, _limit: number){
    const currentValue = this._notifications.value;

    var promise = new Promise((resolve, reject) => {
      let params = new HttpParams();
        if(_sort) params = params.append('_sort', _sort);
        if(_start) params = params.append('_start', _start);
        if(_limit) params = params.append('_limit', _limit);
      this.http.get<any>(`${environment.apiUrl}/notifications`, { params }).subscribe(
        (response: any)=>{
          let rf = response as Notification[];
          const updatedValue = [...currentValue, ...rf];
          this._notifications.next(updatedValue);
          resolve({
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            previousPage: response.previousPage,
          });
        },
        (err)=>{
          reject('error al cargar notificaciones.');
        }
      );
    });
    return promise;
  }

  public refreshNotifications(_sort: string, _start: number, _limit: number){
    var promise = new Promise((resolve, reject) => {
      let params = new HttpParams()
        if(_sort) params = params.append('_sort', _sort);
        if(_start) params = params.append('_start', _start);
        if(_limit) params = params.append('_limit', _limit);
      this.http.get<any>(`${environment.apiUrl}/notifications`, { params }).subscribe(
        (response: any)=>{
          let rf = response as Notification[];
          this._notifications.next(rf);
          resolve({
            currentPage: response.currentPage,
            nextPage: response.nextPage,
            previousPage: response.previousPage,
          });
        },
        (err)=>{
          reject('error al cargar notificaciones.');
        }
      );
    });
    return promise;
  }

  public insert(notif: Notification) {
    const currentValue = this._notifications.value;
    const updatedValue = [notif, ...currentValue];
    this._notifications.next(updatedValue);

    const currentValueFull = this._notificationsFull.value;
    const updatedValueFull = [notif, ...currentValueFull];
    this._notificationsFull.next(updatedValueFull);

    const currentCount = this._unread.value;
    this._unread.next(currentCount+1);
  }

  public countUnread() {
    let params = new HttpParams()
      params = params.append('read', false);
    this.http.get<number>(`${environment.apiUrl}/notifications/count`, { params }).subscribe(
      (response: number)=>{
        this._unread.next(response);
      },
      (err)=>{
        console.log('Error obteniendo numero de notificaciones no leidas.')
      }
    );
  }

  public setRead(n: Notification) {

    this.http.put<any>(`${environment.apiUrl}/notifications/${n.id}`, { read: true }).subscribe(
      (response: any)=>{
        const currentValue = this._notifications.value;
        let _ncv = currentValue.find(item => item.id == n.id);
        if(_ncv) _ncv.read = true;

        const currentValueFull = this._notificationsFull.value;
        let _ncvf = currentValueFull.find(item => item.id == n.id);
        if(_ncvf) _ncvf.read = true;

        const currentCount = this._unread.value;
        this._unread.next(currentCount-1);
      },
      (err)=>{
        console.log('Error actualizando estado de notificacion.')
      }
    );
  }

  public delete(n: Notification){

    this.http.delete<any>(`${environment.apiUrl}/notifications/${n.id}`).subscribe(
      (response: any)=>{
        const currentValue = this._notifications.value;
        const updatedValue = currentValue.filter(item => item.id !== n.id);
        this._notifications.next(updatedValue);

        const currentValueFull = this._notificationsFull.value;
        const updatedValueFull = currentValueFull.filter(item => item.id !== n.id);
        this._notificationsFull.next(updatedValueFull);

        if(!n.read){
          const currentCount = this._unread.value;
          this._unread.next(currentCount-1);
        }
      },
      (err)=>{
        console.log('Error actualizando estado de notificacion.')
      }
    );
  }

  public deleteAll(){

    this.http.delete<any>(`${environment.apiUrl}/notifications/all`).subscribe(
      (response: any)=>{
        this._notifications.next([]);
        this._notificationsFull.next([]);
        this._unread.next(0);
      },
      (err)=>{
        console.log('Error actualizando estado de notificacion.')
      }
    );
  }

}
