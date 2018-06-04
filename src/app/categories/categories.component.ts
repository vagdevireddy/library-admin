import { Component, OnInit, TemplateRef } from '@angular/core';
import {AppServiceModule} from '../shared/app.service.module';
import {AppUrls} from '../config/constant.config';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  search: string;
  modalRef: BsModalRef;
  modalItem: any;
  hoverCategory: any = {};
  constructor(private appService: AppServiceModule,
              private appUrls: AppUrls,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getCategories();
  }
  stopLoading() {
    setTimeout(() => {
      this.appUrls.loadingIcon = false;
    }, 500);
  }
  openModal(template: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(template);
    this.modalItem = item;
  }
  getCategories () {
    const query = {max_results: 100, sort: 'category_name'};
    this.appService.get(this.appUrls.categories, query).subscribe((data: any) => {
      console.log(data);
      this.categories = data['_items'];
    }, (err) => {
      console.log(err);
    });
  }
  addCategory(item, type) {
    this.appUrls.loadingIcon = true;
    const url = this.appUrls.categories;
    this.appService.post(url, {category_name: item['category_name']})
      .subscribe((success) => {
        success['category_name'] = item['category_name'];
        this.categories.push(success);
        this.modalRef.hide();
        this.appService.toast(item['category_name'], 'Successfully Created!', 's');
        this.stopLoading();
      });
  }
  updateCategory(item, type) {
    this.appUrls.loadingIcon = true;
    const url = this.appUrls.categories + '/' + item['_id'];
    this.appService.update(url, {category_name: item['category_name']})
      .subscribe((success) => {
        console.log(success);
        this.modalRef.hide();
        this.appService.toast(item['category_name'], 'Successfully updated!', 's');
        this.stopLoading();
      });
  }
  deleteCategory(item, index) {
    this.appUrls.loadingIcon = true;
    this.appService.delete(this.appUrls.categories + '/' + item['_id']).subscribe((success) => {
      this.appService.toast(item['category_name'], 'successfully deleted!', 's');
      this.categories.splice(index, 1);
      this.stopLoading();
    });
  }

}
