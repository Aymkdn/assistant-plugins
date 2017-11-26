# TAG

Plugin lié aux transports de Grenoble. Lorsqu'on l'enclenche, le plugin va récupérer l'heure de passage des prochains trams à un arrêt bien précis et les envoyer pour lecture au Google Home.

## Configuration

Pour configurer la ligne et l'arrêt utilisé pour la récupération des prochains passages il faut modifier le fichier ```configuration.json``` comme dans l'exemple suivant :

    {
      "ligne": "B",
      "arret": "palais de justice",
      "dir": 0
    }
