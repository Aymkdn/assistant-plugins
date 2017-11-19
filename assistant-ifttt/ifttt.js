var request = require('request-promise-native');
var AssistantIfttt = function(configuration) {
  this.key = configuration.key;
}
AssistantIfttt.prototype.init = function(plugins) {
  this.plugins = plugins;
  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande Le nom du event WebHook créé sur IFTTT
 */
AssistantIfttt.prototype.action = function(commande) {
  var _this=this;
  return request({url:'https://maker.ifttt.com/trigger/'+commande+'/with/key/'+_this.key})
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  var configuration = require('./configuration');
  var an = new AssistantIfttt(configuration);
  return an.init(plugins)
  .then(function(resource) {
    console.log("[assistant-ifttt] Plugin chargé et prêt.");
    return resource;
  })
}

