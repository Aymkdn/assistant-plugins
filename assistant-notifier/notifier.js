var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var GoogleTTS = require('google-tts-api');
var AssistantNotifier = function(configuration) {
  this.host = configuration.host;
}
AssistantNotifier.prototype.init = function(plugins) {
  this.plugins = plugins;
  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} text Le texte à lire (par exemple: "bonjour et bienvenue")
 */
AssistantNotifier.prototype.action = function(text) {
  var _this=this;
  return new Promise(function(prom_res) {
    // on génère le texte
    GoogleTTS(text, "fr-FR", 1)
    .then(function(url) {
      var client = new Client();
      client.connect(_this.host, function() {
        client.launch(DefaultMediaReceiver, function(err, player) {
          var media = {
            contentId: url,
            contentType: 'audio/mp3',
            streamType: 'BUFFERED'
          };
          player.load(media, {
            autoplay: true
          }, function(err, status) {
            player.on('status', function(status) {
              if (status.playerState == "IDLE") {
                player.stop();
                client.close();
                prom_res();
              }
            });
          });
        })
      })
    })
  })
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  var configuration = require('./configuration');
  var an = new AssistantNotifier(configuration);
  return an.init(plugins)
  .then(function(resource) {
    console.log("[assistant-notifier] Plugin chargé et prêt.");
    return resource;
  })
}

