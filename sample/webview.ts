import {Component, ElementRef} from 'angular2/core';
import {NativeFeedback} from './common';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'webview-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NativeFeedback],
  template: `
<View flexDirection="row" flex="1">
  <View [style]="styles.button" flex="1" nativeFeedback (tap)="goBack()">
    <Text [style]="styles.buttonText">Back</Text>
  </View>
  <View [style]="styles.button" flex="1" nativeFeedback (tap)="goForward()">
    <Text [style]="styles.buttonText">Forward</Text>
  </View>
</View>
<WebView flex="11" url="https://www.google.com" javaScriptEnabled="true" domStorageEnabled="true" automaticallyAdjustContentInsets="false">
</WebView>
`
})
export class WebViewApp {
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
    this._el.children[3].dispatchCommand('goBack');
  }

  goForward() {
    this._el.children[3].dispatchCommand('goForward');
  }
}

