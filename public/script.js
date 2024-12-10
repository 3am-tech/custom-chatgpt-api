let chatContext = [];

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        // Create message content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        messageDiv.appendChild(contentDiv);

        // Add copy button for assistant messages
        if (!isUser) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<i class="copy-icon">📋</i>';
            copyButton.title = 'Copy to clipboard';
            
            copyButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(content);
                    copyButton.innerHTML = '<i class="copy-icon">✓</i>';
                    copyButton.classList.add('copied');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="copy-icon">📋</i>';
                        copyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text:', err);
                }
            });
            
            messageDiv.appendChild(copyButton);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.textContent = 'AI is generating a comprehensive response...';
        chatMessages.appendChild(typingDiv);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context: chatContext
                }),
            });

            const data = await response.json();

            // Remove typing indicator
            typingDiv.remove();

            if (data.error) {
                addMessage('Error: ' + data.error);
            } else {
                // Split the response into paragraphs for better readability
                const formattedMessage = data.message
                    .split('\n')
                    .filter(para => para.trim())
                    .join('\n\n');
                addMessage(formattedMessage);
                chatContext = data.context;
            }
        } catch (error) {
            typingDiv.remove();
            addMessage('Error: Could not connect to the server');
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
