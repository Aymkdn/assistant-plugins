var request = require('request-promise-native');
var AssistantTam = function() {}
AssistantTam.prototype.init = function(plugins) {
  this.plugins = plugins;
  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande un nombre puis un identifiant de temps
 * @example
 * "30 secondes"
 * "5 minutes"
 * "1 heure"
 */
AssistantTam.prototype.action = function(commande) {
  var _this=this;
  return request({
    'url' : 'https://apimobile.tam-voyages.com/api/v1/hours/next/stops',
    'method':'POST',
    'headers':{
      "appPlateforme": "Android",
      "appVersion": "1.2",
      "Content-Type": "application/json; charset=UTF-8",
      "Host": "apimobile.tam-voyages.com",
      "User-Agent": "okhttp/2.4.0"
    },
    'body': JSON.stringify({"stopList":[{"sens":2,"directions":[41101],"urbanLine":1,"citywayLineId":1,"lineNumber":"1","citywayStopId":41203,"tamStopId":1161}]})
  })
  .then(function(response){
    var body = JSON.parse(response);
    var data = body[0].stop_next_time;
    if (data.length === 0) {
      if (_this.plugins.notifier) _this.plugins.notifier.action("Je ne trouve aucun tram...");
    } else {
      // on voit au moins 6 minutes pour le prochain tram
      var idx = 0;
      if (data[idx].waiting_time.replace(/min/,"") < 6) idx++;
      var speak = "le prochain tram est dans " + data[idx++].waiting_time + "utes";
      if (data.length > idx) speak += ", le suivant dans " + data[idx++].waiting_time + "utes";
      if (data.length > idx) speak += ", et celui d'après dans " + data[idx++].waiting_time + "utes";
      if (_this.plugins.notifier) _this.plugins.notifier.action(speak)
    }
  })
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  var assistant = new AssistantTam();
  return assistant.init(plugins)
  .then(function(resource) {
    console.log("[assistant-wait] Plugin chargé et prêt.");
    return resource;
  })
}

