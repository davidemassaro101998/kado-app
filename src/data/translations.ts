export type Language = "en" | "it" | "es" | "fr" | "de";

export interface Translations {
  // Header
  savedDates: string;
  selectLanguageRegion: string;
  language: string;
  storeRegion: string;
  regionNotice: string;

  // Home Screen
  heroTag: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  findGiftBtn: string;
  tag20Sec: string;
  tagDirectLinks: string;
  fastTrackPlaceholder: string;
  homeStep1Title: string;
  homeStep1Sub: string;
  homeStep2Title: string;
  homeStep2Sub: string;
  homeStep3Title: string;
  homeStep3Sub: string;
  orExactAmountLabel: string;
  customBudgetLabel: string;
  exactAmountPlaceholder: string;
  extraOptionsLabel: string;
  hasEverythingLabel: string;
  extraDetailsHomePlaceholder: string;
  showPerfectGiftsBtn: string;

  // Quiz Steps
  step0Tag: string;
  step0Title: string;
  step1Tag: string;
  step1Title: string;
  addCustomRecipient: string;
  recipientPlaceholder: string;
  addBtn: string;

  step2Tag: string;
  step2Title: string;
  additionalPreferencesTitle: string;
  additionalPreferencesOptional: string;
  prefPlaceholder: string;

  step3Tag: string;
  step3Title: string;
  inCurrency: string;

  step4Tag: string;
  step4Title: string;
  customVibeTitle: string;
  vibePlaceholder: string;

  // Calendar Planner
  calendarPlannerTitle: string;
  planEventBtn: string;
  quickPresets: string;
  upcomingEvents: string;
  noEventsPlanned: string;
  planNewEvent: string;
  findGiftForEvent: string;
  daysRemaining: string;

  // Buttons
  next: string;
  skip: string;
  done: string;
  back: string;
  cancel: string;
  save: string;
  close: string;
  delete: string;

  // Loading
  curating: string;
  curatingSub: string;
  loadingStep1: string;
  loadingStep2: string;
  loadingStep3: string;

  // Results
  curatedSelection: string;
  forRecipient: string;
  startOver: string;
  viewOnStore: string;
  shareWhatsApp: string;
  saveDate: string;
  optionOf: string;
  newSearchBtn: string;
  previousLabel: string;
  nextLabel: string;
  ourPickLabel: string;
  whyPerfectLabel: string;
  seeInStoreBtn: string;
  addToCartBtn: string;
  copiedOpenedLabel: string;
  copyTicketLabel: string;
  moreIdeasBtn: string;
  remindNextYearBtn: string;
  reminderNamePlaceholder: string;
  reminderSavedMsg: string;
  wsGreetingTemplate: string;

  // Modals
  saveEventDate: string;
  personsName: string;
  eventDateWheel: string;
  notesBookmark: string;
  saveToReminders: string;
  noSavedDates: string;
  namePlaceholder: string;
  notesPlaceholder: string;

  // AI Concierge & Voice
  aiConciergeBtn: string;
  aiVoiceTitle: string;
  aiVoiceSubtitle: string;
  talkToAiPill1: string;
  talkToAiPill2: string;
  talkToAiPill3: string;
  chatPlaceholder: string;
  listening: string;
  viewDeckBtn: string;
  voiceListeningHint: string;
  voiceTapToSpeakHint: string;
  voiceTranscriptLabel: string;
  voiceTranscriptPlaceholder: string;
  voiceNotSupported: string;
  voiceMicDenied: string;
  voiceFindGiftBtn: string;

  // Settings Drawer
  settingsTitle: string;
  interactionSection: string;
  hapticFeedbackLabel: string;
  permissionsSection: string;
  micLabel: string;
  micStatusGranted: string;
  micStatusDenied: string;
  micStatusPrompt: string;
  micStatusUnknown: string;
  micBadgeOn: string;
  micBadgeBlocked: string;
  micEnableBtn: string;
  micBlockedHint: string;
  notificationsLabel: string;
  notifTestBtn: string;
  myOccasionsSection: string;
  noOccasionsText: string;
  legalSection: string;
  termsLabel: string;
  affiliateLabel: string;
  supportSection: string;
  sendFeedbackBtn: string;
  affiliateDisclaimerShort: string;

  // Legal Modal
  legalPrivacyTitle: string;
  legalTermsTitle: string;
  legalAffiliateTitle: string;
  legalPrivacyHeading: string;
  legalPrivacyItem1Title: string;
  legalPrivacyItem1Text: string;
  legalPrivacyItem2Title: string;
  legalPrivacyItem2Text: string;
  legalPrivacyItem3Title: string;
  legalPrivacyItem3Text: string;
  legalPrivacyItem4Title: string;
  legalPrivacyItem4Text: string;
  legalPrivacyItem5Title: string;
  legalPrivacyItem5Text: string;
  legalTermsHeading: string;
  legalTermsItem1Title: string;
  legalTermsItem1Text: string;
  legalTermsItem2Title: string;
  legalTermsItem2Text: string;
  legalTermsItem3Title: string;
  legalTermsItem3Text: string;
  legalTermsItem4Title: string;
  legalTermsItem4Text: string;
  legalAffiliateHeading: string;
  legalAffiliateQuote: string;
  legalAffiliateProgramText: string;
  legalAffiliatePriceDisclaimerTitle: string;
  legalAffiliatePriceDisclaimerText: string;

  // Cookie Banner
  cookieText: string;
  cookieAccept: string;

  // Error Boundary
  errorTitle: string;
  errorText: string;
  errorRestartBtn: string;

  // Offline Screen
  offlineTitle: string;
  offlineText: string;
  offlineChecking: string;
  offlineRetryBtn: string;

  // Security / PWA
  inAppBrowserHint: string;
  pwaInstallTitle: string;
  pwaInstallSubtitle: string;
  pwaInstallNowBtn: string;
  pwaAddHomeBtn: string;
  pwaFallbackAlert: string;
  iosGuideTitle: string;
  iosStep1Title: string;
  iosStep1Sub: string;
  iosStep2Title: string;
  iosStep2Sub: string;
  iosPressShareBelow: string;
  iosGotItBtn: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    savedDates: "Saved Dates",
    selectLanguageRegion: "Language & Region",
    language: "Language",
    storeRegion: "Store Region",
    regionNotice: "Gift links will open in your local store currency and region.",

    heroTag: "Ultra-Fast Gift Curation",
    heroTitleLine1: "The Right Gift.",
    heroTitleLine2: "Instantly.",
    heroSubtitle: "Solved in under 20 seconds. Thoughtful recommendations for everyone you care about.",
    findGiftBtn: "Find a Gift",
    tag20Sec: "20 Seconds",
    tagDirectLinks: "Direct Store Links",
    fastTrackPlaceholder: "Have an idea or SOS? Speak or type...",
    homeStep1Title: "Who is the gift for?",
    homeStep1Sub: "Select recipient to customize",
    homeStep2Title: "What vibe does it have?",
    homeStep2Sub: "Choose the main style or interest",
    homeStep3Title: "Budget & Style",
    homeStep3Sub: "Set your preferred price range",
    orExactAmountLabel: "Or exact amount:",
    customBudgetLabel: "Custom",
    exactAmountPlaceholder: "Exact amount (e.g. 18)",
    extraOptionsLabel: "EXTRA OPTIONS",
    hasEverythingLabel: "Has everything already (unique/consumables)",
    extraDetailsHomePlaceholder: "Extra details (optional)",
    showPerfectGiftsBtn: "SHOW PERFECT GIFTS",

    step0Tag: "STEP 1 OF 5 • EVENT DATE",
    step0Title: "When is the event?",
    step1Tag: "STEP 2 OF 5 • RECIPIENT",
    step1Title: "Who is this gift for?",
    addCustomRecipient: "Custom Recipient & Note",
    recipientPlaceholder: "e.g. Best friend Sarah who loves reading...",
    addBtn: "Add",

    step2Tag: "STEP 3 OF 5 • OCCASION",
    step2Title: "What is the occasion?",
    additionalPreferencesTitle: "Additional Preferences & Details",
    additionalPreferencesOptional: "Optional",
    prefPlaceholder: "e.g. Likes outdoor gear, prefers sustainable items...",

    step3Tag: "STEP 4 OF 5 • BUDGET",
    step3Title: "Choose a budget.",
    inCurrency: "In",

    step4Tag: "STEP 5 OF 5 • VIBE",
    step4Title: "Select their vibe.",
    customVibeTitle: "Custom Style, Hobbies & Interests Note",
    vibePlaceholder: "e.g. Photography, Specialty coffee, Espresso making...",

    calendarPlannerTitle: "Gift Calendar & Event Planner",
    planEventBtn: "Plan an Event",
    quickPresets: "Quick Presets",
    upcomingEvents: "Upcoming Planned Events",
    noEventsPlanned: "No events planned yet. Add a date to start planning gifts!",
    planNewEvent: "Plan New Event",
    findGiftForEvent: "Find Gift for this Event",
    daysRemaining: "days away",

    next: "Next",
    skip: "Skip",
    done: "Done",
    back: "Back",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    delete: "Delete",

    curating: "CURATING...",
    curatingSub: "Matching recipient preferences with premium store availability...",
    loadingStep1: "Analyzing recipient profile & vibe",
    loadingStep2: "Filtering top rated gifts across categories",
    loadingStep3: "Preparing direct store links & details",

    curatedSelection: "Curated Selection",
    forRecipient: "For",
    startOver: "Start Over",
    viewOnStore: "View on Store",
    shareWhatsApp: "Share on WhatsApp",
    saveDate: "Save Date",
    optionOf: "Option",
    newSearchBtn: "New Search",
    previousLabel: "Previous",
    nextLabel: "Next",
    ourPickLabel: "Our pick",
    whyPerfectLabel: "Why it's perfect:",
    seeInStoreBtn: "SEE IN STORE",
    addToCartBtn: "ADD TO CART",
    copiedOpenedLabel: "Copied & Opened!",
    copyTicketLabel: "Copy Ticket",
    moreIdeasBtn: "3 More Ideas",
    remindNextYearBtn: "Remind me again next year",
    reminderNamePlaceholder: "Name (optional)",
    reminderSavedMsg: "Reminder saved — we'll remind you.",
    wsGreetingTemplate: "Happy Birthday! 🎉 I found a special gift for you: {title} ({price})! Check it out: {link}",

    saveEventDate: "Save Event Date",
    personsName: "Person's Name",
    eventDateWheel: "Event Date (Tactile Wheel Picker)",
    notesBookmark: "Notes / Gift Bookmark",
    saveToReminders: "Save to Reminders",
    noSavedDates: "No saved dates yet.",
    namePlaceholder: "e.g. Alex",
    notesPlaceholder: "e.g. Ember Mug or Wireless Charger",

    aiConciergeBtn: "Talk to AI Voice Assistant",
    aiVoiceTitle: "Wrap AI Concierge",
    aiVoiceSubtitle: "Have an initial idea or want a voice-guided discovery?",
    talkToAiPill1: "💡 I already have an idea, help me refine it",
    talkToAiPill2: "🎙️ Ask me 3 questions to choose a gift",
    talkToAiPill3: "🎁 Recommend a gift for a coffee & tech lover under $60",
    chatPlaceholder: "Speak or type your thoughts...",
    listening: "Listening...",
    viewDeckBtn: "View Gifts in Interactive Deck",
    voiceListeningHint: "Listening... Speak freely",
    voiceTapToSpeakHint: "Tap microphone to speak",
    voiceTranscriptLabel: "Live Transcript / Idea:",
    voiceTranscriptPlaceholder: "E.g. Tech gift for dad who loves coffee under 50€...",
    voiceNotSupported: "Voice recognition not supported in browser. You can type your idea!",
    voiceMicDenied: "Microphone permission denied. You can type below.",
    voiceFindGiftBtn: "FIND GIFT NOW",

    settingsTitle: "Settings & App",
    interactionSection: "INTERACTION",
    hapticFeedbackLabel: "Haptic Feedback",
    permissionsSection: "PERMISSIONS & PRIVACY",
    micLabel: "Microphone (Voice Search)",
    micStatusGranted: "Permission granted",
    micStatusDenied: "Denied by browser",
    micStatusPrompt: "Not requested yet",
    micStatusUnknown: "Not checked yet",
    micBadgeOn: "On",
    micBadgeBlocked: "Blocked",
    micEnableBtn: "Enable Microphone Permission",
    micBlockedHint: "You've blocked the microphone for this site. Re-enable it from your browser's site settings (padlock icon in the address bar).",
    notificationsLabel: "PWA Reminder Notifications",
    notifTestBtn: "⚡ Send Test PWA Notification",
    myOccasionsSection: "MY OCCASIONS",
    noOccasionsText: "No saved occasions yet. After finding a gift, you can save the date to get a reminder.",
    legalSection: "LEGAL & COMPLIANCE",
    termsLabel: "Terms & Conditions",
    affiliateLabel: "Amazon Affiliate & Disclaimers",
    supportSection: "SUPPORT & INFO",
    sendFeedbackBtn: "Send Feedback",
    affiliateDisclaimerShort: "As an Amazon Associate, Kado AI earns from qualifying purchases.",

    legalPrivacyTitle: "Privacy Policy (GDPR EU)",
    legalTermsTitle: "Terms & Conditions",
    legalAffiliateTitle: "Amazon Affiliate & Disclaimers",
    legalPrivacyHeading: "Privacy Policy & Data Processing Notice (GDPR EU 2016/679)",
    legalPrivacyItem1Title: "1. Data Controller:",
    legalPrivacyItem1Text: "Kado AI operates in accordance with the principles of data minimization and confidentiality.",
    legalPrivacyItem2Title: "2. Types of Data Collected:",
    legalPrivacyItem2Text: "Kado AI does NOT collect, profile, or sell users' personal data. The app works entirely through technical local storage on the user's browser/device (localStorage) to save language, Amazon country, and calendar reminder settings.",
    legalPrivacyItem3Title: "3. Technical Cookies:",
    legalPrivacyItem3Text: "Only cookies and local storage strictly necessary for the applet's operation are used (PWA state, language preferences, reminders list). No advertising tracking or third-party profiling cookies are used.",
    legalPrivacyItem4Title: "4. Third-Party Services (Google Gemini AI & Amazon PA-API):",
    legalPrivacyItem4Text: "Gift recommendation processing happens server-side over encrypted HTTPS connections. No user identifier is ever transmitted to the AI models.",
    legalPrivacyItem5Title: "5. User Rights:",
    legalPrivacyItem5Text: "Users can delete their saved data at any time simply by clearing their browser cache or resetting the app's settings.",
    legalTermsHeading: "Terms & Conditions of Use",
    legalTermsItem1Title: "1. Nature of the Service:",
    legalTermsItem1Text: "Kado AI is an intelligent recommendation engine designed to suggest personalized gift ideas available on online stores such as Amazon.",
    legalTermsItem2Title: "2. Disclaimer:",
    legalTermsItem2Text: "Suggestions generated by the Artificial Intelligence are for informational and heuristic purposes only. Kado AI is not the direct seller of the recommended products.",
    legalTermsItem3Title: "3. External Purchases:",
    legalTermsItem3Text: "Purchases take place entirely on the official Amazon sites of the selected country. Users rely on the sales, warranty, and shipping conditions provided directly by Amazon.",
    legalTermsItem4Title: "4. Intellectual Property:",
    legalTermsItem4Text: "The design, code, and interface of Kado AI are protected by copyright. Amazon trademarks and product logos belong to their respective owners.",
    legalAffiliateHeading: "Amazon Affiliate Disclosure & Mandatory Disclaimers",
    legalAffiliateQuote: "\"As an Amazon Associate, Kado AI earns from qualifying purchases.\"",
    legalAffiliateProgramText: "Kado AI participates in the Amazon EU Associates Programme and the Amazon.com Associates Program, affiliate advertising programs designed to provide a means for sites to earn advertising fees by linking to Amazon.it, Amazon.com, and their respective international stores.",
    legalAffiliatePriceDisclaimerTitle: "Price & Availability Disclaimer:",
    legalAffiliatePriceDisclaimerText: "Product prices and availability are provided in real time by the Amazon PA-API and are subject to continuous change. The price and availability shown on the Amazon product page at the time of final purchase apply.",

    cookieText: "Kado AI uses technical cookies and affiliate services to recommend the perfect gifts. By continuing to use the app, you accept our Privacy Policy.",
    cookieAccept: "Accept",

    errorTitle: "Something went wrong",
    errorText: "No worries — your saved occasions are safe. Let's start fresh.",
    errorRestartBtn: "Start over",

    offlineTitle: "No Connection",
    offlineText: "Check your internet connection to continue searching for gifts.",
    offlineChecking: "CHECKING...",
    offlineRetryBtn: "RETRY",

    inAppBrowserHint: "For the best experience, open in Safari or Chrome",
    pwaInstallTitle: "Install App in 1 Tap",
    pwaInstallSubtitle: "Instant 1-tap access from your Home Screen without app stores.",
    pwaInstallNowBtn: "INSTALL NOW ON HOME",
    pwaAddHomeBtn: "ADD TO HOME SCREEN",
    pwaFallbackAlert: "To install the app, open your browser menu and select 'Add to Home Screen'.",
    iosGuideTitle: "Add to iOS Home Screen",
    iosStep1Title: "Tap the 'Share' button",
    iosStep1Sub: "Located in Safari bottom bar",
    iosStep2Title: "Select 'Add to Home Screen'",
    iosStep2Sub: "Scroll through options in the share sheet",
    iosPressShareBelow: "Press Share Below",
    iosGotItBtn: "GOT IT",
  },
  it: {
    savedDates: "Date Salvate",
    selectLanguageRegion: "Lingua e Regione",
    language: "Lingua",
    storeRegion: "Regione dello Store",
    regionNotice: "I link dei regali si apriranno nella tua valuta e store locale.",

    heroTag: "Curatela Regali Ultra-Veloce",
    heroTitleLine1: "Il Regalo Perfetto.",
    heroTitleLine2: "All'Istante.",
    heroSubtitle: "Trovato in meno di 20 secondi. Idee speciali e premurose per tutti le persone a cui tieni.",
    findGiftBtn: "Trova un Regalo",
    tag20Sec: "20 Secondi",
    tagDirectLinks: "Link Diretti allo Store",
    fastTrackPlaceholder: "Hai un'idea o SOS? Parla o scrivi...",
    homeStep1Title: "Per chi è il regalo?",
    homeStep1Sub: "Seleziona il destinatario per personalizzare",
    homeStep2Title: "Che vibe ha?",
    homeStep2Sub: "Scegli lo stile o l'interesse principale",
    homeStep3Title: "Budget e Stile",
    homeStep3Sub: "Imposta la fascia di prezzo desiderata",
    orExactAmountLabel: "Oppure cifra esatta:",
    customBudgetLabel: "Personalizzato",
    exactAmountPlaceholder: "Cifra esatta (es. 18)",
    extraOptionsLabel: "OPZIONI EXTRA",
    hasEverythingLabel: "Ha già tutto (idee uniche o consumabili)",
    extraDetailsHomePlaceholder: "Dettaglio extra (opzionale)",
    showPerfectGiftsBtn: "MOSTRA REGALI PERFETTI",

    step0Tag: "PASSAGGIO 1 DI 5 • DATA EVENTO",
    step0Title: "Quando è l'evento o la festa?",
    step1Tag: "PASSAGGIO 2 DI 5 • DESTINATARIO",
    step1Title: "Per chi è questo regalo?",
    addCustomRecipient: "Destinatario o Note Personalizzate",
    recipientPlaceholder: "es. La mia amica Sara che ama la lettura...",
    addBtn: "Aggiungi",

    step2Tag: "PASSAGGIO 3 DI 5 • OCCASIONE",
    step2Title: "Qual è l'occasione?",
    additionalPreferencesTitle: "Preferenze e Dettagli Aggiuntivi",
    additionalPreferencesOptional: "Opzionale",
    prefPlaceholder: "es. Ama l'aria aperta, preferisce materiali eco...",

    step3Tag: "PASSAGGIO 4 DI 5 • BUDGET",
    step3Title: "Scegli un budget.",
    inCurrency: "In",

    step4Tag: "PASSAGGIO 5 DI 5 • STILE",
    step4Title: "Seleziona il suo stile.",
    customVibeTitle: "Note su Hobby, Stile e Interessi",
    vibePlaceholder: "es. Fotografia, Caffè specialty, Tennis, Libri...",

    calendarPlannerTitle: "Calendario Eventi & Pianificatore Regali",
    planEventBtn: "Pianifica un Evento",
    quickPresets: "Scelta Rapida",
    upcomingEvents: "Prossimi Eventi Pianificati",
    noEventsPlanned: "Nessun evento pianificato. Aggiungi una data per iniziare a cercare i regali!",
    planNewEvent: "Pianifica Nuovo Evento",
    findGiftForEvent: "Trova Regalo per questo Evento",
    daysRemaining: "giorni rimasti",

    next: "Avanti",
    skip: "Salta",
    done: "Fatto",
    back: "Indietro",
    cancel: "Annulla",
    save: "Salva",
    close: "Chiudi",
    delete: "Elimina",

    curating: "CREAZIONE SELEZIONE...",
    curatingSub: "Ricerca dei migliori regali in corso per le preferenze indicate...",
    loadingStep1: "Analisi profilo destinatario e stile",
    loadingStep2: "Filtro dei regali più apprezzati per categoria",
    loadingStep3: "Preparazione link store e dettagli",

    curatedSelection: "Selezione Su Misura",
    forRecipient: "Per",
    startOver: "Ricomincia",
    viewOnStore: "Vedi sullo Store",
    shareWhatsApp: "Condividi su WhatsApp",
    saveDate: "Salva Data",
    optionOf: "Opzione",
    newSearchBtn: "Nuova Ricerca",
    previousLabel: "Precedente",
    nextLabel: "Successivo",
    ourPickLabel: "La nostra scelta",
    whyPerfectLabel: "Perché è perfetto:",
    seeInStoreBtn: "VEDI NELLO STORE",
    addToCartBtn: "METTI IN CARRELLO",
    copiedOpenedLabel: "Copiato & Aperto!",
    copyTicketLabel: "Copia Biglietto",
    moreIdeasBtn: "Altre 3 Idee",
    remindNextYearBtn: "Ricordamelo anche l'anno prossimo",
    reminderNamePlaceholder: "Nome (facoltativo)",
    reminderSavedMsg: "Promemoria salvato — te lo ricorderemo noi.",
    wsGreetingTemplate: "Tanti auguri! 🎉 Ho trovato un regalo speciale per te: {title} ({price})! Guarda qui su Amazon: {link}",

    saveEventDate: "Salva Data Evento",
    personsName: "Nome della Persona",
    eventDateWheel: "Data dell'Evento (Selettore a Ruota)",
    notesBookmark: "Note / Regalo Salvato",
    saveToReminders: "Salva nei Promemoria",
    noSavedDates: "Nessuna data salvata al momento.",
    namePlaceholder: "es. Marco",
    notesPlaceholder: "es. Tazza Ember o Caricatore Wireless",

    aiConciergeBtn: "Parla con l'Assistente Vocale AI",
    aiVoiceTitle: "Wrap AI Concierge",
    aiVoiceSubtitle: "Hai già un'idea o vuoi farti guidare a voce?",
    talkToAiPill1: "💡 Ho già un'idea, aiutami a perfezionarla",
    talkToAiPill2: "🎙️ Fammi 3 domande per scegliere un regalo",
    talkToAiPill3: "🎁 Consigliami un regalo per chi ama caffè e tecnologia sotto 60€",
    chatPlaceholder: "Parla o scrivi il tuo pensiero...",
    listening: "In ascolto...",
    viewDeckBtn: "Vedi i Regali nel Deck Interattivo",
    voiceListeningHint: "In ascolto... Parla liberamente",
    voiceTapToSpeakHint: "Tocca il microfono per parlare",
    voiceTranscriptLabel: "Trascrizione Live / Idea:",
    voiceTranscriptPlaceholder: "Es. Regalo tecnologico per papà appassionato di caffè sotto i 50€...",
    voiceNotSupported: "Riconoscimento vocale non supportato nel browser. Puoi digitare la tua idea!",
    voiceMicDenied: "Permesso microfono negato. Puoi digitare la tua idea qui sotto.",
    voiceFindGiftBtn: "TROVA REGALO ORA",

    settingsTitle: "Impostazioni & App",
    interactionSection: "INTERAZIONE",
    hapticFeedbackLabel: "Feedback Tattile (Vibrazione)",
    permissionsSection: "PERMESSI & PRIVACY",
    micLabel: "Microfono (Ricerca Vocale)",
    micStatusGranted: "Permesso concesso",
    micStatusDenied: "Permesso negato dal browser",
    micStatusPrompt: "Non ancora richiesto",
    micStatusUnknown: "Da verificare",
    micBadgeOn: "Attivo",
    micBadgeBlocked: "Bloccato",
    micEnableBtn: "Attiva Permesso Microfono",
    micBlockedHint: "Hai bloccato il microfono per questo sito. Riattivalo dalle impostazioni del browser (icona lucchetto nella barra indirizzo).",
    notificationsLabel: "Notifiche PWA Promemoria",
    notifTestBtn: "⚡ Invia Notifica di Prova PWA",
    myOccasionsSection: "LE MIE OCCASIONI",
    noOccasionsText: "Nessuna occasione salvata. Dopo aver trovato un regalo, potrai salvare la data per ricevere un promemoria.",
    legalSection: "LEGALE & COMPLIANCE",
    termsLabel: "Termini e Condizioni",
    affiliateLabel: "Affiliazione Amazon & Disclaimers",
    supportSection: "SUPPORTO & INFO",
    sendFeedbackBtn: "Invia un Feedback",
    affiliateDisclaimerShort: "In qualità di Affiliato Amazon, Kado AI riceve un guadagno dagli acquisti idonei.",

    legalPrivacyTitle: "Privacy Policy (GDPR EU)",
    legalTermsTitle: "Termini e Condizioni",
    legalAffiliateTitle: "Affiliazione Amazon & Disclaimers",
    legalPrivacyHeading: "Informativa sulla Privacy e Trattamento Dati (GDPR EU 2016/679)",
    legalPrivacyItem1Title: "1. Titolare del Trattamento:",
    legalPrivacyItem1Text: "Kado AI opera nel rispetto dei principi di minimizzazione dei dati e riservatezza.",
    legalPrivacyItem2Title: "2. Tipologia di Dati Raccolti:",
    legalPrivacyItem2Text: "Kado AI NON raccoglie, profila né vende dati personali degli utenti. L'applicazione funziona interamente tramite salvataggi locali tecnici nel browser/dispositivo dell'utente (localStorage) per memorizzare le impostazioni di lingua, paese Amazon e promemoria calendario.",
    legalPrivacyItem3Title: "3. Cookie Tecnici:",
    legalPrivacyItem3Text: "Vengono utilizzati esclusivamente cookie e archivi locali strettamente necessari per le funzionalità operative dell'applet (PWA state, preferenze lingua, lista promemoria). Non vengono impiegati cookie di tracciamento pubblicitario o profilazione di terze parti.",
    legalPrivacyItem4Title: "4. Servizi Terzi (Google Gemini AI & Amazon PA-API):",
    legalPrivacyItem4Text: "Le elaborazioni per la raccomandazione dei regali avvengono lato server tramite connessioni crittografate HTTPS. Nessun identificativo dell'utente viene trasmesso ai modelli AI.",
    legalPrivacyItem5Title: "5. Diritti dell'Utente:",
    legalPrivacyItem5Text: "L'utente può in qualsiasi momento cancellare i propri dati salvati semplicemente svuotando la cache del browser o ripristinando le impostazioni dell'app.",
    legalTermsHeading: "Termini e Condizioni di Utilizzo",
    legalTermsItem1Title: "1. Natura del Servizio:",
    legalTermsItem1Text: "Kado AI è un motore di raccomandazione intelligente sviluppato per suggerire idee regalo personalizzate reperibili su store online come Amazon.",
    legalTermsItem2Title: "2. Esclusione di Responsabilità:",
    legalTermsItem2Text: "I suggerimenti generati dall'Intelligenza Artificiale hanno scopo informativo ed euristico. Kado AI non è il venditore diretto dei prodotti consigliati.",
    legalTermsItem3Title: "3. Acquisti Esterni:",
    legalTermsItem3Text: "Gli acquisti avvengono interamente sui siti ufficiali Amazon del paese selezionato. L'utente si affida alle condizioni di vendita, garanzia e spedizione fornite direttamente da Amazon.",
    legalTermsItem4Title: "4. Proprietà Intellettuale:",
    legalTermsItem4Text: "Il design, il codice e l'interfaccia di Kado AI sono protetti da copyright. I marchi Amazon e i loghi dei prodotti appartengono ai rispettivi proprietari.",
    legalAffiliateHeading: "Dichiarazione di Affiliazione Amazon & Disclaimers Obbligatori",
    legalAffiliateQuote: "\"In qualità di Affiliato Amazon, Kado AI riceve un guadagno dagli acquisti idonei.\"",
    legalAffiliateProgramText: "Kado AI partecipa al Programma Affiliazione Amazon EU e Amazon Associates US, un programma di affiliazione progettato per fornire ai siti un mezzo per guadagnare commissioni pubblicitarie creando link verso Amazon.it, Amazon.com e i rispettivi store internazionali.",
    legalAffiliatePriceDisclaimerTitle: "Disclaimer Prezzi e Disponibilità:",
    legalAffiliatePriceDisclaimerText: "Prezzi e disponibilità dei prodotti sono forniti in tempo reale da Amazon PA-API e sono soggetti a variazioni continue. Fa fede il prezzo e la disponibilità mostrati sulla pagina prodotto di Amazon al momento dell'acquisto finale.",

    cookieText: "Kado AI utilizza cookie tecnici e servizi di affiliazione per consigliarti i regali perfetti. Continuando ad usare l'app accetti la nostra Privacy Policy.",
    cookieAccept: "Accetta",

    errorTitle: "Qualcosa è andato storto",
    errorText: "Nessun problema — le tue occasioni salvate sono al sicuro. Riprova a ripartire.",
    errorRestartBtn: "Ricomincia",

    offlineTitle: "Nessuna Connessione",
    offlineText: "Verifica la tua rete internet per continuare a cercare i regali.",
    offlineChecking: "VERIFICA IN CORSO...",
    offlineRetryBtn: "RIPROVA",

    inAppBrowserHint: "Per la migliore esperienza, apri in Safari o Chrome",
    pwaInstallTitle: "Installa l'App in 1 Tap",
    pwaInstallSubtitle: "Accedi all'istante dalla tua Schermata Home senza scaricare dagli store.",
    pwaInstallNowBtn: "INSTALLA SUBITO IN HOME",
    pwaAddHomeBtn: "AGGIUNGI A SCHERMATA HOME",
    pwaFallbackAlert: "Per installare l'app, usa il menu del tuo browser e seleziona 'Aggiungi a Schermata Home'.",
    iosGuideTitle: "Aggiungi a Home Screen iOS",
    iosStep1Title: "Tocca il tasto 'Condividi'",
    iosStep1Sub: "Si trova nella barra in basso di Safari",
    iosStep2Title: "Seleziona 'Aggiungi alla schermata Home'",
    iosStep2Sub: "Scorri le opzioni del menu di condivisione",
    iosPressShareBelow: "Premi Condividi Qui Sotto",
    iosGotItBtn: "HO CAPITO",
  },
  es: {
    savedDates: "Fechas Guardadas",
    selectLanguageRegion: "Idioma y Región",
    language: "Idioma",
    storeRegion: "Región de la Tienda",
    regionNotice: "Los enlaces de regalo se abrirán en la moneda y tienda de tu región.",

    heroTag: "Selección de Regalos Ultra-Rápida",
    heroTitleLine1: "El Regalo Perfecto.",
    heroTitleLine2: "Al Instante.",
    heroSubtitle: "Resuelto en menos de 20 segundos. Ideas cuidadas para todas las personas que te importan.",
    findGiftBtn: "Buscar un Regalo",
    tag20Sec: "20 Segundos",
    tagDirectLinks: "Enlaces Directos a la Tienda",
    fastTrackPlaceholder: "¿Tienes una idea o un SOS? Habla o escribe...",
    homeStep1Title: "¿Para quién es el regalo?",
    homeStep1Sub: "Selecciona el destinatario para personalizar",
    homeStep2Title: "¿Qué estilo tiene?",
    homeStep2Sub: "Elige el estilo o interés principal",
    homeStep3Title: "Presupuesto y Estilo",
    homeStep3Sub: "Establece el rango de precio deseado",
    orExactAmountLabel: "O importe exacto:",
    customBudgetLabel: "Personalizado",
    exactAmountPlaceholder: "Importe exacto (ej. 18)",
    extraOptionsLabel: "OPCIONES EXTRA",
    hasEverythingLabel: "Ya lo tiene todo (ideas únicas o consumibles)",
    extraDetailsHomePlaceholder: "Detalle extra (opcional)",
    showPerfectGiftsBtn: "MOSTRAR REGALOS PERFECTOS",

    step0Tag: "PASO 1 DE 5 • FECHA DEL EVENTO",
    step0Title: "¿Cuándo es el evento?",
    step1Tag: "PASO 2 DE 5 • DESTINATARIO",
    step1Title: "¿Para quién es este regalo?",
    addCustomRecipient: "Destinatario y Nota Personalizada",
    recipientPlaceholder: "ej. Mi mejor amiga Sara que ama leer...",
    addBtn: "Añadir",

    step2Tag: "PASO 3 DE 5 • OCASIÓN",
    step2Title: "¿Cuál es la ocasión?",
    additionalPreferencesTitle: "Preferencias y Detalles Adicionales",
    additionalPreferencesOptional: "Opcional",
    prefPlaceholder: "ej. Le gusta el aire libre, prefiere artículos sostenibles...",

    step3Tag: "PASO 4 DE 5 • PRESUPUESTO",
    step3Title: "Elige un presupuesto.",
    inCurrency: "En",

    step4Tag: "PASO 5 DE 5 • ESTILO",
    step4Title: "Selecciona su estilo.",
    customVibeTitle: "Nota Personalizada de Estilo, Aficiones e Intereses",
    vibePlaceholder: "ej. Fotografía, café de especialidad, hacer espresso...",

    calendarPlannerTitle: "Calendario de Regalos y Planificador de Eventos",
    planEventBtn: "Planificar un Evento",
    quickPresets: "Accesos Rápidos",
    upcomingEvents: "Próximos Eventos Planificados",
    noEventsPlanned: "Aún no hay eventos planificados. ¡Añade una fecha para empezar a planificar regalos!",
    planNewEvent: "Planificar Nuevo Evento",
    findGiftForEvent: "Buscar Regalo para este Evento",
    daysRemaining: "días restantes",

    next: "Siguiente",
    skip: "Omitir",
    done: "Listo",
    back: "Atrás",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    delete: "Eliminar",

    curating: "PREPARANDO SELECCIÓN...",
    curatingSub: "Buscando los mejores regalos según tus preferencias...",
    loadingStep1: "Analizando perfil del destinatario y estilo",
    loadingStep2: "Filtrando los regalos mejor valorados por categoría",
    loadingStep3: "Preparando enlaces directos y detalles",

    curatedSelection: "Selección a tu Medida",
    forRecipient: "Para",
    startOver: "Empezar de Nuevo",
    viewOnStore: "Ver en la Tienda",
    shareWhatsApp: "Compartir en WhatsApp",
    saveDate: "Guardar Fecha",
    optionOf: "Opción",
    newSearchBtn: "Nueva Búsqueda",
    previousLabel: "Anterior",
    nextLabel: "Siguiente",
    ourPickLabel: "Nuestra elección",
    whyPerfectLabel: "Por qué es perfecto:",
    seeInStoreBtn: "VER EN LA TIENDA",
    addToCartBtn: "AÑADIR AL CARRITO",
    copiedOpenedLabel: "¡Copiado y Abierto!",
    copyTicketLabel: "Copiar Mensaje",
    moreIdeasBtn: "3 Ideas Más",
    remindNextYearBtn: "Recuérdamelo también el año que viene",
    reminderNamePlaceholder: "Nombre (opcional)",
    reminderSavedMsg: "Recordatorio guardado — te lo recordaremos nosotros.",
    wsGreetingTemplate: "¡Feliz cumpleaños! 🎉 Encontré un regalo especial para ti: {title} ({price}). Míralo aquí: {link}",

    saveEventDate: "Guardar Fecha del Evento",
    personsName: "Nombre de la Persona",
    eventDateWheel: "Fecha del Evento (Selector de Rueda)",
    notesBookmark: "Notas / Regalo Guardado",
    saveToReminders: "Guardar en Recordatorios",
    noSavedDates: "Aún no hay fechas guardadas.",
    namePlaceholder: "ej. Alex",
    notesPlaceholder: "ej. Taza Ember o Cargador Inalámbrico",

    aiConciergeBtn: "Habla con el Asistente de Voz AI",
    aiVoiceTitle: "Wrap AI Concierge",
    aiVoiceSubtitle: "¿Ya tienes una idea o prefieres que te guiemos por voz?",
    talkToAiPill1: "💡 Ya tengo una idea, ayúdame a perfeccionarla",
    talkToAiPill2: "🎙️ Hazme 3 preguntas para elegir un regalo",
    talkToAiPill3: "🎁 Recomiéndame un regalo para alguien fan del café y la tecnología por menos de 60€",
    chatPlaceholder: "Habla o escribe tus ideas...",
    listening: "Escuchando...",
    viewDeckBtn: "Ver Regalos en el Panel Interactivo",
    voiceListeningHint: "Escuchando... Habla libremente",
    voiceTapToSpeakHint: "Toca el micrófono para hablar",
    voiceTranscriptLabel: "Transcripción en Vivo / Idea:",
    voiceTranscriptPlaceholder: "Ej. Regalo tecnológico para papá amante del café por menos de 50€...",
    voiceNotSupported: "El reconocimiento de voz no es compatible con este navegador. ¡Puedes escribir tu idea!",
    voiceMicDenied: "Permiso de micrófono denegado. Puedes escribir tu idea abajo.",
    voiceFindGiftBtn: "BUSCAR REGALO AHORA",

    settingsTitle: "Ajustes y App",
    interactionSection: "INTERACCIÓN",
    hapticFeedbackLabel: "Vibración Táctil",
    permissionsSection: "PERMISOS Y PRIVACIDAD",
    micLabel: "Micrófono (Búsqueda por Voz)",
    micStatusGranted: "Permiso concedido",
    micStatusDenied: "Denegado por el navegador",
    micStatusPrompt: "Aún no solicitado",
    micStatusUnknown: "Por verificar",
    micBadgeOn: "Activo",
    micBadgeBlocked: "Bloqueado",
    micEnableBtn: "Activar Permiso de Micrófono",
    micBlockedHint: "Has bloqueado el micrófono para este sitio. Actívalo desde la configuración del navegador (icono de candado en la barra de direcciones).",
    notificationsLabel: "Notificaciones PWA de Recordatorios",
    notifTestBtn: "⚡ Enviar Notificación de Prueba PWA",
    myOccasionsSection: "MIS OCASIONES",
    noOccasionsText: "Aún no hay ocasiones guardadas. Después de encontrar un regalo, podrás guardar la fecha para recibir un recordatorio.",
    legalSection: "LEGAL Y CUMPLIMIENTO",
    termsLabel: "Términos y Condiciones",
    affiliateLabel: "Afiliación Amazon y Avisos Legales",
    supportSection: "SOPORTE E INFO",
    sendFeedbackBtn: "Enviar Comentarios",
    affiliateDisclaimerShort: "Como Afiliado de Amazon, Kado AI obtiene ingresos por las compras que califican.",

    legalPrivacyTitle: "Política de Privacidad (RGPD UE)",
    legalTermsTitle: "Términos y Condiciones",
    legalAffiliateTitle: "Afiliación Amazon y Avisos Legales",
    legalPrivacyHeading: "Política de Privacidad y Tratamiento de Datos (RGPD UE 2016/679)",
    legalPrivacyItem1Title: "1. Responsable del Tratamiento:",
    legalPrivacyItem1Text: "Kado AI opera respetando los principios de minimización de datos y confidencialidad.",
    legalPrivacyItem2Title: "2. Tipos de Datos Recopilados:",
    legalPrivacyItem2Text: "Kado AI NO recopila, perfila ni vende datos personales de los usuarios. La aplicación funciona enteramente mediante almacenamiento técnico local en el navegador/dispositivo del usuario (localStorage) para guardar las preferencias de idioma, el país de Amazon y los recordatorios de calendario.",
    legalPrivacyItem3Title: "3. Cookies Técnicas:",
    legalPrivacyItem3Text: "Solo se utilizan cookies y almacenamiento local estrictamente necesarios para el funcionamiento de la app (estado PWA, preferencias de idioma, lista de recordatorios). No se utilizan cookies de rastreo publicitario ni de perfilado de terceros.",
    legalPrivacyItem4Title: "4. Servicios de Terceros (Google Gemini AI y Amazon PA-API):",
    legalPrivacyItem4Text: "El procesamiento de las recomendaciones de regalos se realiza en el servidor mediante conexiones HTTPS cifradas. Ningún identificador del usuario se transmite a los modelos de IA.",
    legalPrivacyItem5Title: "5. Derechos del Usuario:",
    legalPrivacyItem5Text: "El usuario puede eliminar en cualquier momento sus datos guardados simplemente borrando la caché del navegador o restableciendo la configuración de la app.",
    legalTermsHeading: "Términos y Condiciones de Uso",
    legalTermsItem1Title: "1. Naturaleza del Servicio:",
    legalTermsItem1Text: "Kado AI es un motor de recomendación inteligente diseñado para sugerir ideas de regalo personalizadas disponibles en tiendas online como Amazon.",
    legalTermsItem2Title: "2. Exclusión de Responsabilidad:",
    legalTermsItem2Text: "Las sugerencias generadas por la Inteligencia Artificial tienen fines informativos y heurísticos. Kado AI no es el vendedor directo de los productos recomendados.",
    legalTermsItem3Title: "3. Compras Externas:",
    legalTermsItem3Text: "Las compras se realizan enteramente en los sitios oficiales de Amazon del país seleccionado. El usuario se rige por las condiciones de venta, garantía y envío proporcionadas directamente por Amazon.",
    legalTermsItem4Title: "4. Propiedad Intelectual:",
    legalTermsItem4Text: "El diseño, el código y la interfaz de Kado AI están protegidos por derechos de autor. Las marcas de Amazon y los logotipos de productos pertenecen a sus respectivos propietarios.",
    legalAffiliateHeading: "Declaración de Afiliación con Amazon y Avisos Legales Obligatorios",
    legalAffiliateQuote: "\"Como Afiliado de Amazon, Kado AI obtiene ingresos por las compras que califican.\"",
    legalAffiliateProgramText: "Kado AI participa en el Programa de Afiliados de Amazon EU y en el Programa de Afiliados de Amazon.com, programas de publicidad afiliada diseñados para ofrecer a los sitios un medio de obtener comisiones publicitarias mediante enlaces a Amazon.es, Amazon.com y sus respectivas tiendas internacionales.",
    legalAffiliatePriceDisclaimerTitle: "Aviso sobre Precios y Disponibilidad:",
    legalAffiliatePriceDisclaimerText: "Los precios y la disponibilidad de los productos se proporcionan en tiempo real mediante la Amazon PA-API y están sujetos a cambios continuos. Prevalece el precio y la disponibilidad mostrados en la página del producto de Amazon en el momento de la compra final.",

    cookieText: "Kado AI utiliza cookies técnicas y servicios de afiliación para recomendarte los regalos perfectos. Al continuar usando la app, aceptas nuestra Política de Privacidad.",
    cookieAccept: "Aceptar",

    errorTitle: "Algo salió mal",
    errorText: "No te preocupes — tus ocasiones guardadas están a salvo. Vamos a empezar de nuevo.",
    errorRestartBtn: "Empezar de nuevo",

    offlineTitle: "Sin Conexión",
    offlineText: "Comprueba tu conexión a internet para seguir buscando regalos.",
    offlineChecking: "VERIFICANDO...",
    offlineRetryBtn: "REINTENTAR",

    inAppBrowserHint: "Para la mejor experiencia, abre en Safari o Chrome",
    pwaInstallTitle: "Instala la App en 1 Toque",
    pwaInstallSubtitle: "Acceso instantáneo desde tu pantalla de inicio, sin tiendas de apps.",
    pwaInstallNowBtn: "INSTALAR AHORA EN INICIO",
    pwaAddHomeBtn: "AÑADIR A PANTALLA DE INICIO",
    pwaFallbackAlert: "Para instalar la app, abre el menú de tu navegador y selecciona 'Añadir a pantalla de inicio'.",
    iosGuideTitle: "Añadir a Pantalla de Inicio en iOS",
    iosStep1Title: "Toca el botón 'Compartir'",
    iosStep1Sub: "Se encuentra en la barra inferior de Safari",
    iosStep2Title: "Selecciona 'Añadir a pantalla de inicio'",
    iosStep2Sub: "Desplázate por las opciones del menú para compartir",
    iosPressShareBelow: "Pulsa Compartir Aquí Abajo",
    iosGotItBtn: "ENTENDIDO",
  },
  fr: {
    savedDates: "Dates Enregistrées",
    selectLanguageRegion: "Langue et Région",
    language: "Langue",
    storeRegion: "Région de la Boutique",
    regionNotice: "Les liens des cadeaux s'ouvriront dans la devise et la boutique de votre région.",

    heroTag: "Sélection de Cadeaux Ultra-Rapide",
    heroTitleLine1: "Le Bon Cadeau.",
    heroTitleLine2: "Instantanément.",
    heroSubtitle: "Résolu en moins de 20 secondes. Des idées attentionnées pour tous ceux qui comptent pour vous.",
    findGiftBtn: "Trouver un Cadeau",
    tag20Sec: "20 Secondes",
    tagDirectLinks: "Liens Directs vers la Boutique",
    fastTrackPlaceholder: "Une idée ou un SOS ? Parlez ou écrivez...",
    homeStep1Title: "Pour qui est le cadeau ?",
    homeStep1Sub: "Sélectionnez le destinataire pour personnaliser",
    homeStep2Title: "Quel est son style ?",
    homeStep2Sub: "Choisissez le style ou le centre d'intérêt principal",
    homeStep3Title: "Budget et Style",
    homeStep3Sub: "Définissez la fourchette de prix souhaitée",
    orExactAmountLabel: "Ou montant exact :",
    customBudgetLabel: "Personnalisé",
    exactAmountPlaceholder: "Montant exact (ex. 18)",
    extraOptionsLabel: "OPTIONS SUPPLÉMENTAIRES",
    hasEverythingLabel: "A déjà tout (idées uniques ou consommables)",
    extraDetailsHomePlaceholder: "Détail supplémentaire (facultatif)",
    showPerfectGiftsBtn: "AFFICHER LES CADEAUX PARFAITS",

    step0Tag: "ÉTAPE 1 SUR 5 • DATE DE L'ÉVÉNEMENT",
    step0Title: "Quand a lieu l'événement ?",
    step1Tag: "ÉTAPE 2 SUR 5 • DESTINATAIRE",
    step1Title: "Pour qui est ce cadeau ?",
    addCustomRecipient: "Destinataire et Note Personnalisés",
    recipientPlaceholder: "ex. Ma meilleure amie Sarah qui adore lire...",
    addBtn: "Ajouter",

    step2Tag: "ÉTAPE 3 SUR 5 • OCCASION",
    step2Title: "Quelle est l'occasion ?",
    additionalPreferencesTitle: "Préférences et Détails Complémentaires",
    additionalPreferencesOptional: "Facultatif",
    prefPlaceholder: "ex. Aime le plein air, préfère les produits durables...",

    step3Tag: "ÉTAPE 4 SUR 5 • BUDGET",
    step3Title: "Choisissez un budget.",
    inCurrency: "En",

    step4Tag: "ÉTAPE 5 SUR 5 • STYLE",
    step4Title: "Sélectionnez son style.",
    customVibeTitle: "Note Personnalisée sur le Style, les Loisirs et les Intérêts",
    vibePlaceholder: "ex. Photographie, café de spécialité, art de l'espresso...",

    calendarPlannerTitle: "Calendrier Cadeaux & Planificateur d'Événements",
    planEventBtn: "Planifier un Événement",
    quickPresets: "Raccourcis Rapides",
    upcomingEvents: "Prochains Événements Planifiés",
    noEventsPlanned: "Aucun événement planifié pour l'instant. Ajoutez une date pour commencer à planifier des cadeaux !",
    planNewEvent: "Planifier un Nouvel Événement",
    findGiftForEvent: "Trouver un Cadeau pour cet Événement",
    daysRemaining: "jours restants",

    next: "Suivant",
    skip: "Passer",
    done: "Terminé",
    back: "Retour",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    delete: "Supprimer",

    curating: "SÉLECTION EN COURS...",
    curatingSub: "Recherche des meilleurs cadeaux selon vos préférences...",
    loadingStep1: "Analyse du profil du destinataire et du style",
    loadingStep2: "Filtrage des cadeaux les mieux notés par catégorie",
    loadingStep3: "Préparation des liens directs et des détails",

    curatedSelection: "Sélection Sur Mesure",
    forRecipient: "Pour",
    startOver: "Recommencer",
    viewOnStore: "Voir sur la Boutique",
    shareWhatsApp: "Partager sur WhatsApp",
    saveDate: "Enregistrer la Date",
    optionOf: "Option",
    newSearchBtn: "Nouvelle Recherche",
    previousLabel: "Précédent",
    nextLabel: "Suivant",
    ourPickLabel: "Notre choix",
    whyPerfectLabel: "Pourquoi c'est parfait :",
    seeInStoreBtn: "VOIR SUR LA BOUTIQUE",
    addToCartBtn: "AJOUTER AU PANIER",
    copiedOpenedLabel: "Copié et Ouvert !",
    copyTicketLabel: "Copier le Message",
    moreIdeasBtn: "3 Idées de Plus",
    remindNextYearBtn: "Me le rappeler l'année prochaine aussi",
    reminderNamePlaceholder: "Nom (facultatif)",
    reminderSavedMsg: "Rappel enregistré — nous vous le rappellerons.",
    wsGreetingTemplate: "Joyeux anniversaire ! 🎉 J'ai trouvé un cadeau spécial pour toi : {title} ({price}) ! Découvre-le ici : {link}",

    saveEventDate: "Enregistrer la Date de l'Événement",
    personsName: "Nom de la Personne",
    eventDateWheel: "Date de l'Événement (Sélecteur à Molette)",
    notesBookmark: "Notes / Cadeau Enregistré",
    saveToReminders: "Enregistrer dans les Rappels",
    noSavedDates: "Aucune date enregistrée pour l'instant.",
    namePlaceholder: "ex. Alex",
    notesPlaceholder: "ex. Mug Ember ou Chargeur Sans Fil",

    aiConciergeBtn: "Parler à l'Assistant Vocal IA",
    aiVoiceTitle: "Wrap AI Concierge",
    aiVoiceSubtitle: "Vous avez déjà une idée ou préférez être guidé(e) à la voix ?",
    talkToAiPill1: "💡 J'ai déjà une idée, aidez-moi à l'affiner",
    talkToAiPill2: "🎙️ Posez-moi 3 questions pour choisir un cadeau",
    talkToAiPill3: "🎁 Recommandez-moi un cadeau pour un(e) fan de café et de tech à moins de 60€",
    chatPlaceholder: "Parlez ou écrivez vos idées...",
    listening: "Écoute en cours...",
    viewDeckBtn: "Voir les Cadeaux dans le Deck Interactif",
    voiceListeningHint: "Écoute en cours... Parlez librement",
    voiceTapToSpeakHint: "Touchez le micro pour parler",
    voiceTranscriptLabel: "Transcription en Direct / Idée :",
    voiceTranscriptPlaceholder: "Ex. Cadeau high-tech pour papa amateur de café à moins de 50€...",
    voiceNotSupported: "Reconnaissance vocale non prise en charge par ce navigateur. Vous pouvez saisir votre idée !",
    voiceMicDenied: "Autorisation du microphone refusée. Vous pouvez saisir votre idée ci-dessous.",
    voiceFindGiftBtn: "TROUVER UN CADEAU MAINTENANT",

    settingsTitle: "Réglages & Application",
    interactionSection: "INTERACTION",
    hapticFeedbackLabel: "Retour Haptique (Vibration)",
    permissionsSection: "AUTORISATIONS & CONFIDENTIALITÉ",
    micLabel: "Microphone (Recherche Vocale)",
    micStatusGranted: "Autorisation accordée",
    micStatusDenied: "Refusée par le navigateur",
    micStatusPrompt: "Pas encore demandée",
    micStatusUnknown: "À vérifier",
    micBadgeOn: "Actif",
    micBadgeBlocked: "Bloqué",
    micEnableBtn: "Activer l'Autorisation du Microphone",
    micBlockedHint: "Vous avez bloqué le microphone pour ce site. Réactivez-le dans les réglages du navigateur (icône cadenas dans la barre d'adresse).",
    notificationsLabel: "Notifications PWA de Rappel",
    notifTestBtn: "⚡ Envoyer une Notification PWA de Test",
    myOccasionsSection: "MES OCCASIONS",
    noOccasionsText: "Aucune occasion enregistrée pour l'instant. Après avoir trouvé un cadeau, vous pourrez enregistrer la date pour recevoir un rappel.",
    legalSection: "MENTIONS LÉGALES & CONFORMITÉ",
    termsLabel: "Conditions Générales",
    affiliateLabel: "Affiliation Amazon & Avertissements",
    supportSection: "ASSISTANCE & INFOS",
    sendFeedbackBtn: "Envoyer un Avis",
    affiliateDisclaimerShort: "En tant que Partenaire Amazon, Kado AI perçoit une rémunération sur les achats éligibles.",

    legalPrivacyTitle: "Politique de Confidentialité (RGPD UE)",
    legalTermsTitle: "Conditions Générales",
    legalAffiliateTitle: "Affiliation Amazon & Avertissements",
    legalPrivacyHeading: "Politique de Confidentialité et Traitement des Données (RGPD UE 2016/679)",
    legalPrivacyItem1Title: "1. Responsable du Traitement :",
    legalPrivacyItem1Text: "Kado AI opère dans le respect des principes de minimisation des données et de confidentialité.",
    legalPrivacyItem2Title: "2. Types de Données Collectées :",
    legalPrivacyItem2Text: "Kado AI ne collecte, ne profile ni ne vend AUCUNE donnée personnelle des utilisateurs. L'application fonctionne entièrement via un stockage technique local sur le navigateur/appareil de l'utilisateur (localStorage) pour mémoriser les préférences de langue, le pays Amazon et les rappels de calendrier.",
    legalPrivacyItem3Title: "3. Cookies Techniques :",
    legalPrivacyItem3Text: "Seuls les cookies et stockages locaux strictement nécessaires au fonctionnement de l'application sont utilisés (état PWA, préférences de langue, liste des rappels). Aucun cookie de suivi publicitaire ou de profilage tiers n'est utilisé.",
    legalPrivacyItem4Title: "4. Services Tiers (Google Gemini AI & Amazon PA-API) :",
    legalPrivacyItem4Text: "Le traitement des recommandations de cadeaux s'effectue côté serveur via des connexions HTTPS chiffrées. Aucun identifiant utilisateur n'est transmis aux modèles d'IA.",
    legalPrivacyItem5Title: "5. Droits de l'Utilisateur :",
    legalPrivacyItem5Text: "L'utilisateur peut à tout moment supprimer ses données enregistrées en vidant simplement le cache de son navigateur ou en réinitialisant les paramètres de l'application.",
    legalTermsHeading: "Conditions Générales d'Utilisation",
    legalTermsItem1Title: "1. Nature du Service :",
    legalTermsItem1Text: "Kado AI est un moteur de recommandation intelligent conçu pour suggérer des idées cadeaux personnalisées disponibles sur des boutiques en ligne comme Amazon.",
    legalTermsItem2Title: "2. Limitation de Responsabilité :",
    legalTermsItem2Text: "Les suggestions générées par l'Intelligence Artificielle ont un but informatif et heuristique. Kado AI n'est pas le vendeur direct des produits recommandés.",
    legalTermsItem3Title: "3. Achats Externes :",
    legalTermsItem3Text: "Les achats s'effectuent entièrement sur les sites Amazon officiels du pays sélectionné. L'utilisateur se réfère aux conditions de vente, de garantie et d'expédition fournies directement par Amazon.",
    legalTermsItem4Title: "4. Propriété Intellectuelle :",
    legalTermsItem4Text: "Le design, le code et l'interface de Kado AI sont protégés par le droit d'auteur. Les marques Amazon et les logos des produits appartiennent à leurs propriétaires respectifs.",
    legalAffiliateHeading: "Déclaration d'Affiliation Amazon & Avertissements Obligatoires",
    legalAffiliateQuote: "\"En tant que Partenaire Amazon, Kado AI perçoit une rémunération sur les achats éligibles.\"",
    legalAffiliateProgramText: "Kado AI participe au Programme Partenaires Amazon EU et au programme Amazon Associates US, des programmes d'affiliation publicitaire conçus pour permettre aux sites de percevoir des commissions publicitaires en créant des liens vers Amazon.fr, Amazon.com et leurs boutiques internationales respectives.",
    legalAffiliatePriceDisclaimerTitle: "Avertissement sur les Prix et la Disponibilité :",
    legalAffiliatePriceDisclaimerText: "Les prix et la disponibilité des produits sont fournis en temps réel par l'Amazon PA-API et sont susceptibles de varier en permanence. Le prix et la disponibilité affichés sur la page produit Amazon au moment de l'achat final font foi.",

    cookieText: "Kado AI utilise des cookies techniques et des services d'affiliation pour vous recommander les cadeaux parfaits. En continuant à utiliser l'application, vous acceptez notre Politique de Confidentialité.",
    cookieAccept: "Accepter",

    errorTitle: "Un problème est survenu",
    errorText: "Pas d'inquiétude — vos occasions enregistrées sont en sécurité. Repartons de zéro.",
    errorRestartBtn: "Recommencer",

    offlineTitle: "Aucune Connexion",
    offlineText: "Vérifiez votre connexion internet pour continuer à chercher des cadeaux.",
    offlineChecking: "VÉRIFICATION EN COURS...",
    offlineRetryBtn: "RÉESSAYER",

    inAppBrowserHint: "Pour une meilleure expérience, ouvrez dans Safari ou Chrome",
    pwaInstallTitle: "Installez l'App en 1 Geste",
    pwaInstallSubtitle: "Accès instantané depuis votre écran d'accueil, sans passer par les stores.",
    pwaInstallNowBtn: "INSTALLER MAINTENANT",
    pwaAddHomeBtn: "AJOUTER À L'ÉCRAN D'ACCUEIL",
    pwaFallbackAlert: "Pour installer l'application, ouvrez le menu de votre navigateur et sélectionnez « Ajouter à l'écran d'accueil ».",
    iosGuideTitle: "Ajouter à l'Écran d'Accueil iOS",
    iosStep1Title: "Touchez le bouton « Partager »",
    iosStep1Sub: "Situé dans la barre du bas de Safari",
    iosStep2Title: "Sélectionnez « Sur l'écran d'accueil »",
    iosStep2Sub: "Faites défiler les options du menu de partage",
    iosPressShareBelow: "Appuyez sur Partager Ci-Dessous",
    iosGotItBtn: "COMPRIS",
  },
  de: {
    savedDates: "Gespeicherte Termine",
    selectLanguageRegion: "Sprache & Region",
    language: "Sprache",
    storeRegion: "Store-Region",
    regionNotice: "Geschenklinks öffnen sich in der Währung und im Store deiner Region.",

    heroTag: "Ultraschnelle Geschenkauswahl",
    heroTitleLine1: "Das Perfekte Geschenk.",
    heroTitleLine2: "Sofort.",
    heroSubtitle: "In unter 20 Sekunden gelöst. Durchdachte Empfehlungen für alle, die dir wichtig sind.",
    findGiftBtn: "Geschenk Finden",
    tag20Sec: "20 Sekunden",
    tagDirectLinks: "Direkte Store-Links",
    fastTrackPlaceholder: "Hast du eine Idee oder einen SOS? Sprich oder schreib...",
    homeStep1Title: "Für wen ist das Geschenk?",
    homeStep1Sub: "Empfänger auswählen, um zu personalisieren",
    homeStep2Title: "Welchen Stil hat die Person?",
    homeStep2Sub: "Wähle den Stil oder das Hauptinteresse",
    homeStep3Title: "Budget & Stil",
    homeStep3Sub: "Lege deine bevorzugte Preisspanne fest",
    orExactAmountLabel: "Oder genauer Betrag:",
    customBudgetLabel: "Individuell",
    exactAmountPlaceholder: "Genauer Betrag (z. B. 18)",
    extraOptionsLabel: "ZUSATZOPTIONEN",
    hasEverythingLabel: "Hat schon alles (einzigartige Ideen oder Verbrauchsgüter)",
    extraDetailsHomePlaceholder: "Zusätzliches Detail (optional)",
    showPerfectGiftsBtn: "PERFEKTE GESCHENKE ANZEIGEN",

    step0Tag: "SCHRITT 1 VON 5 • EVENT-DATUM",
    step0Title: "Wann findet das Event statt?",
    step1Tag: "SCHRITT 2 VON 5 • EMPFÄNGER",
    step1Title: "Für wen ist dieses Geschenk?",
    addCustomRecipient: "Individueller Empfänger & Notiz",
    recipientPlaceholder: "z. B. Beste Freundin Sarah, die gerne liest...",
    addBtn: "Hinzufügen",

    step2Tag: "SCHRITT 3 VON 5 • ANLASS",
    step2Title: "Was ist der Anlass?",
    additionalPreferencesTitle: "Zusätzliche Vorlieben & Details",
    additionalPreferencesOptional: "Optional",
    prefPlaceholder: "z. B. Mag Outdoor-Ausrüstung, bevorzugt nachhaltige Produkte...",

    step3Tag: "SCHRITT 4 VON 5 • BUDGET",
    step3Title: "Wähle ein Budget.",
    inCurrency: "In",

    step4Tag: "SCHRITT 5 VON 5 • STIL",
    step4Title: "Wähle den passenden Stil.",
    customVibeTitle: "Individuelle Notiz zu Stil, Hobbys & Interessen",
    vibePlaceholder: "z. B. Fotografie, Spezialitätenkaffee, Espresso-Zubereitung...",

    calendarPlannerTitle: "Geschenkkalender & Event-Planer",
    planEventBtn: "Event Planen",
    quickPresets: "Schnellauswahl",
    upcomingEvents: "Anstehende Geplante Events",
    noEventsPlanned: "Noch keine Events geplant. Füge ein Datum hinzu, um mit der Geschenkplanung zu beginnen!",
    planNewEvent: "Neues Event Planen",
    findGiftForEvent: "Geschenk für dieses Event Finden",
    daysRemaining: "Tage verbleibend",

    next: "Weiter",
    skip: "Überspringen",
    done: "Fertig",
    back: "Zurück",
    cancel: "Abbrechen",
    save: "Speichern",
    close: "Schließen",
    delete: "Löschen",

    curating: "AUSWAHL WIRD ERSTELLT...",
    curatingSub: "Suche nach den besten Geschenken passend zu deinen Vorlieben...",
    loadingStep1: "Analysiere Empfängerprofil & Stil",
    loadingStep2: "Filtere die bestbewerteten Geschenke nach Kategorie",
    loadingStep3: "Bereite Direktlinks & Details vor",

    curatedSelection: "Maßgeschneiderte Auswahl",
    forRecipient: "Für",
    startOver: "Neu Starten",
    viewOnStore: "Im Store Ansehen",
    shareWhatsApp: "Auf WhatsApp Teilen",
    saveDate: "Datum Speichern",
    optionOf: "Option",
    newSearchBtn: "Neue Suche",
    previousLabel: "Zurück",
    nextLabel: "Weiter",
    ourPickLabel: "Unsere Wahl",
    whyPerfectLabel: "Warum es perfekt passt:",
    seeInStoreBtn: "IM STORE ANSEHEN",
    addToCartBtn: "IN DEN WARENKORB",
    copiedOpenedLabel: "Kopiert & Geöffnet!",
    copyTicketLabel: "Nachricht Kopieren",
    moreIdeasBtn: "3 Weitere Ideen",
    remindNextYearBtn: "Auch nächstes Jahr wieder erinnern",
    reminderNamePlaceholder: "Name (optional)",
    reminderSavedMsg: "Erinnerung gespeichert — wir erinnern dich rechtzeitig.",
    wsGreetingTemplate: "Alles Gute zum Geburtstag! 🎉 Ich habe ein besonderes Geschenk für dich gefunden: {title} ({price})! Hier ansehen: {link}",

    saveEventDate: "Event-Datum Speichern",
    personsName: "Name der Person",
    eventDateWheel: "Event-Datum (Drehrad-Auswahl)",
    notesBookmark: "Notizen / Gemerktes Geschenk",
    saveToReminders: "Zu Erinnerungen Hinzufügen",
    noSavedDates: "Noch keine gespeicherten Termine.",
    namePlaceholder: "z. B. Alex",
    notesPlaceholder: "z. B. Ember Tasse oder Wireless-Ladegerät",

    aiConciergeBtn: "Mit dem KI-Sprachassistenten Sprechen",
    aiVoiceTitle: "Wrap AI Concierge",
    aiVoiceSubtitle: "Hast du schon eine Idee oder möchtest du sprachgeführt entdecken?",
    talkToAiPill1: "💡 Ich habe schon eine Idee, hilf mir, sie zu verfeinern",
    talkToAiPill2: "🎙️ Stell mir 3 Fragen, um ein Geschenk auszuwählen",
    talkToAiPill3: "🎁 Empfiehl mir ein Geschenk für Kaffee- und Technikliebhaber unter 60 €",
    chatPlaceholder: "Sprich oder schreib deine Gedanken...",
    listening: "Ich höre zu...",
    viewDeckBtn: "Geschenke im Interaktiven Deck Ansehen",
    voiceListeningHint: "Ich höre zu... Sprich frei",
    voiceTapToSpeakHint: "Tippe auf das Mikrofon, um zu sprechen",
    voiceTranscriptLabel: "Live-Transkript / Idee:",
    voiceTranscriptPlaceholder: "Z. B. Tech-Geschenk für Papa, der Kaffee liebt, unter 50 €...",
    voiceNotSupported: "Spracherkennung wird von diesem Browser nicht unterstützt. Du kannst deine Idee eintippen!",
    voiceMicDenied: "Mikrofonzugriff verweigert. Du kannst deine Idee unten eintippen.",
    voiceFindGiftBtn: "JETZT GESCHENK FINDEN",

    settingsTitle: "Einstellungen & App",
    interactionSection: "INTERAKTION",
    hapticFeedbackLabel: "Haptisches Feedback (Vibration)",
    permissionsSection: "BERECHTIGUNGEN & DATENSCHUTZ",
    micLabel: "Mikrofon (Sprachsuche)",
    micStatusGranted: "Berechtigung erteilt",
    micStatusDenied: "Vom Browser verweigert",
    micStatusPrompt: "Noch nicht angefragt",
    micStatusUnknown: "Noch zu prüfen",
    micBadgeOn: "Aktiv",
    micBadgeBlocked: "Blockiert",
    micEnableBtn: "Mikrofonzugriff Aktivieren",
    micBlockedHint: "Du hast das Mikrofon für diese Seite blockiert. Aktiviere es in den Website-Einstellungen deines Browsers (Schloss-Symbol in der Adressleiste).",
    notificationsLabel: "PWA-Erinnerungsbenachrichtigungen",
    notifTestBtn: "⚡ Test-PWA-Benachrichtigung Senden",
    myOccasionsSection: "MEINE ANLÄSSE",
    noOccasionsText: "Noch keine Anlässe gespeichert. Nachdem du ein Geschenk gefunden hast, kannst du das Datum speichern, um eine Erinnerung zu erhalten.",
    legalSection: "RECHTLICHES & COMPLIANCE",
    termsLabel: "Allgemeine Geschäftsbedingungen",
    affiliateLabel: "Amazon-Partnerprogramm & Haftungsausschlüsse",
    supportSection: "SUPPORT & INFO",
    sendFeedbackBtn: "Feedback Senden",
    affiliateDisclaimerShort: "Als Amazon-Partner verdient Kado AI an qualifizierten Käufen.",

    legalPrivacyTitle: "Datenschutzerklärung (DSGVO EU)",
    legalTermsTitle: "Allgemeine Geschäftsbedingungen",
    legalAffiliateTitle: "Amazon-Partnerprogramm & Haftungsausschlüsse",
    legalPrivacyHeading: "Datenschutzerklärung und Datenverarbeitung (DSGVO EU 2016/679)",
    legalPrivacyItem1Title: "1. Verantwortlicher für die Datenverarbeitung:",
    legalPrivacyItem1Text: "Kado AI arbeitet nach den Grundsätzen der Datenminimierung und Vertraulichkeit.",
    legalPrivacyItem2Title: "2. Art der Erhobenen Daten:",
    legalPrivacyItem2Text: "Kado AI erhebt, profiliert oder verkauft KEINE personenbezogenen Daten der Nutzer. Die App funktioniert vollständig über technische lokale Speicherung im Browser/Gerät des Nutzers (localStorage), um Sprach-, Amazon-Länder- und Kalendereinstellungen zu speichern.",
    legalPrivacyItem3Title: "3. Technische Cookies:",
    legalPrivacyItem3Text: "Es werden ausschließlich Cookies und lokale Speicher verwendet, die für den Betrieb der App zwingend erforderlich sind (PWA-Status, Spracheinstellungen, Erinnerungsliste). Es werden keine Werbe-Tracking- oder Drittanbieter-Profiling-Cookies verwendet.",
    legalPrivacyItem4Title: "4. Drittanbieterdienste (Google Gemini AI & Amazon PA-API):",
    legalPrivacyItem4Text: "Die Verarbeitung der Geschenkempfehlungen erfolgt serverseitig über verschlüsselte HTTPS-Verbindungen. Es wird kein Nutzeridentifikator an die KI-Modelle übermittelt.",
    legalPrivacyItem5Title: "5. Rechte der Nutzer:",
    legalPrivacyItem5Text: "Nutzer können ihre gespeicherten Daten jederzeit löschen, indem sie einfach den Browser-Cache leeren oder die App-Einstellungen zurücksetzen.",
    legalTermsHeading: "Allgemeine Nutzungsbedingungen",
    legalTermsItem1Title: "1. Art des Dienstes:",
    legalTermsItem1Text: "Kado AI ist eine intelligente Empfehlungs-Engine, die personalisierte Geschenkideen vorschlägt, die in Online-Shops wie Amazon erhältlich sind.",
    legalTermsItem2Title: "2. Haftungsausschluss:",
    legalTermsItem2Text: "Die von der Künstlichen Intelligenz generierten Vorschläge dienen ausschließlich Informations- und Orientierungszwecken. Kado AI ist nicht der direkte Verkäufer der empfohlenen Produkte.",
    legalTermsItem3Title: "3. Externe Käufe:",
    legalTermsItem3Text: "Käufe erfolgen vollständig auf den offiziellen Amazon-Websites des ausgewählten Landes. Der Nutzer verlässt sich auf die direkt von Amazon bereitgestellten Verkaufs-, Garantie- und Versandbedingungen.",
    legalTermsItem4Title: "4. Geistiges Eigentum:",
    legalTermsItem4Text: "Design, Code und Benutzeroberfläche von Kado AI sind urheberrechtlich geschützt. Amazon-Marken und Produktlogos gehören ihren jeweiligen Eigentümern.",
    legalAffiliateHeading: "Amazon-Partnerprogramm-Erklärung & Verpflichtende Haftungsausschlüsse",
    legalAffiliateQuote: "„Als Amazon-Partner verdient Kado AI an qualifizierten Käufen.“",
    legalAffiliateProgramText: "Kado AI nimmt am Amazon-EU-Partnerprogramm und am Amazon.com-Partnerprogramm teil, Partnerprogrammen, die Websites die Möglichkeit bieten, durch Links zu Amazon.de, Amazon.com und den jeweiligen internationalen Stores Werbekostenerstattungen zu verdienen.",
    legalAffiliatePriceDisclaimerTitle: "Hinweis zu Preisen und Verfügbarkeit:",
    legalAffiliatePriceDisclaimerText: "Produktpreise und Verfügbarkeit werden in Echtzeit über die Amazon PA-API bereitgestellt und unterliegen laufenden Änderungen. Maßgeblich sind Preis und Verfügbarkeit, die zum Zeitpunkt des endgültigen Kaufs auf der Amazon-Produktseite angezeigt werden.",

    cookieText: "Kado AI verwendet technische Cookies und Partnerdienste, um dir die perfekten Geschenke zu empfehlen. Durch die weitere Nutzung der App akzeptierst du unsere Datenschutzerklärung.",
    cookieAccept: "Akzeptieren",

    errorTitle: "Etwas ist schiefgelaufen",
    errorText: "Keine Sorge — deine gespeicherten Anlässe sind sicher. Lass uns neu starten.",
    errorRestartBtn: "Neu starten",

    offlineTitle: "Keine Verbindung",
    offlineText: "Überprüfe deine Internetverbindung, um weiter nach Geschenken zu suchen.",
    offlineChecking: "WIRD ÜBERPRÜFT...",
    offlineRetryBtn: "ERNEUT VERSUCHEN",

    inAppBrowserHint: "Für das beste Erlebnis in Safari oder Chrome öffnen",
    pwaInstallTitle: "App mit 1 Tipp Installieren",
    pwaInstallSubtitle: "Sofortiger Zugriff vom Startbildschirm ohne App Stores.",
    pwaInstallNowBtn: "JETZT AUF STARTBILDSCHIRM INSTALLIEREN",
    pwaAddHomeBtn: "ZUM STARTBILDSCHIRM HINZUFÜGEN",
    pwaFallbackAlert: "Um die App zu installieren, öffne das Menü deines Browsers und wähle „Zum Startbildschirm hinzufügen“.",
    iosGuideTitle: "Zum iOS-Startbildschirm Hinzufügen",
    iosStep1Title: "Tippe auf die Schaltfläche „Teilen“",
    iosStep1Sub: "Befindet sich in der unteren Leiste von Safari",
    iosStep2Title: "Wähle „Zum Home-Bildschirm“",
    iosStep2Sub: "Scrolle durch die Optionen im Freigabemenü",
    iosPressShareBelow: "Unten auf Teilen Tippen",
    iosGotItBtn: "VERSTANDEN",
  },
};
