import { Component, OnInit } from '@angular/core';
import {AppServiceModule, AuthService} from '../shared/app.service.module';
import {AppUrls} from '../config/constant.config';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = {};
  constructor(private appService: AppServiceModule,
              public authService: AuthService,
              public appUrls: AppUrls,
              private route: Router) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      // check user is logged in or not from the server
      const token = this.authService.getToken('access_token');
      this.appService.get(this.appUrls.me, {login_token: token}).subscribe((data) => {
        console.log(data);
        this.user = data['data'];
        this.appService.updateUser(data['data']);
      }, (err: HttpErrorResponse) => {
        this.logout();
      });
    }
  }
  logout() {
    const lToken = this.authService.getToken('access_token');
    this.appService.get(this.appUrls['logout'], {login_token: lToken})
      .subscribe((data) => {}, (err: HttpErrorResponse) => {});
    this.authService.removeToken();
    this.route.navigate(['/login']);
    this.appService.updateUser({});
    this.appService.toast('Successfully logged out', '', 's');
  }

}
