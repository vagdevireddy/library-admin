import {Component, OnInit, TemplateRef} from '@angular/core';
import {AppServiceModule} from '../shared/app.service.module';
import {ActivatedRoute, Router} from '@angular/router';
import {AppUrls} from '../config/constant.config';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public embedded: any = {user_id: 1};
  public query: any = {
    sort: '-_created', page: 1, max_results: 15,
    embedded: JSON.stringify(this.embedded)
  };
  modalRef: BsModalRef;
  modalItem: any;
  public orders: any = [];
  public _meta: any = {};
  constructor(private appService: AppServiceModule,
              private router: Router,
              public appUrls: AppUrls,
              private activatedRoute: ActivatedRoute,
              private modalService: BsModalService) {
    this.activatedRoute.queryParams.subscribe((parameters: any) => {
      const where = {}, params = parameters;
      console.log(params);
      if (Object.keys(parameters).length === 0) {
        this.router.navigate(['/orders'], {queryParams: this.query});
      } else {
        this.query = Object.assign({}, params);
        this.getOrders();
      }
    });
  }
  ngOnInit() {
  }
  parseTitle(title) {
    return title.replace(/\//g, '').replace(/ /g, '-');
  }
  openModal(template: TemplateRef<any>, item) {
    this.modalRef = this.modalService.show(template);
    const query = {embedded: {user_id: 1, books: 1}};
    this.appService.get(this.appUrls.orders + '/' + item['_id'], query)
      .subscribe((data) => {
        console.log(data);
        this.modalItem = data;
      }, (err) => {
        console.log(err);
      });
  }
  stopLoading () {
    setTimeout(() => {
      this.appUrls.loadingIcon = false;
    }, 500);
  }
  changeParams(filter) {
    console.log(this.query, '-------', filter);
    this.router.navigate(['/orders'], {queryParams: this.query});
  }
  getOrders() {
    this.appUrls.loadingIcon = true;
    this.appService.get(this.appUrls.orders, this.query).subscribe((data: any) => {
      console.log(data);
      this.orders = data['_items'];
      this._meta = data['_meta'];
      this.stopLoading();
    }, (err: any) => {
      console.log(err);
      this.stopLoading();
    });
  }
  updateOrder(order) {
    console.log(order);
    this.appService.update(this.appUrls.orders + '/' + order['_id'], order)
      .subscribe((data) => {
        this.appService.toast(order['_id'], 'Successfully Updated!', 's');
        this.modalRef.hide();
      }, (err) => {
        console.log(err);
      });
  }
}
