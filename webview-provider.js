const vscode = require('vscode');
class MyProvider {
    static get viewType() { return 'alxly.twitch.bot'; };
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
        this.view = null;
    }
    resolveWebviewView(webviewView, context, _token) {
        this.view = webviewView
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                this.extensionUri
            ]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            console.log('LOG DATA', data);
            switch (data.type) {
                case 'sendMessage':
                    /* @TODO send message to chat */
                    {
                        // (vscode.window.activeTextEditor !== undefined || vscode.window.activeTextEditor !== null) &&
                        //     vscode.window.activeTextEditor
                        //         .insertSnippet(new vscode.SnippetString(`#${data.value}`));
                        break;
                    }
            }
        });
    }
    getHtmlForWebview(webview) {
        const nonce = getNonce();
        const { hide_message_after } = vscode.workspace.getConfiguration("twitch");
        const script_src = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'webview', 'index.js'));
        const styles_src = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'webview', 'styles.css'));
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
				<link rel="stylesheet" href="${styles_src}">
				<title>Twitch Chat</title>
			</head>
            <script nonce="${nonce}">window.hide_message_after=${hide_message_after};</script>
			<body>
				<ul class="chat-list"></ul>
			</body>
            <script nonce="${nonce}" src="${script_src}" />
			</html>`
    }
    addMessage(msg) {
        if (this.view) {
            this.view.show(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this.view.webview.postMessage({ type: 'addMessage', message: msg });
        }
    }

    clearMessages() {
        if (this.view) {
            this.view.webview.postMessage({ type: 'clearMessagess' });
        }
    }
    sayMessage(msg) {
        if (this.view) {
            this.view.webview.postMessage({ type: 'sayMessage', message: msg });
        }
    }

}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
module.exports = MyProvider;