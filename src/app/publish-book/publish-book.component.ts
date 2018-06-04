import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppServiceModule, Languages} from '../shared/app.service.module';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AppUrls} from '../config/constant.config';
import {Router} from '@angular/router';

@Component({
  selector: 'app-publish-book',
  templateUrl: './publish-book.component.html',
  styleUrls: ['./publish-book.component.css']
})
export class PublishBookComponent implements OnInit {
  trueFalseArray: any[];
  bookInfo: object = {};
  isbnSearch: string;
  languages: any[];
  googleBookInfo: any = {};
  categories: any = [];
  imagePreview: any = {};
  bookForm = new FormGroup({
    book_title: new FormControl('', Validators.required),
    sub_title: new FormControl(''),
    book_summary: new FormControl(),
    book_keywords: new FormControl(),
    no_of_pages: new FormControl('', Validators.required),
    book_authors: new FormControl('', Validators.required),
    book_author_desc: new FormControl(),
    availability: new FormControl(true),
    hcopy_price: new FormControl(0, Validators.required),
    ecopy_price: new FormControl(0, Validators.required),
    book_categories: new FormControl('', Validators.required),
    language: new FormControl('', Validators.required),
    publisher: new FormControl('', Validators.required),
    ISBN_10: new FormControl('', Validators.required),
    ISBN_13: new FormControl('', Validators.required),
    published_date: new FormControl('', Validators.required),
    image_small_thumbnail: new FormControl('', Validators.required),
    image_thumbnail: new FormControl('', Validators.required),
    no_of_copies: new FormControl(1, Validators.required)
  });
  @ViewChild('imageUpload') imageInput: ElementRef;
  @ViewChild('eBookUpload') eBookInput: ElementRef;
  constructor(private appService: AppServiceModule,
              private langs: Languages,
              private appUrls: AppUrls,
              private router: Router) {}
  ngOnInit() {
    this.trueFalseArray = [
      {text: 'Yes', val: true},
      {text: 'No', val: false}
    ];
    this.languages = this.langs.get();
    this.getCategories();
  }
  getBookDetails (isbnNumber: string) {
    this.appUrls.loadingIcon = true;
    if (!isbnNumber) { return; }
    const googleBookAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbnNumber;
    this.appService.get(googleBookAPI).subscribe((data) => {
      console.log(data);
      if (data['items'] && data['items'].length) {
        this.googleBookInfo = data['items'][0]['volumeInfo'];
        console.log(this.googleBookInfo);
        if (this.googleBookInfo['industryIdentifiers']) {
          this.googleBookInfo.industryIdentifiers.forEach((item) => {
            this.bookInfo[item['type']] = item['identifier'];
          });
        }
        if (this.googleBookInfo['authors']) {
          this.bookInfo['book_authors'] = this.googleBookInfo.authors;
        }
        this.bookInfo['book_title'] = this.googleBookInfo['title'];
        this.bookInfo['sub_title'] = this.googleBookInfo['subtitle'];
        this.bookInfo['publisher'] = this.googleBookInfo['publisher'];
        this.bookInfo['published_date'] = new Date(this.googleBookInfo['publishedDate']).toLocaleString().split(',')[0];
        /*if (this.googleBookInfo['categories']) {
          this.bookInfo['book_category'] = this.googleBookInfo.categories.toString();
        }*/
        this.bookInfo['language'] = this.googleBookInfo['language'];
        this.bookInfo['book_summary'] = this.googleBookInfo['description'];
        this.bookInfo['no_of_pages'] = this.googleBookInfo['pageCount'];
        if (this.googleBookInfo['imageLinks']) {
          this.bookInfo['image_small_thumbnail'] = this.googleBookInfo['imageLinks']['smallThumbnail'];
          this.bookInfo['image_thumbnail'] = this.googleBookInfo['imageLinks']['thumbnail'];
          this.imagePreview['src'] = this.googleBookInfo['imageLinks']['thumbnail'];
          this.imageInput.nativeElement.required = false;
        } else {
          this.imageInput.nativeElement.required = true;
        }
        console.log(this.bookInfo);
        this.bookForm.patchValue(this.bookInfo);
        this.stopLoading();
      }
    }, (err) => {
      console.log(err);
      this.stopLoading();
    });
  }
  stopLoading () {
    setTimeout(() => {
      this.appUrls.loadingIcon = false;
    }, 500);
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
  eBookChangeEvent(event) {
    const file = this.eBookInput.nativeElement['files'][0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log(e);
    };
    reader.readAsDataURL(this.eBookInput.nativeElement['files'][0]);
  }
  getCategories () {
    this.appService.get(this.appUrls.categories).subscribe((data: any) => {
      console.log(data);
      this.categories = data['_items'];
    }, (err) => {
      console.log(err);
    });
  }
  postBook(bookForm) {
    bookForm['book_categories'] = [bookForm['book_categories']];
    this.appService.post(this.appUrls.books_list, bookForm).subscribe((data) => {
      console.log(data);
      this.appService.toast(bookForm['book_title'], 'Successfully added in Database', 's');
      this.router.navigate(['/homepage']);
      this.stopLoading();
    }, (err) => {
      console.log(err);
      this.stopLoading();
    });
  }
  checkEBookUpload(bookForm) {
    if (this.eBookInput.nativeElement.value) {
      const formData = new FormData();
      formData.append('file', this.eBookInput.nativeElement['files'][0]);
      this.appService.post(this.appUrls.upload_file, formData, true).subscribe((data) => {
        if (data && data['data']) {
          bookForm['ebook'] = data['data']['path'];
        }
        this.postBook(bookForm);
      }, (err) => {
        console.log(err);
        this.stopLoading();
      });
    } else {
      this.postBook(bookForm);
    }
  }
  postBookDetails(bookForm) {
    this.appUrls.loadingIcon = true;
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
        this.checkEBookUpload(bookForm);
      }, (err) => {
        console.log(err);
        this.stopLoading();
      });
    } else {
      this.checkEBookUpload(bookForm);
    }
  }
}


