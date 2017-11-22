var request = require('request-promise-native');

var LINES = {};
var STOPS = {};

var loadAllLines = function(){
    return new Promise(function(resolve, reject){
        console.log("[assistant-tag] listing available lines");
        request({
            'url' : "https://data.metromobilite.fr/api/routers/default/index/routes",
            'method':'GET',
            json: true
        }).then(function(routes){
            console.log("[assistant-tag] found %d lines", routes.length);
            routes.forEach(function(route){
                LINES[route.shortName] = route;
            });
            resolve(LINES);
        });
    });
}

var loadStopsFor = function(line){
    return new Promise(function(resolve, reject){
        request({
            'url' : "https://data.metromobilite.fr/api/routers/default/index/routes/" + line.id + "/clusters",
            'method':'GET',
            json: true
        }).then(function(stops){
            console.log("[assistant-tag] found %d stops for %s", stops.length, line.shortName);
            stops.forEach(function(stop){
                var nameParts = stop.name.split(" - ");
                nameParts.forEach(function(namePart){
                    var shortName = namePart.trim().toLowerCase().replace(/ /g, "");
                    STOPS[shortName] = stop;
                });
            });
            resolve(STOPS);
        });
    });
};

class AssistantTag {

    constructor(configuration){
        this.configuration = configuration;
    }


    init(plugins){
        var self = this;
        this.plugins = plugins;
        var lineCode = this.configuration.ligne;
        var stopCode = this.configuration.arret.trim().toLowerCase().replace(/ /g, "");;

        return new Promise(function(resolve, reject){
            loadAllLines().then(function(lines){
                if(!lines[lineCode]){
                    reject("mauvaise configuration pour ligne=%s", lineCode);
                    return;
                }
                var line = lines[lineCode];
                console.log("[assistant-tag] found matching line %j", line);
                loadStopsFor(line).then(function(stops){
                    if(!stops[stopCode]){
                        console.log("[assistant-tag] mauvaise configuration pour arret=%s", stopCode);
                        reject("mauvaise configuration pour arret=" + stopCode);
                        return;
                    }
                    var stop = stops[stopCode];
                    console.log("[assistant-tag] found matching stop %j", stop);

                    self.line = line;
                    self.stop = stop;
                    resolve(self);
                });
            });
        });

        return Promise.resolve(this);
    }

    notify(message){
        if(this.plugins.notifier) {
            this.plugins.notifier.action(message);
        }
    }

    searchNextRequest(){
        var url = "https://data.metromobilite.fr/api/routers/default/index/clusters/" + this.stop.code+ "/stoptimes?route="+ this.line.id;
        console.log("[assistant-tag] recuperation des données sur %s", url)
        return request({
            'url' : url,
            'method':'GET',
            json: true
        });
    }


    action(commande){
        var self= this;
        return this.searchNextRequest().then(function(results){
            console.log("[assistant-tag] %j results", results.length);
            console.log("[assistant-tag] %j", results);
            if(!results || !results.length){
                console.log("[assistant-tag] error");
                self.notify("Je ne trouve aucun tram...");
                return;
            }

            if(!results || !results.length || !results.length || !results[1].times || !results[1].times.length){
                console.log("[assistant-tag] error");
                self.notify("Je ne trouve aucun tram...");
            } else {
                var times = results[0].times;
                if (results[0].pattern.dir != 1) {
                    times = results[1].times;
                }
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
                self.notify(resultText);
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
    var assistant = new AssistantTag(configuration);
    return assistant.init(plugins)
        .then(function(resource) {
            console.log("[assistant-tag] Plugin chargé et prêt.");
            return resource;
        })
}

