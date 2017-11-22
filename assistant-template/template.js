/**
 * on crée une fonction `AssistantTemplate`
 * @param {Object} configuration L'objet `configuration` qui vient du fichier configuration.json
 */
var AssistantTemplate = function(configuration) {
  // par exemple configuration.key si on a `{ "key": "XXX" }` dans le fichier configuration.json
  // exemple: this.key = configuration.key;
}

/**
 * Il faut ensuite créer une fonction `init()`
 *
 * @param  {Object} plugins Un objet représentant les autres plugins chargés
 * @return {Promise}
 */
AssistantTemplate.prototype.init = function(plugins) {
  this.plugins = plugins;
  return Promise.resolve(this);
};

/**
 * Fonction appelée par le système central
 *
 * @param {String} commande La commande envoyée depuis IFTTT par Pushbullet
 * @return {Promise}
 */
AssistantTemplate.prototype.action = function(commande) {
  // faire quelque chose avec `commande`
  // votre code sera ici principalement
};

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  // on lit le fichier configuration.json
  var configuration = require('./configuration');
  var assistant = new AssistantTemplate(configuration);
  return assistant.init(plugins)
  .then(function(resource) {
    console.log("[assistant-template] Plugin chargé et prêt.");
    return resource;
  })
}

