import {Component, Inject, NgZone, ElementRef, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {Node} from '../renderer/node';
import {ReactNativeWrapper, isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['numberOfLines', 'underlineColorAndroid'];
var IOS_INPUTS: Array<string> = ['blurOnSubmit', 'clearButtonMode', 'clearTextOnFocus', 'enablesReturnKeyAutomatically',
  'keyboardAppearance', 'returnKeyType',  'selectTextOnFocus'];

var ANDROID_BINDINGS: string = `[numberOfLines]="_numberOfLines" [underlineColorAndroid]="_underlineColorAndroid"`;
var IOS_BINDINGS: string = `[blurOnSubmit]="_blurOnSubmit" [clearButtonMode]="_clearButtonMode" [clearTextOnFocus]="_clearTextOnFocus"
  [enablesReturnKeyAutomatically]="_enablesReturnKeyAutomatically"
  [keyboardAppearance]="_keyboardAppearance" [returnKeyType]="_returnKeyType" [selectTextOnFocus]="_selectTextOnFocus"`;

@Component({
  selector: 'TextInput',
  inputs: [
    //Non-native
    'autoFocus',
    //Native
    'autoCapitalize', 'autoCorrect', 'editable', 'keyboardType', 'maxLength', 'multiline',
    'password', 'placeholder', 'placeholderTextColor', 'selectionColor'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-textinput [text]="_getText()" [autoCapitalize]="_autoCapitalize" [autoCorrect]="_autoCorrect" [editable]="_editable" [keyboardType]="_keyboardType"
  [maxLength]="_maxLength" [multiline]="_multiline" [password]="_password" [placeholder]="_placeholder" [placeholderTextColor]="_placeholderTextColor" [selectionColor]="_selectionColor"
  (tap)="focusTextInput()" (topFocus)="_handleFocus()" (topChange)="_handleChange($event)" (topTextInput)="_handleTextInput($event)" (topSubmitEditing)="_handleSubmitEditing($event)"
  (topBlur)="_handleBlur()" (topEndEditing)="_handleEndEditing($event)" ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-textinput>`
})
export class TextInput extends HighLevelComponent implements OnInit {
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
  }

  //Events
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<string> = new EventEmitter();
  @Output() input: EventEmitter<string> = new EventEmitter();
  @Output() submit: EventEmitter<string> = new EventEmitter();
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() endEditing: EventEmitter<string> = new EventEmitter();


  //Properties
  @Input() defaultValue: string;
  @Input() value: string = null;
  private _autoFocus: boolean = false;
  set autoFocus(value: any) { this._autoFocus = this.processBoolean(value);}

  private _autoCapitalize : string;
  private _autoCorrect: boolean;
  private _editable: boolean;
  private _keyboardType: string;
  private _maxLength: number;
  private _multiline: boolean;
  private _password: boolean;
  private _placeholder: string;
  private _placeholderTextColor: number;
  private _selectionColor: number;
  set autoCapitalize(value: string) {this._autoCapitalize = this.processEnum(value, ['none', 'sentences', 'words', 'characters']);}
  set autoCorrect(value: any) { this._autoCorrect = this.processBoolean(value);}
  set editable(value: any) {this._editable = this.processBoolean(value);}
  set keyboardType(value: string) {this._autoCapitalize = this.processEnum(value, ['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']);}
  set maxLength(value: any) {this._maxLength = this.processNumber(value);}
  set multiline(value: any) {this._multiline = this.processBoolean(value);}
  set password(value: any) {this._password = this.processBoolean(value);}
  set placeholder(value: string) {this._placeholder = value;}
  set placeholderTextColor(value: string) {this._placeholderTextColor = this.processColor(value);}
  set selectionColor(value: string) {this._selectionColor = this.processColor(value);}

  private _numberOfLines: number;
  private _underlineColorAndroid: number;
  set numberOfLines(value: any) {this._numberOfLines = this.processNumber(value);}
  set underlineColorAndroid(value: string) {this._underlineColorAndroid = this.processColor(value);}

  private _blurOnSubmit: boolean;
  private _clearButtonMode: boolean;
  private _clearTextOnFocus: boolean;
  private _enablesReturnKeyAutomatically: boolean;
  private _keyboardAppearance: string;
  private _returnKeyType: string;
  private _selectTextOnFocus: boolean;
  set blurOnSubmit(value: any) {this._blurOnSubmit = this.processBoolean(value);}
  set clearButtonMode(value: any) {this._clearButtonMode = this.processBoolean(value);}
  set clearTextOnFocus(value: any) {this._clearTextOnFocus = this.processBoolean(value);}
  set enablesReturnKeyAutomatically(value: any) {this._enablesReturnKeyAutomatically = this.processBoolean(value);}
  set keyboardAppearance(value: string) {this._keyboardAppearance = this.processEnum(value, ['default', 'light', 'dark']);}
  set returnKeyType(value: string) {this._returnKeyType = this.processEnum(value, ['default', 'go', 'google', 'join', 'next', 'route', 'search', 'send', 'yahoo', 'done', 'emergency-call']);}
  set selectTextOnFocus(value: any) {this._selectTextOnFocus = this.processBoolean(value);}

  //Event handlers
  _handleFocus() {
    this.focus.emit(null);
  }

  _handleChange(event: any) {
    this.change.emit(event.text);
    if (this.value && this.value != event.text) {
      this._nativeElement.children[0].setProperty('text', this.value);
    }
  }

  _handleTextInput(event: any) {
    this.input.emit(event.text);
  }

  _handleSubmitEditing(event: any) {
    this.submit.emit(event.text);
  }

  _handleBlur() {
    this.blur.emit(null);
  }

  _handleEndEditing(event: any) {
    this.endEditing.emit(event.text);
  }

  //Commands
  blurTextInput() {
    this._nativeElement.children[0].dispatchCommand('blurTextInput');
  }

  focusTextInput() {
    this._nativeElement.children[0].dispatchCommand('focusTextInput');
  }

  //Lifecycle
  ngOnInit() {
    if (this._autoFocus) {
      setTimeout(() => {
        this.focusTextInput();
      }, 0);
    }
  }

  _getText(): string {
    return (this.value && this.value.length > 0) ? this.value : this.defaultValue;
  }
}
