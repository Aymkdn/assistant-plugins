exports.start = function(dirname) {
  var path = require("path");
  var PushBullet = require('pushbullet');
  var configuration = require(path.join(dirname,'configuration'));
  var pusher, plugins={}, addons=[], dependencies;
  function PromiseChain(arr, fct) {
    var dfd = Promise.resolve();
    var res = arr.map(function(a) {
      dfd = dfd.then(function() {
        return fct(a)
      });
      return dfd
    });
    return Promise.all(res)
  }

  // pour éviter l'erreur "Action failure message: Account has not been used for over a month" on envoie des messages régulièrement à PushBullet
  function awakePushBullet() {
    pusher.devices(function(error, response) {
      if (!response) return;
      var assistantDevice = response.devices.filter(function(device) { return device.nickname === "assistant-plugins" });
      // on regarde si un "device" pour assistant-plugins existe, sinon on le crée
      if (assistantDevice.length===0) {
        pusher.createDevice({nickname:'assistant-plugins'}, function(error, response) {});
      } else {
        pusher.note(assistantDevice[0].iden, 'Note', 'Pour éviter la désactivation du compte par PushBullet', function(error, response) {
          if (!response) return;
          pusher.dismissPush(response.iden, function(error, response) {
            if (response) pusher.deletePush(response.iden, function(error, response) {})
          });
        });
      }
    });
  }

  function timestamp() {
    var now = new Date();
    var month = now.getMonth()+1;
    if (month < 10) month="0"+month;
    var day = now.getDate()+1;
    if (day < 10) day="0"+day;
    var hours = now.getHours();
    if (hours < 10) hours = hours="0"+hours;
    var minutes = now.getMinutes();
    if (minutes < 10) minutes = minutes="0"+minutes;
    var seconds = now.getSeconds();
    if (seconds < 10) seconds = seconds="0"+seconds;
    return now.getFullYear()+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
  }

  if (!configuration.main.pushbullet_token) {
    console.log("[assistant] Erreur : vous devez configurer le token de PushBullet");
  } else {
    pusher = new PushBullet(configuration.main.pushbullet_token);
    // on va définir un plugin "assistant" pour modifier la configuration
    plugins.assistant = {
      saveConfig:function(plugin, config) {
        if (plugin && config) {
          var configuration = require(path.join(dirname,'configuration'));
          configuration.plugins[plugin] = config;
          var jsonfile = require('jsonfile');
          jsonfile.writeFile(path.join(dirname, 'configuration.json'), configuration, {spaces: 2, EOL: '\r\n'}, function(err) {
            if (err) console.error("[assistant-"+plugin+"] Erreur lors de la sauvegarde de la configuration : "+err);
            else console.log("[assistant-"+plugin+"] Configuration sauvegardée.");
          })
        }
      }
    };

    // chargement des plugins
    dependencies = require(path.join(dirname,"package")).dependencies;
    for (var plugin in dependencies) {
      if (plugin.startsWith("assistant-") && plugin !== "assistant-plugins") {
        addons.push(plugin.slice(10));
      }
    }
    var packageCurrent = require(path.join(dirname,'/node_modules/assistant-plugins/package'));
    console.log("[assistant] Assistant v"+packageCurrent.version+" : Chargement en cours...");
    console.log("[assistant] "+addons.length+" plugin"+(addons.length>1?"s":"")+" trouvé"+(addons.length>1?"s":"")+".");

    PromiseChain(addons, function(plugin) {
      plugin = plugin.trim();
      var packagePlugin = require(path.join(dirname,'/node_modules/assistant-'+plugin+'/package'));
      console.log("[assistant] Chargement du plugin '"+plugin+"' (v"+packagePlugin.version+")");
      return require(path.join(dirname,'/node_modules/assistant-'+plugin)).init(configuration.plugins[plugin], plugins)
      .then(function(resource) {
        plugins[plugin] = resource;
      })
    })
    .then(function() {
      console.log("[assistant] Connexion au flux de PushBullet...");
      awakePushBullet();
      setInterval(awakePushBullet, 86400000); // toutes les 24h
      // on écoute les notifications qui viennent de IFTTT via PushBullet
      // les commandes envoyées sont de type KEYWORD_ACTION1|KEYWORD_ACTION2|...
      var recoTimeout = null;
      var stream = pusher.stream();
      stream.connect();
      stream.on('error', function(error) { console.log("[assistant] Erreur de connexion avec PushBullet: ",error) });
      stream.on('tickle', function(tickle) {
        if (tickle==="push") {
          pusher.history({limit:1}, function(error, response) {
            if (error) {
              console.log("[assistant] Erreur retournée par PushBullet: ",error);
            } else {
              response.pushes.forEach(function(push) {
                if (push.sender_name === "IFTTT" && push.title === "Assistant" && !push.dismissed) {
                  var commandes = push.body.split("|");
                  console.log("[assistant] ("+timestamp()+") Commande reçue: ",commandes);
                  PromiseChain(commandes, function(commande) {
                    // on regarde le keyword et on transmet au plug associé
                    var plugin = commande.split("_")[0];
                    if (!plugins[plugin]) {
                      console.log("[assistant] ("+timestamp()+") Erreur : la commande « "+commande+" » a été reçue, cependant le plugin '"+plugin+"' n'a pas été chargé !");
                    } else {
                      console.log("[assistant] ("+timestamp()+") Appel du plugin '"+plugin+"'");
                      return plugins[plugin].action(commande.split("_").slice(1).join("_"));
                    }
                  })
                }
              })
            }
          })
        }
      })
      stream.on('connect', function() {
        if (recoTimeout) {
          clearTimeout(recoTimeout);
          recoTimeout=null;
        }
        console.log("[assistant] ("+timestamp()+") Connecté ! Prêt à exécuter les ordres.");
      });
      stream.on('close', function() {
        console.log("[assistant] ("+timestamp()+") Le flux avec Pushbullet a été déconnecté... Tentative de reconnexion...");
        // par défaut le module Pushbullet devrait se reconnecter tout seul
        // mais parfois il n'y arrive pas, donc on reteste dans 1 minute
        recoTimeout = setTimeout(function() {
          console.log("[assistant] ("+timestamp()+") Reconnexion....");
          stream.close();
          stream.connect();
        }, 60000);
      });
    }).catch(function(err) {
      console.log(err)
    })
  }
}
