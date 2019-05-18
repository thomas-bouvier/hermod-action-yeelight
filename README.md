# snips-action-yeelight

This app allows you to control your Xiaomi Yeelight lights by voice using Snips. It supports multiroom, color selection, and brightness control.

More features can be added by customising your own assistant and action code.

## Installation

You must have Node.js installed on your device for this app to run.

**⚠️ Make sure you enabled the LAN Control option in the Yeelight mobile app for each of your lights before installing this app.**

### Installation with Sam

Add the `Yeelight` app from the Snips App Store to your assistant. Then run this [Sam](https://docs.snips.ai/reference/sam) command to install it on your device:

```sh
sam install assistant
```

### Manual installation

If you don't want (or can't) use [Sam](https://docs.snips.ai/reference/sam), you can manually clone this repository to the `/var/lib/snips/skills/` directory where the `snips-skill-server` is based on:

```sh
cd /var/lib/snips/skills
sudo -u _snips-skills git clone https://github.com/thomas-bouvier/snips-action-yeelight.git
cd snips-action-yeelight
sudo -u _snips-skills sh setup.sh
```

## Configuration

When installing the app, your connected Yeelight lights will light up one after the other. It is important to remember the order. For each of them, you will then be asked to enter an id, a room name and an id site. Only the id is mandatory, please press enter to keep the value already entered.

If you decide to enter the name of a room for a light, it must exactly match one of the values in the slot named `house_room` in the assistant. Feel free to create new values to fit your needs. Assigning a room to a light allows you to ask queries like `Hey Snips, turn on the entrance lights`.

Assigning a site id to a light allows you to ask queries like `Hey Snips, turn on the lights` to affect lights in the same area than the Snips device. If you don't affect any site id to any lights, this query would affect all of your lights.

You can change this configuration by manually editing `config.ini`.

## Tests & Demo cases

This app only supports french 🇫🇷 and english 🇬🇧.

### `TurnOn`

#### Turn on the lights, optionnally indicating room names

Turn on the light
> *Hey Snips, can you turn on the light please?*

> *Hey Snips, allume la lumière !*

Turn on the light in the given room(s)
> *Hey Snips, turn on the entrance lights*

> *Hey Snips, allume le luminaire du séjour*

Turn on all the lights

> *Hey Snips, turn on all the lights*

> *Hey Snips, allume dans tout l'appartement*

### `TurnOff`

#### Turn off the lights, optionnally indicating room names

Turn off the light
> *Hey Snips, can you switch off the light?*

> *Hey Snips, éteins la lumière s'il te plaît*

Turn off the light in the given room(s)
> *Hey Snips, turn off the lights in the garden*

> *Hey Snips, éteins les lumières du couloir et de la chambre*

Turn off all the lights

> *Hey Snips, turn off all the lights*

> *Hey Snips, tu peux éteindre dans toutes les pièces*

### `SetBrightness`

#### Set the brightness, optionnally indicating room names

Set the brightness of a light
> *Hey Snips, can you set the brightness to 75?*

> *Hey Snips, peux-tu régler la luminosité à 80 ?*

Set the brightness of a light in the given room(s)
> *Hey Snips, set the brightness level to 75 in the kitchen and in the bathroom*

> *Hey Snips, mets le niveau de luminosité de ma chambre à 20 pourcent*

Set the brightness of all lights
> *Hey Snips, set the brightness level of the flat to 5 percent*

> *Hey Snips, règle toutes les lampes à 10 pourcent de luminosité*

### `ShiftUp`

#### Increase the brightness, optionnally indicating room names

Increase the brightness of a light
> *Hey Snips, can you increase the brightness by 5 percent?*

> *Hey Snips, peux-tu augmenter la luminosité*

Increase the brightness of a light in the given room(s)
> *Hey Snips, increase the brightness in the garage*

> *Hey Snips, monte le niveau de luminosité de ma chambre à 20 pourcent*

Increase the brightness of all lights
> *Hey Snips, its too dark in all the rooms*

> *Hey Snips, augmente la luminosité dans toute la maison*

### `ShiftDown`

#### Decrease the brightness, optionnally indicating room names

Decrease the brightness of a light
> *Hey Snips, can you decrease the brightness?*

> *Hey Snips, peux-tu diminuer la luminosité de 10 pourcent*

Decrease the brightness of a light in the given room(s)
> *Hey Snips, decrease the lights of the garden*

> *Hey Snips, diminuer le niveau d'éclairage de la cuisine et de la salle de bain*

Decrease the brightness of all lights
> *Hey Snips, its too bright in all the rooms*

> *Hey Snips, il y a trop de lumière dans tout l'appart*

### `SetColor`

#### Set a color, optionnally indicating room names

Set the color a light
> *Hey Snips, can you set the color to red?*

> *Hey Snips, mets du bleu*

Set the color a light in the given room(s)
> *Hey Snips, set the color to green in the garden*

> *Hey Snips, mets une lumière orange dans ma chambre et dans le séjour*

Set a color in all lights
> *Hey Snips, set the entire flat in a red light*

> *Hey Snips, mets une ambiance rose dans tout l'appartement*

## Development

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

### Run

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
node action-yeelight.js
```

### Debug

In the `action-yeelight.js` file:

```js
// Uncomment this line to print everything
// debug.enable(name + ':*')
```

### Test

*Requires [mosquitto](https://mosquitto.org/download/) to be installed.*

```sh
npm run test
```

**In test mode, i18n output and http calls are mocked.**

- **http**: see `tests/httpMocks/index.ts`
- **i18n**: see `src/factories/i18nFactory.ts`