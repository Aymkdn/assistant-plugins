# SNCF

Plugin lié aux transports SNCF. Lorsqu'on l'enclenche, le plugin va récupérer l'heure de passage des prochains trains à un arrêt bien précis avec une direction précise et les envoyer pour lecture au Google Home.


## Configuration

Récupérez une clé via https://data.sncf.com/api/fr/register et c'est tout bon ! Il s'agîra de votre « apitoken » à mettre en configuration

Récupérez le code de votre gare sur cette carte https://ressources.data.sncf.com/explore/dataset/liste-des-gares/map/?basemap=osmtransport , il faut prendre le code UIC snas les espaces et le mettre avec le prefix "OCE:SA:MONCODEGAREUIC"
Exemple: "codeGare":"OCE:SA:87382358"

La dernière configuration est la direction des trains qui vous intéressent à votre arrêt. Inscrire le libellé de la gare terminus. Vous pouvez utiliser le lien de la carte précédente pour le récupérer. Exemple:  "direction":"Paris-St-Lazare"