import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpServiceService } from '../http.service.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  form: any = {
    data: {},
    message: '',
    inputerror: {},
  };

  constructor(private httpService: HttpServiceService) {}

  signUp() {
    var self = this;
    this.httpService.post(
      'http://localhost:8080/Auth/signUp',
      this.form.data,
      function (res: any) {
        console.log('res => ', res);

        self.form.message = '';
        self.form.inputerror = {};

        if (res.result.message) {
          self.form.message = res.result.message;
        }

        if (!res.success) {
          self.form.inputerror = res.result.inputerror;
        }
      }
    );
  }
}
