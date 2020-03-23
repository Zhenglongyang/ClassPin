# classpin_app

> A platform to share school work

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Server Configuration

To configurate your server:
  1) go to the main.js file located under /src folder
  2) Replace the firebase config variable with your own server apiKey, authDomain,etc. It should look like this:

```  // Your web app's Firebase configuration
  var firebaseConfig = {
    //REPLACE THIS WITH YOUR FIREBASE CONFIG.
    apiKey: "AIzaSyBQMcvETHcfgQsCez0O3KscPxwWPmAnyFc",
    authDomain: "classpinapp.firebaseapp.com",
    databaseURL: "https://classpinapp.firebaseio.com",
    projectId: "classpinapp",
    storageBucket: "classpinapp.appspot.com",
    messagingSenderId: "1095611313541",
    appId: "1:1095611313541:web:7f4bc0d87eb486550128ec",
    measurementId: "G-W3ZXLX8SHL"
  };
 ```
 
