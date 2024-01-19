# MyGarden

This is a university project in which a combination of the following tools are used:

- Wokwi
- ThingSpeak
- Tauri

[Wokwi](https://wokwi.com/projects/386613712557643777) is used for simulating an esp32 with appropriate sensor hardware.
Meanwhile Thingspeak is used as a data store and Tauri as an application frontend.

# Run in dev mode

First install dependencies:
`npm i`
You will also need to install rustup as this project requires rust.

Then run the dev server:
`npm run tauri dev`

If you want to change the data on ThingSpeak, just run the wokwi simulation and change the sensors' settings.

# Build

`npm run tauri build`
