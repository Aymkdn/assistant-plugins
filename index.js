var PushBullet = require('pushbullet');
var pushbullet_token = require('./configuration').pushbullet_token;
if (!pushbullet_token) throw "Vous devez configurer le token de PushBullet";
var pusher = new PushBullet(pushbullet_token);
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

// chargement des plugins
var plugins = {};
var addons = require('./plugins').plugins;
console.log("[assistant] "+addons.length+" plugin"+(addons.length>1?"s":"")+" trouvé"+(addons.length>1?"s":"")+".");
var dfd = Promise.resolve();
var res = addons.map(function(plugin) {
  dfd = dfd.then(function() {
    console.log("[assistant] Chargement du plugin '"+plugin+"'");
    return require('./assistant-'+plugin).init(plugins)
    .then(function(resource) {
      plugins[plugin] = resource;
    })
  });
  return dfd
});

Promise.all(res).then(function() {
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
              let plugin = commande.split("_")[0];
              if (!plugins[plugin]) {
                console.log("[assistant] Erreur: la commande « "+commande+" » a été reçue, cependant le plugin '"+plugin+"' n'a pas été chargé !");
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
})





/*var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var GoogleTTS = require('google-tts-api');
var App = {
    playin: false,
    DeviceIp: "",
    Player: null,
    GoogleHome: function (host, url, callback) {
        var client = new Client();
        client.connect(host, function () {
            client.launch(DefaultMediaReceiver, function (err, player) {
              console.log(url)
                var media = {
                    contentId: url,
                    contentType: 'audio/mp3',
                    streamType: 'BUFFERED'
                };
                App.Player = player;
                App.Player.load(media, { autoplay: true }, function (err, status) {
                    App.Player.on('status', function (status) {
                        if (status.playerState == "IDLE" && App.playin == false) {
                            App.Player.stop();
                            client.close();
                        }
                    });
                });
            });
        });
        client.on('error', function (err) {
            console.log('Error: %s', err.message);
            client.close();
            callback('error');
        });
    },
    run: function (ip, text) {
        App.DeviceIp = ip;
        var lang = "fr-FR"; //de-DE
        GoogleTTS(text, lang, 1).then(function (url) {
            App.GoogleHome(App.DeviceIp, url, function (res) {
                console.log(res);
            });
        });
    }
};

App.run("192.168.0.13", "Bonjour Aymeric");*/
