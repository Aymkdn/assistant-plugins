# assistant-template

Dans le fichier `template.js` on retrouve la structure minimale à utiliser pour créer un autre plugin.

## Configuration

Si vous avez besoin de configuration, elle doit être stockée dans le fichier `configuration.json`.

## Utilisation

Le plugin sera appelé quand il sera envoyé à Pushbullet (depuis IFTTT) le message `template_XXX`, avec `template` le nom du plugin, et `XXX` la commande envoyée au plugin en question.
