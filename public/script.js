document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingAnimationToggle = document.getElementById('typing-animation-toggle');
    const clearHistoryButton = document.getElementById('clear-history');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmClearButton = document.getElementById('confirm-clear-history');
    const cancelClearButton = document.getElementById('cancel-clear-history');
    const contextFileInput = document.getElementById('context-file');
    const contextFileName = document.getElementById('context-file-name');

    let chatContext = [];
    let conversationHistory = [];
    let contextFileContent = '';

    // Load saved preferences and history
    const savedAnimationPreference = localStorage.getItem('typingAnimation');
    if (savedAnimationPreference !== null) {
        typingAnimationToggle.checked = savedAnimationPreference === 'true';
    }

    // Load conversation history
    function loadConversationHistory() {
        const savedHistory = localStorage.getItem('conversationHistory');
        if (savedHistory) {
            // Parse saved history
            const parsedHistory = JSON.parse(savedHistory);
            
            // Clear existing messages before rendering
            chatMessages.innerHTML = '';
            
            // Render saved history without re-saving
            parsedHistory.forEach(message => {
                renderMessageWithoutSaving(message.content, message.isUser);
            });
        }
    }

    // Render message without saving to history again
    function renderMessageWithoutSaving(content, isUser = false) {
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
        
        // Always add typing-complete class for loaded messages
        messageDiv.classList.add('typing-complete');
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Save conversation history
    function saveConversationHistory() {
        localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    }

    // Save preference when changed
    typingAnimationToggle.addEventListener('change', () => {
        localStorage.setItem('typingAnimation', typingAnimationToggle.checked);
    });

    // Context File Upload Handling
    contextFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        // Validate file type
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                contextFileContent = e.target.result;
                contextFileName.textContent = file.name;
                contextFileName.classList.remove('error');
                
                // Add a message to chat about uploaded context
                addMessage(`📄 Context file uploaded: ${file.name}`, true);
            };
            
            reader.onerror = () => {
                contextFileName.textContent = 'Error reading file';
                contextFileName.classList.add('error');
            };
            
            reader.readAsText(file);
        } else {
            contextFileName.textContent = 'Please upload a .txt file';
            contextFileName.classList.add('error');
            contextFileInput.value = ''; // Clear the input
        }
    });

    // Clear history button handlers
    clearHistoryButton.addEventListener('click', () => {
        confirmationModal.style.display = 'flex';
    });

    confirmClearButton.addEventListener('click', () => {
        // Clear local storage and UI
        localStorage.removeItem('conversationHistory');
        chatMessages.innerHTML = '';
        conversationHistory = [];
        chatContext = [];
        
        // Hide modal
        confirmationModal.style.display = 'none';
    });

    cancelClearButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        
        // Create message content div
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        messageDiv.appendChild(contentDiv);

        // Store message in conversation history ONLY if it's a new message
        conversationHistory.push({ content, isUser });
        saveConversationHistory();

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
        
        if (!isUser && typingAnimationToggle.checked) {
            // Animate the text being typed
            let currentText = '';
            let currentIndex = 0;
            const typingSpeed = 10; // Milliseconds per character
            
            function typeNextCharacter() {
                if (currentIndex < content.length) {
                    currentText += content[currentIndex];
                    contentDiv.textContent = currentText;
                    currentIndex++;
                    
                    // Vary typing speed slightly for more natural effect
                    const variance = Math.random() * 10 - 5;
                    setTimeout(typeNextCharacter, typingSpeed + variance);
                    
                    // Scroll to bottom as text is being typed
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    // Add typing-complete class when done
                    messageDiv.classList.add('typing-complete');
                }
            }
            
            typeNextCharacter();
        } else {
            contentDiv.textContent = content;
            if (!isUser) {
                messageDiv.classList.add('typing-complete');
            }
        }
        
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
            // Prepare context with file content if available
            const fullContext = contextFileContent 
                ? [{ role: "system", content: contextFileContent }, ...chatContext]
                : chatContext;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context: fullContext
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

    // Load conversation history on page load
    loadConversationHistory();
});
