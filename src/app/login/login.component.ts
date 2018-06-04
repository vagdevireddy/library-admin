import { Component, OnInit } from '@angular/core';
import {AppServiceModule, AuthService} from '../shared/app.service.module';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AppUrls} from '../config/constant.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  lForm = new FormGroup({
    email: new FormControl('suryamuppalla@gmail.com'),
    password: new FormControl('surya')
  });
  constructor(private authService: AuthService,
              private appService: AppServiceModule,
              private router: Router,
              private appUrls: AppUrls) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/homepage'], {queryParams: {page: 1, max_results: 25, sort: '-_updated'}});
    }
  }
  login(user: object, lform) {
    console.log(user, lform);
    this.appService.post(this.appUrls.login, user).subscribe((data) => {
      this.authService.setToken(data['data']['login_token']);
      localStorage.setItem('userInfo', data['data']);
      this.router.navigate(['/homepage']);
    }, (err) => {
      console.log(err);
    });
  }

}
