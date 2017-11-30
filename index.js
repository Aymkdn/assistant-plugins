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

  if (!configuration.main.pushbullet_token) {
    console.log("[assistant] Erreur : vous devez configurer le token de PushBullet");
  } else {
    pusher = new PushBullet(configuration.main.pushbullet_token);
    // on va définir un plugin "assistant" pour modifier la configuration
    plugins.assistant = {
      saveConfig:function(plugin, config) {
        if (plugin && config) {
          var configuration = require(path.join(dirname,'configuration'));
          configuration[plugin] = config;
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
    console.log("[assistant] "+addons.length+" plugin"+(addons.length>1?"s":"")+" trouvé"+(addons.length>1?"s":"")+".");

    PromiseChain(addons, function(plugin) {
      console.log("[assistant] Chargement du plugin '"+plugin+"'");
      return require(path.join(dirname,'/node_modules/assistant-'+plugin)).init(configuration.plugins[plugin], plugins)
      .then(function(resource) {
        plugins[plugin] = resource;
      })
    })
    .then(function() {
      console.log("[assistant] Prêt à écouter les commandes via PushBullet");
      // on écoute les notifications qui viennent de IFTTT via PushBullet
      // les commandes envoyées sont de type KEYWORD_ACTION1|KEYWORD_ACTION2|...
      var stream = pusher.stream();
      stream.connect();
      stream.on('tickle', function(tickle) {
        if (tickle==="push") {
          pusher.history({limit:1}, function(error, response) {
            response.pushes.forEach(function(push) {
              if (push.sender_name === "IFTTT" && push.title === "Assistant" && !push.dismissed) {
                var commandes = push.body.split("|");
                console.log("[assistant] Commande reçue: ",commandes);
                PromiseChain(commandes, function(commande) {
                  // on regarde le keyword et on transmet au plug associé
                  var plugin = commande.split("_")[0];
                  if (!plugins[plugin]) {
                    console.log("[assistant] Erreur : la commande « "+commande+" » a été reçue, cependant le plugin '"+plugin+"' n'a pas été chargé !");
                  } else {
                    console.log("[assistant] Appelle du plugin '"+plugin+"'");
                    return plugins[plugin].action(commande.split("_").slice(1).join("_"));
                  }
                })
              }
            })
          })
        }
      })
    }).catch(function(err) {
      console.log(err)
    })
  }
}
