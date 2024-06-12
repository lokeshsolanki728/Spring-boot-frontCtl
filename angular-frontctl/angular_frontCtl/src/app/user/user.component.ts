import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from '../http.service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  form: any = {
    data: {},
    inputerror: {},
    message: '',
    preload: [],
  };

  fileToUpload: any = null;

  constructor(
    private httpService: HttpServiceService,
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params: any) => {
      this.form.data.id = params['id'];
      console.log(this.form.data.id);
    });
  }

  ngOnInit(): void {
    this.preload();
    if (this.form.data.id && this.form.data.id > 0) {
      this.display();
    }
  }

  preload() {
    var self = this;
    this.httpService.get(
      'http://localhost:8080/User/preload',
      function (res: any) {
        console.log(res);
        self.form.preload = res.result.roleList;
      }
    );
  }

  display() {
    var self = this;
    this.httpService.get(
      'http://localhost:8080/User/get/' + this.form.data.id,
      function (res: any) {
        console.log(res);
        self.form.data = res.result.data;
      }
    );
  }

  onFileSelect(event: any) {
    this.fileToUpload = event.target.files.item(0);
    console.log(this.fileToUpload);
  }

  save() {
    var self = this;
    this.httpService.post(
      'http://localhost:8080/User/save',
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

        self.form.data.id = res.result.data;

        self.myFile();
      }
    );
  }

  myFile() {
    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    return this.httpClient
      .post(
        'http://localhost:8080/Auth/profilePic/' + this.form.data.id,
        formData
      )
      .subscribe(
        (res: any) => {
          console.log(this.fileToUpload);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
