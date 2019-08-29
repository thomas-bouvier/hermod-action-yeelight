# snips-action-yeelight

This app allows you to control your Xiaomi Yeelight lights by voice using [Snips](https://snips.ai). It supports multiroom, color selection, and brightness control.

More features can be added by customising your own assistant and action code.

This app has been tested with Xiaomi Yeelight v2 (RGB and white). Tell me if you tried it with other devices 😉

## Installation

You must have Node.js installed on your device for this app to run.

**⚠️ Make sure you enabled the LAN Control option in the Yeelight mobile app for each of your lights before installing this app.**

### Installation using Sam

Add the `Smart lights - Yeelight` (or `Lumières connectées - Yeelight`) app from the [Snips App Store](https://console.snips.ai/store) to your assistant, and run this [Sam](https://docs.snips.ai/reference/sam) command to install it on your device:

```sh
sam install assistant
```

### Manual installation

If you don't want (or can't) use [Sam](https://docs.snips.ai/reference/sam), you can manually clone this repository to the `/var/lib/snips/skills` directory:

```sh
cd /var/lib/snips/skills
sudo -u _snips-skills git clone https://github.com/thomas-bouvier/snips-action-yeelight.git
cd snips-action-yeelight
sudo -u _snips-skills sh setup.sh
```

Don't forget to install your assistant containing the app to `/usr/share/snips/assistant`.

Finally, restart the `snips-skill-server`:

```sh
sudo systemctl restart snips-skill-server
```

## Configuration

When installing the app, your connected Yeelight lights will light up one after the other: please remember the order. For each of them, you will then be asked to provide an `id`, a `room` (optional) and a `site_id` (optional). Only the `id` is mandatory.

If you provide a `room` for a light, it must exactly match one of the values in the slot named `house_room` in the assistant. Feel free to create new values to fit your needs. Assigning a room to a light allows you to ask queries like `Hey Snips, turn on the bedroom lights` (where `bedroom` is a value of `house_room`).

Assigning a `site_id` to a light allows you to ask queries like `Hey Snips, turn on the lights`, which would  affect lights in the same area than the Snips device only. If you don't affect any `site_id` to any lights, this query would affect all of your lights.

If you forked the app from the Snips App Store, you may need to update the `intent_prefix` attribute with your Snips Console account username. It will be used to catch the correct 'intent detected' topic.

### Configuration using Sam

Sam will ask you to input the above parameters during the installation process. Enter your locale (`en` or `fr`). Press enter to keep the value already set as an `id`, and fill in the `room` and the `site_id` at your convenience.

You can change this configuration by manually editing `config.ini`.

### Manual configuration

Edit `config.ini` to setup the app.

## Tests & Demo cases

At the moment, this app only supports french 🇫🇷 and english 🇬🇧.

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

## Contributing

Please see the [Contribution Guidelines](https://github.com/thomas-bouvier/snips-action-yeelight/blob/master/CONTRIBUTING.md).