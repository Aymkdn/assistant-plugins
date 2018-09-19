# assistant-plugins

Vous utilisez un Assistant, comme Google Home/Assistant, Cortana, Alexa ? Alors vous pouvez étendre ses possibilités grâce à cet outil qui utilise la puissance de [IFTTT](http://www.ifttt.com/).

> Consulter [le changelog](https://github.com/Aymkdn/assistant-plugins/blob/master/changelog.md) pour connaitre les dernières mises à jour.

## ★ Comment ça marche ?

J'ai passé un moment à explorer comment je pouvais faire faire des actions spéciales à mon Google Home Mini. Par exemple, piloter ma Freebox, ou me dire quand les prochains trams arrivent à côté de chez moi. Toutes les solutions trouvées ([Google Actions](https://developers.google.com/actions/), [Sarah v5](https://github.com/NGRP/node-red-contrib-viseo), et autres Node modules) étaient très compliquées : beaucoup de choses à installer, ou qui demandent beaucoup de manipulations, ou avec des contraintes importantes.

Après toutes ces recherches, j'ai décidé d'utiliser [IFTTT](http://www.ifttt.com/) (qui permet de dire ce que l'on souhaite à son Assistant et d'avoir une action associée), en combinaison avec [Pushbullet](https://www.pushbullet.com/) et une machine sous Windows, Linux ou MacOS.

**Les avantages de ce système**  : plus sécurisé (le système va écouter les notifications venant de Pushbullet et qui contiennent les actions à réaliser), et plus simple (pas besoin de devoir configurer son routeur pour ouvrir sur l'extérieur, ni devoir entrer des URLs compliqués, ou autres).

### Schéma exemple

Voici concrètement comment cela fonctionne avec un exemple :
![schema](https://user-images.githubusercontent.com/946315/35142776-a087b06e-fcff-11e7-98b1-c1ce7613ed13.png)

L'opération peut paraître compliquée, mais elle s'exécute très rapidement et la mise en place est plutôt simple !

## ★ Installation

<iframe width="560" height="315" src="https://www.youtube.com/embed/Gmt4tIPH_fk?rel=0" frameborder="0" allowfullscreen></iframe>
  
L'installation passe par quelques étapes.  
Si vous avez un **RaspberryPi**, [voir cette page dédiée](https://github.com/Aymkdn/assistant-plugins/wiki/Installation-de-assistant-plugins-sur-RaspberryPi).  
Si vous avez un **Synology**, [voir cette page dédiée](https://github.com/Aymkdn/assistant-plugins/wiki/Installation-de-assistant-plugins-sur-Synology).

  1. Installer [NodeJS](https://nodejs.org/en/) sur une machine qui sera allumée 24h/24, qui exécutera les actions demandées et qui doit se trouver sur votre réseau local  
  À noter que NodeJS est disponible sur Windows, Linux et MacOS.  
  → Pour les utilisateurs de Linux, s'assurer que vous avez une version supérieure à la 8.x.x de NodeJS d'installé.  
    
  2. Créer un compte sur [IFTTT](http://www.ifttt.com/) (c'est gratuit)  
    
  3. Créer un compte sur [Pushbullet](https://www.pushbullet.com/) (c'est gratuit)  
    
  4. Sélectionner les plugins que vous voulez installer :  
  <vue-plugins-selection></vue-plugins-selection>  
    
  5. Cliquer sur le bouton pour télécharger `assistant-plugins` sur votre machine :<br> <button type="button" class="button ui" @click="downloadStart" :disabled="download.disabled">{{ download.text }}</button>  
    
  6. Dézipper le fichier qui vient d'être téléchargé, puis se rendre dans le dossier `assistant-plugins`  
    
  7. Pour **Windows**, double-cliquer sur le fichier `install.bat` (une fenêtre va s'ouvrir et va essayer de télécharger les packages associés)   
  Pour **MacOS** ([voir la vidéo](https://youtu.be/r3y8X66Hnng)) et **Linux**, ouvrir une console dans le répertoire et taper :  
  `npm install --loglevel error && npm run-script postinstall`  
  8. Un fichier `configuration.json` a dû apparaitre à la fin de l'installation.  
  Il est donc maintenant temps de configurer (voir [section Configuration plus bas](#-configuration))  
    
  9. Une fois tout configuré :  
  Pour **Windows**, double-cliquer sur le fichier `start.bat`  
  Pour **MacOS/Linux**, ouvrir une console et taper : `node index.js`  
  → L'affichage va donner quelque chose comme :  
        ```
        [assistant] 2 plugins trouvés.
        [assistant] Chargement du plugin 'freebox'
        [assistant-freebox] Récupération des chaines télé sur free.fr...
        [assistant-freebox] Récupération des chaines sur free.fr terminée !
        [assistant-freebox] Plugin chargé et prêt.
        [assistant] Chargement du plugin 'notifier'
        [assistant-notifier] Plugin chargé et prêt.
        [assistant] Prêt à écouter les commandes via PushBullet
        ```

<pre class="important">Un problème ou une question ? Consulte [cette page d'aide](https://github.com/Aymkdn/assistant-plugins/wiki/Questions-Fr%C3%A9quentes).</pre>

## ★ Configuration

Tout se passe dans le fichier `configuration.json` qui contient toutes les éléments à configurer.

### Configuration Principale

Avant toute chose, il faut récupérer un élément du site Pushbullet.  
Pour cela, se rendre dans les [settings de Pushbullet](https://www.pushbullet.com/#settings) puis cliquer sur `Create Access Token`. Il va alors fournir une clé (*token*) qui ressemble à `o.XORwEvj04kFriJ67A3ZYofiudZeYFCzi`.

Ouvrir le fichier `configuration.json` dans un éditeur de texte puis fournir le token. Votre fichier ressemble alors à :
```javascript
{
  "main": {
    "pushbullet_token":"o.XORwEvj04kFriJ67A3ZYofiudZeYFCzi"
  },
  "plugins": {
    ...
  }
}
```

<pre class="important">Un problème ou une question ? Consulte [cette page d'aide](https://github.com/Aymkdn/assistant-plugins/wiki/Questions-Fr%C3%A9quentes).</pre>

### Configuration des Plugins

Certains plugins peuvent nécessiter une configuration. Pour cela, se reporter au site Web de chaque plugin :
<vue-plugins></vue-plugins>

<pre class="important">Un problème ou une question ? Consulte [cette page d'aide](https://github.com/Aymkdn/assistant-plugins/wiki/Questions-Fr%C3%A9quentes).</pre>

# Comment mettre à jour ?

Pour la suite, pour mettre à jour le programme et les plugins, il faut **arrêter le programme** , puis lancer le fichier `update.bat` pour Windows, et pour MacOS/Linux taper la commande : `npm update` dans le répertoire courant.

Et enfin, **redémarrer le programme**.

# Comment faire son propre plugin ?

Si vous savez programmer en JavaScript, et avez quelques notions de NodeJS/npm, c'est assez simple : [en savoir plus](https://github.com/Aymkdn/assistant-template)

# Lancer le programme au démarrage et en arrière-plan

Pour les **utilisateurs plus avancées**, vous pouvez configurer le programme pour qu'il se lance au démarrage de votre machine et en arrière-plan sur votre machine.  

Je vous invite à utiliser [pm2](http://pm2.keymetrics.io/), que je vais rapidement expliquer.  
Pour **RaspberryPi**, se reporter à la [documentation dédiée](https://github.com/Aymkdn/assistant-plugins/wiki/Installation-de-assistant-plugins-sur-RaspberryPi#8-lancer-au-red%C3%A9marrage).  
Pour **Synology**, se reporter à la [documentation dédiée](https://github.com/Aymkdn/assistant-plugins/wiki/Installation-de-assistant-plugins-sur-Synology#8-lancer-le-programme-au-d%C3%A9marrage).

Voici les étapes à suivre :

  1) Ouvrir une console dans le répertoire où vous avez installé le programme, puis taper la commande:  
  `npm install pm2 -g`  
  2) Pour les utilisateurs de **Windows**, taper la commande :  
  `npm install pm2-windows-startup -g && pm2-startup install`  
  Pour les utilisateurs de **Linux/MacOS**, taper la commande :  
  `sudo pm2 startup`  
  3) Maintenant on va démarrer notre programme avec la commande :  
  `pm2 start index.js`  
  4) Puis on sauvegarde avec la commande :  
  `pm2 save`  
  5) Redémarrer la machine pour constater que cela fonctionne
  
Si vous avez besoin de faire des modifications (changement de configuration, ajout d'un plugin, etc.), assurez-vous de **relancer le programme via pm2** :
```bash
# on liste tous les programmes lancés via pm2
pm2 list
# on repère celui d'assistant-plugins (probablement le seul de la liste)
# son ID est sûrement 0... on l'arrête
pm2 stop 0
# on peut modifier le fichier de configuration, ajouter de nouveaux plugins, etc.
# puis on le relance
pm2 start 0
```
  
Une fois que le programme est lancé en arrière plan, il faudra utiliser la commande `pm2 monit` pour voir **les logs du programme**.

Si vous avez des problèmes pour lancer le programme au démarrage sous **MacOS**, alors vous pouvez consulter [ce sujet](https://github.com/Aymkdn/assistant-plugins/issues/147).

# Faire un don

Certaines personnes ont souhaité me faire un don pour me remercier du travail fourni. Si c'est votre cas, vous pouvez le faire via [paypal.me/aymkdn](https://paypal.me/aymkdn). **Merci !**
