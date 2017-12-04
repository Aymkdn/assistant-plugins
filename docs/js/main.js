// Promise polyfill
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Promise=t()}(this,function(){"use strict";function e(){}function t(e,t){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,f._immediateFn(function(){var i=1===e._state?t.onFulfilled:t.onRejected;if(null!==i){var r;try{r=i(e._value)}catch(e){return void o(t.promise,e)}n(t.promise,r)}else(1===e._state?n:o)(t.promise,e._value)})):e._deferreds.push(t)}function n(e,t){try{if(t===e)throw new TypeError("A promise cannot be resolved with itself.");if(t&&("object"==typeof t||"function"==typeof t)){var n=t.then;if(t instanceof f)return e._state=3,e._value=t,void i(e);if("function"==typeof n)return void r(function(e,t){return function(){e.apply(t,arguments)}}(n,t),e)}e._state=1,e._value=t,i(e)}catch(t){o(e,t)}}function o(e,t){e._state=2,e._value=t,i(e)}function i(e){2===e._state&&0===e._deferreds.length&&f._immediateFn(function(){e._handled||f._unhandledRejectionFn(e._value)});for(var n=0,o=e._deferreds.length;o>n;n++)t(e,e._deferreds[n]);e._deferreds=null}function r(e,t){var i=!1;try{e(function(e){i||(i=!0,n(t,e))},function(e){i||(i=!0,o(t,e))})}catch(e){if(i)return;i=!0,o(t,e)}}function f(e){if(!(this instanceof f))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],r(e,this)}var u=setTimeout,c=f.prototype;return c.catch=function(e){return this.then(null,e)},c.then=function(n,o){var i=new this.constructor(e);return t(this,new function(e,t,n){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.promise=n}(n,o,i)),i},f.all=function(e){return new f(function(t,n){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(t){o(e,t)},n)}i[e]=f,0==--r&&t(i)}catch(e){n(e)}}if(!e||void 0===e.length)throw new TypeError("Promise.all accepts an array");var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var r=i.length,f=0;i.length>f;f++)o(f,i[f])})},f.resolve=function(e){return e&&"object"==typeof e&&e.constructor===f?e:new f(function(t){t(e)})},f.reject=function(e){return new f(function(t,n){n(e)})},f.race=function(e){return new f(function(t,n){for(var o=0,i=e.length;i>o;o++)e[o].then(t,n)})},f._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){u(e,0)},f._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},f});
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}

function PromiseChain(n,r){var e=Promise.resolve(),i=n.map(function(n){return e=e.then(function(){return r(n)})});return Promise.all(i)}

var repoURL = "https://raw.githubusercontent.com/Aymkdn/assistant-plugins/master/docs/";

// Vue
var store = new Vuex.Store({
  state: {
    plugins:[]
  }
})
var appVue = new Vue({
  data:{
    download:{
      text:"Télécharger",
      disabled:false
    }
  },
  components: {
    'vue-plugins': {
      template:'#vue-plugins-template',
      computed:{
        store:function() { return store }
      }
    },
    'vue-plugins-selection': {
      template:'#vue-plugins-selection-template',
      computed:{
        store:function() { return store }
      }
    }
  },
  methods:{
    downloadStart:function() {
      var _this=this;
      var pluginsSelected = store.state.plugins.filter(function(plugin) { return plugin.selected });
      var zip = new JSZip();
      var files = [ "index.js", "postinstall.js", "install.bat", "start.bat", "update.bat"];
      _this.download.text = "Téléchargement...";
      // on récupère le package.json et on y ajoute les plugins choisis
      request(repoURL+'install/package.json?timestamp='+Date.now())
      .then(function(responseText) {
        var json = JSON.parse(responseText);
        pluginsSelected.forEach(function(plugin) {
          json.dependencies["assistant-"+plugin.name] = "latest";
        })
        // on crée le package.json en y insérant les plugins demandés
        var pkg = "{" + JSON.stringify(json).replace(/(,|{)/g, "$1\r\n  ").replace(/}/g, "\r\n}").slice(1,-1) + "}";
        zip.file("assistant-plugins/package.json", pkg);
        // on télécharge les autres fichiers
        var dfd = Promise.resolve();
        var res = files.map(function(file) {
          dfd = dfd.then(function() {
            return request(repoURL+'install/'+file+'?timestamp='+Date.now());
          });
          return dfd
        });
        return Promise.all(res)
      })
      .then(function(res) {
        files.forEach(function(file, idx) {
          zip.file("assistant-plugins/"+file, res[idx]);
        })
        return zip.generateAsync({type:"blob"});
      })
      .then(function(content) {
        saveAs(content, "assistant-plugins.zip");
        _this.download.text="Télécharger";
      });
    }
  }
});

function request(url) {
  return new Promise(function(prom_res, prom_rej) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(event) {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          prom_res(this.responseText);
        } else {
          prom_rej()
        }
      }
    };
    req.open('GET', url, true);
    req.send(null);
  })
}

// on récupère la page sur Github
var pageURL = repoURL+'index.md';
var isMain = true;
// si on souhaite afficher la page d'un plugin
if (window.location.search.indexOf("?plugin=") !== -1) {
  var plugin = window.location.search.slice(8);
  plugin = store.state.plugins.filter(function(p) { return p.name === plugin });
  if (plugin.length>0 && plugin[0].url) {
    isMain = false;
    pageURL = plugin[0].url.replace(/github.com/,"raw.githubusercontent.com")+'/master/README.md'
    document.querySelector('.project-name').innerHTML = "Plugin '"+plugin[0].name+"'";
    document.querySelector('.project-tagline').innerHTML = plugin[0].description;
    document.querySelector('.project-url').href = plugin[0].url;
    document.querySelector('.page-header').style.backgroundImage = "linear-gradient(120deg, #155799, #993a15)";
  }
}
request("https://github-proxy.kodono.info/?q="+encodeURIComponent(pageURL)+"&direct=true&timestamp="+Date.now())
.then(function(responseText) {
  document.querySelector('#contenu').innerHTML = marked(responseText).replace(/(\\{\\{[^\\]+\\}\\})/g,function(match, p1, p2, p3, offset, string) { return '<span v-pre>'+p1.replace(/\\{/g,'{').replace(/\\}/g,'}')+'</span>' });
  appVue.$mount('#contenu');
})
.then(function() {
  if (isMain) {
    // on lit plugins.json
    return request(repoURL+'plugins.json?timestamp='+Date.now())
  } else return false;
})
.then(function(responseText) {
  if (responseText !== false) {
    var json = JSON.parse(responseText);
    store.state.plugins=json.data.map(function(plugin) { plugin.selected=false; plugin.version=false; return plugin });
    store.state.plugins.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    // puis on cherche à trouver la version pour chacun
    PromiseChain(store.state.plugins, function(plugin) {
      var u = plugin.url.replace(/github.com/,"raw.githubusercontent.com")+'/master/package.json';
      return request("https://github-proxy.kodono.info/?q="+encodeURIComponent(u)+"&direct=true&timestamp="+Date.now())
      .then(function(responseText) {
        var json = JSON.parse(responseText);
        var name = plugin.name;
        store.state.plugins.filter(function(p) { return p.name === name })[0].version=json.version;
      })
      .catch(function(err) {
        console.log("erreur lorsque je cherche la version du plugin "+plugin.name);
      })
    });
  }
})
.catch(function() {
  document.querySelector('#contenu').innerHTML = 'Erreur lors du chargement du contenu. La page peut être vue à cette adresse : <a href="'+pageURL+'">'+pageURL+'</a>';
})
