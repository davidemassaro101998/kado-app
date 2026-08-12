export type Language = "en" | "it";

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

  // Quiz Options
  recipients: { [key: string]: string };
  occasions: { [key: string]: string };
  vibes: { [key: string]: string };
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

    recipients: {
      Partner: "Partner",
      Friend: "Friend",
      Parent: "Parent",
      Sibling: "Sibling",
      Colleague: "Colleague",
      Child: "Child",
    },
    occasions: {
      Birthday: "Birthday",
      Anniversary: "Anniversary",
      Holiday: "Holiday",
      "Thank You": "Thank You",
      Housewarming: "Housewarming",
      "Just Because": "Just Because",
    },
    vibes: {
      Tech: "Tech & Gadgets",
      Cozy: "Cozy & Wellness",
      Style: "Fashion & Style",
      Foodie: "Foodie & Gourmet",
      Outdoors: "Outdoor & Fitness",
      Creative: "Creative & Art",
    },
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

    recipients: {
      Partner: "Partner",
      Friend: "Amico / Amica",
      Parent: "Genitore",
      Sibling: "Fratello / Sorella",
      Colleague: "Collega",
      Child: "Figlio / Figlia",
    },
    occasions: {
      Birthday: "Compleanno",
      Anniversary: "Anniversario",
      Holiday: "Festività / Natale",
      "Thank You": "Ringraziamento",
      Housewarming: "Nuova Casa",
      "Just Because": "Pensiero Speciale",
    },
    vibes: {
      Tech: "Tech & Gadget",
      Cozy: "Relax & Wellness",
      Style: "Moda & Stile",
      Foodie: "Cucina & Gourmet",
      Outdoors: "Sport & Natura",
      Creative: "Arte & Creatività",
    },
  },
};
