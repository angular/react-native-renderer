import {Component} from '@angular/core';
import {StyleSheet, Alert, Linking, ToastAndroid, Clipboard, Platform, PixelRatio, NetInfo, AppState, DatePickerAndroid, TimePickerAndroid} from 'react-native';

@Component({
  selector: 'apis-list',
  host: {flex: '1'},
  template: `
<PagerLayout initialPage="0" [style]="{flex: 1, justifyContent: 'center', alignItems: 'center'}">
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">Actionable</Text>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="showAlert()">
      <Text [style]="styles.buttonText">Alert</Text>
    </View>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="showToast()">
      <Text [styleSheet]="styles.buttonText">Toast</Text>
    </View>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="launchIntent()">
      <Text [styleSheet]="styles.buttonText">Intent</Text>
    </View>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="setClipboard()">
      <Text [styleSheet]="styles.buttonText">Clipboard</Text>
    </View>
    <Text>Current clipboard value: {{clipBoardContent}}</Text>
  </View>
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">More actionable</Text>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="pickDate()">
      <Text [styleSheet]="styles.buttonText">Pick a date: {{pickedDate}}</Text>
    </View>
    <View [styleSheet]="styles.button" rippleFeedback (tap)="pickTime()">
      <Text [styleSheet]="styles.buttonText">Pick a time: {{pickedTime}}</Text>
    </View>
  </View>
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.title">Infos</Text>
    <Text [styleSheet]="styles.subtitle">Platform</Text>
    <Text>{{platform}}</Text>
    <Text [styleSheet]="styles.subtitle">PixelRatio</Text>
    <Text>{{ratio}}</Text>
    <Text [styleSheet]="styles.subtitle">Geoloation</Text>
    <Text>{{location}}</Text>
    <Text [styleSheet]="styles.subtitle">NetInfo</Text>
    <Text>{{connectionType}} connection is {{isConnected ? 'on' : 'off'}} and {{isConnectionExpensive ? 'expensive' : 'not expensive'}}</Text>
    <Text [styleSheet]="styles.subtitle">AppState</Text>
    <Text>Current state is {{appState}}</Text>
  </View>
</PagerLayout>
`
})
export class APIsList {
  styles: any;
  clipBoardContent: string = '';
  pickedDate: Date;
  pickedTime: string;
  platform: string = '';
  ratio: number = 0;
  location: string = 'Fetching ...';
  connectionType: string = 'Unknown';
  isConnectionExpensive: boolean = false;
  isConnected: boolean = false;
  appState: string = AppState.currentState;
  constructor() {
    this.styles = this._getStyles();
    this.platform = `OS: ${Platform.OS}, version: ${Platform.Version}`;
    this.ratio = PixelRatio.get();
    navigator.geolocation.getCurrentPosition(
      (position) => this.location = JSON.stringify(position),
      (error) => console.log(error.message),
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
    Linking.canOpenURL(url).then((supported: boolean) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        Linking.openURL(url);
      }
    });
  }

  setClipboard() {
    var newValue = this.clipBoardContent == 'foo' ? 'bar' : 'foo';
    Clipboard.setString(newValue);
    Clipboard.getString().then((content: string) => this.clipBoardContent = content);
  }

  pickDate() {
    DatePickerAndroid.open().then(({action, year, month, day}) => {
      this.pickedDate = new Date(year, month, day);
    });
  }

  pickTime() {
    TimePickerAndroid.open().then(({action, hour, minute}) => {
      this.pickedTime = hour + ':' + (minute < 10 ? '0' + minute : minute);
    });
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