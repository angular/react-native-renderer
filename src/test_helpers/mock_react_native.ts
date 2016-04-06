global.require = function (s: any) {
  return {uri: s};
}

//Mock of React Native APIs to test with systemjs in a browser
export class StyleSheet {
  static create(s: any) {
    return s;
  }
}