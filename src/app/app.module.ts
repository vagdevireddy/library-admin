import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { routes } from './config/router.config';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PublishBookComponent } from './publish-book/publish-book.component';
import {AppServiceModule, AuthGuardService, AuthService, Languages} from './shared/app.service.module';
import {AppUrls} from './config/constant.config';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PersonsComponent } from './persons/persons.component';
import {BsDatepickerModule, ModalModule} from 'ngx-bootstrap';
import { EditBookComponent } from './edit-book/edit-book.component';
import { CategoriesComponent } from './categories/categories.component';
import {FilterPipe} from './app.pipe';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    HomepageComponent,
    PublishBookComponent,
    PersonsComponent,
    EditBookComponent,
    CategoriesComponent,
    FilterPipe,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AgGridModule.withComponents(
      []
    )
  ],
  providers: [AppServiceModule, AppUrls, AuthService, AuthGuardService, Languages],
  bootstrap: [AppComponent]
})
export class AppModule { }
