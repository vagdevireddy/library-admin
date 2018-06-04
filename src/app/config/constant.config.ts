/* Application Constants */

// API End points
export class AppUrls {
  public baseUrl = 'http://ec2-18-220-81-9.us-east-2.compute.amazonaws.com/api/1.0/';
  public custUrl = 'http://18.220.81.9:8080/';
  // REST End points
  public login = this.baseUrl + 'auth/login';
  public register = this.baseUrl + 'auth/signup';
  public me = this.baseUrl + 'auth/me';
  public logout = this.baseUrl + 'auth/logout';
  public confirmEmail = this.baseUrl + 'account/ConfirmEmailAndSetPassword';
  public resetPassword = this.baseUrl + 'reset';
  public sendForgotPasswordMail = this.baseUrl + 'Password/SendForgotPasswordMail';
  public books_list = this.baseUrl + 'books';
  public categories = this.baseUrl + 'categories';
  public orders = this.baseUrl + 'orders';
  public authors = this.baseUrl + 'authors';
  public users = this.baseUrl + 'persons';
  public upload_file = this.baseUrl + 'upload-file';
  public loadingIcon = false;
}

