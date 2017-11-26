var request = require('request-promise-native');
class AssistantRatp {

    constructor(configuration){
        this.configuration = configuration;
    }


    init(plugins){
        var self = this;
        this.plugins = plugins;
        return Promise.resolve(this);
    }

    notify(message){
        if(this.plugins.notifier) {
            this.plugins.notifier.action(message);
        }
    }

    searchNextRequest(commande){
      var self = this;
        var url = "https://api-ratp.pierre-grimaud.fr/v3/schedules/"+this.configuration.type+"/" + this.configuration.line+ "/" + this.configuration.station+ "/"+ this.configuration.way+"?_format=json";
        console.log("[assistant-ratp] recuperation des données sur %s", url)
        return request({
            'url' : url,
            'method':'GET',
            json: true
        });
    }

    action(commande){
        var self= this;
        return this.searchNextRequest(commande).then(function(results){

            if(!results || !results.result || !results.result.schedules || !results.result.schedules.length){
                console.log("[assistant-ratp] error");
                self.notify("Je ne trouve aucun départ...");
                return;
            }
            let data = results.result.schedules;
            let nextDate = data[0].message.replace("mn","minutes");
            var speak = "le prochain tram est dans " + nextDate;
            if(data.length > 1){
                let nextDate = data[1].message.replace("mn","minutes");
              speak += ", puis dans " + nextDate;
            }
             self.notify(speak)
        })
    }
}

/**
 * Initialisation du plugin
 *
 * @param  {Object} plugins Un objet qui contient tous les plugins chargés
 * @return {Promise} resolve(this)
 */
exports.init=function(plugins) {
  var configuration = require('./configuration');
  var assistant = new AssistantRatp(configuration);
  return assistant.init(plugins)
  .then(function(resource) {
    console.log("[assistant-ratp] Plugin chargé et prêt.");
    return resource;
  })
}

