var request = require('request-promise-native');
var moment = require('moment');

class AssistantSncf {

    constructor(configuration){
        this.configuration = configuration;
    }


    init(plugins){
        var self = this;
        this.plugins = plugins;
        this.apitoken = this.configuration.apitoken;
        this.direction = this.configuration.direction;
        this.codeGare = this.configuration.codeGare.trim().replace(/ /g, "");;
        moment.updateLocale('fr', {
            relativeTime : {
                past:   "%s",
                future: "%s",
            }
        });
        return Promise.resolve(this);
    }

    notify(message){
        if(this.plugins.notifier) {
            this.plugins.notifier.action(message);
        }
    }

    searchNextRequest(){
      var self = this;
        var url = "https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:" + this.codeGare+ "/departures?disable_geojson=true&data_freshness=realtime";
        console.log("[assistant-tag] recuperation des données sur %s", url)
        return request({
            'url' : url,
            'method':'GET',
              'headers':{
              "Authorization": "Basic "+ this.apitoken,
              },
            json: true
        });
    }

    action(commande){
        var self= this;
        return this.searchNextRequest().then(function(results){
            if(!results || !results.departures || !results.departures.length){
                console.log("[assistant-sncf] error");
                self.notify("Je ne trouve aucun train...");
                return;
            }
         var data =  results.departures.filter(departure => departure.route.direction.name.indexOf(self.direction))
         if (data.length === 0) {
            self.notify("Je ne trouve aucun train...");
          } else {


            let nextDate = data[0].stop_date_time.departure_date_time;
            // on voit au moins 6 minutes pour le prochain tram
            var speak = "le prochain train est dans " + moment(nextDate, 'YYYYMMDDTHHmmss').fromNow();
            if(data.length > 1){
               let nextDate = data[1].stop_date_time.departure_date_time
              speak += ", puis dans " +moment(nextDate, 'YYYYMMDDTHHmmss').fromNow();
            }
             self.notify(speak)

          }

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
  var assistant = new AssistantSncf(configuration);
  return assistant.init(plugins)
  .then(function(resource) {
    console.log("[assistant-sncf] Plugin chargé et prêt.");
    return resource;
  })
}

