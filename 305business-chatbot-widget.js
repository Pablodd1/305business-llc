// 305business.llc AI Smart Front Desk Chatbot v2.0
// Multi-language: EN/ES/RU/HT
// Smart front desk: routes users, answers site questions, guides buyers/sellers
// Trained on full site content, trending heatmap, agentic features, and services

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
      en: "🏢 Welcome to 305business! I'm your Smart Front Desk AI. I can help you:\n\n• Find and buy a Miami business\n• List your business for sale\n• Get a valuation or broker match\n• Navigate our marketplace features\n• Answer questions about selling/buying\n\nWhat brings you here today?",
      es: "🏢 ¡Bienvenido a 305business! Soy tu AI Recepcionista Inteligente. Puedo ayudarte a:\n\n• Encontrar y comprar un negocio en Miami\n• Publicar tu negocio en venta\n• Obtener valuación o corredor\n• Navegar nuestro marketplace\n• Responder preguntas sobre compra/venta\n\n¿Qué te trae por aquí hoy?",
      ru: "🏢 Добро пожаловать в 305business! Я ваш умный ИИ-ассистент. Я могу помочь вам:\n\n• Найти и купить бизнес в Майами\n• Разместить ваш бизнес на продажу\n• Получить оценку или подобрать брокера\n• Ориентироваться на нашей торговой площадке\n• Ответить на вопросы о покупке/продаже\n\nЧто привело вас сюда сегодня?",
      ht: "🏢 Byenveni nan 305business! Mwen se AI Resepsyonist entelijan ou a. Mwen ka ede w:\n\n• Jwenn ak achte yon biznis nan Miami\n• Lis biznis ou pou vann\n• Jwenn evalyasyon oswa kourtye\n• Navige marketplace nou an\n• Reponn kesyon sou vann/achte\n\nKi sa ki mennen ou isit jodi a?"
    },
    bookingUrl: 'https://305business.llc/list-business',
    voiceEnabled: true,
    languages: ['en', 'es', 'ru', 'ht'],
    knowledgeBase: {
      en: buildKnowledgeBase('en'),
      es: buildKnowledgeBase('es'),
      ru: buildKnowledgeBase('ru'),
      ht: buildKnowledgeBase('ht')
    }
  };

  function buildKnowledgeBase(lang) {
    const bases = {
      en: `You are 305business.llc's Smart Front Desk AI. You are trained on the FULL website content and act as an intelligent receptionist that guides users.

=== SITE NAVIGATION & PAGES ===
• Home (index.html): Main marketplace with trending heatmap, featured listings, AI matching, stock ticker, live activity feed
• Search: Use the hero search bar or category filters (tech, restaurant, retail, healthcare, hospitality)
• Trending Heatmap (SHEET: H-1): Shows businesses with most views/clicks. Red = HOT, Orange = WARM, Yellow = TRENDING. Auto-refreshes every 60 seconds. Real-time buyer interest signals.
• Featured Listings (SHEET: A-1): All active business listings with filters. Each card shows views, inquiries, price, revenue, location, features
• AI Matching: Input budget, industry, location → AI finds matching businesses with match scores
• How It Works: SEARCH → CONNECT → CONNECT → CLOSE (4-step process)
• Services: Business Valuation ($495), Financial Forecasting ($895), Investor Pitch Deck ($695)
• Broker Portal: For registered brokers to manage listings
• Contact: Submit inquiry form with entity name, email, phone, business type, revenue range, message
• Legal Support: NDA templates, contract guides, due diligence checklists
• Valuation Page: Professional business valuation service
• Booking: Free 30-min consultation via Google Meet

=== TRENDING HEATMAP FEATURES ===
• Heat Score Formula: views + (inquiries × 3) + featured bonus
• Heat Levels: HOT (score ≥50, red, pulsing), WARM (score ≥20, orange), TRENDING (score ≥5, yellow), NORMAL (default)
• Clicks are tracked via /api/track-click and increment view counts
• Heatmap auto-refreshes every 60 seconds
• Social proof: "Getting serious buyer attention", "Rising interest", "Steady views", "New listing"

=== AGENTIC WEBSITE CAPABILITIES ===
• Self-Optimizing SEO: Auto-adjusts meta titles, descriptions, CTAs based on user behavior
• A/B Testing: Tests headline and CTA variants automatically
• Dynamic Keywords: Adapts content priority based on search trends
• Schema.org Injection: Organization, LocalBusiness, Service, FAQPage, HowTo structured data
• AI Search Optimization: Optimized for Google AI Overviews, ChatGPT, Perplexity, Claude
• Content Freshness: Tracks and alerts when content needs updating
• Performance Monitoring: Core Web Vitals, page speed alerts
• Conversion Tracking: Tracks listing submissions, buyer inquiries, broker matches, valuation requests
• Analytics: Google Analytics 4 integration, custom event tracking
• Multi-language: English, Spanish, Russian, Haitian Creole

=== SMART FRONT DESK ROUTING ===
When a user asks something, detect their intent and route them:
• "I want to buy" → Guide to search, trending heatmap, AI matching. Suggest browsing #listings
• "I want to sell" → Guide to list-business page, valuation service, broker portal. Suggest free listing
• "How much is my business worth?" → Guide to valuation service ($495). Explain process.
• "Find me a broker" → Guide to broker portal. Explain matching process.
• "How does this work?" → Explain 4-step process. Link to #how-it-works
• "I need legal help" → Guide to legal-support page, NDA templates, contract guides
• "What's trending?" → Explain heatmap, guide to #trending section
• "Contact someone" → Provide contact info, suggest booking consultation
• "Services" → List all services with pricing
• "AI features" → Explain agentic website, chatbot, AI matching, SEO engine

=== BUYER GUIDE ===
1. Browse trending heatmap (#trending) for hot deals
2. Search by category, budget, location
3. Use AI Matching for personalized recommendations
4. Click "View Details" on any listing → business-detail.html
5. Request info or contact seller directly
6. Sign NDA, schedule video call, negotiate terms
7. Close deal with admin verification

=== SELLER GUIDE ===
1. List your business for FREE at list-business.html
2. Get professional valuation ($495) for accurate pricing
3. Upgrade to featured listing for more visibility
4. Track views and inquiries in real-time (heatmap)
5. Connect with matched buyers via secure chat
6. Use our legal resources (NDA, contracts)
7. Close with broker support

=== CONTACT INFO ===
• Email: info@305business.llc
• Phone: +1-786-643-2099
• Location: Miami, FL
• WhatsApp: +1 786-643-2099
• Telegram: https://t.me/28729102e2163caa3555992f580e1013
• Booking: https://oem-flex-spots-poll.trycloudflare.com/?company=305business
• Instagram: @305business
• Facebook: 305business

=== PRICING ===
• List business: FREE
• Business Valuation: $495
• Financial Forecasting: $895
• Investor Pitch Deck: $695
• Broker commission: typically 8-12% of sale price

Always be professional, helpful, and specific. Reference page names, section IDs, and actual URLs. Guide users to take action.`,

      es: `Eres el AI Recepcionista Inteligente de 305business.llc. Estás entrenado en TODO el contenido del sitio y actúas como recepcionista inteligente que guía a los usuarios.

=== NAVEGACIÓN DEL SITIO Y PÁGINAS ===
• Inicio: Marketplace principal con heatmap trending, listados destacados, matching AI, ticker de acciones, feed de actividad en vivo
• Búsqueda: Usa la barra de búsqueda o filtros de categoría (tech, restaurante, retail, salud, hotelería)
• Heatmap Trending (SHEET: H-1): Muestra negocios con más vistas/clics. Rojo = HOT, Naranja = WARM, Amarillo = TRENDING. Se actualiza cada 60 segundos.
• Listados Destacados (SHEET: A-1): Todos los listados activos con filtros. Cada tarjeta muestra vistas, consultas, precio, ingresos, ubicación, características
• Matching AI: Ingresa presupuesto, industria, ubicación → AI encuentra negocios con scores de coincidencia
• Cómo Funciona: BUSCAR → CONECTAR → CONECTAR → CERRAR
• Servicios: Valuación ($495), Pronósticos Financieros ($895), Pitch Deck ($695)
• Portal de Corredores: Para corredores registrados
• Contacto: Formulario de consulta
• Soporte Legal: Plantillas NDA, guías de contratos, checklists de due diligence
• Valuación: Servicio profesional de valuación de negocios
• Reserva: Consulta gratuita de 30 minutos

=== TRENDING HEATMAP ===
• Fórmula: vistas + (consultas × 3) + bono destacado
• Niveles: HOT (≥50, rojo, pulsante), WARM (≥20, naranja), TRENDING (≥5, amarillo)
• Clics trackeados vía /api/track-click
• Se actualiza cada 60 segundos
• Prueba social: "Atención seria de compradores", "Interés creciente", "Vistas constantes", "Nuevo listado"

=== CAPACIDADES AGENTIC ===
• SEO auto-optimizante: Ajusta metas, descripciones, CTAs según comportamiento
• A/B Testing: Prueba variantes automáticamente
• Schema.org: Organization, LocalBusiness, Service, FAQPage
• Optimización AI Search: Google AI Overviews, ChatGPT, Perplexity, Claude
• Multi-idioma: Inglés, Español, Ruso, Criollo Haitiano
• Tracking de conversiones: Envíos, consultas, matches, valuaciones

=== RUTEO INTELIGENTE ===
• "Quiero comprar" → Guía a búsqueda, heatmap, matching AI. Sugerir #listings
• "Quiero vender" → Guía a list-business, valuación, portal de corredores. Gratis.
• "Cuánto vale mi negocio?" → Guía a valuación ($495). Explicar proceso.
• "Busco corredor" → Guía a broker portal. Explicar matching.
• "Cómo funciona?" → Explicar proceso de 4 pasos. Link a #how-it-works
• "Ayuda legal" → Guía a legal-support, plantillas NDA
• "Qué está en tendencia?" → Explicar heatmap, guía a #trending
• "Contacto" → Info de contacto, sugerir reserva
• "Servicios" → Lista con precios
• "AI features" → Explicar agentic, chatbot, matching, SEO

=== GUÍA DEL COMPRADOR ===
1. Explorar heatmap trending (#trending) para ofertas calientes
2. Buscar por categoría, presupuesto, ubicación
3. Usar Matching AI para recomendaciones personalizadas
4. Clic "Ver Detalles" → business-detail.html
5. Solicitar info o contactar vendedor
6. Firmar NDA, agendar videollamada, negociar
7. Cerrar con verificación de admin

=== GUÍA DEL VENDEDOR ===
1. Listar negocio GRATIS en list-business.html
2. Obtener valuación profesional ($495)
3. Actualizar a listado destacado para más visibilidad
4. Trackear vistas y consultas en tiempo real (heatmap)
5. Conectar con compradores via chat seguro
6. Usar recursos legales (NDA, contratos)
7. Cerrar con soporte de corredor

=== CONTACTO ===
• Email: info@305business.llc
• Teléfono: +1-786-643-2099
• WhatsApp: +1 786-643-2099
• Reserva: https://oem-flex-spots-poll.trycloudflare.com/?company=305business
• Instagram: @305business

=== PRECIOS ===
• Listar negocio: GRATIS
• Valuación: $495
• Pronósticos Financieros: $895
• Pitch Deck: $695
• Comisión corredor: típicamente 8-12% del precio de venta

Sé profesional, servicial y específico. Referencia nombres de páginas, IDs de sección y URLs reales. Guía a los usuarios a la acción.`,

      ru: `Вы — умный ИИ-ассистент 305business.llc. Вы обучены на ПОЛНОМ содержимом сайта и действуете как интеллектуальный ресепшнист, который направляет пользователей.

=== НАВИГАЦИЯ ПО САЙТУ ===
• Главная: Основной маркетплейс с тепловой картой, избранными листингами, AI-подбором, тикером акций, лентой активности
• Поиск: Строка поиска или фильтры по категориям (tech, ресторан, retail, здравоохранение, отели)
• Тепловая карта (SHEET: H-1): Показывает бизнес с наибольшими просмотрами/кликами. Красный = HOT, Оранжевый = WARM, Желтый = TRENDING. Обновляется каждые 60 секунд.
• Избранные листинги (SHEET: A-1): Все активные листинги с фильтрами. Каждая карточка показывает просмотры, запросы, цену, выручку, локацию, фичи
• AI-подбор: Введите бюджет, индустрию, локацию → AI находит подходящий бизнес с score совпадения
• Как это работает: ПОИСК → СВЯЗЬ → СВЯЗЬ → ЗАКРЫТИЕ
• Услуги: Оценка бизнеса ($495), Финансовое прогнозирование ($895), Pitch Deck ($695)
• Портал брокеров: Для зарегистрированных брокеров
• Контакт: Форма запроса
• Юридическая поддержка: NDA шаблоны, гиды по контрактам, чеклисты due diligence
• Оценка: Профессиональная оценка бизнеса
• Бронирование: Бесплатная 30-минутная консультация

=== ТЕПЛОВАЯ КАРТА ===
• Формула: просмотры + (запросы × 3) + бонус избранного
• Уровни: HOT (≥50, красный, пульсирующий), WARM (≥20, оранжевый), TRENDING (≥5, желтый)
• Клики трекаются через /api/track-click
• Обновляется каждые 60 секунд
• Социальное доказательство: "Серьезное внимание покупателей", "Растущий интерес", "Стабильные просмотры", "Новый листинг"

=== AGENTIC ВОЗМОЖНОСТИ ===
• Самооптимизирующийся SEO: Авто-настройка мета, описаний, CTA по поведению
• A/B Testing: Автоматическое тестирование вариантов
• Schema.org: Organization, LocalBusiness, Service, FAQPage
• AI Search Optimization: Google AI Overviews, ChatGPT, Perplexity, Claude
• Мультиязычность: Английский, Испанский, Русский, Гаитянский креольский
• Трекинг конверсий: Отправки, запросы, матчи, оценки

=== УМНЫЙ РОУТИНГ ===
• "Хочу купить" → Поиск, тепловая карта, AI-подбор. #listings
• "Хочу продать" → list-business, оценка, портал брокеров. Бесплатно.
• "Сколько стоит мой бизнес?" → Оценка ($495). Объяснить процесс.
• "Ищу брокера" → Портал брокеров. Объяснить matching.
• "Как работает?" → Объяснить 4 шага. #how-it-works
• "Юридическая помощь" → legal-support, NDA шаблоны
• "Что в тренде?" → Объяснить heatmap, #trending
• "Контакт" → Контактная информация, предложить бронирование
• "Услуги" → Список с ценами
• "AI возможности" → Объяснить agentic, чатбот, matching, SEO

=== ГИД ПОКУПАТЕЛЯ ===
1. Изучить тепловую карту (#trending) для горячих предложений
2. Поиск по категории, бюджету, локации
3. AI-подбор для персональных рекомендаций
4. Клик "Подробнее" → business-detail.html
5. Запросить информацию или связаться с продавцом
6. Подписать NDA, назначить видеозвонок, договариваться
7. Закрыть с верификацией админа

=== ГИД ПРОДАВЦА ===
1. Бесплатный листинг на list-business.html
2. Профессиональная оценка ($495)
3. Апгрейд до избранного для видимости
4. Трекинг просмотров и запросов в реальном времени (heatmap)
5. Связь с покупателями через безопасный чат
6. Использование юридических ресурсов (NDA, контракты)
7. Закрытие с поддержкой брокера

=== КОНТАКТЫ ===
• Email: info@305business.llc
• Телефон: +1-786-643-2099
• WhatsApp: +1 786-643-2099
• Бронирование: https://oem-flex-spots-poll.trycloudflare.com/?company=305business
• Instagram: @305business

=== ЦЕНЫ ===
• Листинг: БЕСПЛАТНО
• Оценка: $495
• Финансовое прогнозирование: $895
• Pitch Deck: $695
• Комиссия брокера: обычно 8-12% от цены продажи

Будь профессионален, полезен и конкретен. Ссылайся на реальные страницы, секции и URL. Направляй пользователей к действию.`,

      ht: `Ou se AI Resepsyonist entelijan 305business.llc. Ou antrene sou TOUT kontni sit la epi ou aji tankou yon resepsyonist entelijan ki gide itilizatè yo.

=== NAVIGASYON SIT AK PAJ ===
• Akèy: Marketplace prensipal ak heatmap trending, lis ki enpòtan, matching AI, ticker aksyon, feed aktivite an tan reyèl
• Rechèch: Itilize bar rechèch la oswa filtè kategori (tech, restoran, retail, swen sante, otèl)
• Heatmap Trending (SHEET: H-1): Montre biznis ak plis vi/klike. Wouj = HOT, Orange = WARM, Jòn = TRENDING. Aktualize chak 60 segonn.
• Lis ki Enpòtan (SHEET: A-1): Tout lis aktif ak filtè. Chak kat montre vi, demand, pri, revni, lokasyon, karakteristik
• Matching AI: Antre bidjè, endistri, lokasyon → AI jwenn biznis ak match scores
• Kijan Li Fonksyone: SEARCH → CONNECT → CONNECT → CLOSE
• Sèvis: Evalyasyon Biznis ($495), Previzyon Finansye ($895), Pitch Deck ($695)
• Pòtay Kourtye: Pou kourtye ki anrejistre
• Kontak: Fòm soumisyon
• Sipò Legal: Modèl NDA, gid kontra, lis tcheke due diligence
• Evalyasyon: Sèvis pwofesyonèl evalyasyon biznis
• Rezèvasyon: Konsiltasyon gratis 30 minit

=== TRENDING HEATMAP ===
• Fòmil: vi + (demann × 3) + bonis ki enpòtan
• Nivo: HOT (≥50, wouj, ki bat), WARM (≥20, orange), TRENDING (≥5, jòn)
• Klike trake atravè /api/track-click
• Aktualize chak 60 segonn
• Prèv sosyal: "Atansyon serye achtè", "Enterè ki ap monte", "Vi konstan", "Nouvo lis"

=== KAPASITE AGENTIC ===
• SEO ki auto-optimize: Ajiste meta, deskripsyon, CTA dapre konpòtman
• A/B Testing: Tès varyan otomatikman
• Schema.org: Organization, LocalBusiness, Service, FAQPage
• AI Search Optimization: Google AI Overviews, ChatGPT, Perplexity, Claude
• Multi-lang: Anglè, Panyòl, Ris, Kreyòl Ayisyen
• Trake konvèsyon: Soumisyon, demand, matches, evalyasyon

=== RUTAJ ENTELIJAN ===
• "Mwen vle achte" → Gide rechèch, heatmap, matching AI. #listings
• "Mwen vle vann" → Gide list-business, evalyasyon, pòtay kourtye. Gratis.
• "Konbyen biznis mwen vo?" → Gide evalyasyon ($495). Eksplike pwosesis.
• "Mwen chache kourtye" → Gide pòtay kourtye. Eksplike matching.
• "Kijan li fonksyone?" → Eksplike pwosesis 4 etap. #how-it-works
• "Èd legal" → Gide legal-support, modèl NDA
• "Kisa ki nan tandans?" → Eksplike heatmap, #trending
• "Kontak" → Enfòmasyon kontak, sijere rezèvasyon
• "Sèvis" → Lis ak pri
• "AI kapasite" → Eksplike agentic, chatbot, matching, SEO

=== GID ACHTÈ ===
1. Eksplore heatmap trending (#trending) pou ofr cho
2. Rechèch pa kategori, bidjè, lokasyon
3. Itilize Matching AI pou rekòmandasyon pèsonalize
4. Klike "Gade Detay" → business-detail.html
5. Mande enfòmasyon oswa kontakte vandè
6. Siyen NDA, pwograme videyo, negosye
7. Fèmen ak verifikasyon admin

=== GID VANDÈ ===
1. Lis biznis GRATIS sou list-business.html
2. Jwenn evalyasyon pwofesyonèl ($495)
3. Aktualize pou plis vizibilite
4. Trake vi ak demand an tan reyèl (heatmap)
5. Konekte ak achtè atravè chat sekirite
6. Itilize resous legal (NDA, kontra)
7. Fèmen ak sipò kourtye

=== KONTAK ===
• Email: info@305business.llc
• Telefòn: +1-786-643-2099
• WhatsApp: +1 786-643-2099
• Rezèvasyon: https://oem-flex-spots-poll.trycloudflare.com/?company=305business
• Instagram: @305business

=== PRI ===
• Lis biznis: GRATIS
• Evalyasyon: $495
• Previzyon Finansye: $895
• Pitch Deck: $695
• Komisyon kourtye: tipikman 8-12% nan pri vann

Toujou pwofesyonèl, ede, espesifik. Referans non paj, ID seksyon, ak URL reyèl. Gide itilizatè yo pou aksyon.`
    };
    return bases[lang];
  }

  // Merge configs: HTML overrides specific fields, but keeps DEFAULT knowledge base
  const userConfig = window.BIZ305_CONFIG || {};
  const CONFIG = Object.assign({}, DEFAULT_CONFIG, userConfig);
  // Ensure knowledge base is preserved if not explicitly provided by user
  if (!userConfig.knowledgeBase) {
    CONFIG.knowledgeBase = DEFAULT_CONFIG.knowledgeBase;
  }
  // Ensure welcome messages are preserved if not explicitly provided by user
  if (!userConfig.welcomeMessage) {
    CONFIG.welcomeMessage = DEFAULT_CONFIG.welcomeMessage;
  }
  let isOpen = false;
  let isVoiceMode = false;
  let currentLang = 'en';
  let messages = [];
  let recognition = null;
  let synth = window.speechSynthesis;

  // Inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    .biz305-widget-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', -apple-system, sans-serif; }
    .biz305-toggle-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #FF6B35, #1E90FF); border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(255,107,53,0.3); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; color: white; font-size: 24px; }
    .biz305-toggle-btn:hover { transform: scale(1.05); box-shadow: 0 6px 30px rgba(255,107,53,0.4); }
    .biz305-chat-window { position: absolute; bottom: 70px; right: 0; width: 380px; max-height: 550px; background: rgba(26,74,122,0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; overflow: hidden; display: none; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
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
    .biz305-message { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.5; word-wrap: break-word; }
    .biz305-message.user { align-self: flex-end; background: rgba(255,107,53,0.25); color: white; border-bottom-right-radius: 4px; }
    .biz305-message.bot { align-self: flex-start; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.9); border-bottom-left-radius: 4px; }
    .biz305-message.bot a { color: #FF6B35; text-decoration: none; }
    .biz305-message.bot a:hover { text-decoration: underline; }
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
    .biz305-action-btn { display: inline-block; padding: 6px 12px; margin: 4px 4px 0 0; border: 1px solid rgba(255,107,53,0.4); border-radius: 12px; background: rgba(255,107,53,0.1); color: #FF6B35; font-size: 11px; cursor: pointer; transition: all 0.2s; }
    .biz305-action-btn:hover { background: rgba(255,107,53,0.2); }
    .biz305-smart-route { display: flex; align-items: center; gap: 6px; padding: 8px 12px; margin-top: 8px; background: rgba(30,144,255,0.1); border: 1px solid rgba(30,144,255,0.3); border-radius: 8px; font-size: 12px; color: #1E90FF; }
    .biz305-smart-route a { color: #1E90FF; text-decoration: none; font-weight: 600; }
    .biz305-smart-route a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(styles);

  // Build widget
  const widget = document.createElement('div');
  widget.className = 'biz305-widget-container';
  widget.innerHTML = `
    <div class="biz305-chat-window" id="biz305-chat-window">
      <div class="biz305-header">
        <div class="biz305-header-info">
          <div class="biz305-avatar">🤖</div>
          <div class="biz305-header-text">
            <h3>305business Smart Desk</h3>
            <span id="biz305-status">Online • AI Front Desk</span>
          </div>
        </div>
        <div class="biz305-controls">
          <button class="biz305-control-btn" id="biz305-lang-btn" title="Switch language">EN</button>
          <button class="biz305-control-btn" id="biz305-voice-btn" title="Voice mode">🎙️</button>
          <button class="biz305-control-btn" id="biz305-close-btn" title="Close">✕</button>
        </div>
      </div>
      <div class="biz305-messages" id="biz305-messages"></div>
      <div class="biz305-typing-indicator" id="biz305-typing">AI is analyzing...</div>
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
        <input type="text" class="biz305-input" id="biz305-input" placeholder="Ask me anything about 305business..." />
        <button class="biz305-send-btn" id="biz305-send-btn">➤</button>
      </div>
      <div class="biz305-booking-cta">
        <a href="${CONFIG.bookingUrl}" target="_blank">📋 List Your Business Free →</a>
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

  // Toggle chat
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.classList.toggle('active', isOpen);
    toggleBtn.textContent = isOpen ? '✕' : '💬';
    if (isOpen && messages.length === 0) {
      addMessage('bot', CONFIG.welcomeMessage[currentLang]);
      // Add quick action buttons
      addQuickActions();
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWindow.classList.remove('active');
    toggleBtn.textContent = '💬';
  });

  // Language toggle
  const LANG_CYCLE = ['en', 'es', 'ru', 'ht'];
  langBtn.addEventListener('click', () => {
    const idx = LANG_CYCLE.indexOf(currentLang);
    currentLang = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
    langBtn.textContent = currentLang.toUpperCase();
    messagesContainer.innerHTML = '';
    messages = [];
    addMessage('bot', CONFIG.welcomeMessage[currentLang]);
    addQuickActions();
  });

  // Voice toggle
  voiceBtn.addEventListener('click', () => {
    if (!CONFIG.voiceEnabled) { alert('Voice mode not enabled'); return; }
    isVoiceMode = !isVoiceMode;
    voiceBtn.style.background = isVoiceMode ? CONFIG.primaryColor + '40' : '';
    if (isVoiceMode) startVoiceInput(); else stopVoiceInput();
  });

  // Send message
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    showTyping(true);
    
    // Detect intent and route
    const route = detectIntent(text);
    
    callAI(text).then(response => {
      showTyping(false);
      addMessage('bot', response);
      if (route) addSmartRoute(route);
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

  // Add message to chat
  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `biz305-message ${sender}`;
    msgDiv.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>').replace(/\n/g, '<br>');
    messagesContainer.appendChild(msgDiv);
    messages.push({ sender, text });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Add quick action buttons
  function addQuickActions() {
    const actions = {
      en: [
        { text: '🔍 Find a Business', action: 'I want to buy a business' },
        { text: '🏷️ Sell My Business', action: 'I want to sell my business' },
        { text: '🔥 What\'s Trending?', action: 'What is trending right now?' },
        { text: '💰 Get Valuation', action: 'How much is my business worth?' },
        { text: '📞 Book Consultation', action: 'I want to book a consultation' }
      ],
      es: [
        { text: '🔍 Encontrar Negocio', action: 'Quiero comprar un negocio' },
        { text: '🏷️ Vender Mi Negocio', action: 'Quiero vender mi negocio' },
        { text: '🔥 Qué está en Tendencia?', action: 'Qué está en tendencia ahora?' },
        { text: '💰 Obtener Valuación', action: 'Cuánto vale mi negocio?' },
        { text: '📞 Agendar Consulta', action: 'Quiero agendar una consulta' }
      ],
      ru: [
        { text: '🔍 Найти Бизнес', action: 'Хочу купить бизнес' },
        { text: '🏷️ Продать Бизнес', action: 'Хочу продать бизнес' },
        { text: '🔥 Что в Тренде?', action: 'Что сейчас в тренде?' },
        { text: '💰 Оценка Бизнеса', action: 'Сколько стоит мой бизнес?' },
        { text: '📞 Записаться', action: 'Хочу записаться на консультацию' }
      ],
      ht: [
        { text: '🔍 Jwenn Biznis', action: 'Mwen vle achte yon biznis' },
        { text: '🏷️ Vann Biznis Mwen', action: 'Mwen vle vann biznis mwen' },
        { text: '🔥 Kisa ki nan Tandans?', action: 'Kisa ki nan tandans kounye a?' },
        { text: '💰 Jwenn Evalyasyon', action: 'Konbyen biznis mwen vo?' },
        { text: '📞 Pwograme Konsiltasyon', action: 'Mwen vle pwograme yon konsiltasyon' }
      ]
    };
    const container = document.createElement('div');
    container.style.marginTop = '8px';
    (actions[currentLang] || actions.en).forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'biz305-action-btn';
      btn.textContent = a.text;
      btn.onclick = () => {
        input.value = a.action;
        sendMessage();
      };
      container.appendChild(btn);
    });
    messagesContainer.appendChild(container);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Smart intent detection and routing
  function detectIntent(text) {
    const t = text.toLowerCase();
    const routes = {
      en: {
        buy: { text: '👉 Browse trending listings and AI-matched businesses', url: 'https://305business.llc/#trending', action: 'View Trending' },
        sell: { text: '👉 List your business for FREE in 5 minutes', url: 'https://305business.llc/list-business', action: 'Start Listing' },
        valuation: { text: '👉 Get professional valuation ($495) — 3-5 day turnaround', url: 'https://305business.llc/valuation', action: 'Get Valuation' },
        broker: { text: '👉 Connect with verified Miami business brokers', url: 'https://305business.llc/broker-portal', action: 'Find Broker' },
        legal: { text: '👉 Download NDA templates and legal guides', url: 'https://305business.llc/legal-support', action: 'Legal Resources' },
        trending: { text: '👉 See what buyers are viewing right now', url: 'https://305business.llc/#trending', action: 'View Heatmap' },
        contact: { text: '👉 Book a free 30-min consultation', url: 'https://oem-flex-spots-poll.trycloudflare.com/?company=305business', action: 'Book Now' },
        booking: { text: '👉 Schedule your free consultation', url: 'https://oem-flex-spots-poll.trycloudflare.com/?company=305business', action: 'Book Now' },
        services: { text: '👉 Explore all business services and pricing', url: 'https://305business.llc/#services', action: 'View Services' },
        ai: { text: '👉 Learn about our AI-powered marketplace features', url: 'https://305business.llc/#matching', action: 'Explore AI' }
      }
    };
    const r = routes.en;
    if (t.match(/buy|purchase|acquire|find business|look for|search/)) return r.buy;
    if (t.match(/sell|list|vend|listing my|put up for sale/)) return r.sell;
    if (t.match(/valuation|worth|value|price|how much/)) return r.valuation;
    if (t.match(/broker|agent|corredor| intermediary/)) return r.broker;
    if (t.match(/legal|contract|lawyer|nda|attorney/)) return r.legal;
    if (t.match(/trending|hot|heatmap|popular|most viewed/)) return r.trending;
    if (t.match(/contact|call|email|reach|phone|booking|consultation|schedule|appointment/)) return r.contact;
    if (t.match(/service|pricing|cost|fee|package/)) return r.services;
    if (t.match(/ai|artificial|smart|agentic|automate|chatbot/)) return r.ai;
    return null;
  }

  // Add smart route suggestion
  function addSmartRoute(route) {
    const div = document.createElement('div');
    div.className = 'biz305-smart-route';
    div.innerHTML = `${route.text} <a href="${route.url}" target="_blank">${route.action} →</a>`;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Show/hide typing indicator
  function showTyping(show) {
    typingIndicator.classList.toggle('active', show);
    sendBtn.disabled = show;
  }

  // Call AI API
  async function callAI(userMessage) {
    if (!CONFIG.apiKey) return getSmartResponse(userMessage);
    try {
      const systemPrompt = CONFIG.knowledgeBase[currentLang] || CONFIG.knowledgeBase.en;
      const contents = [{ role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + userMessage }] }];
      const response = await fetch(`${CONFIG.apiEndpoint}?key=${CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
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
      return getSmartResponse(userMessage);
    }
  }

  // Smart fallback response with intent detection
  function getSmartResponse(input) {
    const text = input.toLowerCase();
    const kb = {
      en: {
        greeting: "👋 Hello! Welcome to 305business Smart Front Desk.\n\nI can help you:\n• 🏢 Buy a Miami business (browse #trending or #listings)\n• 🏷️ Sell your business (list for FREE at list-business.html)\n• 💰 Get a valuation ($495, 3-5 days)\n• 🤝 Find a broker (verified Miami network)\n• 📄 Access legal resources (NDA templates, contracts)\n• 🔥 Check trending deals (real-time heatmap)\n• 📞 Book a free consultation (30 min, Google Meet)\n\nWhat would you like to do?",
        buy: "🔍 **Ready to buy a Miami business?**\n\nHere's how:\n1. Check the **Trending Heatmap** (#trending) for hot deals buyers are viewing right now\n2. Browse **Featured Listings** (#listings) with filters by category, price, location\n3. Use **AI Matching** (#matching) — tell me your budget, industry, and preferred area\n4. Click any listing → view details → request info → sign NDA → schedule call\n\nAll listings include verified financials and broker contact info.\n\n👉 [View Trending Deals](https://305business.llc/#trending)",
        sell: "🏷️ **Ready to sell your Miami business?**\n\nIt's FREE to list! Here's the process:\n1. **List your business** at list-business.html (5 minutes)\n2. **Get a valuation** ($495) for accurate pricing — attracts serious buyers\n3. **Upgrade to featured** for top placement on the heatmap\n4. **Track interest** in real-time (views, inquiries, heat score)\n5. **Connect with buyers** via secure chat and video calls\n6. **Close with support** — NDA templates, broker matching, legal guides\n\nWe cover Miami-Dade, Broward, and Palm Beach.\n\n👉 [Start Your Free Listing](https://305business.llc/list-business)",
        valuation: "💰 **Business Valuation Service**\n\n• **Price:** $495 flat fee\n• **Turnaround:** 3-5 business days\n• **Includes:** Market analysis, financial review, comparable sales, final report\n• **Why it matters:** Accurate pricing attracts serious buyers faster\n• **Bonus:** Valuation clients get featured listing placement for 30 days\n\nThe valuation is conducted by our certified business analysts with Miami market expertise.\n\n👉 [Request Valuation](https://305business.llc/valuation)",
        broker: "🤝 **Broker Matching Service**\n\n305business has a verified network of Miami business brokers specializing in:\n• Restaurants & food service\n• Healthcare practices (dental, medical, chiropractic)\n• Retail & franchises\n• Tech startups & SaaS\n• Professional services\n\n**How matching works:**\n1. Submit your business details\n2. We match you with 2-3 brokers based on industry expertise\n3. Interview brokers, choose your fit\n4. Broker handles marketing, screening, negotiation, closing\n\nTypical broker commission: 8-12% of sale price\n\n👉 [Find a Broker](https://305business.llc/broker-portal)",
        legal: "📄 **Legal Support Resources**\n\n305business provides free and premium legal resources:\n\n**FREE:**\n• NDA template (buyer-seller confidentiality)\n• Due diligence checklist\n• Closing checklist\n• Contract review guide\n\n**PREMIUM (via partner attorneys):**\n• Purchase agreement drafting\n• Asset vs. stock sale structuring\n• Lease transfer negotiation\n• Licensing transfer assistance\n\nAll resources are Florida-specific and reviewed by Miami business attorneys.\n\n👉 [Access Legal Resources](https://305business.llc/legal-support)",
        price: "💵 **Pricing & Fees**\n\n| Service | Price |\n|---------|-------|\n| List a business | **FREE** |\n| Business Valuation | $495 |\n| Financial Forecasting (3-year) | $895 |\n| Investor Pitch Deck | $695 |\n| Broker Match | **FREE** |\n| Featured Listing (30 days) | $99 |\n| Legal Document Review | $250/hr |\n\n**Broker commissions:** Typically 8-12% of final sale price (paid by seller at closing)\n\nNo hidden fees. No monthly charges for basic listings.\n\n👉 [View All Services](https://305business.llc/#services)",
        contact: "📞 **Contact 305business**\n\n• **Email:** info@305business.llc\n• **Phone:** +1-786-643-2099\n• **WhatsApp:** +1 786-643-2099\n• **Telegram:** [Message us](https://t.me/28729102e2163caa3555992f580e1013)\n• **Instagram:** @305business\n• **Facebook:** 305business\n\n**Office Hours:** Mon-Fri 9AM-6PM EST\n**Platform:** Available 24/7\n\n**Book a FREE 30-minute consultation:**\n👉 [Schedule Now](https://oem-flex-spots-poll.trycloudflare.com/?company=305business)\n\nGoogle Meet link auto-generated. You'll get email confirmation + calendar invite.",
        location: "📍 **305business Coverage Area**\n\nWe serve all of South Florida:\n\n• **Miami-Dade County** — Miami, Miami Beach, Coral Gables, Doral, Aventura, Brickell, Wynwood, Little Havana, Kendall\n• **Broward County** — Fort Lauderdale, Hollywood, Pompano Beach, Plantation\n• **Palm Beach County** — West Palm Beach, Boca Raton, Palm Beach\n• **Also:** Monroe County (Key West), Collier County (Naples)\n\nOur marketplace focuses on businesses in the 305 area code and surrounding regions.\n\nWhether you're buying a restaurant on South Beach or selling a dental practice in Coral Gables, we've got you covered.",
        trending: "🔥 **Trending Heatmap — Real-Time Buyer Interest**\n\nThe heatmap shows which businesses are getting the most attention RIGHT NOW:\n\n• **🔴 HOT (red, pulsing):** Score ≥50 — Multiple inquiries, serious buyer interest\n• **🟠 WARM (orange):** Score ≥20 — Rising views, buyers actively exploring\n• **🟡 TRENDING (yellow):** Score ≥5 — Steady interest, worth watching\n\n**How it works:**\n• Every click and view is tracked in real-time\n• Heat score = views + (inquiries × 3) + featured bonus\n• Auto-refreshes every 60 seconds\n• Creates social proof — "If other buyers are interested, maybe I should look too"\n\n👉 [View Live Heatmap](https://305business.llc/#trending)",
        services: "🛠️ **All 305business Services**\n\n| Service | Price | What You Get |\n|---------|-------|-------------|\n| **Business Listing** | FREE | Standard listing on marketplace, visible to all buyers |\n| **Featured Listing** | $99/mo | Top placement, heatmap priority, homepage spotlight |\n| **Business Valuation** | $495 | Certified valuation report, market analysis, 3-5 days |\n| **Financial Forecasting** | $895 | 3-year financial model, projections, investor-ready |\n| **Investor Pitch Deck** | $695 | Custom-designed deck, 12-15 slides, professional design |\n| **Broker Matching** | FREE | Matched with 2-3 verified brokers, interview & choose |\n| **Legal Document Review** | $250/hr | Attorney-reviewed contracts, Florida-specific |\n| **NDA Templates** | FREE | Download ready-to-use confidentiality agreements |\n\n👉 [Explore Services](https://305business.llc/#services)",
        ai: "🤖 **AI-Powered Features**\n\n305business uses cutting-edge AI to make buying and selling easier:\n\n• **AI Matching** — Input your budget, industry, location → get personalized business recommendations with match scores\n• **Trending Heatmap** — Real-time buyer interest visualization, social proof for hot listings\n• **Smart Front Desk (this chatbot)** — Trained on full site content, guides buyers/sellers, answers questions in 4 languages\n• **Agentic SEO Engine** — Self-optimizing website that adapts meta titles, descriptions, and CTAs based on user behavior\n• **A/B Testing** — Automatically tests headline and CTA variants to maximize conversions\n• **AI Search Optimization** — Optimized for Google AI Overviews, ChatGPT, Perplexity, Claude\n• **Dynamic Content** — Freshness alerts, content priority scoring, structured data injection\n\n👉 [Try AI Matching](https://305business.llc/#matching)",
        default: "That's a great question. Let me connect you with the right resource.\n\nFor detailed help, you can:\n• 📞 **Book a free consultation** — [Schedule 30-min call](https://oem-flex-spots-poll.trycloudflare.com/?company=305business)\n• 📧 **Email us:** info@305business.llc\n• 🔍 **Browse listings:** [View marketplace](https://305business.llc/#listings)\n• 🔥 **Check trending deals:** [Live heatmap](https://305business.llc/#trending)\n\nWhat specific aspect would you like to explore?"
      }
    };

    const lang = kb[currentLang] || kb.en;
    if (text.match(/hi|hello|hey|hola|buenas|здравствуй|привет|bonjou|salut|welcome/)) return lang.greeting;
    if (text.match(/buy|purchase|acquire|comprar|adquirir|купить|achte/)) return lang.buy;
    if (text.match(/sell|listing|vender|продать|vann|list my/)) return lang.sell;
    if (text.match(/broker|agent|corredor|брокер|kourtye/)) return lang.broker;
    if (text.match(/valuation|worth|value|valuación|стоимость|evalyasyon|how much is my/)) return lang.valuation;
    if (text.match(/legal|contract|lawyer|attorney|юрист|legal/)) return lang.legal;
    if (text.match(/price|cost|pricing|precio|цена|pri|koute|fee/)) return lang.price;
    if (text.match(/contact|email|call|llamar|контакт|kontak|rele|phone|reach/)) return lang.contact;
    if (text.match(/location|where|miami|florida|address|место|ki kote|adrès|area/)) return lang.location;
    if (text.match(/trending|hot|heatmap|popular|most viewed|tendencia|тренд|tandans/)) return lang.trending;
    if (text.match(/service|services|offer|what do you do|pricing|package/)) return lang.services;
    if (text.match(/ai|artificial|smart|agentic|automate|chatbot|feature|technology/)) return lang.ai;
    return lang.default;
  }

  // Voice input
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

  // Text-to-speech
  function speak(text) {
    if (!synth) return;
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[\*👉\n]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang === 'es' ? 'es-ES' : currentLang === 'ru' ? 'ru-RU' : currentLang === 'ht' ? 'ht-HT' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  }

  // Public API
  window.BIZ305_CHATBOT = {
    open: () => toggleBtn.click(),
    close: () => { if (isOpen) toggleBtn.click(); },
    send: (text) => { if (!isOpen) toggleBtn.click(); input.value = text; sendMessage(); },
    setLanguage: (lang) => { if (CONFIG.languages.includes(lang)) { currentLang = lang; langBtn.textContent = lang.toUpperCase(); } }
  };

  console.log('[305business Smart Front Desk] Loaded v2.0. Set API key: window.BIZ305_CONFIG.apiKey = "your-key"');
  console.log('[305business Smart Front Desk] Features: Smart routing, intent detection, trending heatmap knowledge, agentic SEO info, multi-language, voice mode');
})();
