import {Component, Inject, ElementRef, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {REACT_NATIVE_WRAPPER} from './../renderer/renderer';
import {Node} from '../renderer/node';
import {ReactNativeWrapper, isAndroid} from './../wrapper/wrapper';
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['numberOfLines', 'underlineColorAndroid'];
var IOS_INPUTS: Array<string> = ['clearButtonMode', 'clearTextOnFocus', 'enablesReturnKeyAutomatically',
  'keyboardAppearance', 'returnKeyType'];

var ANDROID_BINDINGS: string = `[numberOfLines]="_numberOfLines" [underlineColorAndroid]="_underlineColorAndroid" (topTextInput)="_handleKeyPress($event)"`;
var IOS_BINDINGS: string = `[clearButtonMode]="_clearButtonMode" [clearTextOnFocus]="_clearTextOnFocus"
  [enablesReturnKeyAutomatically]="_enablesReturnKeyAutomatically" [keyboardAppearance]="_keyboardAppearance"
  [returnKeyType]="_returnKeyType" (topKeyPress)="_handleKeyPress($event)"`;

/**
 * A component for displaying a textinput.
 *
 * ```
@Component({
  selector: 'sample',
  template: `<TextInput placeholder="Type in" (submit)="typed=$event"></TextInput>`
})
export class Sample {
  typed: string = "";
}
 * ```
 * @style https://facebook.github.io/react-native/docs/view.html#style
 */
@Component({
  selector: 'TextInput',
  inputs: [
    //Non-native
    'autoFocus',
    //Native
    'autoCapitalize', 'autoCorrect', 'blurOnSubmit', 'editable', 'keyboardType', 'maxLength', 'multiline',
    'password', 'placeholder', 'placeholderTextColor', 'selectionColor', 'selectTextOnFocus'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-textinput [text]="_getText()" [autoCapitalize]="_autoCapitalize" [autoCorrect]="_autoCorrect" [blurOnSubmit]="_blurOnSubmit" [editable]="_editable" [keyboardType]="_keyboardType"
  [maxLength]="_maxLength" [multiline]="_multiline" [password]="_password" [placeholder]="_placeholder" [placeholderTextColor]="_placeholderTextColor"
  [selectionColor]="_selectionColor" [selectTextOnFocus]="_selectTextOnFocus"
  (tap)="focusTextInput()" (topFocus)="_handleFocus()" (topChange)="_handleChange($event)" (topSubmitEditing)="_handleSubmitEditing($event)"
  (topBlur)="_handleBlur()" (topEndEditing)="_handleEndEditing($event)" ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-textinput>`
})
export class TextInput extends HighLevelComponent implements OnInit {
  private _nativeElement: Node;
  constructor(@Inject(REACT_NATIVE_WRAPPER) wrapper: ReactNativeWrapper, el: ElementRef) {
    super(wrapper);
    this._nativeElement = el.nativeElement;
    if (!wrapper.isAndroid()) {
      this.setDefaultStyle({height: 40});
    }
  }

  //Events
  /**
   * To be documented
   */
  @Output() focus: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() change: EventEmitter<string> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() keyPress: EventEmitter<string> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() submit: EventEmitter<string> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() blur: EventEmitter<any> = new EventEmitter();
  /**
   * To be documented
   */
  @Output() endEditing: EventEmitter<string> = new EventEmitter();


  //Properties
  @Input() defaultValue: string;
  @Input() value: string = null;
  private _autoFocus: boolean = false;
  /**
   * To be documented
   */
  set autoFocus(value: any) { this._autoFocus = this.processBoolean(value);}

  private _autoCapitalize : string;
  private _autoCorrect: boolean;
  private _blurOnSubmit: boolean;
  private _editable: boolean;
  private _keyboardType: string;
  private _maxLength: number;
  private _multiline: boolean;
  private _password: boolean;
  private _placeholder: string;
  private _placeholderTextColor: number;
  private _selectionColor: number;
  private _selectTextOnFocus: boolean;
  /**
   * To be documented
   */
  set autoCapitalize(value: string) {this._autoCapitalize = this.processEnum(value, ['none', 'sentences', 'words', 'characters']);}
  /**
   * To be documented
   */
  set autoCorrect(value: any) { this._autoCorrect = this.processBoolean(value);}
  /**
   * To be documented
   */
  set blurOnSubmit(value: any) {this._blurOnSubmit = this.processBoolean(value);}
  /**
   * To be documented
   */
  set editable(value: any) {this._editable = this.processBoolean(value);}
  /**
   * To be documented
   */
  set keyboardType(value: string) {this._autoCapitalize = this.processEnum(value, ['default', 'email-address', 'numeric', 'phone-pad', 'ascii-capable', 'numbers-and-punctuation', 'url', 'number-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search']);}
  /**
   * To be documented
   */
  set maxLength(value: any) {this._maxLength = this.processNumber(value);}
  /**
   * To be documented
   */
  set multiline(value: any) {this._multiline = this.processBoolean(value);}
  /**
   * To be documented
   */
  set password(value: any) {this._password = this.processBoolean(value);}
  /**
   * To be documented
   */
  set placeholder(value: string) {this._placeholder = value;}
  /**
   * To be documented
   */
  set placeholderTextColor(value: string) {this._placeholderTextColor = this.processColor(value);}
  /**
   * To be documented
   */
  set selectionColor(value: string) {this._selectionColor = this.processColor(value);}
  /**
   * To be documented
   */
  set selectTextOnFocus(value: any) {this._selectTextOnFocus = this.processBoolean(value);}

  private _numberOfLines: number;
  private _underlineColorAndroid: number;
  /**
   * To be documented
   * @platform android
   */
  set numberOfLines(value: any) {this._numberOfLines = this.processNumber(value);}
  /**
   * To be documented
   * @platform android
   */
  set underlineColorAndroid(value: string) {this._underlineColorAndroid = this.processColor(value);}

  private _clearButtonMode: boolean;
  private _clearTextOnFocus: boolean;
  private _enablesReturnKeyAutomatically: boolean;
  private _keyboardAppearance: string;
  private _returnKeyType: string;
  /**
   * To be documented
   * @platform ios
   */
  set clearButtonMode(value: any) {this._clearButtonMode = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set clearTextOnFocus(value: any) {this._clearTextOnFocus = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set enablesReturnKeyAutomatically(value: any) {this._enablesReturnKeyAutomatically = this.processBoolean(value);}
  /**
   * To be documented
   * @platform ios
   */
  set keyboardAppearance(value: string) {this._keyboardAppearance = this.processEnum(value, ['default', 'light', 'dark']);}
  /**
   * To be documented
   * @platform ios
   */
  set returnKeyType(value: string) {this._returnKeyType = this.processEnum(value, ['default', 'go', 'google', 'join', 'next', 'route', 'search', 'send', 'yahoo', 'done', 'emergency-call']);}

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

  _handleKeyPress(event: any) {
    this.keyPress.emit(event.text);
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
  /**
   * To be documented
   */
  blurTextInput() {
    this._nativeElement.children[0].blur();
  }

  /**
   * To be documented
   */
  focusTextInput() {
    this._nativeElement.children[0].focus();
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
