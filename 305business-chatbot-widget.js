// 305business.llc AI Chatbot Widget v1.0
// Multi-language: EN/ES/RU/HT
// Configurable: Set BIZ305_CONFIG.apiKey before loading

(function() {
  'use strict';

  const DEFAULT_CONFIG = {
    apiKey: '',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    model: 'gemini-1.5-flash',
    siteName: '305business',
    primaryColor: '#FF6B35',
    secondaryColor: '#1E90FF',
    position: 'bottom-right',
    welcomeMessage: {
      en: "Hi! I'm 305business AI Assistant. I can help you buy or sell a Miami business, connect with brokers, or answer questions about our marketplace. How can I help?",
      es: "¡Hola! Soy el Asistente AI de 305business. Puedo ayudarte a comprar o vender un negocio en Miami, conectar con corredores, o responder preguntas sobre nuestro marketplace. ¿Cómo puedo ayudarte?",
      ru: "Здравствуйте! Я ИИ-помощник 305business. Я могу помочь вам купить или продать бизнес в Майами, связаться с брокерами или ответить на вопросы о нашей торговой площадке. Чем могу помочь?",
      ht: "Bonjou! Mwen se Asistan AI 305business. Mwen ka ede w achte oswa vann yon biznis nan Miami, konekte ak kourtye, oswa reponn kesyon sou marketplace nou an. Kijan mwen ka ede w?"
    },
    bookingUrl: 'https://305business.llc/list-business',
    voiceEnabled: true,
    languages: ['en', 'es', 'ru', 'ht'],
    knowledgeBase: {
      en: `You are 305business.llc's AI Assistant. 305business is Miami's premier business marketplace connecting buyers and sellers of businesses.

Key facts:
- Miami's #1 business marketplace for buying and selling businesses
- Categories: restaurants, retail, services, healthcare practices, tech companies, franchises
- Services: business valuation, broker matching, legal support, financial forecasting, pitch decks
- Free to list a business for sale
- Buyer resources: due diligence guides, financing options, broker connections
- Seller resources: valuation tools, marketing packages, confidential listings
- Coverage: Miami-Dade, Broward, Palm Beach, and throughout South Florida
- Contact: info@305business.llc

Always be professional, helpful, and encourage users to schedule a consultation for detailed valuations or legal matters.`,
      es: `Eres el Asistente AI de 305business.llc. 305business es el marketplace de negocios #1 de Miami que conecta compradores y vendedores de negocios.

Datos clave:
- El marketplace #1 de Miami para comprar y vender negocios
- Categorías: restaurantes, retail, servicios, consultorios de salud, empresas tech, franquicias
- Servicios: valuación de negocios, conexión con corredores, soporte legal, pronósticos financieros, pitch decks
- Gratis para publicar un negocio en venta
- Recursos para compradores: guías de due diligence, opciones de financiamiento, conexiones con corredores
- Recursos para vendedores: herramientas de valuación, paquetes de marketing, listados confidenciales
- Cobertura: Miami-Dade, Broward, Palm Beach y todo el sur de Florida
- Contacto: info@305business.llc

Sé profesional, servicial, y anima a los usuarios a agendar una consulta para valuaciones detalladas o asuntos legales.`,
      ru: `Вы — ИИ-помощник 305business.llc. 305business — ведущая торговая площадка бизнеса в Майами, соединяющая покупателей и продавцов бизнеса.

Ключевые факты:
- Торговая площадка №1 в Майами для покупки и продажи бизнеса
- Категории: рестораны, розничная торговля, услуги, медицинские практики, технологические компании, франшизы
- Услуги: оценка бизнеса, подбор брокеров, юридическая поддержка, финансовое прогнозирование, инвестиционные презентации
- Бесплатная публикация бизнеса на продажу
- Ресурсы для покупателей: руководства по due diligence, варианты финансирования, связи с брокерами
- Ресурсы для продавцов: инструменты оценки, маркетинговые пакеты, конфиденциальные объявления
- Охват: округа Майами-Дейд, Броуард, Палм-Бич и весь Южная Флорида
- Контакт: info@305business.llc

Всегда будьте профессиональны, услужливы и предлагайте пользователям записаться на консультацию для подробных оценок или юридических вопросов.`,
      ht: `Ou se Asistan AI 305business.llc. 305business se marketplace biznis prensipal Miami ki konekte achtè ak vandè biznis.

Fè kle:
- Marketplace #1 nan Miami pou achte ak vann biznis
- Kategori: restoran, detay, sèvis, pratik swen sante, konpayi teknoloji, franchiz
- Sèvis: evalyasyon biznis, korespondans kourtye, sipò legal, previzyon finansye, pitch decks
- Gratis pou lis yon biznis pou vann
- Resous pou achtè: gid due diligence, opsyon finansman, koneksyon kourtye
- Resous pou vandè: zouti evalyasyon, pakè maketing, lis konfidansyèl
- Kouvri: Miami-Dade, Broward, Palm Beach, ak tout Sid Florid
- Kontak: info@305business.llc

Toujou pwofesyonèl, ede, ankouraje itilizatè pou yo pwograme yon konsiltasyon pou evalyasyon detaye oswa zafè legal.`
    }
  };

  const CONFIG = window.BIZ305_CONFIG || DEFAULT_CONFIG;
  let isOpen = false;
  let isVoiceMode = false;
  let currentLang = 'en';
  let messages = [];
  let recognition = null;
  let synth = window.speechSynthesis;

  const styles = document.createElement('style');
  styles.textContent = `
    .biz305-widget-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', -apple-system, sans-serif; }
    .biz305-toggle-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #FF6B35, #1E90FF); border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(255,107,53,0.3); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; color: white; font-size: 24px; }
    .biz305-toggle-btn:hover { transform: scale(1.05); box-shadow: 0 6px 30px rgba(255,107,53,0.4); }
    .biz305-chat-window { position: absolute; bottom: 70px; right: 0; width: 360px; max-height: 500px; background: rgba(26,74,122,0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; overflow: hidden; display: none; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .biz305-chat-window.active { display: flex; }
    .biz305-header { padding: 16px 20px; background: linear-gradient(135deg, rgba(255,107,53,0.2), transparent); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
    .biz305-header-info { display: flex; align-items: center; gap: 10px; }
    .biz305-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #FF6B35, #1E90FF); display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .biz305-header-text h3 { margin: 0; color: white; font-size: 14px; font-weight: 600; }
    .biz305-header-text span { color: rgba(255,255,255,0.5); font-size: 11px; }
    .biz305-controls { display: flex; gap: 8px; }
    .biz305-control-btn { width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; }
    .biz305-control-btn:hover { background: rgba(255,255,255,0.2); }
    .biz305-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .biz305-message { max-width: 80%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.5; word-wrap: break-word; }
    .biz305-message.user { align-self: flex-end; background: rgba(255,107,53,0.25); color: white; border-bottom-right-radius: 4px; }
    .biz305-message.bot { align-self: flex-start; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-bottom-left-radius: 4px; }
    .biz305-message.bot a { color: #FF6B35; text-decoration: none; }
    .biz305-input-area { padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px; align-items: center; }
    .biz305-input { flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 8px 14px; color: white; font-size: 13px; outline: none; }
    .biz305-input::placeholder { color: rgba(255,255,255,0.4); }
    .biz305-send-btn { width: 32px; height: 32px; border-radius: 50%; background: #FF6B35; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .biz305-send-btn:hover { background: #FF6B35dd; }
    .biz305-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .biz305-voice-indicator { display: none; align-items: center; gap: 8px; padding: 8px 16px; color: #FF6B35; font-size: 12px; }
    .biz305-voice-indicator.active { display: flex; }
    .biz305-typing-indicator { display: none; padding: 8px 16px; color: rgba(255,255,255,0.5); font-size: 12px; font-style: italic; }
    .biz305-typing-indicator.active { display: block; }
    .biz305-booking-cta { padding: 10px 16px; background: linear-gradient(135deg, rgba(30,144,255,0.2), transparent); border-top: 1px solid rgba(255,255,255,0.1); text-align: center; }
    .biz305-booking-cta a { color: #1E90FF; text-decoration: none; font-size: 12px; font-weight: 500; }
    .biz305-voice-wave { display: flex; align-items: center; gap: 2px; height: 20px; }
    .biz305-voice-bar { width: 3px; background: #FF6B35; border-radius: 2px; animation: biz305Wave 0.5s ease-in-out infinite alternate; }
    @keyframes biz305Wave { 0% { height: 4px; } 100% { height: 16px; } }
    @media (max-width: 480px) { .biz305-chat-window { width: calc(100vw - 40px); right: -10px; } }
  `;
  document.head.appendChild(styles);

  const widget = document.createElement('div');
  widget.className = 'biz305-widget-container';
  widget.innerHTML = `
    <div class="biz305-chat-window" id="biz305-chat-window">
      <div class="biz305-header">
        <div class="biz305-header-info">
          <div class="biz305-avatar">🏢</div>
          <div class="biz305-header-text">
            <h3>305business AI</h3>
            <span id="biz305-status">Online</span>
          </div>
        </div>
        <div class="biz305-controls">
          <button class="biz305-control-btn" id="biz305-lang-btn" title="Switch language">EN</button>
          <button class="biz305-control-btn" id="biz305-voice-btn" title="Voice mode">🎙️</button>
          <button class="biz305-control-btn" id="biz305-close-btn" title="Close">✕</button>
        </div>
      </div>
      <div class="biz305-messages" id="biz305-messages"></div>
      <div class="biz305-typing-indicator" id="biz305-typing">AI is thinking...</div>
      <div class="biz305-voice-indicator" id="biz305-voice-indicator">
        <div class="biz305-voice-wave">
          <div class="biz305-voice-bar" style="animation-delay: 0s"></div>
          <div class="biz305-voice-bar" style="animation-delay: 0.1s"></div>
          <div class="biz305-voice-bar" style="animation-delay: 0.2s"></div>
          <div class="biz305-voice-bar" style="animation-delay: 0.3s"></div>
          <div class="biz305-voice-bar" style="animation-delay: 0.4s"></div>
        </div>
        <span>Listening...</span>
      </div>
      <div class="biz305-input-area">
        <input type="text" class="biz305-input" id="biz305-input" placeholder="Ask about buying or selling..." />
        <button class="biz305-send-btn" id="biz305-send-btn">➤</button>
      </div>
      <div class="biz305-booking-cta">
        <a href="${CONFIG.bookingUrl}" target="_blank">📋 List Your Business →</a>
      </div>
    </div>
    <button class="biz305-toggle-btn" id="biz305-toggle-btn">💬</button>
  `;
  document.body.appendChild(widget);

  const chatWindow = document.getElementById('biz305-chat-window');
  const toggleBtn = document.getElementById('biz305-toggle-btn');
  const closeBtn = document.getElementById('biz305-close-btn');
  const sendBtn = document.getElementById('biz305-send-btn');
  const input = document.getElementById('biz305-input');
  const messagesContainer = document.getElementById('biz305-messages');
  const typingIndicator = document.getElementById('biz305-typing');
  const voiceIndicator = document.getElementById('biz305-voice-indicator');
  const voiceBtn = document.getElementById('biz305-voice-btn');
  const langBtn = document.getElementById('biz305-lang-btn');

  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('active', isOpen);
    toggleBtn.textContent = isOpen ? '✕' : '💬';
    if (isOpen && messages.length === 0) {
      addMessage('bot', CONFIG.welcomeMessage[currentLang]);
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWindow.classList.remove('active');
    toggleBtn.textContent = '💬';
  });

  const LANG_CYCLE = ['en', 'es', 'ru', 'ht'];
  langBtn.addEventListener('click', () => {
    const idx = LANG_CYCLE.indexOf(currentLang);
    currentLang = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    langBtn.textContent = currentLang.toUpperCase();
    messagesContainer.innerHTML = '';
    messages = [];
    addMessage('bot', CONFIG.welcomeMessage[currentLang]);
  });

  voiceBtn.addEventListener('click', () => {
    if (!CONFIG.voiceEnabled) { alert('Voice mode not enabled'); return; }
    isVoiceMode = !isVoiceMode;
    voiceBtn.style.background = isVoiceMode ? CONFIG.primaryColor + '40' : '';
    if (isVoiceMode) startVoiceInput(); else stopVoiceInput();
  });

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    showTyping(true);
    callAI(text).then(response => {
      showTyping(false);
      addMessage('bot', response);
      if (isVoiceMode) speak(response);
    }).catch(err => {
      showTyping(false);
      const errorMsgs = {
        en: "I'm having trouble connecting. Please try again or contact us at info@305business.llc",
        es: "Estoy teniendo problemas de conexión. Por favor intenta de nuevo o contáctanos en info@305business.llc",
        ru: "У меня проблемы с подключением. Пожалуйста, попробуйте еще раз или свяжитесь с нами по адресу info@305business.llc",
        ht: "Mwen gen pwoblèm koneksyon. Tanpri eseye ankò oswa kontakte nou nan info@305business.llc"
      };
      addMessage('bot', errorMsgs[currentLang] || errorMsgs.en);
      console.error('Chatbot error:', err);
    });
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `biz305-message ${sender}`;
    msgDiv.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    messagesContainer.appendChild(msgDiv);
    messages.push({ sender, text });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping(show) {
    typingIndicator.classList.toggle('active', show);
    sendBtn.disabled = show;
  }

  async function callAI(userMessage) {
    if (!CONFIG.apiKey) return getFallbackResponse(userMessage);
    try {
      const systemPrompt = CONFIG.knowledgeBase[currentLang];
      const contents = [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + userMessage }] }];
      const response = await fetch(`${CONFIG.apiEndpoint}?key=${CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error('Unexpected response');
    } catch (err) {
      return getFallbackResponse(userMessage);
    }
  }

  function getFallbackResponse(input) {
    const text = input.toLowerCase();
    const kb = {
      en: {
        greeting: "Hello! Welcome to 305business.llc. I can help you buy or sell a Miami business, connect with brokers, or answer marketplace questions. What would you like to know?",
        buy: "305business connects you with verified business listings in Miami. Browse restaurants, retail, healthcare practices, tech companies, and more. All listings include financials and broker contact info.",
        sell: "Listing your business on 305business is free. We offer valuation tools, confidential marketing, and broker matching to help you find the right buyer in Miami-Dade, Broward, and Palm Beach.",
        broker: "305business has a network of verified business brokers specializing in Miami-area transactions. We can match you with the right broker based on your industry and business size.",
        valuation: "We offer professional business valuation services. Typical turnaround is 3-5 business days. Pricing depends on business complexity. Schedule a consultation for a custom quote.",
        legal: "305business provides legal support resources including contract templates, due diligence checklists, and connections to Miami business attorneys. Visit 305business.llc/legal-support.",
        price: "Listing a business is free. Valuation services and broker fees vary. Most broker commissions are 8-12% of sale price. Contact us for detailed pricing.",
        contact: "Reach us at info@305business.llc or through our contact page. We're here to help Miami business owners and buyers connect.",
        location: "305business serves Miami-Dade, Broward, Palm Beach, and all of South Florida. Our marketplace focuses on businesses in the 305 and surrounding areas.",
        default: "That's a great question. For detailed information about buying or selling a Miami business, please visit 305business.llc or contact us at info@305business.llc."
      },
      es: {
        greeting: "¡Hola! Bienvenido a 305business.llc. Puedo ayudarte a comprar o vender un negocio en Miami, conectar con corredores, o responder preguntas sobre nuestro marketplace. ¿Qué te gustaría saber?",
        buy: "305business te conecta con listados de negocios verificados en Miami. Explora restaurantes, retail, consultorios de salud, empresas tech y más. Todos los listados incluyen financieros e información de contacto del corredor.",
        sell: "Publicar tu negocio en 305business es gratis. Ofrecemos herramientas de valuación, marketing confidencial y conexión con corredores para ayudarte a encontrar el comprador adecuado en Miami-Dade, Broward y Palm Beach.",
        broker: "305business tiene una red de corredores de negocios verificados especializados en transacciones del área de Miami. Podemos conectarte con el corredor adecuado según tu industria y tamaño del negocio.",
        valuation: "Ofrecemos servicios profesionales de valuación de negocios. El tiempo típico es de 3-5 días hábiles. Los precios dependen de la complejidad del negocio. Agenda una consulta para una cotización personalizada.",
        legal: "305business proporciona recursos de soporte legal incluyendo plantillas de contratos, listas de verificación de due diligence y conexiones con abogados de negocios en Miami. Visita 305business.llc/legal-support.",
        price: "Publicar un negocio es gratis. Los servicios de valuación y honorarios de corredores varían. La mayoría de las comisiones de corredores son del 8-12% del precio de venta. Contáctanos para precios detallados.",
        contact: "Escríbenos a info@305business.llc o a través de nuestra página de contacto. Estamos aquí para ayudar a dueños de negocios y compradores de Miami a conectar.",
        location: "305business sirve a Miami-Dade, Broward, Palm Beach y todo el sur de Florida. Nuestro marketplace se enfoca en negocios del 305 y áreas circundantes.",
        default: "Esa es una excelente pregunta. Para información detallada sobre comprar o vender un negocio en Miami, visita 305business.llc o contáctanos en info@305business.llc."
      },
      ru: {
        greeting: "Здравствуйте! Добро пожаловать в 305business.llc. Я могу помочь вам купить или продать бизнес в Майами, связаться с брокерами или ответить на вопросы о нашей торговой площадке. Что бы вы хотели узнать?",
        buy: "305business соединяет вас с проверенными объявлениями о бизнесе в Майами. Исследуйте рестораны, розничную торговлю, медицинские практики, технологические компании и многое другое. Все объявления включают финансовую информацию и контакты брокеров.",
        sell: "Размещение вашего бизнеса на 305business бесплатно. Мы предлагаем инструменты оценки, конфиденциальный маркетинг и подбор брокеров, чтобы помочь вам найти подходящего покупателя в округах Майами-Дейд, Броуард и Палм-Бич.",
        broker: "305business имеет сеть проверенных бизнес-брокеров, специализирующихся на сделках в районе Майами. Мы можем подобрать вам подходящего брокера на основе вашей отрасли и размера бизнеса.",
        valuation: "Мы предлагаем профессиональные услуги по оценке бизнеса. Типичное время выполнения — 3-5 рабочих дней. Цены зависят от сложности бизнеса. Запишитесь на консультацию для индивидуального расчета.",
        legal: "305business предоставляет ресурсы юридической поддержки, включая шаблоны контрактов, контрольные списки due diligence и связи с бизнес-юристами Майами. Посетите 305business.llc/legal-support.",
        price: "Размещение бизнеса бесплатно. Услуги оценки и комиссии брокеров варьируются. Большинство комиссий брокеров составляют 8-12% от цены продажи. Свяжитесь с нами для подробной информации о ценах.",
        contact: "Свяжитесь с нами по адресу info@305business.llc или через нашу страницу контактов. Мы здесь, чтобы помочь владельцам бизнеса и покупателям Майами найти друг друга.",
        location: "305business обслуживает округа Майами-Дейд, Броуард, Палм-Бич и весь Южная Флорида. Наша торговая площадка фокусируется на бизнесе в районе 305 и окрестностях.",
        default: "Отличный вопрос. Для подробной информации о покупке или продаже бизнеса в Майами, пожалуйста, посетите 305business.llc или свяжитесь с нами по адресу info@305business.llc."
      },
      ht: {
        greeting: "Bonjou! Byenveni nan 305business.llc. Mwen ka ede w achte oswa vann yon biznis nan Miami, konekte ak kourtye, oswa reponn kesyon sou marketplace nou an. Ki sa ou ta renmen konnen?",
        buy: "305business konekte w ak lis biznis verifye nan Miami. Eksplore restoran, detay, pratik swen sante, konpayi teknoloji, ak plis. Tout lis yo gen enfòmasyon finansye ak enfòmasyon kontak kourtye.",
        sell: "Lis biznis ou sou 305business se gratis. Nou ofri zouti evalyasyon, maketing konfidansyèl ak korespondans kourtye pou ede w jwenn bon achtè nan Miami-Dade, Broward, ak Palm Beach.",
        broker: "305business gen yon rezo kourtye biznis verifye ki espesyalize nan tranzaksyon zòn Miami. Nou ka matche w ak bon kourtye ki baze sou endistri ou an ak gwosè biznis ou an.",
        valuation: "Nou ofri sèvis evalyasyon biznis pwofesyonèl. Tan tipik se 3-5 jou travay. Pri yo depann de konpleksite biznis la. Pwograme yon konsiltasyon pou yon devis pèsonalize.",
        legal: "305business bay resous sipò legal ki gen ladan modèl kontra, lis tcheke due diligence ak koneksyon ak avoka biznis Miami. Vizite 305business.llc/legal-support.",
        price: "Lis yon biznis se gratis. Sèvis evalyasyon ak frais kourtye varye. Pifò komisyon kourtye se 8-12% nan pri vann. Kontakte nou pou pri detaye.",
        contact: "Kontakte nou nan info@305business.llc oswa nan paj kontak nou an. Nou isit la pou ede pwopriyetè biznis ak achtè Miami konekte.",
        location: "305business sèvi Miami-Dade, Broward, Palm Beach, ak tout Sid Florid. Marketplace nou an konsantre sou biznis nan 305 ak zòn ki ozalantou.",
        default: "Sa se yon gwo kesyon. Pou enfòmasyon detaye sou achte oswa vann yon biznis nan Miami, tanpri vizite 305business.llc oswa kontakte nou nan info@305business.llc."
      }
    };

    const lang = kb[currentLang];
    if (text.match(/hi|hello|hey|hola|buenas|здравствуй|привет|bonjou|salut/)) return lang.greeting;
    if (text.match(/buy|purchase|acquire|comprar|adquirir|купить|achte/)) return lang.buy;
    if (text.match(/sell|listing|vender|продать|vann/)) return lang.sell;
    if (text.match(/broker|agent|corredor|брокер|kourtye/)) return lang.broker;
    if (text.match(/valuation|worth|value|valuación|стоимость|evalyasyon/)) return lang.valuation;
    if (text.match(/legal|contract|lawyer|legal|юрист|legal/)) return lang.legal;
    if (text.match(/price|cost|pricing|precio|цена|pri|koute/)) return lang.price;
    if (text.match(/contact|email|call|llamar|контакт|kontak|rele/)) return lang.contact;
    if (text.match(/location|where|miami|florida|address|место|ki kote|adrès/)) return lang.location;
    return lang.default;
  }

  function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported. Try Chrome or Edge.');
      isVoiceMode = false;
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = currentLang === 'es' ? 'es-ES' : currentLang === 'ru' ? 'ru-RU' : currentLang === 'ht' ? 'ht-HT' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => { voiceIndicator.classList.add('active'); };
    recognition.onresult = (event) => {
      input.value = event.results[0][0].transcript;
      sendMessage();
    };
    recognition.onerror = () => { voiceIndicator.classList.remove('active'); };
    recognition.onend = () => {
      voiceIndicator.classList.remove('active');
      if (isVoiceMode) setTimeout(() => { if (isVoiceMode) recognition.start(); }, 500);
    };
    recognition.start();
  }

  function stopVoiceInput() {
    if (recognition) { recognition.stop(); recognition = null; }
    voiceIndicator.classList.remove('active');
  }

  function speak(text) {
    if (!synth) return;
    const cleanText = text.replace(/<[^>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'es' ? 'es-ES' : currentLang === 'ru' ? 'ru-RU' : currentLang === 'ht' ? 'ht-HT' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  }

  window.BIZ305_CHATBOT = {
    open: () => toggleBtn.click(),
    close: () => { if (isOpen) toggleBtn.click(); },
    send: (text) => { if (!isOpen) toggleBtn.click(); input.value = text; sendMessage(); },
    setLanguage: (lang) => { if (CONFIG.languages.includes(lang)) { currentLang = lang; langBtn.textContent = lang.toUpperCase(); } }
  };

  console.log('[305business Chatbot] Loaded. Set API key: window.BIZ305_CONFIG.apiKey = "your-key"');
})();
