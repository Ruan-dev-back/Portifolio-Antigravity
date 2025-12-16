import './style.css';

// TYPEWRITER (Mantendo a do passo anterior)
class TypeWriterSimple {
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.speed = 50;
    this.queue = [];
  }

  typeString(htmlString) {
    const regex = /(<[^>]+>)/g;
    const segments = htmlString.split(regex);
    this.queue = segments.filter(s => s !== "");
    return this;
  }

  start() {
    this.nextSegment();
  }

  nextSegment() {
    if (this.queue.length === 0) return;

    const segment = this.queue.shift();

    if (segment.startsWith('<') && segment.endsWith('>')) {
      this.element.innerHTML += segment;
      this.nextSegment();
    } else {
      this.typeText(segment, 0);
    }
  }

  typeText(text, index) {
    if (index < text.length) {
      this.element.innerHTML += text.charAt(index);
      setTimeout(() => this.typeText(text, index + 1), this.speed);
    } else {
      this.nextSegment();
    }
  }
}

// CHATBOT LOGIC
class ChatBot {
  constructor() {
    this.widget = document.getElementById('chat-widget');
    if (!this.widget) return;

    this.toggleBtn = document.getElementById('chat-toggle-btn');
    this.closeBtn = document.getElementById('chat-close-btn');
    this.chatWindow = document.getElementById('chat-window');
    this.messagesContainer = document.getElementById('chat-messages');
    this.input = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send-btn');

    this.isOpen = false;
    this.apiUrl = 'http://localhost:3000/api/chat';

    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.toggleChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Initial greeting
    setTimeout(() => {
      // Only add greeting if empty
      if (this.messagesContainer && this.messagesContainer.children.length === 0) {
        this.addMessage("Olá! Sou a IA do Ruan. Pergunte sobre meus projetos ou habilidades.", 'ai');
      }
    }, 1000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chatWindow.classList.remove('hidden');
      this.input.focus();
    } else {
      this.chatWindow.classList.add('hidden');
    }
  }

  async sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    // Add user message
    this.addMessage(text, 'user');
    this.input.value = '';

    // Show loading
    const loadingId = this.addLoadingIndicator();

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();

      // Remove loading
      this.removeLoadingIndicator(loadingId);

      if (data.reply) {
        this.addMessage(data.reply, 'ai');
      } else {
        this.addMessage("Desculpe, não consegui processar sua mensagem.", 'ai');
      }
    } catch (error) {
      this.removeLoadingIndicator(loadingId);
      this.addMessage("Erro de conexão com o servidor. (Certifique-se que o backend está rodando)", 'ai');
      console.error(error);
    }
  }

  addMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.classList.add('message', sender);
    bubble.textContent = text; // Safer than innerHTML
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
  }

  addLoadingIndicator() {
    const id = 'loading-' + Date.now();
    const bubble = document.createElement('div');
    bubble.classList.add('message', 'ai');
    bubble.id = id;
    bubble.textContent = 'Digitando...';
    this.messagesContainer.appendChild(bubble);
    this.scrollToBottom();
    return id;
  }

  removeLoadingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
}

// Inicialização Unificada
function initProtfolio() {
  // Init TypeWriter
  new TypeWriterSimple('#typing-text')
    .typeString('Entusiasta de <strong>IA</strong> | Focado em Engenharia de Prompt e <span style="color: #bd93f9">Agentes Autônomos</span>')
    .start();

  // Init Chatbot
  new ChatBot();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProtfolio);
} else {
  initProtfolio();
}