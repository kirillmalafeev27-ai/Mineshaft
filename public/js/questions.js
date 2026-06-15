const GRAMMAR_TOPICS = [
  'Präsens',
  'Perfekt',
  'Präteritum',
  'Futur I',
  'Imperativ',
  'Modalverben',
  'Trennbare Verben',
  'Untrennbare Verben',
  'Reflexive Verben',
  'Verben mit Präpositionen',
  'Lassen',
  'Werden',
  'Sein vs. haben',
  'Nominativ',
  'Akkusativ',
  'Dativ',
  'Genitiv',
  'Artikel',
  'Possessivartikel',
  'Pronomen',
  'Personalpronomen',
  'Relativpronomen',
  'Fragewörter',
  'Negation',
  'Adjektivdeklination',
  'Komparativ',
  'Superlativ',
  'Zahlen und Datum',
  'Temporale Präpositionen',
  'Lokale Präpositionen',
  'Wechselpräpositionen',
  'Präpositionen mit Dativ',
  'Präpositionen mit Akkusativ',
  'Satzklammer',
  'Wortstellung im Hauptsatz',
  'Wortstellung im Nebensatz',
  'weil-Sätze',
  'dass-Sätze',
  'wenn-Sätze',
  'obwohl-Sätze',
  'damit-Sätze',
  'Relativsätze',
  'Indirekte Fragen',
  'Infinitiv mit zu',
  'Konjunktiv II',
  'Passiv',
  'Plusquamperfekt',
  'Doppelkonjunktionen',
  'als vs. wenn',
  'Partizip I und II',
  'Genitivpräpositionen'
];

const LEXICAL_TOPICS = [
  'Familie',
  'Freundschaft',
  'Wohnen',
  'Hausarbeit',
  'Schule',
  'Universität',
  'Arbeit',
  'Bewerbung',
  'Reisen',
  'Hotel',
  'Stadt',
  'Landleben',
  'Essen und Trinken',
  'Restaurant',
  'Einkaufen',
  'Kleidung',
  'Gesundheit',
  'Körper',
  'Sport',
  'Freizeit',
  'Musik',
  'Filme und Serien',
  'Natur',
  'Umwelt',
  'Verkehr',
  'Technik',
  'Internet',
  'Bücher',
  'Wetter',
  'Feiertage',
  'Notfälle',
  'Berge',
  'Camping',
  'Tiere',
  'Kunst',
  'Medien',
  'Politik',
  'Alltag',
  'Zeitmanagement',
  'Büroarbeit',
  'Kundenservice',
  'Studium im Ausland',
  'Migration',
  'Wohnungssuche',
  'Finanzen',
  'Termine',
  'Kommunikation',
  'Gefühle',
  'Urlaub am Meer',
  'Winterurlaub',
  'Begrüßung',
  'Tagesablauf',
  'Hobbys und Freizeit',
  'Verkehrsmittel',
  'Feste und Feiertage'
];

const AUDIO_QUESTION_POOL = [
  {
    level: 'A1',
    audioText: 'Ich kaufe heute Brot und Käse.',
    options: [
      'Сегодня я покупаю хлеб и сыр.',
      'Сегодня я продаю хлеб и сыр.',
      'Сегодня я покупаю булочки и сыр.',
      'Сегодня я покупаю хлеб и колбасу.'
    ],
    correct: 0
  },
  {
    level: 'A1',
    audioText: 'Der Zug kommt um acht Uhr an.',
    options: [
      'Поезд прибывает в восемь часов.',
      'Поезд отправляется в восемь часов.',
      'Поезд прибывает на восьмой путь.',
      'На поезд нужно пересесть в восемь часов.'
    ],
    correct: 0
  },
  {
    level: 'A2',
    audioText: 'Wir müssen morgen früh zum Arzt gehen.',
    options: [
      'Завтра рано мы должны пойти к врачу.',
      'Завтра рано мы хотим пойти к врачу.',
      'Завтра рано мы должны пойти в аптеку.',
      'Завтра рано нам разрешено пойти к врачу.'
    ],
    correct: 0
  },
  {
    level: 'A2',
    audioText: 'Sie hat den Schlüssel auf dem Tisch gelassen.',
    options: [
      'Она оставила ключ на столе.',
      'Она положила ключ на стул.',
      'Она оставила ключ в столе.',
      'Она забыла замок на столе.'
    ],
    correct: 0
  },
  {
    level: 'B1',
    audioText: 'Obwohl es regnet, gehen die Kinder nach draußen.',
    options: [
      'Хотя идет дождь, дети выходят на улицу.',
      'Пока идет дождь, дети выходят на улицу.',
      'Потому что идет дождь, дети выходят на улицу.',
      'Хотя идет дождь, дети идут внутрь.'
    ],
    correct: 0
  },
  {
    level: 'B1',
    audioText: 'Ich freue mich darauf, dich wiederzusehen.',
    options: [
      'Я рад снова тебя увидеть.',
      'Я боюсь снова тебя увидеть.',
      'Я рад снова тебя проводить.',
      'Я рад снова с тобой познакомиться.'
    ],
    correct: 0
  },
  {
    level: 'B2',
    audioText: 'Nachdem der Vertrag unterschrieben worden war, begann die Lieferung.',
    options: [
      'После того как договор был подписан, началась поставка.',
      'После того как договор подписали, поставка была отменена.',
      'После того как договор был отправлен, началась поставка.',
      'После того как заявка была подписана, началась поставка.'
    ],
    correct: 0
  },
  {
    level: 'B2',
    audioText: 'Je länger wir warten, desto schwieriger wird die Entscheidung.',
    options: [
      'Чем дольше мы ждем, тем труднее становится решение.',
      'Чем дольше мы ждем, тем труднее становится обсуждение.',
      'Чем дольше мы советуемся, тем труднее становится решение.',
      'Чем дольше мы ждем, тем надежнее становится решение.'
    ],
    correct: 0
  }
];

const LEVEL_RANK = { A1: 1, A2: 2, B1: 3, B2: 4 };

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function isWortstellungTopic(topic) {
  return /Wortstellung/i.test(topic || '');
}

function validRawQuestion(question) {
  return Boolean(
    question &&
      typeof question.text === 'string' &&
      typeof question.display === 'string' &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      Number.isInteger(question.correct) &&
      question.correct >= 0 &&
      question.correct <= 3
  );
}

class QuestionManager {
  constructor() {
    this.mode = 'grammar';
    this.lexicalTopic = null;
    this.grammarTopics = ['Artikel'];
    this.pools = Object.create(null);
    this.fetching = Object.create(null);
    this.usedDisplays = Object.create(null);
    this.lastServed = null;
    this.audioFallbackCursor = 0;
  }

  configure({ mode, lexicalTopic, grammarTopics }) {
    const nextMode = mode === 'audio' ? 'audio' : 'grammar';
    const nextLexicalTopic = lexicalTopic || null;
    const nextGrammarTopics = (grammarTopics && grammarTopics.length) ? grammarTopics : ['Artikel'];
    const changed =
      this.mode !== nextMode ||
      this.lexicalTopic !== nextLexicalTopic ||
      nextGrammarTopics.join('|') !== this.grammarTopics.join('|');

    this.mode = nextMode;
    this.lexicalTopic = nextLexicalTopic;
    this.grammarTopics = nextGrammarTopics;

    if (changed) {
      this.pools = Object.create(null);
      this.fetching = Object.create(null);
      this.usedDisplays = Object.create(null);
      this.lastServed = null;
    }
  }

  prefetch(levels = ['A1', 'A2']) {
    const loaders = levels.map((level) => (
      this.mode === 'audio' ? this._ensureAudioPool(level) : this._ensureGrammarPool(level)
    ));
    return Promise.allSettled(loaders);
  }

  async getQuestion(level, difficulty) {
    return this.mode === 'audio'
      ? this._getAudioQuestion(level)
      : this._getGrammarQuestion(level, difficulty);
  }

  onCorrect() {
    if (!this.lastServed) return;
    const { key, raw } = this.lastServed;
    const used = this._usedFor(key);
    used.add(raw.audioText || raw.display);
    this.lastServed = null;
  }

  onWrong() {
    if (!this.lastServed) return;
    const { key, raw } = this.lastServed;
    const pool = this.pools[key] || (this.pools[key] = []);
    const position = Math.floor(Math.random() * (pool.length + 1));
    pool.splice(position, 0, raw);
    this.lastServed = null;
  }

  _usedFor(key) {
    if (!this.usedDisplays[key]) this.usedDisplays[key] = new Set();
    return this.usedDisplays[key];
  }

  async _getGrammarQuestion(level, difficulty) {
    const key = this._grammarKey(level);
    await this._ensureGrammarPool(level, difficulty);
    const pool = this.pools[key];

    if (!pool || pool.length === 0) {
      this.lastServed = null;
      return this._fallbackQuestion(level);
    }

    const raw = pool.shift();
    this.lastServed = { key, raw };

    if (pool.length <= 2) {
      this._ensureGrammarPool(level, difficulty);
    }

    return this._formatGrammarQuestion(raw, level);
  }

  async _getAudioQuestion(level) {
    const key = this._audioKey(level);
    await this._ensureAudioPool(level);
    const pool = this.pools[key];

    if (!pool || pool.length === 0) {
      this.lastServed = null;
      return this._fallbackAudioQuestion(level);
    }

    const raw = pool.shift();
    this.lastServed = { key, raw };

    if (pool.length <= 2) {
      this._ensureAudioPool(level);
    }

    return this._formatAudioQuestion(raw, level);
  }

  _randomGrammarTopic() {
    return this.grammarTopics[Math.floor(Math.random() * this.grammarTopics.length)] || 'Artikel';
  }

  _difficultyFor(level, explicitDifficulty) {
    return Math.min(4, Math.max(1, Number(explicitDifficulty) || LEVEL_RANK[level] || 1));
  }

  _grammarKey(level) {
    return `grammar:${level}`;
  }

  _audioKey(level) {
    return `audio:${level}`;
  }

  async _ensureGrammarPool(level, difficulty) {
    const key = this._grammarKey(level);
    if (this.fetching[key]) return this.fetching[key];
    const pool = this.pools[key];
    if (pool && pool.length > 2) return pool;

    this.fetching[key] = this._fetchGrammarQuestions(level, difficulty)
      .catch((error) => {
        console.warn(`Не удалось загрузить вопросы (${level}):`, error);
        return [];
      })
      .finally(() => {
        delete this.fetching[key];
      });

    return this.fetching[key];
  }

  async _ensureAudioPool(level) {
    const key = this._audioKey(level);
    if (this.fetching[key]) return this.fetching[key];
    const pool = this.pools[key];
    if (pool && pool.length > 2) return pool;

    this.fetching[key] = this._fetchAudioQuestions(level)
      .catch((error) => {
        console.warn(`Не удалось загрузить аудио-вопросы (${level}):`, error);
        return [];
      })
      .finally(() => {
        delete this.fetching[key];
      });

    return this.fetching[key];
  }

  async _fetchGrammarQuestions(level, difficulty) {
    const key = this._grammarKey(level);
    const grammarTopic = this._randomGrammarTopic();
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        lexicalTopic: this.lexicalTopic,
        grammarTopic,
        isWortstellung: isWortstellungTopic(grammarTopic),
        difficulty: this._difficultyFor(level, difficulty),
        count: 12,
        exclude: Array.from(this._usedFor(key)).slice(-12)
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const valid = (data.questions || []).filter(validRawQuestion);
    valid.forEach((question) => { question.grammarTopic = grammarTopic; });
    this.pools[key] = [...(this.pools[key] || []), ...shuffleArray(valid)];
    return this.pools[key];
  }

  async _fetchAudioQuestions(level) {
    const key = this._audioKey(level);
    const response = await fetch('/api/generate-audio-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        lexicalTopic: this.lexicalTopic,
        count: 12,
        exclude: Array.from(this._usedFor(key)).slice(-12)
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const valid = (data.questions || [])
      .filter((question) => validRawQuestion(question) && typeof question.audioText === 'string' && question.audioText.trim());
    this.pools[key] = [...(this.pools[key] || []), ...shuffleArray(valid)];
    return this.pools[key];
  }

  _formatGrammarQuestion(raw, level) {
    const correctAnswer = raw.options[raw.correct];
    const shuffledOptions = shuffleArray(raw.options);

    return {
      mode: 'grammar',
      level,
      grammarTopic: raw.grammarTopic || this._randomGrammarTopic(),
      text: raw.text,
      display: raw.display,
      options: {
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctAnswer)
      }
    };
  }

  _formatAudioQuestion(raw, level) {
    const correctAnswer = raw.options[raw.correct];
    const shuffledOptions = shuffleArray(raw.options);

    return {
      mode: 'audio',
      level,
      grammarTopic: 'Audio',
      text: raw.text || 'Прослушай немецкое предложение и выбери точный русский перевод.',
      display: raw.display || 'Немецкая фраза звучит вслух. Выбери перевод.',
      audioText: raw.audioText,
      options: {
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctAnswer)
      }
    };
  }

  _fallbackQuestion(level) {
    return {
      mode: 'grammar',
      level,
      grammarTopic: this._randomGrammarTopic(),
      text: 'Резервное упражнение',
      display: 'Сервер вопросов временно недоступен. Нажмите OK, чтобы продолжить спуск.',
      options: {
        options: ['OK', 'Пауза', 'Ошибка', 'Назад'],
        correctIndex: 0
      }
    };
  }

  _fallbackAudioQuestion(level) {
    const maxRank = LEVEL_RANK[level] || LEVEL_RANK.A2;
    const candidates = AUDIO_QUESTION_POOL.filter((question) => (LEVEL_RANK[question.level] || 1) <= maxRank);
    const source = candidates.length ? candidates : AUDIO_QUESTION_POOL;
    const raw = source[this.audioFallbackCursor % source.length];
    this.audioFallbackCursor += 1;
    return this._formatAudioQuestion(raw, level);
  }
}

const AudioQuiz = (() => {
  const cache = new Map();
  let currentQuestion = null;
  let token = 0;
  let button = null;

  function ensureButton() {
    if (button || !document.body) return;
    button = document.createElement('button');
    button.id = 'audio-repeat';
    button.type = 'button';
    button.textContent = '▶';
    button.title = 'Повторить аудио-вопрос';
    button.addEventListener('click', () => play(currentQuestion, true));
    document.body.appendChild(button);
  }

  function fallbackSpeech(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'de-DE';
    utter.rate = 0.88;
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const germanVoice = voices.find((voice) => /^de[-_]/i.test(voice.lang || ''));
    if (germanVoice) utter.voice = germanVoice;
    window.speechSynthesis.speak(utter);
  }

  async function play(question, force = false) {
    ensureButton();
    currentQuestion = question && question.audioText ? question : null;
    token += 1;
    const myToken = token;

    if (button) {
      button.classList.toggle('on', Boolean(currentQuestion));
      button.classList.remove('loading');
    }
    if (!currentQuestion) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }
    if (!force && currentQuestion._audioPlayed) return;
    currentQuestion._audioPlayed = true;

    const text = currentQuestion.audioText;
    if (button) button.classList.add('loading');
    try {
      let buffer = cache.get(text);
      if (!buffer) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error(`TTS HTTP ${response.status}`);
        buffer = await response.arrayBuffer();
        cache.set(text, buffer.slice(0));
      }
      if (myToken !== token) return;
      const url = URL.createObjectURL(new Blob([buffer.slice(0)], { type: 'audio/mpeg' }));
      const audio = new Audio(url);
      audio.addEventListener('ended', () => URL.revokeObjectURL(url), { once: true });
      await audio.play();
    } catch (_) {
      if (myToken === token) fallbackSpeech(text);
    } finally {
      if (myToken === token && button) button.classList.remove('loading');
    }
  }

  return { play, ensureButton };
})();

window.playQuizAudio = (question, force) => AudioQuiz.play(question, force);

document.addEventListener('DOMContentLoaded', () => {
  AudioQuiz.ensureButton();
});
