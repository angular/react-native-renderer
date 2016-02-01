import {Component, ElementRef, NgZone} from 'angular2/core';
import {StyleSheet, Alert, IntentAndroid, ToastAndroid, Clipboard, Platform, PixelRatio, NetInfo, AppState} from 'react-native';
import {NativeFeedback} from './common';

@Component({
  selector: 'apis-list',
  host: {flex: '1'},
  directives: [NativeFeedback],
  template: `
<PagerLayout flex="1" justifyContent="center" alignItems="center" selectedPage="0">
  <View [style]="styles.container">
    <Text [style]="styles.title">Actionable</Text>
    <View [style]="styles.button" nativeFeedback (tap)="showAlert()">
      <Text [style]="styles.buttonText">Alert</Text>
    </View>
    <View [style]="styles.button" nativeFeedback (tap)="showToast()">
      <Text [style]="styles.buttonText">Toast</Text>
    </View>
    <View [style]="styles.button" nativeFeedback (tap)="launchIntent()">
      <Text [style]="styles.buttonText">Intent</Text>
    </View>
    <View [style]="styles.button" nativeFeedback (tap)="setClipboard()">
      <Text [style]="styles.buttonText">Clipboard</Text>
    </View>
    <Text>Current clipboard value: {{clipcoardContent}}</Text>
  </View>
  <View [style]="styles.container">
    <Text [style]="styles.title">Infos</Text>
    <Text [style]="styles.subtitle">Platform</Text>
    <Text>{{platform}}</Text>
    <Text [style]="styles.subtitle">PixelRatio</Text>
    <Text>{{ratio}}</Text>
    <Text [style]="styles.subtitle">Geoloation</Text>
    <Text>{{location}}</Text>
    <Text [style]="styles.subtitle">NetInfo</Text>
    <Text>{{connectionType}} connection is {{isConnected ? 'on' : 'off'}} and {{isConnectionExpensive ? 'expensive' : 'not expensive'}}</Text>
    <Text [style]="styles.subtitle">AppState</Text>
    <Text>Current state is {{appState}}</Text>
  </View>
</PagerLayout>
`
})
export class APIsList {
  styles: any;
  clipcoardContent: string = '';
  platform: string = '';
  ratio: string = '';
  location: string = 'Fetching ...';
  connectionType: string = 'Unknown';
  isConnectionExpensive: boolean = false;
  isConnected: boolean = false;
  appState: string = AppState.currentState;
  constructor(private zone: NgZone) {
    this.styles = this._getStyles();
    this.platform = `OS: ${Platform.OS}, version: ${Platform.Version}`;
    this.ratio = PixelRatio.get();
    Clipboard.getString((content) => this.zone.run(() => this.clipcoardContent = content));
    navigator.geolocation.getCurrentPosition(
      (position) => this.zone.run(() => this.location = JSON.stringify(position)),
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    NetInfo.fetch().then((reach) => { this.connectionType = reach });
    NetInfo.isConnectionExpensive((isConnectionExpensive) => { this.isConnectionExpensive = isConnectionExpensive });
    NetInfo.isConnected.fetch().then((isConnected) => { this.isConnected = isConnected });
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
    IntentAndroid.canOpenURL(url, (supported) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        IntentAndroid.openURL(url);
      }
    });
  }

  setClipboard() {
    var newValue = this.clipcoardContent == 'foo' ? 'bar' : 'foo';
    Clipboard.setString(newValue);
    Clipboard.getString((content) => this.zone.run(() => this.clipcoardContent = content));
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