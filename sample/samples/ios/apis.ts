import {Component} from '@angular/core';
import {StyleSheet, ActionSheetIOS, Alert, AlertIOS, AppState, Clipboard, Linking, NetInfo, PixelRatio, Platform} from 'react-native';

@Component({
  selector: 'apis-app',
  host: {flex: '1'},
  template: `
<TabBar tintColor="white" barTintColor="#005eb8">
  <TabBarItem systemIcon="history" [selected]="selectedTab == 'one'" (select)="selectedTab='one'" [style]="{alignItems: 'center'}">
    <View [style]="{flexDirection: 'row', marginTop: 20}">
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_actionSheet()">Action sheet</Text>
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_shareActionSheet()">Share</Text>
    </View>
    <View [style]="{flexDirection: 'row', marginTop: 20}">
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_alert()">Alert</Text>
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_prompt()">Prompt</Text>
    </View>
    <Text>{{feedback}}</Text>
    <View [style]="{marginTop: 20}">
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_setClipboard()">Clipboard</Text>
      <Text>Current clipboard value: {{clipBoardContent}}</Text>
    </View>
    <View [style]="{flexDirection: 'row', marginTop: 20}">
      <Text [styleSheet]="styles.button" opacityFeedback (tap)="_linking()">Linking</Text>
    </View>
  </TabBarItem>

  <TabBarItem systemIcon="downloads" [selected]="selectedTab == 'two'" (select)="selectedTab='two'" [style]="{padding: 10}">
    <Text [styleSheet]="styles.subtitle">AppState</Text>
    <Text>Current state is {{appState}}</Text>
    <Text [styleSheet]="styles.subtitle">Platform</Text>
    <Text>{{platform}}</Text>
    <Text [styleSheet]="styles.subtitle">PixelRatio</Text>
    <Text>{{ratio}}</Text>
    <Text [styleSheet]="styles.subtitle">Geoloation</Text>
    <Text>{{location}}</Text>
    <Text [styleSheet]="styles.subtitle">NetInfo</Text>
    <Text>{{connectionType}} connection is {{isConnected ? 'on' : 'off'}} and {{isConnectionExpensive ? 'expensive' : 'not expensive'}}</Text>
  </TabBarItem>
</TabBar>
`
})
export class APIsApp {
  selectedTab: string = 'one';
  styles: any;
  appState: string = AppState.currentState;
  clipBoardContent: string = '';
  platform: string = '';
  ratio: number = 0;
  location: string = 'Fetching ...';
  connectionType: string = 'Unknown';
  isConnectionExpensive: boolean = false;
  isConnected: boolean = false;
  feedback: string = '';
  constructor() {
    Clipboard.getString().then((content: string) => this.clipBoardContent = content);
    this.platform = `OS: ${Platform.OS}, version: ${Platform.Version}`;
    this.ratio = PixelRatio.get();
    navigator.geolocation.getCurrentPosition(
      (position) => this.location = JSON.stringify(position),
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    NetInfo.fetch().then((reach: string) => { this.connectionType = reach });
    //NetInfo.isConnectionExpensive((isConnectionExpensive: boolean) => { this.isConnectionExpensive = isConnectionExpensive });
    NetInfo.isConnected.fetch().then((isConnected: boolean) => { this.isConnected = isConnected });
    this.styles = StyleSheet.create({
      button: {
        borderColor: '#005eb8',
        borderWidth: 3,
        color: '#005eb8',
        width: 150,
        padding: 10,
        margin: 10,
        textAlign: 'center',
        fontSize: 20,
        borderRadius: 10
      },
      subtitle: {
        fontSize: 15,
        textAlign: 'left',
        color: '#005eb8'
      }
    });
  }

  _actionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
      title: 'Options',
      options: ['Option 1', 'Option 2', 'Option 3', 'Delete', 'Cancel'],
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
      tintColor: 'black'},
      (actionIndex: number) => {this.feedback = 'Action selected: ' + actionIndex}
    )
  }

  _shareActionSheet() {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: 'https://angular.io',
      message: 'message to go with the shared url',
      subject: 'a subject to go in the email heading',
    },
    (error: any) => {this.feedback = error;},
    (success: boolean, method: string) => {
      if (success) {
        this.feedback = `Shared via ${method}`;
      } else {
        this.feedback = `You didn't share`;
      }
    });
  }

  _alert() {
    Alert.alert(
      'Sync Complete',
      'All your data are belong to us.'
    );
  }

  _prompt() {
    AlertIOS.prompt(
      'Enter password',
      'Enter your password to claim your $1.5B in lottery winnings',
      [
        {text: 'Cancel', onPress: () => {this.feedback = 'Cancel Pressed';}, style: 'cancel'},
        {text: 'OK', onPress: password => {this.feedback = 'OK Pressed, password: ' + password;}}
      ],
      'secure-text'
    );
  }

  _setClipboard() {
    var newValue = this.clipBoardContent == 'foo' ? 'bar' : 'foo';
    Clipboard.setString(newValue);
    Clipboard.getString().then((content: string) => this.clipBoardContent = content);
  }

  _linking() {
    var url = 'https://www.angular.io';
    Linking.canOpenURL(url).then((supported: boolean) => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        Linking.openURL(url);
      }
    });
  }
}

