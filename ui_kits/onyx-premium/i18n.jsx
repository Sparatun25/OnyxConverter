const i18n = {
  en: {
    title: "Onyx — Free Online File Converter & AI Tools",
    description: "Convert images, documents, audio, video, archives, fonts, ebooks, spreadsheets and vectors for free — plus 11 AI tools.",
    convert: "Convert",
    dragDrop: "Drag & drop your files here",
    orBrowse: "or browse",
    supportedFormats: "Supported formats",
    converting: "Converting...",
    success: "Success!",
    error: "Error",
    tryAgain: "Try again",
    about: "About",
    account: "Account",
    aiTools: "AI Tools",
    proFeatures: "Pro Features",
    free: "Free",
    pro: "Pro",
    unlimited: "Unlimited",
    learnMore: "Learn more",
    privacy: "Privacy by design",
    noUploads: "Nothing uploaded to servers",
    runLocally: "Everything runs in your browser",
    formats: {
      images: "Images (PNG, JPG, WebP, HEIC, AVIF)",
      documents: "Documents (PDF, DOCX, MD)",
      audio: "Audio (MP3, WAV, OGG)",
      video: "Video (MP4, MOV, WebM)",
      archives: "Archives (ZIP, RAR, 7Z)",
      presentations: "Presentations (PPTX, PDF, KEY)",
      fonts: "Fonts (TTF, OTF, WOFF)",
      ebooks: "Ebooks (EPUB, MOBI)",
      spreadsheets: "Spreadsheets (XLSX, CSV)",
      vectors: "Vectors (SVG, AI, EPS)"
    },
    aiTools: {
      transcriber: "Smart Transcriber",
      subtitles: "Auto-Subtitles",
      summarizer: "Media Summariser",
      translator: "Smart Translator",
      toneShift: "Tone Shift",
      ocr: "AI OCR",
      vector: "Smart Vector",
      compress: "Generative Compress",
      background: "Background Removal",
      code: "Code Converter",
      data: "Data to Tables"
    }
  },

  ru: {
    title: "Onyx — Бесплатный конвертер файлов и ИИ-инструменты онлайн",
    description: "Конвертируйте изображения, документы, аудио, видео, архивы, шрифты, электронные книги, таблицы и векторы бесплатно — плюс 11 ИИ-инструментов.",
    convert: "Конвертировать",
    dragDrop: "Перетащите ваши файлы сюда",
    orBrowse: "или выберите",
    supportedFormats: "Поддерживаемые форматы",
    converting: "Конвертируем...",
    success: "Успешно!",
    error: "Ошибка",
    tryAgain: "Попробовать снова",
    about: "О нас",
    account: "Аккаунт",
    aiTools: "ИИ-инструменты",
    proFeatures: "Pro-функции",
    free: "Бесплатно",
    pro: "Pro",
    unlimited: "Без ограничений",
    learnMore: "Узнать больше",
    privacy: "Приоритет приватности",
    noUploads: "Ничего не загружается на серверы",
    runLocally: "Всё работает в вашем браузере",
    formats: {
      images: "Изображения (PNG, JPG, WebP, HEIC, AVIF)",
      documents: "Документы (PDF, DOCX, MD)",
      audio: "Аудио (MP3, WAV, OGG)",
      video: "Видео (MP4, MOV, WebM)",
      archives: "Архивы (ZIP, RAR, 7Z)",
      presentations: "Презентации (PPTX, PDF, KEY)",
      fonts: "Шрифты (TTF, OTF, WOFF)",
      ebooks: "Электронные книги (EPUB, MOBI)",
      spreadsheets: "Таблицы (XLSX, CSV)",
      vectors: "Векторы (SVG, AI, EPS)"
    },
    aiTools: {
      transcriber: "Умный транскрайбер",
      subtitles: "Автозаголовки",
      summarizer: "Медиа-резюме",
      translator: "Умный переводчик",
      toneShift: "Смена тона",
      ocr: "ИИ OCR",
      vector: "Умный вектор",
      compress: "Генеративное сжатие",
      background: "Удаление фона",
      code: "Конвертер кода",
      data: "Данные в таблицы"
    }
  },

  // Add other languages (es, pt, de, fr) following the same pattern
  es: {
    title: "Onyx — Conversor de Archivos Gratis y Herramientas de IA",
    description: "Convierte imágenes, documentos, audio, video, archivos, fuentes, ebooks, hojas de cálculo y vectores gratis — más 11 herramientas de IA.",
    convert: "Convertir",
    dragDrop: "Arrastra y suelta tus archivos aquí",
    orBrowse: "o explora",
    supportedFormats: "Formatos soportados",
    converting: "Convirtiendo...",
    success: "¡Éxito!",
    error: "Error",
    tryAgain: "Intentar de nuevo",
    about: "Acerca de",
    account: "Cuenta",
    aiTools: "Herramientas de IA",
    proFeatures: "Características Pro",
    free: "Gratis",
    pro: "Pro",
    unlimited: "Ilimitado",
    learnMore: "Saber más",
    privacy: "Privacidad por diseño",
    noUploads: "Nada subido a servidores",
    runLocally: "Todo funciona en tu navegador",
    formats: {
      images: "Imágenes (PNG, JPG, WebP, HEIC, AVIF)",
      documents: "Documentos (PDF, DOCX, MD)",
      audio: "Audio (MP3, WAV, OGG)",
      video: "Video (MP4, MOV, WebM)",
      archives: "Archivos (ZIP, RAR, 7Z)",
      presentations: "Presentaciones (PPTX, PDF, KEY)",
      fonts: "Fuentes (TTF, OTF, WOFF)",
      ebooks: "Ebooks (EPUB, MOBI)",
      spreadsheets: "Hojas de cálculo (XLSX, CSV)",
      vectors: "Vectores (SVG, AI, EPS)"
    },
    aiTools: {
      transcriber: "Transcriptor Inteligente",
      subtitles: "Subtítulos Automáticos",
      summarizer: "Resumen de Medios",
      translator: "Traductor Inteligente",
      toneShift: "Cambio de Tono",
      ocr: "IA OCR",
      vector: "Vector Inteligente",
      compress: "Compresión Generativa",
      background: "Eliminación de Fondo",
      code: "Convertidor de Código",
      data: "Datos a Tablas"
    }
  }
};

const currentLang = () => {
  // Get language from URL or default to 'en'
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'en';
};

const t = (key, lang = null) => {
  const language = lang || currentLang();
  const keys = key.split('.');
  let value = i18n[language];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return value || key;
};

export default { t, currentLang, i18n };