# Freebox

Ce plugin permet de contrôler la Freebox Révolution.

**/!\ Attention** : pour que le plugin soit fonctionnel, il faut activer le AirMedia sur la Freebox en allant dans **Réglages** → **Applications** → **AirMedia Video** puis **activer AirMedia**.

## Configuration

Éditer le fichier `configuration.json`.

On y trouve plusieurs paramètres. Le seul important qu'il vous faut modifier est `code_telecommande`.

### `code_telecommande`

Allumer la Freebox, aller complètement à gauche dans la section **Réglages**, puis descendre jusqu'à **Système**, puis dans **Informations Freebox Player et Server**.

Dans le premier onglet vous trouverez le **code télécommande réseau**. Inscrire ce nombre dans le fichier de configuration.

#### `box_to_control`

Par défaut c'est la box dénommée `hd1` qui est pilotée, mais si vous avez plusieurs box vous pouvez modifier ce paramètre en mettant, par exemple, `hd2`.

#### `search_path`

Une des fonctionnalités est la possibilité de se déplacer dans un dossier de la Freebox.

Par exemple, en disant *« OK Google, va dans le dossier Star Trek »*. Il va alors fouiller dans la zone indiquée par `search_path` (qui est `/Disque dur/Vidéos/` qui est `Mes Vidéos` dans le menu de la Freebox).

Il est conseillé de réduire la zone de recherche. Par exemple, supposons que vous voulez seulement rechercher parmi vos séries télé qui sont stockées dans `Perso/Mes Séries/`, alors mettre `/Disque dur/Vidéos/Perso/Mes Séries/`.

#### `use_Mon_Bouquet`

À mettre à `true` si vous souhaitez que le lancement de la télé se fasse dans le menu `Mon Bouquet` (vos chaines favorites) plutôt que dans `Freebox TV`.

## Modifier les chaines TV (optionnel)

Les chaines de TV sont automatiquement récupérées depuis le site de Free au démarrage du plugin, cependant certaines chaines peuvent être mal transcrites par votre Assistant.

Par exemple si vous dites `zappe sur Mangas`, l'Assistant va comprendre `zappe sur Manga` (sans le `s` final) et donc la chaine ne sera pas reconnu par le plugin.

Pour palier à cela, ouvrir le fichier `replace_chaine.json` et s'inspirer des exemples présents. J'ai déjà modifié pour les principales chaines.

## Utilisation

J'ai créé des applets IFTTT qui sont déjà disponibles. Vous pouvez donc les utiliser. Pour cela, [chercher "Freebox"](https://ifttt.com/search/query/freebox).

Voici les phrases clés à dire — s'assurer d'avoir installé les applets associées :
  - `allume la Freebox` ([https://ifttt.com/applets/qa8rME2N-allume-la-freebox](https://ifttt.com/applets/qa8rME2N-allume-la-freebox)) : allume simplement la Freebox
  - `allume la télé` ([https://ifttt.com/applets/tuKQJrnH-allume-la-tele-via-la-freebox](https://ifttt.com/applets/tuKQJrnH-allume-la-tele-via-la-freebox)) : allume la Freebox (si elle n'est pas allumée) puis va mettre une chaine télé
  - `allume la télé et zappe sur ...` ([https://ifttt.com/applets/Bj6nH7Xw-allume-la-tele-via-la-freebox-et-zappe-sur-une-chaine](https://ifttt.com/applets/Bj6nH7Xw-allume-la-tele-via-la-freebox-et-zappe-sur-une-chaine)) : allume la Freebox (si elle n'est pas allumée) puis va mettre la chaine de télé demandée
    Exemples :
    *OK Google, allume la télé et zappe sur M6*
    *OK Google, allume la télé et zappe sur la 6*
  - `éteins la Freebox` ([https://ifttt.com/applets/EEn7LsPJ-eteins-la-freebox](https://ifttt.com/applets/EEn7LsPJ-eteins-la-freebox)) : éteins la Freebox
  - `zappe sur ...` ([https://ifttt.com/applets/d6B7Yrk5-zappe-sur-une-chaine-de-la-freebox](https://ifttt.com/applets/d6B7Yrk5-zappe-sur-une-chaine-de-la-freebox)) : zappe sur la chaine demandée, et fonctionne aussi avec le numéro de la chaine
   Exemples :
    *OK Google, zappe sur TMC*
    *OK Google, zappe sur la 10*
  - `coupe le son de la Freebox` ([https://ifttt.com/applets/kx4Ku7vj-coupe-le-son-de-la-freebox](https://ifttt.com/applets/kx4Ku7vj-coupe-le-son-de-la-freebox))
  - `remets le son de la Freebox` ([https://ifttt.com/applets/S4wcuJn7-remets-le-son-de-la-freebox](https://ifttt.com/applets/S4wcuJn7-remets-le-son-de-la-freebox))
  - `baisse le son de la Freebox` ([https://ifttt.com/applets/WWf3zG58-baisse-le-son-de-la-freebox](https://ifttt.com/applets/WWf3zG58-baisse-le-son-de-la-freebox)) : va baisser le son de 15 barres
  - `baisse le son de la Freebox de X` ([https://ifttt.com/applets/cbeL79cW-baisse-le-son-de-x-barres-sur-la-freebox](https://ifttt.com/applets/cbeL79cW-baisse-le-son-de-x-barres-sur-la-freebox)) : va baisser le son de X barres
   Exemple : *OK Google, baisse le son de la Freebox de 50*
  - `monte le son de la Freebox` ([https://ifttt.com/applets/uCcg6RdE-augmente-le-son-de-la-freebox](https://ifttt.com/applets/uCcg6RdE-augmente-le-son-de-la-freebox)) : va augmenter le son de 15 barres
  - `monte le son de la Freebox de X` ([https://ifttt.com/applets/UuDGXdmL-augmente-le-son-de-x-barres-sur-la-freebox](https://ifttt.com/applets/UuDGXdmL-augmente-le-son-de-x-barres-sur-la-freebox)) : va augmenter le son de X barres
    Exemple : *OK Google, augmente le son de la Freebox de 25*
  - `mets la Freebox sur pause` ([https://ifttt.com/applets/N7um4qJU-mets-sur-pause-la-freebox](https://ifttt.com/applets/N7um4qJU-mets-sur-pause-la-freebox)) : met le programme en cours sur pause
  - `remets la Freebox en lecture` ([https://ifttt.com/applets/mHAXMym9-remets-la-freebox-en-lecture](https://ifttt.com/applets/mHAXMym9-remets-la-freebox-en-lecture)) : remet en lecture le programme en cours
  - `reviens au direct` ([https://ifttt.com/applets/zfSALsrD-remets-le-direct-sur-la-freebox](https://ifttt.com/applets/zfSALsrD-remets-le-direct-sur-la-freebox)) : lorsque la Freebox TV a été mise sur pause et qu'on souhaite revenir au direct
  - `va dans Mes Enregistrements` ([https://ifttt.com/applets/KxHGy7vw-va-dans-mes-enregistrements-sur-la-freebox](https://ifttt.com/applets/KxHGy7vw-va-dans-mes-enregistrements-sur-la-freebox)) : pour aller dans le menu "Mes Enregistrements" de la Freebox
  - `va dans Mes Vidéos` ([https://ifttt.com/applets/ZkWauBKi-va-dans-mes-videos-sur-la-freebox](https://ifttt.com/applets/ZkWauBKi-va-dans-mes-videos-sur-la-freebox)) : pour aller dans le menu "Mes Vidéos" de la Freebox
  - `va dans le dossier ...` ([https://ifttt.com/applets/bbdEPtcx-va-dans-un-dossier-stocke-sur-la-freebox](https://ifttt.com/applets/bbdEPtcx-va-dans-un-dossier-stocke-sur-la-freebox)) : parcourt tous les dossiers définis dans `search_path` (voir la section Configuration ci-dessus) afin de trouver le dossier souhaité
    Exemples :
    *OK Google, va dans le dossier Star Trek*
    *OK Google, va dans le dossier The Walking Dead* (il vous faudra prendre votre plus beau accent anglais !)

## Personnalisation

Il est également possible de créer ses propres applets et commandes pour piloter la Freebox.

Il faut pour cela procéder ainsi :

  1) Créer une nouvelle *applet* dans IFTTT : [https://ifttt.com/create](https://ifttt.com/create)
  2) Cliquer sur **this** puis choisir **Google Assistant**
  3) Choisir la carte **Say a simple phrase** (ou autre, selon votre cas)
  4) Dans *« What do you want to say? »* mettre la phrase qui va déclencher l'action
  5) Remplir les autres champs de la carte
  6) Maintenant, cliquer sur **that** puis choisir **Pushbullet**
  7) Choisir la carte **Push a Note**
  8) Dans le champs *« Title »*, mettre `Assistant`
  9) Dans le champs *« Message »*, mettre `freebox_` suivi par la commande souhaitée (si plusieurs commandes, les séparer par une virgule) (voir plus bas)
  10) Enregistrer puis cliquer sur **Finish**
  11) Dites : « OK Google » suivi de votre phrase spéciale du point 4)
  12) Google Home va s'exécuter

### Commandes

Dans l'étape 9) précédente, vous devez y indiquer une commande. Voici donc les commandes disponibles :

  - `red` : envoie la commande `red` (touche rouge de la télécommande)
  - `yellow` : envoie la commande `yellow` (touche jaune de la télécommande)
  - `blue` : envoie la commande `blue` (touche bleue de la télécommande)
  - `green` : envoie la commande `green` (touche verte de la télécommande)
  - `up` : envoie la commande `up` (flèche haut)
  - `down` : envoie la commande `down` (flèche bas)
  - `left` : envoie la commande `left` (flèche gauche)
  - `right` : envoie la commande `right` (flèche droite)
  - `OK` : envoie la commande `OK`
  - `home` : envoie la commande `home` (bouton "Free" de la télécommande)
  - `mute` : envoie la commande `mute` (sourdine)
  - `play` : envoie la commande `play`
  - `fwd` : envoie la commande `fwd` (avance rapide)
  - `bwd` : envoie la commande `bwd` (retour rapide)
  - `waitXXXX` : enclenche un timer de XXXX millisecondes
  - `on` : envoie la séquence `power` suivi d'un timer de 7 secondes (`wait7000`)
  - `off` : envoie la commande `power`
  - `tv` : envoie la séquence `home`, `wait2000`, `right`, `left`, `red`, `ok`, `wait4000'
  - `unmute` : envoie `mute`
  - `home` : envoie la séquence `home`, `wait2000`, `red`
  - `back` : envoie la commande `red`
  - `pause` : envoie la commande `play`
  - `videos` : envoie la séquence `home`, `wait2000`, `right`, `left`, `red`, `right`, `ok`
  - `direct` : envoie la séquence `green`, `ok`
  - `enregistrements` : envoie la séquence `home`, `wait2000`, `right`, `left`, `red`, `up`, `ok`
  - `soundDown` : envoie la commande `vol_dec`
  - `soundUp` : envoie la commande `vol_inc`
  - `programUp` : envoie la commande `prgm_inc`
  - `programDown` : envoie la commande `prgm_dec`

### Exemple

Par exemple, supposons que vous avez un enregistrement journalier (disons l'émission [Quotidien de Yann Barthès qui passe sur TMC](https://www.tf1.fr/tmc/quotidien-avec-yann-barthes)), et que vous souhaitez lancer le dernier Quotidien enregistré.

Pour cela vous souhaitez donner la commande : *OK Google, lance le programme Quotidien*

Il faut donc créer une applet IFTTT (comme décrit plus haut) et pour la commande envoyée à Pushbullet vous mettrez : `freebox_enregistrements,wait7000,ok,ok` qui peut se traduire par `Freebox, va dans Mes Enregistrements, puis patiente 7 secondes, et ensuite appuie sur OK puis OK encore une fois`
