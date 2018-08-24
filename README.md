# WebPack学习笔记 

#### 参照 https://webpack.js.org/guides/getting-started/

## 初步入门

按照npm install webpack webpack-cli --save-dev

需要先设置package.json，将main移除，设置private：true
(参照package.json的说明：如果你设置"private": true，npm就不会发布它。这是一个防止意外发布私有库的方式。如果你要确定给定的包是只发布在特定registry（如内部registry）的，用publishConfighash的描述来重写registry的publish-time配置参数。）

### webpack默认配置和运行
项目下必须有src和dist目录，这是webpack默认识别的路径
运行npx webpack, 默认将src/index.js 作为入口，同时生成的文件路径位于dist/main.js

### 通过配置运行webpack, 配置文件名称：webpack.config.js，位于项目根目录下，跟package.json同级别。
默认配置如下：
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```
可以自己修改entry和main。

npm可以在scripts里加上build配置，npm run build则使用webpack构建项目
```javascript
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9"
    },
    "dependencies": {
      "lodash": "^4.17.5"
    }
  }
```

## 模块加载
主要是css，js还有一些文件的读取配置，通过正则表达试匹配文件名，然后加载对应的模块，最终编译出对应的文件处理

### 添加css加载支持：npm install --save-dev style-loader css-loader
可以通过import './style.css' 加载css。
需要在config文件里指出css文件的匹配正则（通过css loader识别css语法，进行整体编译）
```javascript
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```
假如使用css加载模块，会出现下面报错，因为无法识别css，没办法进行整体编译：
```
ERROR in ./src/style.css 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type.
> .hello {
|   color: red;
|   background: url('./icon.jpg');
 @ ./src/index.js 2:0-21
```
