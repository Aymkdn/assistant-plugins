var request = require('request-promise-native');
var fs = require('fs');
var PromiseChain = function(arr, fct) {
  var dfd = Promise.resolve();
  var res = arr.map(function(a) {
    dfd = dfd.then(function() {
      return fct(a)
    });
    return dfd
  });
  return Promise.all(res)
}

var AssistantFreebox = function(configuration) {
  this.config = configuration;
  // url pour accéder au Freebox Server
  this.serverURL = "http://mafreebox.freebox.fr/api/v3/";
  // pour le Freebox Server
  this.freeboxServer = {
    app_id:"assistant.plugin.freebox",
    app_name:"Plugin Freebox pour Assistant",
    logged_in:false,
    challenge:"",
    password:"",
    session_token:""
  }
}

AssistantFreebox.prototype.init = function(plugins) {
  var _this=this;
  _this.plugins = plugins;
  return _this.checkConfiguration()
  .then(function() {
    // url pour accéder au Freebox Player
    _this.playerURL = 'http://'+(_this.config.box_to_control||"hd1")+'.freebox.fr/pub/remote_control?code='+_this.config.code_telecommande;

    // récupération des entities
    _this.htmlEntities = require("./entities");

    _this.chaines = {}; // pour enregistrer le nom de chaine -> numéro de chaine
    // on récupère les chaines Free
    console.log("[assistant-freebox] Récupération des chaines télé sur free.fr...");
    return request('http://www.free.fr/freebox/js/datas/tv/jsontv.js?callback=majinboo&_='+Date.now())
  })
  .then(function(response) {
    // on va lire le fichier replace_chaine.json qui permet de substituer certaines chaines
    var substitution = require("./replace_chaine");

    // puis on s'occupe de la réponse du serveur
    var body =response.slice(9).replace(/\)\W+$/,"");
    body = JSON.parse(body);
    var i, chaines=[], nom, canal, slash;
    for (i=0, len=body.chaines.length; i<len; i++) {
      nom = _this.decodeEntities(body.chaines[i].nom);
      // on remplace certains noms
      nom = nom.toLowerCase().replace(/ la chaine/,"").replace(/\+/g," plus ").replace(/&/g," et ").replace(/\!/g,"").trim();
      slash = nom.indexOf('/');
      if (slash > -1) nom = nom.slice(0,slash);
      nom = nom.replace(/\s+$/,"").replace(/\s(\d)/g,"$1");
      // on fait la substitution
      if (substitution[nom]) nom=substitution[nom];
      if (!nom) continue;
      canal = body.chaines[i].canal;
      _this.chaines[nom] = canal;
    }
    // chaines manquantes
    _this.chaines["Canal +"]="4";

    console.log("[assistant-freebox] Récupération des chaines sur free.fr terminée !");
    return _this;
  })
}

/**
 * Permet d'autoriser le plugin sur la Freebox
 */
AssistantFreebox.prototype.getAuthorization=function() {
  var _this=this;
  console.log("[assistant-freebox] Demande d'autorisation auprès du Freebox Server...");
  var options = {
    url:_this.serverURL+"login/authorize/",
    method:"POST",
    json: {
      "app_id"     : _this.freeboxServer.app_id,
      "app_name"   : _this.freeboxServer.app_name,
      "app_version": "1.0",
      "device_name": "Assistant"
    },
    encode: "utf-8"
  };

  return request(options)
  .then(function(response) {
    if (response.success === true) {
      console.log("[assistant-freebox] Approuvez le plugin en allant sur l'écran LCD de votre Freebox Serveur et en utilisant la flèche de droite sur celui-ci.");
      _this.config.app_token = response.result.app_token;
      var track_id = response.result.track_id;

      // on attend que l'utilisateur accepte l'application
      var pendingAutorization = function(track_id) {
        return new Promise(function(prom_res, prom_rej) {
          request({url:_this.serverURL+"login/authorize/"+track_id})
          .then(function(response) {
            response = JSON.parse(response);

            // on vérifie le statut
            switch (response.result.status) {
              case "pending": {
                setTimeout(function() {
                  pendingAutorization(track_id)
                  .then(function() { prom_res() })
                  .catch(function() { prom_rej() })
                }, 1000);
                break;
              }
              case "granted": {
                console.log("[assistant-freebox] Le plugin a été autorisé sur la Freebox");
                // on sauvegarde la confiuration dans le fichier configuration.json
                try {
                  var txt = "{\r\n" + JSON.stringify(_this.config).replace(/,/g, ",\r\n  ").slice(1,-1) + "\r\n}";
                  fs.writeFileSync(__dirname + '\\configuration.json', txt, 'utf8');
                  console.log("[assistant-freebox] Configuration terminée. Vous êtes prêt à utiliser le plugin Freebox.");
                  prom_res();
                } catch(e) {
                  console.log("[assistant-freebox] Erreur lors de la sauvegarde de la configuration dans configuration.json => "+e);
                  prom_rej();
                }
                break;
              }
              default: {
                console.log("[assistant-freebox] L'opération a échoué. Nouvelle tentative.");
                _this.getAuthorization()
                .then(function() { prom_res() })
                .catch(function() { prom_rej() })
                break;
              }
            }
          });
        })

      }
      return pendingAutorization(track_id);
    } else {
      console.log("[assistant-freebox] La demande d'autorisation à la Freebox a échoué => ",response);
      throw "Error";
    }
  })
}
/**
 * Permet de convertir des caractères HTML en leur équivalent (par exemple "&eacute;"" devient "é")
 *
 * @param  {String} str
 * @return {String} Le résultat
 */
AssistantFreebox.prototype.decodeEntities=function(str) {
  var _this=this;
  var mtch = str.match(/&([^;]+);/g);
  if (mtch) {
    mtch.forEach(function(s) {
      var res = s.slice(1,-1);
      if (res.charAt(0) !== "#") res=_this.htmlEntities[res];
      else res = String.fromCharCode(res.slice(1));
      var regex = new RegExp(s, "g")
      str = str.replace(regex,res);
    })
  }
  return str;
}

/**
 * Va effectuer des vérifications dans la configuration
 */
AssistantFreebox.prototype.checkConfiguration=function() {
  var _this=this;
  return new Promise(function(prom_res, prom_rej) {
    if (!_this.config.code_telecommande) {
      console.log("[assistant-freebox] Erreur: le code télécommande n'a pas été fourni dans le fichier configuration.json");
      return prom_rej();
    }
    if (!_this.config.app_token) {
      return _this.getAuthorization()
      .then(function() {
        prom_res()
      })
      .catch(function() {
        prom_rej()
      })
    } else prom_res();
  })
}

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande à executer
 */
AssistantFreebox.prototype.action = function(commande) {
  var _this=this;
  return _this.executeCommand(commande)
  .then(function() {
    console.log("[assistant-freebox] Commande « "+commande+" » exécutée");
  })
}

/**
 * Va exécuter les commandes demandées
 */
AssistantFreebox.prototype.executeCommand=function(commande) {
  var _this=this;
  var keys=[], baseURL = this.playerURL+"&key=";

  // permet de retourner la clé à envoyer à la Freebox pour les commandes un peu complexe
  var returnKey = function(cmd) {
    switch(cmd.split(" ")[0]) {
      case 'zappe': {
        let nom = cmd.replace(/^zappe /,"").replace(/^sur /,"").toLowerCase().replace(/\s(\d)/g,"$1");
        // si on a "la#" ça signifie qu'on a appelé un nombre
        if (/la\d+/.test(nom)) {
          key = nom.match(/la(\d+)/)[1].split("").join(",");
        } else {
          let canal = _this.chaines[nom];
          if (canal) {
            console.log("[assistant-freebox] Zappe sur "+nom+" ("+canal+")");
            key=canal.split("").join(",")
          } else {
            console.log("[assistant-freebox] Chaine "+nom+" inconnue");
            return;
          }
        }
        break;
      }
      case 'on': { key='power,wait7000'; break; }
      case 'off': { key='power'; break; }
      case 'tv': { key=(_this.config.use_Mon_Bouquet==false?'home,wait2000,right,left,red,ok,wait4000':'home,wait2000,right,left,red,up,up,up,ok,wait4000'); break; }
      /*case 'tvOn': { key='power,wait7000,'+(_this.config.use_Mon_Bouquet==false?'home,right,left,red,ok':'home,right,left,red,up,up,up,ok'); break; }*/
      case 'unmute': { key='mute'; break; }
      case 'home': { key='home,wait2000,red'; break; }
      case 'back': { key='red'; break; }
      case 'pause': { key='play'; break; }
      case 'videos': { key='home,wait2000,right,left,red,right,ok'; break; }
      case 'direct': { key='green,ok'; break; }
      case 'enregistrements': { key='home,wait2000,right,left,red,up,ok'; break; }
      case 'soundDown': { key='vol_dec'; break; }
      case 'soundUp': { key='vol_inc'; break; }
      case 'programUp': { key='prgm_inc'; break; }
      case 'programDown': { key='prgm_dec'; break; }
      default: { key=cmd; break; }
    }

    return key;
  }

  // si on demande "folder"
  if (commande.slice(0,6) === "folder") {
    return _this.isPlayerOn()
    .then(function(state) {
      if (!state) return _this.executeCommand('on')
    })
    .then(function() {
      return _this.findFolder(commande.slice(7), _this.config.search_path)
    })
    .then(function(path) {
      if (path) {
        return _this.executeCommand("videos,wait4000")
        .then(function() {
          if (_this.plugins.notifier) _this.plugins.notifier.action("Le dossier a été trouvé");
          return _this.goToFolder(path);
        })
      }
    })
  }

  // on peut avoir plusieurs commandes (séparées par une virgule) à envoyer à la Freebox
  commande.split(',').forEach(function(key) {
    key=returnKey(key);
    if (key) {
      // on regarde si on a une étoile (*) signifiant qu'on répète plusieurs fois la même commande
      if (key.indexOf("*") !== -1) {
        key=key.replace(/(\w+)\*(\d+)/g, function(match, p1, p2) { var ret=Array(p2*1+1); p1=returnKey(p1); return ret.join(p1+",").slice(0,-1) });
      }
      key.split(',').forEach(function(k) {
        keys.push(k);
      })
    }
  });

  // si la première key n'est pas 'power', alors on va vérifier que la Freebox est allumée pour effectuer l'action
  // si elle n'est pas allumée, on l'allume
  return (keys[0] !== "power" ? _this.isPlayerOn() : Promise.resolve(true))
  .then(function(state) {
    if (!state) {
      keys.splice(0,0,'power','wait7000'); // on l'allume
      console.log("[assistant-freebox] La Freebox n'est pas allumée, donc on l'allume.");
    }

    return PromiseChain(keys, function(key) {
      // on regarde si c'est un "waitXXX"
      if (key.slice(0,4) === "wait") {
        return new Promise(function(p_res) {
          setTimeout(function() {
            p_res()
          }, key.slice(4)*1)
        })
      } else {
        var url = baseURL + key;
        console.log("[assistant-freebox] Url => "+url);
        return new Promise(function(p_res) {
          setTimeout(function() {
            request({url:url}).
            then(function() { p_res() })
          }, (key.slice(0,3)==="vol"?20:500))
        })
      }
    })
  })
}

/**
 * Permet de créer une session sur le Freebox Server
 */
AssistantFreebox.prototype.requestSession=function() {
  var crypto  = require("crypto");
  var _this = this;
  if (_this.logged_in) return;

  return request(_this.serverURL+"login/")
  .then(function(response) {
    var body = JSON.parse(response);
    _this.freeboxServer.logged_in = body.result.logged_in;
    _this.freeboxServer.challenge = body.result.challenge;
    //generation du password
    _this.freeboxServer.password = crypto.createHmac('sha1', _this.config.app_token).update(_this.freeboxServer.challenge).digest('hex');
    // si logué
    if (_this.freeboxServer.logged_in) {
      return;
    } else {
      //POST app_id & password
      var options = {
        url:_this.serverURL+"login/session/",
        method:"POST",
        json: {
         "app_id"     : _this.freeboxServer.app_id,
         "app_version": "1.0",
         "password"   : _this.freeboxServer.password,
        },
        encode:"utf-8"
      };

      return request(options)
    }
  })
  .then(function(response) {
    if (response) {
      _this.freeboxServer.challenge = response.result.challenge;
      _this.freeboxServer.session_token = response.result.session_token;
      _this.freeboxServer.logged_in     = true;
      _this.freeboxServer.permissions   = response.result.permissions;
    }
  })
}

/**
 * Détecte si la Freebox est éteinte ou allumée
 * @return {Promise} resolve(boolean) -> TRUE si elle est allumée
 */
AssistantFreebox.prototype.isPlayerOn=function() {
  var _this = this;
  var debut=new Date().getTime();
  return _this.requestSession()
  .then(function() {
    var options = {
      url:_this.serverURL+"airmedia/receivers/Freebox%20Player/",
      headers:{
        "X-Fbx-App-Auth": _this.freeboxServer.session_token
      },
      method:"POST",
      json: {
        "action":"stop",
        "media_type":"video"
      },
      encode:"utf-8"
    };
    return request(options)
  })
  .then(function(response) {
    // Freebox allumée
    console.log("[assistant-freebox] Durée de la vérification de la Freebox allumée : "+((new Date()).getTime() - debut)+"ms");
    return response.success;
  })
}

AssistantFreebox.prototype.toBase64=function(str) { return Buffer.from(str).toString('base64') }
AssistantFreebox.prototype.fromBase64=function(str) { return Buffer.from(str, 'base64').toString() }

/**
 * Trouve un dossier dans path
 * @param {String} foldertofind Le nom du folder à trouver
 * @param {String} path Le path à explorer
 * @return {Promise} resolve(path_base64)
 */
AssistantFreebox.prototype.findFolder=function(foldertofind, path) {
  var _this=this;
  var b64path = _this.toBase64(path);
  foldertofind = foldertofind.toUpperCase();
  return _this.requestSession()
  .then(function() {
    var options = {
      url:_this.serverURL+"fs/ls/"+b64path+"?countSubFolder=1&onlyFolder=1&removeHidden=1",
      headers : {
        'X-Fbx-App-Auth' : _this.freeboxServer.session_token
      },
      method:"GET"
    };
    return request(options)
  })
  .then(function(response) {
    var listFolders = {}, foldername;
    var body = JSON.parse(response);
    if (body.result) {
      var folders = [];
      for (var i=0, stop=body.result.length; i<stop; i++) {
        if (!body.result[i].hidden && body.result[i].type === "dir") {
          foldername = body.result[i].name.toUpperCase();
          if (foldername.indexOf(foldertofind) !== -1) {
            return _this.fromBase64(body.result[i].path);
          } else {
            folders.push(_this.fromBase64(body.result[i].path));
          }
        }
      }
      return PromiseChain(folders, function(folder) {
        return _this.findFolder(foldertofind,folder)
      })
      .then(function(arrPath) {
        return arrPath.filter(function(path) { return typeof path === "string" })[0];
      })
    }
  })
}

/**
 * On va se déplacer jusque dans le dossier spécificé
 * @param  {String} b64path La version base64 du path
 */
AssistantFreebox.prototype.goToFolder=function(path) {
  var _this=this;
  //var path = _this.fromBase64(b64path);
  var folders = path.split("/").slice(3);
  var deeper=function(folder, currentPath) {
    var options = {
      url:_this.serverURL+"fs/ls/"+_this.toBase64(currentPath),
      headers : {
        'X-Fbx-App-Auth' : _this.freeboxServer.session_token
      },
      method:"GET"
    };
    return request(options)
    .then(function(response) {
      var listFolders = {}, oFolders={}, folderName;
      var commands = [];
      var body = JSON.parse(response);
      for (var i=0, stop=body.result.length; i<stop; i++) {
        if (!body.result[i].hidden) {
          if (body.result[i].type === "dir" && body.result[i].name === folder) {
            // on l'a trouvé
            commands.push("ok");
            commands = commands.join(",");
            // on entre dedans
            return _this.executeCommand(commands)
            .then(function() {
              if (folders.length > 0) {
                return deeper(folders.shift(), currentPath+"/"+folder)
              }
            });
          } else {
            // on descend
            commands.push("down");
          }
        }
      }
    })
  }
  return _this.requestSession()
  .then(function() {
    return deeper(folders.shift(), "/Disque dur/Vidéos");
  })
}

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  var configuration = require('./configuration');
  var af = new AssistantFreebox(configuration);
  return af.init(plugins)
  .then(function(resource) {
    console.log("[assistant-freebox] Plugin chargé et prêt.");
    return resource;
  })
}
