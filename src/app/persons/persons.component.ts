import { Component, OnInit } from '@angular/core';
import {AppServiceModule} from '../shared/app.service.module';
import {AppUrls} from '../config/constant.config';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {
  public usersMeta: any = {};
  public persons: any = [];
  public filter: any = {search: ''};
  public query: any = {max_results: 15, page: 1, sort: 'first_name'};
  constructor(private appService: AppServiceModule,
              private appUrls: AppUrls,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (Object.keys(params).length <= 0) {
        this.router.navigate(['/persons'], {queryParams: this.query});
      } else {
        this.query = Object.assign({}, params);
        this.getPersons();
      }
    });
  }
  stopLoading () {
    setTimeout(() => {
      this.appUrls.loadingIcon = false;
    }, 500);
  }
  pagination(page) {
    this.query['page'] = page;
    this.router.navigate(['/persons'], {queryParams: this.query});
  }
  toggleStatus (status, object, index) {
    object['status'] = status;
    this.persons[index] = object;
    this.appService.toast(object['first_name'], 'Now ' + status, 's');
    this.appService.update(this.appUrls.users + '/' + object['_id'], {status: status}).subscribe((success) => {
      console.log(success);
    }, (err) => {
      console.log(err);
    });
  }
  deletePerson(item, index) {
    this.persons.splice(index, 1);
    this.appService.toast(item['first_name'], 'Deleted from Database', 's');
    this.usersMeta['total'] = this.usersMeta['total'] - 1;
    this.appService.delete(this.appUrls.users + '/' + item['_id']).subscribe((success) => {
      console.log(success);
    }, (err) => {
      console.log(err);
    });
  }
  searchPersons(search, event) {
    if (!event || event.keyCode === 13) {
      if (search) {
        this.query['where'] = JSON.stringify({first_name: search});
      } else {
        delete this.query['where'];
      }
      this.router.navigate(['/persons'], {queryParams: this.query});
    }
  }
  ngOnInit () {
    this.getPersons();
  }
  getPersons() {
    this.persons = [];
    this.appUrls.loadingIcon = true;
    this.appService.get(this.appUrls.users, this.query).subscribe((data) => {
      console.log(data);
      this.usersMeta = data['_meta'];
      this.persons = data['_items'];
      this.stopLoading();
    }, (err) => {
      this.stopLoading();
    });
  }

}
