import {Component, NgIf, NgFor, Input} from 'angular2/angular2';

class Item {
  constructor(public value: string = "") {}
}

@Component({
  selector: 'sub',
  template: `<Text>Sub-component says hello {{item.value}}</Text>`
})
class Sub {
  @Input() item: Item;
}

@Component({
  selector: 'debug-app',
  directives: [NgIf, NgFor, Sub],
  host: {position: "absolute", top: 0, left: 0, bottom: 0, right: 0},
  template: `
<View>
  <template ng-for #item [ng-for-of]="items">
    <sub *ng-if="item.value != ''" [item]="item"></sub>
  </template>
  <View (toptouchend)="handleEvent($event)">
    <Text>Button</Text>
  </View>
</View>
`
})
export class DebugApp {
  items: Array<Item> = [
    new Item("1"),
    new Item("2"),
    new Item("3"),
    new Item("4"),
  ];
  constructor() {}

  handleEvent(event) {
    this.items.push(new Item("5"));
  }
}

