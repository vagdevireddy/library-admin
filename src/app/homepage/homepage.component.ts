import {Component, OnInit, TemplateRef} from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid';
import {AppServiceModule} from '../shared/app.service.module';
import {AppUrls} from '../config/constant.config';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  public query: any = {sort: '-_updated', max_results: 15, page: 1};
  public _meta: any;
  public filter: any = {search: ''};
  public books: any = [];
  modalRef: BsModalRef;
  modalItem: any;
  constructor(private appService: AppServiceModule,
              private appUrls: AppUrls,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService) {
    // Optional parameters
    this.activatedRoute.queryParams.subscribe((parameters: any) => {
      const where = {}, params = parameters;
      console.log(params);
      if (Object.keys(parameters).length <= 0) {
        this.router.navigate(['/homepage'], {queryParams: this.query});
      } else {
        this.query = Object.assign({}, params);
        this.getBooks();
      }
    });
  }
  ngOnInit () {
    this.getBooks();
  }
  openModal(template: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(template);
    this.modalItem = item;
  }
  getBooks() {
    this.books = [];
    this.appUrls.loadingIcon = true;
    this.appService.get(this.appUrls.books_list, this.query).subscribe((data) => {
      const items: any = data['_items'];
      this._meta = data['_meta'];
      this.books = data['_items'];
      setTimeout(() => {this.appUrls.loadingIcon = false; }, 500);
    });
  }
  pagination(page) {
    this.query['page'] = page;
    this.router.navigate(['/homepage'], {queryParams: this.query});
  }
  deleteBook(item, index) {
    this.books.splice(index, 1);
    this.appService.toast(item['book_title'], 'Deleted from Database', 's');
    this._meta['total'] = this._meta['total'] - 1;
    this.appService.delete(this.appUrls.books_list + '/' + item['_id']).subscribe((success) => {
      console.log(success);
      this.modalRef.hide();
    }, (err) => {
      console.log(err);
    });
  }
  searchBooks(search, event) {
    if (search) {
      this.query['where'] = JSON.stringify({book_title: {$regex: '.*' + search + '.*', '$options': 'i'}});
    } else {
      delete this.query['where'];
    }
    this.router.navigate(['/homepage'], {queryParams: this.query});
  }
  changeParams(filter) {
    console.log(this.query, '-------', filter);
    this.router.navigate(['/homepage'], {queryParams: this.query});
  }
  cellClicked (item) {
    console.log(item['_id']);
    this.router.navigate(['/edit-book', item['_id']]);
  }
}
