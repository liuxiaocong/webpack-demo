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

## 输出管理（Output Management）
### 生成加载多个js文件
之前说的都是只有一个js的情况，假如有多个js文件需要加载，则需要进行配置，以html为例子：
```html
<!doctype html>
  <html>
    <head>
-     <title>Asset Management</title>
+     <title>Output Management</title>
+     <script src="./print.bundle.js"></script>
    </head>
    <body>
-     <script src="./bundle.js"></script>
+     <script src="./app.bundle.js"></script>
    </body>
  </html>
```
webpack.config.js对应修改为：
```javascript
const path = require('path');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };

```
运行后将在dist目录生成print.bundle.js，和app.bundle.js

### 通过HtmlWebpackPlugin设置html的生成规则，以修改title为例子：
先安装：npm install --save-dev html-webpack-plugin
修改webpack.config.js
```javascript
const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```
### 其他插件：npm install --save-dev clean-webpack-plugin，用户每次构建前情况dist目录。
webpack.config.js 修改为：
```javascript
 const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## 实际开发使用

### webpack.config.js里面设置 devtool: 'inline-source-map',负责定位到js文件
print.js
```javascript
export default function printMe() {
  //console.log('I get called from print.js!');
  console.logs('I get called from print.js！');
}
```
错误的js代码console.logs，运行时可以在chrome的console log里发现
```
print.js:3 Uncaught TypeError: console.logs is not a function
    at HTMLButtonElement.e (print.js:3)
```
点击可以定位到错误的js文件

### 自动编译刷新工具有3种选择：

#### 1, webpack's Watch Mode: package.json里面增加"watch"参数: "webpack --watch",负责监控变化，自动编译，但需要手动刷新
package.json文件内容为：
```javascript
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "watch": "webpack --watch",
    "server": "node server.js",
    "start": "webpack-dev-server --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^0.1.19",
    "css-loader": "^1.0.0",
    "csv-loader": "^3.0.2",
    "express": "^4.16.3",
    "file-loader": "^2.0.0",
    "html-webpack-plugin": "^3.2.0",
    "style-loader": "^0.22.1",
    "webpack": "^4.17.0",
    "webpack-cli": "^3.1.0",
    "webpack-dev-middleware": "^3.2.0",
    "webpack-dev-server": "^3.1.6",
    "xml-loader": "^1.2.1"
  },
  "dependencies": {
    "lodash": "^4.17.10"
  }
}
```

#### 2 webpack-dev-server，自动编译，自动刷新
安装插件npm install --save-dev webpack-dev-server
webpack.config.js里面增加
```javascript
devServer: {
     contentBase: './dist'
   },
```

同时设置package.json， "start": "webpack-dev-server --open"， 这是常规app应用，包括了webpack --watch的功能


#### 3 webpack-dev-middleware，实际上2说的webpack-dev-server也是使用了这个方式，只是已经封装好给你使用而已
可以自定义服务器完成编译刷新工作，以express为例子，首先是安装：npm install --save-dev express webpack-dev-middleware
修改 webpack.config.js，添加publicPath设置，保证资源文件的正确获取
```javascript
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/'
    }
  };
```
构建服务器：server.js
```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
package.json添加配置，（也可以对应到npm start下）
```javascript
{
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack-dev-server --open",
+     "server": "node server.js",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^0.1.16",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "express": "^4.15.3",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^3.0.0",
      "webpack-dev-middleware": "^1.12.0",
      "xml-loader": "^1.2.1"
    }
  }
```
运行npm run server

