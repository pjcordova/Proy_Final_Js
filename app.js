const socket = io();

const nicknameContainer = document.getElementById('nickname-container');
const nicknameInput = document.getElementById('nickname-input');
const joinChatButton = document.getElementById('join-chat-button');
const chatContainer = document.getElementById('chat-container');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const userStatus = document.getElementById('user-status');
const userUsername = document.getElementById('user-username');
const userAvatar = document.getElementById('user-avatar');

let username = '';
let typingTimeout;

joinChatButton.addEventListener('click', () => {
    username = nicknameInput.value;
    if (username) {
        nicknameContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        userUsername.textContent = username;
        userAvatar.textContent = username.charAt(0).toUpperCase();
        userStatus.textContent = 'online';
        socket.emit('user connected', username);
    }
});

sendButton.addEventListener('click', () => {
    const message = {
        username: username,
        message: messageInput.value
    };
    socket.emit('chat message', message);
    messageInput.value = '';
    socket.emit('stop typing', username);
    clearTimeout(typingTimeout); // Limpiar el timeout al enviar el mensaje
});

messageInput.addEventListener('input', () => {
    socket.emit('typing', username);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('stop typing', username);
    }, 1000);
});

socket.on('chat message', (msg) => {
    const item = document.createElement('div');
    item.classList.add('message', msg.username === username ? 'my-message' : 'other-message');
    item.textContent = msg.message;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    playNotificationSound(); // Reproducir sonido de notificación
});

socket.on('user connected', (msg) => {
    const item = document.createElement('div');
    item.classList.add('notification');
    item.textContent = `${msg} se ha conectado`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('user disconnected', (msg) => {
    const item = document.createElement('div');
    item.classList.add('notification');
    item.textContent = `${msg} se ha desconectado`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('typing', (username) => {
    if (username !== userUsername.textContent) {
        userStatus.textContent = `${username} está escribiendo...`;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            userStatus.textContent = 'online';
        }, 1000);
    }
});

socket.on('stop typing', (username) => {
    userStatus.textContent = 'online';
});

function updateUserStatus(username, status) {
    if (username === userUsername.textContent) {
        userStatus.textContent = status;
    }
}

// Función para reproducir sonido de notificación
function playNotificationSound() {
    const audio = new Audio('notification.mp3'); // Reemplazar con la ruta de tu archivo de sonido
    audio.play();
}
