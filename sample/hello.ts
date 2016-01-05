import {Component} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {HighLight} from './common';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'sub',
  template: `<Text>Sub-component says hello</Text>
  <ng-content select="view"></ng-content>
  <Text>--------</Text>
  <ng-content></ng-content>`
})
class Sub {}

@Component({
  selector: 'hello-app',
  directives: [NgIf, NgFor, Sub, HighLight],
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<View [style]="styles.container">
  <ImageView overflow="hidden" resizeMode="contain" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAADtUlEQVR4Ac3YA2Bj6QLH0XPT1Fzbtm29tW3btm3bfLZtv7e2ObZnms7d8Uw098tuetPzrxv8wiISrtVudrG2JXQZ4VOv+qUfmqCGGl1mqLhoA52oZlb0mrjsnhKpgeUNEs91Z0pd1kvihA3ULGVHiQO2narKSHKkEMulm9VgUyE60s1aWoMQUbpZOWE+kaqs4eLEjdIlZTcFZB0ndc1+lhB1lZrIuk5P2aib1NBpZaL+JaOGIt0ls47SKzLC7CqrlGF6RZ09HGoNy1lYl2aRSWL5GuzqWU1KafRdoRp0iOQEiDzgZPnG6DbldcomadViflnl/cL93tOoVbsOLVM2jylvdWjXolWX1hmfZbGR/wjypDjFLSZIRov09BgYmtUqPQPlQrPapecLgTIy0jMgPKtTeob2zWtrGH3xvjUkPCtNg/tm1rjwrMa+mdUkPd3hWbH0jArPGiU9ufCsNNWFZ40wpwn+62/66R2RUtoso1OB34tnLOcy7YB1fUdc9e0q3yru8PGM773vXsuZ5YIZX+5xmHwHGVvlrGPN6ZSiP1smOsMMde40wKv2VmwPPVXNut4sVpUreZiLBHi0qln/VQeI/LTMYXpsJtFiclUN+5HVZazim+Ky+7sAvxWnvjXrJFneVtLWLyPJu9K3cXLWeOlbMTlrIelbMDlrLenrjEQOtIF+fuI9xRp9ZBFp6+b6WT8RrxEpdK64BuvHgDk+vUy+b5hYk6zfyfs051gRoNO1usU12WWRWL73/MMEy9pMi9qIrR4ZpV16Rrvduxazmy1FSvuFXRkqTnE7m2kdb5U8xGjLw/spRr1uTov4uOgQE+0N/DvFrG/Jt7i/FzwxbA9kDanhf2w+t4V97G8lrT7wc08aA2QNUkuTfW/KimT01wdlfK4yEw030VfT0RtZbzjeMprNq8m8tnSTASrTLti64oBNdpmMQm0eEwvfPwRbUBywG5TzjPCsdwk3IeAXjQblLCoXnDVeoAz6SfJNk5TTzytCNZk/POtTSV40NwOFWzw86wNJRpubpXsn60NJFlHeqlYRbslqZm2jnEZ3qcSKgm0kTli3zZVS7y/iivZTweYXJ26Y+RTbV1zh3hYkgyFGSTKPfRVbRqWWVReaxYeSLarYv1Qqsmh1s95S7G+eEWK0f3jYKTbV6bOwepjfhtafsvUsqrQvrGC8YhmnO9cSCk3yuY984F1vesdHYhWJ5FvASlacshUsajFt2mUM9pqzvKGcyNJW0arTKN1GGGzQlH0tXwLDgQTurS8eIQAAAABJRU5ErkJggg=="></ImageView>
  <Text [style]="styles.welcome">
    Welcome to ngReactNative!
  </Text>
  <ScrollView [style]="styles.scroll">
    <View collapsable="false">
      <View [style]="styles.container">
        <Text [style]="styles.instructions">
          To get started, edit hello.ts
        </Text>
        <Text [style]="styles.instructions" [fontSize]="s">
          Shake or press menu button for dev menu {{foo}}
        </Text>
        <Text *ngIf="maybe" [style]="styles.row">ngIf says hello</Text>
        <sub [marginTop]="10" [marginBottom]="10" [style]="styles.row">
          <Text>Some content at the bottom</Text>
          <View><Text>Some content in a view, at the top</Text></View>
        </sub>
        <Text *ngFor="#item of items" [style]="styles.row">ngFor says {{item}}</Text>

        <TextInput placeholder="Type in" (topTouchEnd)="$event.target.focus()" (topSubmitEditing)="$event.target.blur()"></TextInput>
        <View [style]="styles.button" highlight (tap)="handleEvent($event)">
          <Text>Button</Text>
        </View>
      </View>
    </View>
  </ScrollView>
</View>
`
})
export class HelloApp {
  foo: string = "bar";
  maybe: boolean = true;
  styles: any;
  items: Array<number> = [1, 2, 3, 4];
  constructor() {
    this.styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFB6C1',
      },
      welcome: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: '#2F3B75'
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
      },
      row: {
        backgroundColor: '#E2DCF7',
      },
      button: {
        margin: 20,
        padding: 10,
        backgroundColor: '#800080'
      },
      scroll: {
        flex: 1
      }
    });
  }

  handleEvent(event: any) {
    this.maybe = !this.maybe;
    this.foo += "!";
    this.items.splice(3,1);
    this.items.push(Math.ceil(Math.random()*10));
  }
}

