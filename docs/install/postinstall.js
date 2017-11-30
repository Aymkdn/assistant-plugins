var configuration;
// on regarde si le fichier configuration.json existe déjà
try {
  configuration = require("./configuration");
} catch(err) {
  // on le crée
  configuration = {"main":{"pushbullet_token":""},"plugins":{}};
}
// pour chaque plugins on va regarder si on a besoin d'un fichier de configuration
var dependencies = require("./package").dependencies;
for (var plugin in dependencies) {
  if (plugin.startsWith("assistant-")) {
    plugin = plugin.slice(10);
    try {
      // on regarde si on a un fichier de config pour le plugin
      var config = require("./node_modules/assistant-"+plugin+"/configuration");
      // on regarde si on a déjà la configuration
      if (!configuration.plugins[plugin]) {
        configuration.plugins[plugin] = config;
        console.log("[assistant] Configuration requise pour le plugin '"+plugin+"'.");
      } else {
        // si oui, on regarde les ajouts
        for (var c in config) {
          if (!configuration.plugins[plugin][c]) configuration.plugins[plugin][c] = config[c];
        }
      }
    } catch(err) {}
  }
}
console.log("[assistant] Installation terminée.")

// on écrit le fichier configuration.json
var path = require("path");
var jsonfile = require("jsonfile");
jsonfile.writeFile(path.join(__dirname, 'configuration.json'), configuration, {spaces: 2, EOL: '\r\n'}, function(err) {
  if (err) console.error(err)
})
