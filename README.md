# assistant-plugins

Vous utilisez un Assistant, comme Google Home / Google Assistant ? Alors vous pouvez étendre ses possibilités grâce à cet outil qui utilise la puissance de [IFTTT](http://www.ifttt.com/).

## Disclaimer

Il s'agit d'un projet personnel que je partage avec la communauté pensant que d'autres cherchent une solution similaire. Si j'ai essayé de proposer quelque chose de simple et modulable, il n'en reste pas moins qu'il faut savoir bidouiller un petit peu. Ne sachant pas la portée que va avoir cet outil, je n'ai pas voulu aller trop loin dans la simplicité. Si je vois une forte demande, je verrai pour simplifier encore un peu plus (en particulier si d'autres plugins sont créés par la communauté).

## ★ Comment ça marche ?

J'ai passé un moment à explorer comment je pouvais faire faire des actions spéciales à mon Google Home Mini. Par exemple, piloter ma Freebox, ou me dire quand les prochains trams arrivent à côté de chez moi. Toutes les solutions trouvées ([Google Actions](https://developers.google.com/actions/), [Sarah v5](https://github.com/NGRP/node-red-contrib-viseo), et autres Node modules) étaient très compliquées : beaucoup de choses à installer, ou qui demandent beaucoup de manipulations, ou avec des contraintes importantes.

Certains se plaindront encore que ma solution est trop compliquée : libre à eux d'aller voir ailleurs :-)

### Interconnexions

Le principe est d'utiliser [IFTTT](http://www.ifttt.com/) (qui permet de dire ce que l'on souhaite à son Assistant et d'avoir une action associée), en combinaison avec [Pushbullet](https://www.pushbullet.com/) et une machine sous Windows, Linux ou MacOS.

### Pourquoi Pushbullet ?

Plus simple et plus sécurisé : le système va écouter les notifications venant de Pushbullet et qui contiennent les actions à réaliser. Du coup, pas besoin de devoir configurer son routeur pour ouvrir sur l'extérieur, ni devoir entrer des URLs compliqués, ou autres.

### Exemple

```
Moi: « OK Google, allume la Freebox »
                ↓    
Google: « j'allume la Freebox » (via IFTTT)
                ↓    
Notification à Pushbullet (via IFTTT)
                ↓    
L'ordinateur voit la demande d'action (via Pushbullet) et l'exécute
                ↓    
La Freebox reçoit l'ordre et s'allume 
```

L'opération peut paraître compliquée, mais elle s'exécute très rapidement et la mise en place est plutôt simple !

## ★ Installation

L'installation passe par quelques étapes, assez faciles et rapides.

  1. Installer [NodeJS](https://nodejs.org/en/) sur votre machine qui sera allumée 24h/24 et qui exécutera les actions demandées  
  NodeJS est disponible sur Windows, Linux et MacOS  
  Pour les bidouilleurs, vous pouvez donc l'utiliser sur un [RaspBerryPi](https://www.raspberrypi.org/)
  2. Créer un compte sur [IFTTT](http://www.ifttt.com/) (c'est gratuit)
  3. Créer un compte sur [Pushbullet](https://www.pushbullet.com/) (c'est gratuit)
  4. Télécharger la dernière version d'[assistant-plugins](https://github.com/Aymkdn/assistant-plugins/archive/master.zip) sur votre machine  
  → Dézipper le fichier téléchargé  
  5. Double-cliquer sur le fichier `install.bat` (une fenêtre va s'ouvrir et va essayer de télécharger les packages associés)   
  Exemple d'affichage réussi :
```
C:\Users\User\Desktop\assistant-plugins\>npm install

> websocket@1.0.25 install C:\Users\User\Desktop\assistant-plugins\node_modules\websocket> (node-gyp rebuild 2> builderror.log) || (exit 0)
C:\Users\User\Desktop\assistant-plugins\node_modules\websocket>if not defined npm_config_node_gyp (node "C:\Program Files\nodejs\node_modules\npm\bin\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild )  else (node "" rebuild )
npm WARN assistant-plugins@1.0.0 No repository field.

added 84 packages in 9.452s

C:\Users\User\Desktop\assistant-plugins>
```
  6. Configurer (voir ci-dessous)
  7. Une fois tout configuré, double-cliquer sur le fichier `start.bat`  
  → Une fenêtre va s'ouvrir avec des informations comme celles-ci :  
```
[assistant] 5 plugins trouvés.
[assistant] Chargement du plugin 'freebox'
[assistant-freebox] Récupération des chaines télé sur free.fr...
[assistant-freebox] Récupération des chaines sur free.fr terminée !
[assistant-freebox] Plugin chargé et prêt.
[assistant] Chargement du plugin 'notifier'
[assistant-notifier] Plugin chargé et prêt.
[assistant] Chargement du plugin 'ifttt'
[assistant-ifttt] Plugin chargé et prêt.
[assistant] Chargement du plugin 'wait'
[assistant-wait] Plugin chargé et prêt.
[assistant] Chargement du plugin 'tam'
[assistant-wait] Plugin chargé et prêt.
[assistant] Prêt à écouter les commandes via PushBullet  <-- tout est bon !
```

## ★ Configuration

Trois étapes :
  1. Modifier le fichier `configuration.json`
  2. Modifier le fichier `plugins.json`
  3. Configurer chaque plugin
  
### Fichier `configuration.json`

Commencer par se rendre dans les [settings de Pushbullet](https://www.pushbullet.com/#settings) puis cliquer sur `Create Access Token`. Il va alors vous fournir une clé (*token*) qui ressemble à `o.XORwEvj04kFriJ67A3ZYofiudZeYFCzi`.

Ouvrir le fichier `configuration.json` dans un éditeur de texte puis fournir le token. Votre fichier ressemble alors à :
```javascript
{
  "pushbullet_token":"o.XORwEvj04kFriJ67A3ZYofiudZeYFCzi"
}
```

### Fichier `plugins.json`

Ouvrir le fichier `plugins.json` avec un éditeur de texte puis supprimer les lignes des plugins que vous ne souhaitez pas utiliser.

### Configurations des plugins

Vous devez maintenant aller dans les répertoires de chaque plugin pour vérifier s'il contient un fichier `configuration.json`. Vous trouverez les instructions de configuration dans chacun des répertoires Github des plugins.

# Plugins

## Freebox

Ce plugin est destiné à commander la **Freebox Révolution** : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-freebox)

## IFTTT

Ce plugin va permettre d'enclencher des actions personnalisées (via les *WebHooks*) dans IFTTT : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-ifttt)

### Notifier

Ce plugin permet de faire parler son Google Home en lui faisant dire ce que l'on souhaite : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-notifier)

### Wait

Ce plugin permet de simuler un délai lorsque vous demandez une action à votre Assistant : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-wait)

### TAM

Ce plugin permet de connaître les prochains trams de Montpellier qui passent à un arrêt bien précis : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-tam)

# Comment faire son propre plugin ?

Si vous savez programmer en JavaScript, et avez quelques notions de NodeJS/npm, c'est assez simple : [en savoir plus](https://github.com/Aymkdn/assistant-plugins/tree/master/assistant-template)
