'use strict';
var path = require('path');
var fs = require('fs');
var ts = require('typescript');
var marked = require('marked');
var LEADING_STAR_REGEX = /^[^\S\r\n]*\*[^\S\n\r]?/gm;
var FLAGS_REGEX = /(@([a-z]+)([\t\v\f \u00A0\uFEFF]+\S+){0,1})/g;

function extractFlags(content) {
  var flags = {};
  var match = null;
  while ((match = FLAGS_REGEX.exec(content)) !== null) {
    flags[match[2]] = match[3] ? match[3].trim() : '';
  }
  return flags;
}

function parseComponents() {
  var res = {};
  getFiles('./src/components').forEach(fileName => {
    let sourceFile = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
    res[fileName] = visit(sourceFile);
  });
  return res;
}

function visit(sourceFile) {
  var data = {
    description: null,
    inputs: [],
    outputs: [],
    commands: []
  }
  visitNode(sourceFile);
  return data;

  function visitNode(node) {
    var jsDocs = ts.getJSDocs(node);
    if (jsDocs) {
      jsDocs.forEach(function (jsDoc) {
        var content = sourceFile.text
          .substring(jsDoc.pos + 3, jsDoc.end - 2)
          .replace(LEADING_STAR_REGEX, '')
          .trim();
        if (content) {
          var flags = extractFlags(content);
          content = marked(content.replace(FLAGS_REGEX, '').trim());
          switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
              var lowerCaseName = node.name.text.toLowerCase();
              data.description = {
                name: node.name.text,
                doc: content,
                flags: flags,
                gif: fs.existsSync('./doc/assets/components/' + lowerCaseName + '.gif'),
                gifAndroid: fs.existsSync('./doc/assets/components/' + lowerCaseName + '_android.gif'),
                gifIOS: fs.existsSync('./doc/assets/components/' + lowerCaseName + '_ios.gif')
              }
              break;
            case ts.SyntaxKind.ExportKeyword:
              data.description = {
                name: 'HighLevelComponent',
                doc: content,
                flags: {}
              }
              break;
            case ts.SyntaxKind.PropertyDeclaration:
              var decorator = node.decorators && node.decorators[0] ? node.decorators[0].expression.expression.getText() : null;
              if (decorator) {
                var prop = {
                  name: node.name.getText(),
                  type: node.type.getText(),
                  doc: content,
                  flags: flags
                };
                if (decorator == 'Output') {
                  data.outputs.push(prop);
                } else if (decorator == 'Input') {
                  data.inputs.push(prop);
                }
              }
              break;
            case ts.SyntaxKind.SetAccessor:
              var type = 'any';
              var body = node.body.getText();
              if (body) {
                if (body.indexOf('processBoolean') > -1) {type = 'boolean'}
                else if (body.indexOf('processNumber') > -1) {type = 'number'}
                else if (body.indexOf('processColor') > -1) {type = 'color'}
                else if (body.indexOf('processEnum') > -1) {
                  type = 'enum(' + body.match(/.*\[(.*)\].*/)[1] + ')'
                }
                else {
                  type = node.parameters[0].getText().replace('value: ', '');
                }
              }
              data.inputs.push({
                name: node.name.getText(),
                type: type,
                doc: content,
                flags: flags
              });
              break;
            case  ts.SyntaxKind.MethodDeclaration:
              var params = '';
              node.parameters.forEach((param) => {params += params == '' ? param.getText() : ', ' + param.getText();})
              data.commands.push({
                name: node.name.getText(),
                params: params,
                doc: content,
                flags: flags
              })
              break;
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.Decorator:
              break;
            default:
              console.log('Unmanaged node of kind ' + node.kind + ' with content ' + content);
          }
        }
      });
    }

    ts.forEachChild(node, visitNode);
  }
}

module.exports = {
  parseComponents: parseComponents
};

function getFiles(dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()){
      getFiles(name, files_);
    } else {
      if (name.indexOf('/_') == -1 && name.indexOf('module') == -1) {
        files_.push(name);
      }
    }
  }
  return files_;
}