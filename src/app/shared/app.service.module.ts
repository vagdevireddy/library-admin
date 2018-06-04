import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CanActivate, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AppServiceModule {
  public options: any;
  private CurrentUser = new BehaviorSubject<any>({});
  userCast = this.CurrentUser.asObservable();
  constructor(private httpClient: HttpClient) {
    this.options = new HttpHeaders({'Content-Type': 'application/json'});
  }
  get(url?: string, parameters?: any) {
    console.log('get URL -----', url);
    let params: any;
    // Setup log namespace query parameter
    params = new HttpParams();
    params = params.set('rand', Math.random());
    if (parameters) {
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          if (typeof parameters[key] === 'object') {
            params = params.set(key, JSON.stringify(parameters[key]));
          } else {
            params = params.set(key, parameters[key]);
          }
        }
      }
    }
    console.log('my params: ', params, parameters);
    return this.httpClient.get(url, {params: params});
  }
  post(url: string, data: any, noHeaders?: any) {
    this.options = (noHeaders) ? new Headers({'Content-Type': undefined}) : this.options;
    console.log(this.options);
    return this.httpClient.post(url, data, this.options);
  }
  update(url: string, data: any) {
    return this.httpClient.patch(url, data, this.options);
  }
  delete(url: string) {
    return this.httpClient.delete(url, this.options);
  }
  toast(titleMessage, bodyMessage, toastType) {
    const x = document.getElementById('toast');
    x.className = (toastType === 's') ? 'show green' : 'show red';
    // set title
    const tTitle = document.getElementById('toast-title'),
      tBody = document.getElementById('toast-body');
    tTitle.innerText = titleMessage;
    tBody.innerText = bodyMessage;
    setTimeout(function(){ x.className = x.className.replace('show', ''); }, 5000);
  }
  updateUser(value) {
    this.CurrentUser.next(value);
  }
}

@Injectable()
export class AuthService {
  constructor() {}
  // ...
  public getToken(token) {
    return localStorage.getItem(token);
  }
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!(token);
  }
  public setToken(token): boolean {
    localStorage.setItem('access_token', token);
    return true;
  }
  public removeToken(): boolean {
    localStorage.removeItem('access_token');
    return true;
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class Languages {
  languages = [
    {text: 'Telugu', val: 'te'},
    {text: 'English', val: 'en'},
    {text: 'Tamil', val: 'ta'}
  ];
  constructor() {}
  get() {
    return this.languages;
  }
}
