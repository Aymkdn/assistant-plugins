# assistant-plugins

Vous utilisez un Assistant, comme Google Home / Google Assistant ? Alors vous pouvez étendre ses possibilités grâce à cet outil qui utilise la puissance de [IFTTT](http://www.ifttt.com/).

## Comment ça marche ?

J'ai passé un moment à explorer comment je pouvais faire faire des actions spéciales à mon Google Home Mini. Par exemple, piloter ma Freebox, ou me dire quand les prochains trams arrivent à côté de chez moi. Toutes les solutions trouvées ([Google Actions](https://developers.google.com/actions/), [Sarah v5](https://github.com/NGRP/node-red-contrib-viseo), autres Node modules) étaient très compliquées : beaucoup de choses à installer, qui ne fonctionnent que sur un système d'exploitation, ou qui demandent beaucoup de manipulations, ou avec des contraintes importantes.

Certains se plaidront encore que ma solution est trop compliquée. Libre à eux d'aller voir ailleurs :-)

### Interconnexions

Le principe est d'utiliser [IFTTT](http://www.ifttt.com/) (qui permet de dire ce que l'on souhaite à son Assistant et d'avoir une action associée), en combinaison avec [Pushbullet](https://www.pushbullet.com/) et un ordinateur (Windows, Linux ou MacOS).

### Pourquoi Pushbullet ?

Plus simple et plus sécurisé : le système va écouter les notifications venant de Pushbullet et qui contiennent les actions à réaliser. Du coup, pas besoin de devoir configurer son routeur pour ouvrir sur l'extérieur, ni devoir entrer des URLs compliqués, ou autre.

En plus, c'est gratuit.

### Exemple

Moi: « OK Google, allume la Freebox » → Google: « j'allume la Freebox » (via IFTTT) → Notification à Pushbullet (via IFTTT) → l'ordinateur voit la demande d'action et l'exécute

## Installation

Il passe par quelques étapes, qui peuvent sembler nombreuses, mais qui sont simples et rapides.

  1. Installer [NodeJS](https://nodejs.org/en/) sur votre machine qui sera allumée 24h/24 et qui exécutera les actions demandée
  NodeJS est disponible sur Windows, Linux et MacOS
  2. Créer un compte sur [IFTTT](http://www.ifttt.com/) (c'est gratuit)
  → Associer son compte 
  
