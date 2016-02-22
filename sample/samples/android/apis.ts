import {Component, ElementRef, NgZone} from 'angular2/core';
import {StyleSheet, Alert, IntentAndroid, ToastAndroid, Clipboard, Platform, PixelRatio, NetInfo, AppState} from 'react-native';
import {NativeFeedback} from './common';

@Component({
  selector: 'apis-list',
  host: {flex: '1'},
  directives: [NativeFeedback],
  template: `
<PagerLayout flex="1" justifyContent="center" alignItems="center" selectedPage="0">
  <native-view [style]="styles.container">
    <native-text [style]="styles.title">Actionable</native-text>
    <native-view [style]="styles.button" nativeFeedback (tap)="showAlert()">
      <native-text [style]="styles.buttonText">Alert</native-text>
    </native-view>
    <native-view [style]="styles.button" nativeFeedback (tap)="showToast()">
      <native-text [style]="styles.buttonText">Toast</native-text>
    </native-view>
    <native-view [style]="styles.button" nativeFeedback (tap)="launchIntent()">
      <native-text [style]="styles.buttonText">Intent</native-text>
    </native-view>
    <native-view [style]="styles.button" nativeFeedback (tap)="setClipboard()">
      <native-text [style]="styles.buttonText">Clipboard</native-text>
    </native-view>
    <native-text>Current clipboard value: {{clipBoardContent}}</native-text>
  </native-view>
  <native-view [style]="styles.container">
    <native-text [style]="styles.title">Infos</native-text>
    <native-text [style]="styles.subtitle">Platform</native-text>
    <native-text>{{platform}}</native-text>
    <native-text [style]="styles.subtitle">PixelRatio</native-text>
    <native-text>{{ratio}}</native-text>
    <native-text [style]="styles.subtitle">Geoloation</native-text>
    <native-text>{{location}}</native-text>
    <native-text [style]="styles.subtitle">NetInfo</native-text>
    <native-text>{{connectionType}} connection is {{isConnected ? 'on' : 'off'}} and {{isConnectionExpensive ? 'expensive' : 'not expensive'}}</native-text>
    <native-text [style]="styles.subtitle">AppState</native-text>
    <native-text>Current state is {{appState}}</native-text>
  </native-view>
</PagerLayout>
`
})
export class APIsList {
  styles: any;
  clipBoardContent: string = '';
  platform: string = '';
  ratio: number = 0;
  location: string = 'Fetching ...';
  connectionType: string = 'Unknown';
  isConnectionExpensive: boolean = false;
  isConnected: boolean = false;
  appState: string = AppState.currentState;
  constructor(private zone: NgZone) {
    this.styles = this._getStyles();
    this.platform = `OS: ${Platform.OS}, version: ${Platform.Version}`;
    this.ratio = PixelRatio.get();
    Clipboard.getString().then((content: string) => this.clipBoardContent = content);
    navigator.geolocation.getCurrentPosition(
      (position) => this.zone.run(() => this.location = JSON.stringify(position)),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    NetInfo.fetch().then((reach: string) => { this.connectionType = reach });
    NetInfo.isConnectionExpensive((isConnectionExpensive: boolean) => { this.isConnectionExpensive = isConnectionExpensive });
    NetInfo.isConnected.fetch().then((isConnected: boolean) => { this.isConnected = isConnected });
  }

  showAlert() {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]
    );
  }

  showToast() {
    ToastAndroid.show('This is a toast with short duration', ToastAndroid.SHORT);
  }

  launchIntent() {
    var url = 'https://www.angular.io';
    IntentAndroid.canOpenURL(url, (supported: boolean) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        IntentAndroid.openURL(url);
      }
    });
  }

  setClipboard() {
    var newValue = this.clipBoardContent == 'foo' ? 'bar' : 'foo';
    Clipboard.setString(newValue);
    Clipboard.getString().then((content: string) => this.clipBoardContent = content);
  }

  _getStyles() {
    return StyleSheet.create({
      container: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F5FCFF'
      },
      title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      subtitle: {
        fontSize: 15,
        textAlign: 'left',
        color: '#005eb8'
      },
      button: {
        padding: 10,
        margin: 20,
        height: 50,
        backgroundColor: '#005eb8'
      },
      buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 20
      }
    });
  }
}