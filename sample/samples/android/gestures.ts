import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {NativeFeedback} from './common';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'gestures-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgFor, NativeFeedback],
  template: `
<native-view [style]="styles.surface" flex="6"
  (doubletap)="handleEvent($event)"
  (pan)="handleEvent($event)"
  (panstart)="handleEvent($event)"
  (panmove)="handleEvent($event)"
  (panend)="handleEvent($event)"
  (pancancel)="handleEvent($event)"
  (panleft)="handleEvent($event)"
  (panright)="handleEvent($event)"
  (panup)="handleEvent($event)"
  (pandown)="handleEvent($event)"
  (pinch)="handleEvent($event)"
  (pinchstart)="handleEvent($event)"
  (pinchmove)="handleEvent($event)"
  (pinchend)="handleEvent($event)"
  (pinchcancel)="handleEvent($event)"
  (pinchin)="handleEvent($event)"
  (pinchout)="handleEvent($event)"
  (press)="handleEvent($event)"
  (pressup)="handleEvent($event)"
  (rotate)="handleEvent($event)"
  (rotatestart)="handleEvent($event)"
  (rotatemove)="handleEvent($event)"
  (rotateend)="handleEvent($event)"
  (rotatecancel)="handleEvent($event)"
  (swipe)="handleEvent($event)"
  (swipeleft)="handleEvent($event)"
  (swiperight)="handleEvent($event)"
  (swipeup)="handleEvent($event)"
  (swipedown)="handleEvent($event)"
  (tap)="handleEvent($event)"
  (tapstart)="handleEvent($event)"
  (tapcancel)="handleEvent($event)">
  <native-text [style]="styles.buttonText">TOUCH ME</native-text>
</native-view>
<native-view [style]="styles.button" flex="1" nativeFeedback (tap)="clearLogs()">
  <native-text [style]="styles.buttonText">Clear logs</native-text>
</native-view>
<ScrollView flex="12">
  <native-view collapsable="false">
    <native-view [style]="styles.logs">
      <native-text *ngFor="#log of logs">{{log}}</native-text>
    </native-view>
  </native-view>
</ScrollView>
`
})
export class GesturesApp {
  logs: Array<string> = [];
  styles: any;
  private _begin: number;
  constructor() {
    this.styles = StyleSheet.create({
      surface: {
        backgroundColor: '#ABABAB',
      },
      logs: {
        flex: 1
      },
      button: {
        padding: 10,
        backgroundColor: '#005eb8'
      },
      buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 20
      }
    });
  }

  handleEvent(event: any) {
    if (this.logs.length == 0) {
      this._begin = event.timeStamp;
    }
    this.logs.push(`${event.timeStamp - this._begin}ms - ${event.type}`);
  }

  clearLogs() {
    this.logs = [];
  }
}