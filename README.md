# snips-action-yeelight

This action code is designed for Xiaomi Yeelight lights. It allows you to control lights in different rooms by voice using Snips. The app supports color selection, built-in scenes, and brightness control.

More functionality, for e.g. controlling each individual light or handling more bespoke colors, please follow the Developer section in order to customise your own bundle and action code.

## Installation

Before installing this app, make sure all your bulbs work. To be able to control your lights, don't forget to enable the LAN Control option in the Yeelight mobile app.

**⚠️⚠️ Make sure you enabled the LAN Control option in the Yeelight mobile app for each of your bulbs.**

### Installation with Sam

Run the following command to install your assistant and its action code:

```sh
sam install assistant
```

Then select the assistant which contains `Yeelight` bundle.

### Manual installation

I you don't want (or can't) use Sam, you can manually clone this repository to the `/var/lib/snips/skills/` directory where the `snips-skill-server` is based on. Please go to:

```sh
cd /var/lib/snips/skills
sudo -u _snips-skills git clone https://github.com/thomas-bouvier/snips-action-yeelight.git
cd snips-action-yeelight
sudo -u _snips-skills sh setup.sh
```

Don't forget to edit the `config.ini` file.

## Development

```sh
# Install the dependencies, builds the action and creates the config.ini file.
sh setup.sh
```

Don't forget to edit the `config.ini` file.

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