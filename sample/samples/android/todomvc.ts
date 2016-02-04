import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {HighLight} from './common';
import {StyleSheet, AsyncStorage} from 'react-native';

class Palette {
  static background: string = '#005eb8';
  static lightText: string = '#ffffff';
  static darkText: string = '#333333';
  static disabledText: string = '#a6a6a8';
  static ok: string = '#309712';
  static delete: string = '#ce0058';
  static onBg: string = '#00a9e0';
  static onText: string = '#333333';
  static offBg: string = '#e5e5e5';
  static offText: string = '#005eb8';
}

class Todo {
  constructor(public value: string = "", public active: boolean = true, public edited: boolean = false) {}
}

@Component({
  selector: 'todo-item',
  directives: [NgIf, HighLight],
  template: `
<native-view [style]="styles.row">
<Text [style]="[styles.tick, item.active ? styles.tickOff : styles.tickOn]" highlight (tap)="toggle($event)">{{item.active ? "[  ]" : "[x]"}}</Text>
<Text *ngIf="!item.edited" [style]="[styles.main, item.active ? styles.mainOff : styles.mainOn]" (doubletap)="startEdit()">{{item.value}}</Text>
<TextInput *ngIf="item.edited" [style]="styles.editor" [text]="item.value" mostRecentEventCount="0" (tap)="$event.target.focus()" (topSubmitEditing)="stopEdit($event)"></TextInput>
<Text [style]="styles.cross" highlight (tap)="delete()">X</Text>
</native-view>
`
})
export class TodoItem {
  styles: any;
  @Input() item: Todo;
  @Output() toggled: EventEmitter<number> = new EventEmitter();
  @Output() deleted: EventEmitter<Todo> = new EventEmitter();

  constructor() {
    this.styles = this._getStyles();
  }

  toggle(event: any) {
    this.item.active = !this.item.active;
    this.toggled.emit(this.item.active ? 1 : -1);
  }

  delete() {
    this.deleted.emit(this.item);
  }

  startEdit() {
    this.item.edited = true;
  }

  stopEdit(event: any) {
    event.target.blur();
    this.item.edited = false;
    if (event.text && event.text.length > 0) {
      this.item.value = event.text;
    }
  }

  _getStyles() {
    return StyleSheet.create({
      row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: Palette.background,
        margin: 5,
        paddingBottom: 10
      },
      main: {
        flex: 1,
        fontSize: 20,
        marginLeft: 5
      },
      mainOn: {
        color: Palette.disabledText
      },
      mainOff: {
        color: Palette.darkText
      },
      editor: {
        flex: 1,
        marginLeft: 5
      },
      tick: {
        width: 25,
        textAlign: 'center',
        fontSize: 20
      },
      tickOn: {
        color: Palette.ok
      },
      tickOff: {
        color: Palette.darkText
      },
      cross: {
        width: 25,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: Palette.delete,
        color: Palette.lightText
      }
    });
  }
}

@Component({
  selector: 'todo-mvc',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NgFor, NgIf, TodoItem, HighLight],
  template: `
<native-view flexDirection="row">
  <Text [style]="[styles.all, leftCount == 0 ? styles.allOn : styles.allOff]" (tap)="selectAll()">V</Text>
  <TextInput [style]="styles.input" text="" mostRecentEventCount="0" placeholder="What needs to be done?" (tap)="$event.target.focus()" (topSubmitEditing)="createTodo($event)"></TextInput>
</native-view>
<ScrollView [style]="styles.scroll">
  <native-view collapsable="false">
    <template ngFor #todo [ngForOf]="filteredTodos">
      <todo-item [item]="todo" (toggled)="updateCount($event)" (deleted)="deleteTodo($event)"></todo-item>
    </template>
  </native-view>
</ScrollView>
<native-view [style]="styles.footer">
  <native-view width="60">
    <Text [style]="styles.counter" fontSize="20">{{leftCount}}</Text>
    <Text [style]="styles.counter">item{{leftCount == 1 ? '' : 's'}} left</Text>
  </native-view>
  <native-view flex="1" flexDirection="row" justifyContent="center">
    <native-view [style]="[styles.filter, filter == 'all' ? styles.filterOn : styles.filterOff]" highlight (tap)="setFilter($event, 'all')">
      <Text [style]="[styles.filterText, filter == 'all' ? styles.filterTextOn : styles.filterTextOff]">All</Text>
    </native-view>
    <native-view [style]="[styles.filter, filter == 'active' ? styles.filterOn : styles.filterOff]" highlight (tap)="setFilter($event, 'active')">
      <Text [style]="[styles.filterText, filter == 'active' ? styles.filterTextOn : styles.filterTextOff]">Active</Text>
    </native-view>
    <native-view [style]="[styles.filter, filter == 'done' ? styles.filterOn : styles.filterOff]" highlight (tap)="setFilter($event, 'done')">
      <Text [style]="[styles.filterText, filter == 'done' ? styles.filterTextOn : styles.filterTextOff]">Done</Text>
    </native-view>
  </native-view>
    <native-view [style]="styles.clear" highlight (tap)="clearDone($event)"><Text [style]="styles.clearText">Clear\ndone</Text></native-view>
</native-view>
`
})
export class TodoMVC {
  styles: any;
  todos: Array<Todo> = [];
  filteredTodos: Array<Todo> = [];
  leftCount: number = 0;
  filter: string = 'all';

  constructor() {
    this.styles = this._getStyles();
    this.reset();
  }

  createTodo(event: any) {
    if (event.text && event.text.length > 0) {
      this.todos.push(new Todo(event.text, true, false));
      this.leftCount++;
    }
    this.filterTodos();
    event.target.blur();
  }

  deleteTodo(todo: Todo) {
    var index = this.todos.indexOf(todo);
    if (index > -1) {
      this.todos.splice(index, 1);
      if (todo.active) {
        this.leftCount--;
      }
    }
    this.filterTodos();
  }

  selectAll() {
    var result = this.leftCount == 0;
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].active != result) {
        this.leftCount = this.leftCount + (result ? 1 : -1);
      }
      this.todos[i].active = result;
    }
    this.filterTodos();
  }

  clearDone(event: any) {
    this.todos = this.todos.filter((todo) => {
      return todo.active;
    }, this);
    this.filterTodos();
  }

  updateCount(diff: number) {
    this.leftCount += diff;
    if (this.filter != 'all') {
      this.filterTodos();
    }
  }

  setFilter(event: any, filter: string) {
    this.filter = filter;
    this.filterTodos();
  }

  filterTodos() {
    this.filteredTodos = this.todos.filter((todo) => {
      return this.filter == 'all' || (this.filter == 'active' && todo.active) || (this.filter == 'done' && !todo.active);
    }, this);
  }

  reset() {
    this.todos = this.filteredTodos = [
      new Todo("Angular 2", false, false),
      new Todo("React Native", false, false),
      new Todo("Android", false, false),
      new Todo("iOS", true, false)
    ];
    this.leftCount = 1;
  }

  empty() {
    this.todos = this.filteredTodos = [];
    this.leftCount = 0;
  }

  full() {
    var res: Array<Todo> = [];
    this.leftCount = 0;
    var examples = ['Do something', 'Go there', 'Buy this', 'Call her', 'Think about it']
    for (var i = 0; i < 100; i++) {
      var j = Math.floor(Math.random() * 5);
      var b = Math.random() > 0.5;
      res.push(new Todo(examples[j] + ' ' + i, b, false));
      if (b) this.leftCount++;
    }
    this.todos = this.filteredTodos = res;
  }

  save() {
    AsyncStorage.setItem('todos:key', JSON.stringify({todos: this.todos, left: this.leftCount, filter: this.filter}));
  }

  load() {
    this.empty();
    AsyncStorage.getItem('todos:key').then((jsonString: string) => {
      var json = JSON.parse(jsonString);
      this.todos = json.todos;
      this.leftCount = json.left;
      this.filter = json.filter;
      this.filterTodos();
    });
  }

  _getStyles() {
    return StyleSheet.create({
      all: {
        fontWeight: 'bold',
        width: 30,
        marginTop: 30,
        textAlign: "center"
      },
      allOn: {
        color: Palette.offText
      },
      allOff: {
        color: Palette.disabledText
      },
      input: {
        flex: 1,
        color: Palette.darkText
      },
      scroll: {
        flex: 1
      },
      footer: {
        backgroundColor: Palette.background,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 45
      },
      counter: {
        color: Palette.lightText,
        textAlign: 'center'
      },
      filter: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 55,
        marginHorizontal: 1
      },
      filterOn: {
        backgroundColor: Palette.onBg
      },
      filterOff: {
        backgroundColor: Palette.offBg
      },
      filterText: {
        textAlign: 'center'
      },
      filterTextOn: {
        color: Palette.onText
      },
      filterTextOff: {
        color: Palette.offText
      },
      clear: {
        backgroundColor: Palette.delete,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 55,
        marginLeft: 5
      },
      clearText: {
        textAlign: 'center',
        color: Palette.lightText
      }
    });
  }
}
