// pour utiliser assistant-plugins depuis une ligne de commande
// Commande : node assistant-cli.js Commande
//
// Exemple : node assistant-cli.js "notifier_ceci est un message de test"

var path = require("path");
var dirname = '../../';
var configuration = require(path.join(dirname,'configuration'));
var plugins={}, addons=[], dependencies;
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
  var commandes = process.argv[2].split("|");
  console.log("[assistant] Commande reçue: ",commandes);
  return PromiseChain(commandes, function(commande) {
    // on regarde le keyword et on transmet au plug associé
    var plugin = commande.split("_")[0];
    if (!plugins[plugin]) {
      console.log("[assistant] Erreur : la commande « "+commande+" » a été reçue, cependant le plugin '"+plugin+"' n'a pas été chargé !");
    } else {
      console.log("[assistant] Appel du plugin '"+plugin+"'");
      return plugins[plugin].action(commande.split("_").slice(1).join("_"));
    }
  })
})
.then(function() {
  process.exit()
})
.catch(function(err) {
  console.log(err)
})
