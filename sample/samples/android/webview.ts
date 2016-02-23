import {Component, ElementRef, ViewChild} from 'angular2/core';
import {NativeFeedback} from './common';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-renderer/react-native-renderer';

@Component({
  selector: 'webview-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NativeFeedback],
  template: `
<native-view flexDirection="row" flex="1">
  <native-view [style]="styles.button" flex="1" nativeFeedback (tap)="goBack()">
    <native-text [style]="styles.buttonText">Back</native-text>
  </native-view>
  <native-view [style]="styles.button" flex="1" nativeFeedback (tap)="goForward()">
    <native-text [style]="styles.buttonText">Forward</native-text>
  </native-view>
</native-view>
<WebView [source]="{uri: 'https://www.angular.io'}" javaScriptEnabled="true" domStorageEnabled="true" automaticallyAdjustContentInsets="false" [style]="{flex: 11}">
</WebView>
`
})
export class WebViewApp {
  @ViewChild(WebView) webView: WebView;
  styles: any;
  _el : any = null;
  constructor(el: ElementRef) {
    this._el = el.nativeElement;
    this.styles = StyleSheet.create({
      button: {
        padding: 5,
        margin: 5,
        backgroundColor: '#005eb8'
      },
      buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 15
      }
    });
  }

  goBack() {
    this.webView.goBack();
  }

  goForward() {
    this.webView.goForward();
  }
}

