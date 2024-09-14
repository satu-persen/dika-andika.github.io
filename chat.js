const apiKey = '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'; // Ganti dengan API key OpenAI kamu

async function sendMessage() {
    const input = document.getElementById('input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('You: ' + message);
    input.value = '';
    input.disabled = true;

    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: message,
                max_tokens: 150
            })
        });

        const data = await response.json();
        const reply = data.choices[0].text.trim();
        appendMessage('ChatGPT: ' + reply);
    } catch (error) {
        appendMessage('Error: ' + error.message);
    } finally {
        input.disabled = false;
        input.focus();
    }
}

function appendMessage(text) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = text;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}