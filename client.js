const tmi = require("tmi.js");
const { workspace } = require('vscode');
const { oauth, username, channel } = workspace.getConfiguration("twitch");

// Define configuration options
const opts = {
    identity: {
        username: username,
        password: oauth
    },
    channels: [channel],
    connection: {
        reconnect: true,
        maxReconnectAttempts: 3,
        secure: true
    }
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
// client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
// client.on("join", (channel, username, self) => {
//     if (self) {
//         return;
//     }
//     const text = "Добро пожаловать на канал, " + username;
//     console.log(text);
//     // say(text);
// });

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    // console.log('self', self);
    // console.log('msg', msg);

    if (self) {
        return;
    } // Ignore messages from the bot

    // console.log('CONTEXT', context);
    const { username, 'display-name': displayName, 'message-type': message_type } = context;
    let way_of_say;
    switch (message_type) {
        case "action":
            way_of_say = "";
            break;
        case "chat":
            way_of_say = "говорит";
            break;
        case "whisper":
            way_of_say = "шепчет";
            break;
        default:
            way_of_say = "говорит";
            break;
    }
    console.log(`${displayName} ${way_of_say}: ${msg}`);
    // say(`${displayName} ${way_of_say}: ${msg}`);


}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
// const VOICES = window.speechSynthesis.getVoices();
// const RU_VOICES = VOICES.filter(x => x.lang === 'ru-RU');
// function say(text) {
//     var msg = new SpeechSynthesisUtterance();
//     if (RU_VOICES.length > 0) {
//         msg.voice = RU_VOICES[0];
//     }

//     msg.volume = 1; // From 0 to 1
//     msg.rate = 1; // From 0.1 to 10
//     msg.pitch = 0; // From 0 to 2
//     msg.text = text;
//     msg.lang = 'ru';
//     speechSynthesis.speak(msg);
// }

// Connect to Twitch:
// client.connect().catch(console.error);
module.exports.client = client;