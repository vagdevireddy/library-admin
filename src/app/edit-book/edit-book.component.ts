import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppServiceModule, Languages} from '../shared/app.service.module';
import {FormControl, FormGroup} from '@angular/forms';
import {AppUrls} from '../config/constant.config';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  trueFalseArray: any[];
  bookInfo: object = {};
  myParams: any = {};
  languages: any[];
  googleBookInfo: any = {};
  categories: any = [];
  imagePreview: any = {};
  bookForm = new FormGroup({
    book_title: new FormControl(),
    sub_title: new FormControl(),
    book_summary: new FormControl(),
    book_keywords: new FormControl(),
    no_of_pages: new FormControl(),
    book_authors: new FormControl(),
    book_author_desc: new FormControl(),
    availability: new FormControl(true),
    hcopy_price: new FormControl(),
    ecopy_price: new FormControl(),
    book_categories: new FormControl(),
    language: new FormControl(),
    publisher: new FormControl(),
    ISBN_10: new FormControl(),
    ISBN_13: new FormControl(),
    published_date: new FormControl(),
    image_small_thumbnail: new FormControl(),
    image_thumbnail: new FormControl()
  });
  @ViewChild('imageUpload') imageInput: ElementRef;
  constructor(private appService: AppServiceModule,
              private langs: Languages,
              private appUrls: AppUrls,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params) => {
      this.myParams = params;
    });
  }
  ngOnInit() {
    this.trueFalseArray = [
      {text: 'Yes', val: true},
      {text: 'No', val: false}
    ];
    this.languages = this.langs.get();
    this.getCategories();
  }
  fileChangeEvent (event) {
    const image = this.imageInput.nativeElement['files'][0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = {
        src: e.target.result,
        title: image['name']
      };
    };

    reader.readAsDataURL(this.imageInput.nativeElement['files'][0]);
  }
  getCategories () {
    this.appService.get(this.appUrls.categories).subscribe((data: any) => {
      console.log(data);
      this.categories = data['_items'];
      this.getBookDetails();
    }, (err) => {
      console.log(err);
    });
  }
  getBookDetails() {
    this.appService.get(this.appUrls.books_list + '/' + this.myParams['_id']).subscribe((data) => {
      console.log(data);
      this.bookInfo = data;
      data['published_date'] = new Date(data['published_date']).toLocaleString().split(',')[0];
      this.bookForm.patchValue(data);
    }, (err) => {
      console.log(err);
    });
  }
  updateBook(bookForm) {
    if (typeof bookForm['book_authors'] === 'string') {
      bookForm['book_authors'] = bookForm['book_authors'].split(',');
    }
    if (typeof bookForm['book_categories'] === 'string') {
      bookForm['book_categories'] = [bookForm['book_categories']];
    }
    bookForm['published_date'] = new Date(bookForm['published_date']).toISOString();
    console.log('-------', bookForm, bookForm['book_categories']);
    this.appService.update(this.appUrls.books_list + '/' + this.myParams['_id'], bookForm).subscribe((data) => {
      console.log(data);
      this.appService.toast(bookForm['book_title'], 'Successfully updated!', 's');
    }, (err) => {
      console.log(err);
      this.appService.toast('Something went wrong!', '', 'e');
    });
  }
  updateBookDetails(bookForm) {
    if (this.imageInput.nativeElement.value) {
      const formData = new FormData();
      formData.append('file', this.imageInput.nativeElement['files'][0]);
      this.appService.post(this.appUrls.upload_file, formData, true).subscribe((data) => {
        console.log(data);
        if (data && data['data']) {
          bookForm['image_small_thumbnail'] = data['data']['path'];
          bookForm['image_thumbnail'] = data['data']['path'];
        }
        console.log('Book data', bookForm);
        this.updateBook(bookForm);
      }, (err) => {
        console.log(err);
      });
    } else {
      this.updateBook(bookForm);
    }
  }

}
