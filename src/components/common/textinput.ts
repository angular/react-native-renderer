import {Component, Inject, ElementRef, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {REACT_NATIVE_WRAPPER} from "../../renderer/renderer";
import {Node} from "../../renderer/node";
import {ReactNativeWrapper, isAndroid} from "../../wrapper/wrapper";
import {HighLevelComponent, GENERIC_INPUTS, GENERIC_BINDINGS} from "./component";

var ANDROID_INPUTS: Array<string> = ['numberOfLines', 'returnKeyLabel', 'underlineColorAndroid'];
var IOS_INPUTS: Array<string> = ['clearButtonMode', 'clearTextOnFocus', 'dataDetectorTypes',
  'enablesReturnKeyAutomatically', 'keyboardAppearance'];

var ANDROID_BINDINGS: string = `[numberOfLines]="_numberOfLines" [underlineColorAndroid]="_underlineColorAndroid"
  [returnKeyLabel]="_returnKeyLabel" (topTextInput)="_handleKeyPress($event)"
  mostRecentEventCount="0"`;
var IOS_BINDINGS: string = `[clearButtonMode]="_clearButtonMode" [clearTextOnFocus]="_clearTextOnFocus"
  [dataDetectorTypes]="_dataDetectorTypes"
  [enablesReturnKeyAutomatically]="_enablesReturnKeyAutomatically" [keyboardAppearance]="_keyboardAppearance"
  (topKeyPress)="_handleKeyPress($event)"`;

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
    'autoFocus', 'value',
    //Native
    'autoCapitalize', 'autoCorrect', 'blurOnSubmit', 'editable', 'keyboardType', 'maxLength', 'multiline',
    'placeholder', 'placeholderTextColor', 'returnKeyType', 'secureTextEntry', 'selectionColor', 'selectTextOnFocus'
  ].concat(GENERIC_INPUTS).concat(isAndroid() ? ANDROID_INPUTS : IOS_INPUTS),
  template: `<native-textinput [text]="_nativeValue" [autoCapitalize]="_autoCapitalize" [autoCorrect]="_autoCorrect" [blurOnSubmit]="_blurOnSubmit" [editable]="_editable" [keyboardType]="_keyboardType"
  [maxLength]="_maxLength" [multiline]="_multiline" [placeholder]="_placeholder" [placeholderTextColor]="_placeholderTextColor" [secureTextEntry]="_secureTextEntry"
  [returnKeyType]="_returnKeyType" [selectionColor]="_selectionColor" [selectTextOnFocus]="_selectTextOnFocus"
  (tap)="focusTextInput()" (topFocus)="_handleFocus()" (topChange)="_handleChange($event)" (topSubmitEditing)="_handleSubmitEditing($event)"
  (topBlur)="_handleBlur()" (topEndEditing)="_handleEndEditing($event)" (topContentSizeChange)="_handleContentSizeChange($event)"
  ${GENERIC_BINDINGS} ${isAndroid() ? ANDROID_BINDINGS : IOS_BINDINGS}></native-textinput>`
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
  /**
   * To be documented
   */
  @Output() contentSizeChange: EventEmitter<string> = new EventEmitter();


  //Properties
  @Input() defaultValue: string;
  public _autoFocus: boolean = false;
  public _value: string = null;
  public _nativeValue: string = null;
  /**
   * To be documented
   */
  set autoFocus(value: any) { this._autoFocus = this.processBoolean(value);}
  /**
   * To be documented
   */
  set value(value: string) {
    this._value = value;
    this._nativeValue = value;
  }

  public _autoCapitalize : string;
  public _autoCorrect: boolean;
  public _blurOnSubmit: boolean;
  public _editable: boolean;
  public _keyboardType: string;
  public _maxLength: number;
  public _multiline: boolean;
  public _placeholder: string;
  public _placeholderTextColor: number;
  public _returnKeyType: string;
  public _secureTextEntry: boolean;
  public _selectionColor: number;
  public _selectTextOnFocus: boolean;
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
  set placeholder(value: string) {this._placeholder = value;}
  /**
   * To be documented
   */
  set placeholderTextColor(value: string) {this._placeholderTextColor = this.processColor(value);}
  /**
   * To be documented
   * // Cross-platform
   * 'done', 'go', 'next', 'search', 'send',
   * // Android-only
   * 'none', 'previous',
   * // iOS-only
   * 'default', 'emergency-call', 'google', 'join', 'route', 'yahoo'
   */
  set returnKeyType(value: string) {this._returnKeyType = this.processEnum(value, ['done', 'go', 'next', 'search', 'send', 'none', 'previous', 'default', 'emergency-call', 'google', 'join', 'route', 'yahoo']);}
  /**
   * To be documented
   */
  set secureTextEntry(value: any) {this._secureTextEntry = this.processBoolean(value);}
  /**
   * To be documented
   */
  set selectionColor(value: string) {this._selectionColor = this.processColor(value);}
  /**
   * To be documented
   */
  set selectTextOnFocus(value: any) {this._selectTextOnFocus = this.processBoolean(value);}

  public _numberOfLines: number;
  public _returnKeyLabel: string;
  public _underlineColorAndroid: number;
  /**
   * To be documented
   * @platform android
   */
  set numberOfLines(value: any) {this._numberOfLines = this.processNumber(value);}
  /**
   * To be documented
   * @platform android
   */
  set returnKeyLabel(value: string) {this._returnKeyLabel = value;}
  /**
   * To be documented
   * @platform android
   */
  set underlineColorAndroid(value: string) {this._underlineColorAndroid = this.processColor(value);}

  public _clearButtonMode: boolean;
  public _clearTextOnFocus: boolean;
  public _dataDetectorTypes: string;
  public _enablesReturnKeyAutomatically: boolean;
  public _keyboardAppearance: string;
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
  set dataDetectorTypes(value: string) {this._dataDetectorTypes = this.processEnum(value, ['phoneNumber', 'link', 'address', 'calendarEvent', 'none', 'all']);}
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

  //Event handlers
  _handleFocus() {
    this.focus.emit(null);
  }

  _handleChange(event: any) {
    this._nativeElement.children[0].setProperty('mostRecentEventCount', event.eventCount);

    this.change.emit(event.text);
    if (event.text != this._nativeValue) {
      this._nativeValue = event.text;
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

  _handleContentSizeChange(event: any) {
    this.contentSizeChange.emit(event);
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
    this._nativeValue = this._getText();
  }

  _getText(): string {
    return (this._value && this._value.length > 0) ? this._value : this.defaultValue;
  }
}
