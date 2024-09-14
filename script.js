document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');

    // Load existing messages
    function loadMessages() {
        fetch('messages.php')
            .then(response => response.json())
            .then(data => {
                chatBox.innerHTML = data.map(msg => `<div class="chat-message"><p>${msg}</p></div>`).join('');
                chatBox.scrollTop = chatBox.scrollHeight;
            });
    }
    
    loadMessages(); // Initial load

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value;
        fetch('send_message.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `message=${encodeURIComponent(message)}`
        }).then(response => response.text())
          .then(() => {
              messageInput.value = '';
              loadMessages(); // Refresh chat
          });
    });
});
