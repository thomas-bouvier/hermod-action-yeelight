# hermod-action-yeelight

[![Build Status](https://travis-ci.com/thomas-bouvier/hermod-action-yeelight.svg?branch=master)](https://travis-ci.com/thomas-bouvier/hermod-action-yeelight)

Hermod action: Yeelight

This action allows you to control your Xiaomi Yeelight lights by voice. It supports multiroom, color selection, and brightness control.

This action has been tested with Xiaomi Yeelight v2 (RGB and white). Tell me if you tried it with other devices 😉

## Setup

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

**⚠️ Make sure you enabled the LAN Control option in the Yeelight mobile app for each of your lights before installing this action.**

## Run

- Dev mode:

```sh
# Dev mode watches for file changes and restarts the action.
npm run dev
```

- Prod mode:

```sh
# 1) Lint, transpile and test.
npm start
# 2) Run the action.
npm run launch
```

## Tests & Demo cases

At the moment, this action only supports french 🇫🇷 and english 🇬🇧.

### `TurnOn`

#### Turn on the lights, optionnally indicating room names

Turn on the light
> *Can you turn on the light please?*

> *Allume la lumière !*

Turn on the light in the given room(s)
> *Turn on the entrance lights*

> *Allume le luminaire du séjour*

Turn on all the lights
> *Turn on all the lights*

> *Allume dans tout l'appartement*

### `TurnOff`

#### Turn off the lights, optionnally indicating room names

Turn off the light
> *Can you switch off the light?*

> *Éteins la lumière s'il te plaît*

Turn off the light in the given room(s)
> *Turn off the lights in the garden*

> *Éteins les lumières du couloir et de la chambre*

Turn off all the lights
> *Turn off all the lights*

> *Tu peux éteindre dans toutes les pièces*

### `SetBrightness`

#### Set the brightness, optionnally indicating room names

Set the brightness of a light
> *Can you set the brightness to 75?*

> *Peux-tu régler la luminosité à 80 ?*

Set the brightness of a light in the given room(s)
> *Set the brightness level to 75 in the kitchen and in the bathroom*

> *Mets le niveau de luminosité de ma chambre à 20 pourcent*

Set the brightness of all lights
> *Set the brightness level of the flat to 5 percent*

> *Règle toutes les lampes à 10 pourcent de luminosité*

### `ShiftUp`

#### Increase the brightness, optionnally indicating room names

Increase the brightness of a light
> *Can you increase the brightness by 5 percent?*

> *Peux-tu augmenter la luminosité*

Increase the brightness of a light in the given room(s)
> *Increase the brightness in the garage*

> *Monte le niveau de luminosité de ma chambre à 20 pourcent*

Increase the brightness of all lights
> *It's too dark in all the rooms*

> *Augmente la luminosité dans toute la maison*

### `ShiftDown`

#### Decrease the brightness, optionnally indicating room names

Decrease the brightness of a light
> *Can you decrease the brightness?*

> *Peux-tu diminuer la luminosité de 10 pourcent*

Decrease the brightness of a light in the given room(s)
> *Decrease the lights of the garden*

> *Diminuer le niveau d'éclairage de la cuisine et de la salle de bain*

Decrease the brightness of all lights
> *It's too bright in all the rooms*

> *Il y a trop de lumière dans tout l'appart*

### `SetColor`

#### Set a color, optionnally indicating room names

Set the color a light
> *Can you set the color to red?*

> *Mets du bleu*

Set the color a light in the given room(s)
> *Set the color to green in the garden*

> *Mets une lumière orange dans ma chambre et dans le séjour*

Set a color in all lights
> *Set the entire flat in a red light*

> *Mets une ambiance rose dans tout l'appartement*

## Debug

In the `src/index.ts` file:

```js
// Replace 'error' with '*' to log everything
logger.enable('error')
```

## Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: mocks are written in `tests/mocks`
- **i18n**: mocked by `hermod-toolkit`, see the [documentation](https://github.com/thomas-bouvier/hermod-javascript-toolkit#i18n).
