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

比较常用的是file-loader，可以用户图片文件等的加载，另外还有xml-loader，加载并识别xml文件转换成json，npm install --save-dev file-loader
图片通过file-loader来加载
```javascript
       {
         test: /\.(png|svg|jpg|gif)$/,
         use: [
           'file-loader'
         ]
       }
```
file-loader同时也可以用于字体加载：
```javascript
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         use: [
           'file-loader'
         ]
       }
```
```javascript
+ @font-face {
+   font-family: 'MyFont';
+   src:  url('./my-font.woff2') format('woff2'),
+         url('./my-font.woff') format('woff');
+   font-weight: 600;
+   font-style: normal;
+ }

  .hello {
    color: red;
+   font-family: 'MyFont';
    background: url('./icon.png');
  }
```

### webpack.config.js里面设置 devtool: 'inline-source-map',负责定位到js文件
### package.json里面增加"watch"参数: "webpack --watch",负责监控变化，自动编译，但需要手动刷新
### npm install --save-dev webpack-dev-server， webpack.config.js里面，负责刷新网页（待确定）
```javascript
devServer: {
     contentBase: './dist'
   },
```
