import {Component, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import {TextInput as TextInputAndroid} from 'angular2-react-native/android';
import {TextInput as TextInputIOS} from 'angular2-react-native/ios';

@Component({
  selector: 'http-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<TextInput placeholder="Search Wikipedia" (submit)="sendXHR($event)"></TextInput>
<Text *ngFor="let page of pages">{{page}}</Text>
`
})
export class HttpApp {
  @ViewChild(TextInputAndroid) textInputAndroid: TextInputAndroid;
  @ViewChild(TextInputIOS) textInputIOS: TextInputIOS;
  pages: Array<any> = [];
  constructor(private http: Http) {}

  sendXHR(text: string) {
    if (text && text.length > 0) {
      this.http.get('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=allpages&gaplimit=10&gapfrom=' + text, {body: ''})
        .map(res => res.json())
        .subscribe(data => {
          this.pages = [];
          var raw = data['query'].pages;
          for (var key in raw) {
            this.pages.push(raw[key].title);
          }
        });
      if (this.textInputAndroid) this.textInputAndroid.blurTextInput();
      if (this.textInputIOS) this.textInputIOS.blurTextInput();
    }

  }
}