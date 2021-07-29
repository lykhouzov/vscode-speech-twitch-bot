const { readFile, writeFile } = require('fs');
const SETTINGS_PATH = `${process.env.APPDATA}\\Code\\User\\settings.json`;

function detectCommands(commandName) {
    let result;
    if ((result = p1.exec(commandName)) !== null) {
        // let [_a, r, g, b, ...a] = result;
        const color = rgbToHex(result[1], result[2], result[3]);
        apply_color(color);
        console.log(`* Color was changed to ${color}`);

    } else if ((result = p2.exec(commandName)) !== null || (result = p3.exec(commandName)) !== null) {
        const color = "#" + result[1];
        apply_color(color);
        console.log(`* Color was changed to ${color}`);
    } else {
        return false;
    }
    return true;
}

function rgbToHex(r, g, b) {
    const rgb = [r, g, b].map(x => Number.parseInt(x));
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

const p1 = /^!clr\s(\d{1,3})\s(\d{1,3})\s(\d{1,3})$/i;
const p2 = /^!clr\s([0-9a-f]{6})$/i;
const p3 = /^!clr\s([0-9a-f]{3})$/i;


function apply_color(color) {
    const config = {
        "tab.border": color,
        "sideBar.border": color,
        "titleBar.border": color,
        "activityBar.border": color,
        "panel.border": color
    }

    readFile(SETTINGS_PATH, { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        let settings = JSON.parse(data);
        if ("workbench.colorCustomizations" in settings) {
            for (var [key, value] of Object.entries(config)) {
                settings['workbench.colorCustomizations'][key] = value;
            }
        } else {
            settings['workbench.colorCustomizations'] = config;
        }

        writeFile(SETTINGS_PATH, JSON.stringify(settings), 'utf8', (err) => {
            if (err) console.log('ERROR', err);
            console.log('The file has been saved!');
        });
    });
}

module.exports.detectCommands = detectCommands;