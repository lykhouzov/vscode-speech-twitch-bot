(function() {

    const vscode = acquireVsCodeApi();
    const element = document.querySelector('.chat-list');
    let numMessages = 0;
    window.addEventListener('message', event => {
        const message = event.data;
        // element.textContent = null;
        switch (message.type) {
            case 'addMessage':
                {
                    const { context: { username, 'display-name': displayName, 'message-type': message_type, color }, lang } = message.message;
                    if (numMessages > 10) {
                        element.textContent = null;
                    }
                    numMessages += 1;
                    let spanUsername = document.createElement('span');
                    spanUsername.textContent = displayName;
                    spanUsername.classList.add('username');
                    spanUsername.style.color = color
                    let spanMessage = document.createElement('span');
                    spanMessage.textContent = message.message.msg;
                    spanMessage.classList.add('message');
                    let li = document.createElement('li');
                    li.appendChild(spanUsername);
                    li.appendChild(spanMessage);
                    li.classList.add('chat-messsage-line');
                    li.classList.add('visible');
                    element.appendChild(li);
                    setTimeout(function() {
                        li.classList.remove('visible');
                        li.classList.add('hidden');
                        setTimeout(function() {
                            li.remove();
                        }, 1500);
                    }, window.hide_message_after);


                    const msg = `${displayName}: ${message.message.msg}`
                    const isEnglish = lang === 'english' || lang === 'pidgin';
                    say(msg, isEnglish);
                    // element.innerHTML = msg;
                    break;

                }
            case 'clearMessage':
                {
                    element.innerHTML = JSON.stringify(message);
                    break;
                }
            case 'sayMessage':
                {
                    say(message.message, false);
                    break;
                }

        }
    });

}());

function say(text, isEnglish) {
    var voices = window.speechSynthesis.getVoices();
    let ruVoices = voices.find(({ lang }) => lang.indexOf("ru") !== -1);
    let enVoices = voices.find(({ lang }) => lang.indexOf("en") !== -1);
    console.log({ ruVoices, enVoices });
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.voice = isEnglish ? enVoices : ruVoices;
    msg.volume = 1; // From 0 to 1
    msg.rate = 1; // From 0.1 to 10
    msg.pitch = 1; // From 0 to 2
    msg.lang = "ru-RU";
    window.speechSynthesis.speak(msg);
}