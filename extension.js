// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { client } = require('./client');
const MyWebViewProvider = require('./webview-provider');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
const { detectCommands } = require('./chat-commands');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const provider = new MyWebViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(MyWebViewProvider.viewType, provider)
    );

    client.on("message", (target, context, msg, self) => {
        if (self) {
            return;
        } // Ignore messages from the bot
        const command = detectCommands(msg);
        if (command) {
            return;
        }
        const langDetected = lngDetector.detect(msg, 1);
        const lang = langDetected.length > 0 ? langDetected[0][0] : false;
        provider.addMessage({ msg, context, lang });
    });
    client.on("join", (channel, username, self) => {
        if (self) {
            return;
        }
        const text = "Добро пожаловать на канал, " + username;
        vscode.window.showInformationMessage(text, {});
        provider.sayMessage(text);
    });
    client.connect();
}

// this method is called when your extension is deactivated
function deactivate() { client.disconnect(); }

module.exports = {
    activate,
    deactivate
}