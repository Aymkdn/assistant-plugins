# IFTTT

Ce plugin permet d'enclencher une action **WebHooks** sur IFTTT.

## Configuration

Se rendre dans le [maker WebHooks de IFTTT](https://ifttt.com/maker_webhooks) et le configurer. Une clé (*key*) vous sera alors donnée (qui ressemble à *dph-Wyhz1Zxlw89WZchMAV*).

Éditer le fichier `configuration.json` afin d'y mettre la clé. Exemple :
```javascript
{
  "key":"dph-Wyhz1Zxlw89WZchMAV"
}

```

## Utilisation

Vous pouvez relier des plugins ensembles en déclenchant des actions sur IFTTT.

### Exemple

Un exemple concret sera plus parlant. Supposons qu'on veuille dire *OK Google, éteins toutes les lumières dans X minutes*.

On procédera ainsi :

  1) Création d'un applet WebHooks IFTTT qui se déclenche sur la commande `AllLightsOff` et qui va se connecter à Philipps Hue pour éteindre toutes les lampes
  2) Création d'un applet Google Assistant (*Say a phrase with both a number and a text ingredient*) avec la phrase de déclenchement : "éteins toutes les lumières dans # $"
  Cet applet enverra à Pushbullet une note avec le titre "Assistant" et le message : `wait_{{NumberField}} {{TextField}}|ifttt_AllLightsOff`

Si on décortique la commande envoyée à Pushbullet :
  - `wait_{{NumberField}} {{TextField}}` → cela déclenche le plugin `assistant-wait` qui permet de mettre un timer de `NumberField` `TextField` (par exemple "3 minutes")
  - `|` → le *pipe* permet de distinguer les différentes commandes
  - `ifttt_AllLightsOff` → cela déclenche le plugin `assistant-ifttt` qui va mettre en route le WebHook `AllLightsOff` créé à l'étape 1 et donc éteindre toutes les lumières
