var request = require('request-promise-native');
var AssistantTag = function() {}
AssistantTag.prototype.init = function(plugins) {
    this.plugins = plugins;
    return Promise.resolve(this);
};

AssistantTag.prototype.action = function(commande) {
    var self= this;
    return request({
        'url' : 'https://data.metromobilite.fr/api/routers/default/index/clusters/SEM:GENPALJUSTI/stoptimes?route=SEM:B',
        'method':'GET'
    })
        .then(function(response){
            var results = JSON.parse(response);
            console.log("[assistant-tag] %j", results);
            if(!results || !results.length || !results.length || !results[1].times || !results[1].times.length){
                if (self.plugins.notifier) {
                    console.log("[assistant-tag] error");
                    self.plugins.notifier.action("Je ne trouve aucun tram...");
                }
            } else {
                var times = results[0].times;
                if (results[0].pattern.dir != 1) {
                    times = results[1].times;
                }
                if (self.plugins.notifier) {
                    var resultText;
                    var midnight = new Date();
                    midnight.setHours(0,0,0,0);
                    var now = new Date();

                    var getMinutesFromNow = function(timeRecord){
                        var secondsFromDayStart = timeRecord.realtimeArrival;
                        var next = new Date(midnight.getTime() + (secondsFromDayStart * 1000));
                        var result = (next.getTime() - now.getTime()) / 1000;
                        var minutesFromNow = parseInt(result / 60);
                        return minutesFromNow;
                    };

                    if(times[0]){
                        resultText = "dans " + getMinutesFromNow(times[0]) + " minutes";

                        if(times[1]){
                            resultText += ", puis dans " + getMinutesFromNow(times[1]) + " minutes";
                        }

                        if(times[2]){
                            resultText += ", et enfin dans " + getMinutesFromNow(times[2]) + " minutes";
                        }
                    } else {
                        resultText = "Je ne trouve aucun tram...";

                    }


                    console.log("[assistant-tag] result %s", resultText);
                    self.plugins.notifier.action(resultText);
                }
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
    var assistant = new AssistantTag();
    return assistant.init(plugins)
        .then(function(resource) {
            console.log("[assistant-tag] Plugin chargé et prêt.");
            return resource;
        })
}

