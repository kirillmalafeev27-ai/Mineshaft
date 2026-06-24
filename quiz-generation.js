const questionPool = Object.create(null);
const audioQuestionPool = Object.create(null);
const ttsAudioCache = new Map();

const DEFAULT_MODELS = 'gpt-5.4,gpt-5.2,gpt-5,gpt-5-mini,gpt-4o,gpt-4o-mini';
const AITUNNEL_MODELS = (process.env.AITUNNEL_MODELS || DEFAULT_MODELS)
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVEN_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2_5';
const TTS_CACHE_LIMIT = Number(process.env.TTS_CACHE_LIMIT || 180);
const CYRILLIC_RE = /[\u0400-\u04FF]/;

const TOPIC_RULES = {
  'Infinitiv mit zu': 'Use only verbs and structures that require zu + infinitive: versuchen, anfangen, aufhoeren, planen, hoffen, vergessen, sich freuen, Lust haben, Es ist wichtig/moeglich/schwer. Do not use modal verbs with zu.',
  Modalverben: 'Modal verb on position 2; full verb as infinitive at the end without zu. Include koennen, muessen, sollen, wollen, duerfen, moegen/moechten.',
  Perfekt: 'Use sein for movement/change of state and haben for most other verbs. Respect separable and inseparable prefixes and -ieren verbs.',
  Praeteritum: 'Use regular -te endings, strong verb vowel changes, and mixed verbs such as brachte, dachte, wusste.',
  Dativ: 'Use dative prepositions, dative verbs, and correct forms: dem, der, den + -n; einem/einer.',
  Akkusativ: 'Use accusative prepositions and direct objects. Masculine article changes to den/einen.',
  Genitiv: 'Use wegen, trotz, waehrend, innerhalb, ausserhalb, statt; masculine/neuter nouns take -(e)s.',
  Adjektivdeklination: 'Check adjective endings after definite, indefinite, and zero articles. Exactly one option must have the correct ending.',
  'Komparativ oder Superlativ vor Nomen': `The target is attributive comparative and superlative adjectives directly before nouns, for example "ein größeres Haus" and "das größte Haus".
The learner must decide from the meaning whether the comparative or superlative is required and must also choose the correct adjective ending for the article, gender, number, and case.
Use the comparative for a direct comparison with another person, thing, or reference point, often with als. Use the superlative for the highest or lowest degree within an explicit group, with cues such as von allen, in der Klasse, or im ganzen Land.
Use common irregular forms where suitable, including besser/best-, höher/höchst-, näher/nächst-, and größer/größt-, but keep vocabulary within the requested CEFR level.
Every tested adjective must be attributive before a noun. Do not test predicative forms such as "größer als" without a following noun, and do not use adverbial "am größten" as the correct answer.
Create a deliberately mixed exercise set instead of repeating one template. Rotate evenly among these four formats:
1. Fill one blank inside a German sentence with the correct inflected adjective before a noun.
2. Read a short comparison context and choose the one complete German sentence that expresses it correctly.
3. Find and replace an incorrect adjective+noun phrase; the four options are possible replacement phrases.
4. Read a situation or meaning cue and choose the correct complete noun phrase containing the article, adjective, and noun.
For a batch of 8 or more tasks, use every format at least twice. Vary the Russian Anweisung to match the format. Keep exactly one Satz or Aufgabe line and exactly four options in every task.`,
  Wechselpraepositionen: 'Use an, auf, hinter, in, neben, ueber, unter, vor, zwischen. Direction takes Akkusativ; location takes Dativ.',
  Negation: 'Use nicht for verbs/adjectives/adverbs/prepositional phrases and kein for nouns with indefinite or zero article.',
  'Wortstellung im Hauptsatz': 'Finite verb must be in position 2. If an adverb or object is in position 1, the subject follows the finite verb.',
  'Wortstellung im Nebensatz': 'After weil, dass, wenn, ob, obwohl, nachdem, als, the finite verb goes to the end.',
  'dass-Saetze': 'Use dass with subordinate-clause word order and the finite verb at the end.',
  'weil-Saetze': 'Use weil with subordinate-clause word order and the finite verb at the end.',
  'wenn-Saetze': 'Use wenn with the finite verb at the end; after an initial wenn-clause, the main clause starts with the finite verb.',
  Relativsaetze: 'Relative pronoun gender/number follows the antecedent, but case follows its role in the relative clause. Verb at the end.',
  'Konjunktiv II': 'Use polite requests, advice, and unreal wishes with waere, haette, koennte, muesste, sollte, duerfte, wuerde + infinitive.',
  Passiv: 'Use werden + Partizip II for Vorgangspassiv and sein + Partizip II for Zustandspassiv.',
  Praesens: 'Use present-tense endings and common stem-vowel changes in 2nd/3rd person singular.',
  'Futur I': 'Use werden + infinitive, with the infinitive at the end.',
  Imperativ: 'Use imperative forms for du, ihr, and Sie. Do not add -st in du forms.',
  Artikel: 'Use correct definite and indefinite articles by gender, case, and number.',
  Nominativ: 'Use nominative for the subject and after sein, werden, bleiben.',
};

function aiKey() {
  return process.env.AITUNNEL_API_KEY || process.env.OPENAI_API_KEY || '';
}

function aiBaseUrl() {
  if (process.env.AI_BASE_URL) return process.env.AI_BASE_URL.replace(/\/$/, '');
  if (process.env.OPENAI_BASE_URL) return process.env.OPENAI_BASE_URL.replace(/\/$/, '');
  return process.env.AITUNNEL_API_KEY ? 'https://api.aitunnel.ru/v1' : 'https://api.openai.com/v1';
}

function normalizeTopicKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Г¤|Ã¤/g, 'a').replace(/Г¶|Ã¶/g, 'o').replace(/Гј|Ã¼/g, 'u').replace(/Гџ|ÃŸ/g, 'ss')
    .replace(/Г„|Ã„/g, 'A').replace(/Г–|Ã–/g, 'O').replace(/Гњ|Ãœ/g, 'U')
    .replace(/ae/gi, 'a').replace(/oe/gi, 'o').replace(/ue/gi, 'u')
    .replace(/saetze/gi, 'satze')
    .replace(/praeposition/gi, 'praposition')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function topicRuleFor(grammarTopic) {
  const target = normalizeTopicKey(grammarTopic);
  const entry = Object.entries(TOPIC_RULES).find(([topic]) => normalizeTopicKey(topic) === target);
  return entry ? entry[1] : '';
}

function isValidQuestion(question) {
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

function normalizeAnswerText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[„“"']/g, '')
    .trim()
    .toLowerCase();
}

function answerLetterToIndex(letter) {
  return ['A', 'B', 'C', 'D'].indexOf(String(letter || '').trim().toUpperCase());
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function parseSyntheticQuestions(rawText, expectedCount) {
  const text = String(rawText || '').replace(/\r/g, '').trim();
  const solutionMarker = text.match(/\n\s*(?:={2,}\s*)?(?:LOESUNGEN|LÖSUNGEN|LГ–SUNGEN|ANTWORTEN|SCHLUESSEL|SCHLÜSSEL|KEYS)(?:\s*={2,})?\s*\n/i);
  if (!solutionMarker) return [];

  const tasksText = text.slice(0, solutionMarker.index).replace(/^\s*(?:={2,}\s*)?AUFGABEN(?:\s*={2,})?\s*/i, '').trim();
  const keysText = text.slice(solutionMarker.index + solutionMarker[0].length).trim();
  const keyMap = new Map();
  const keyRegex = /(?:^|\n)\s*(\d{1,2})\s*[\.\):=-]\s*([ABCD])(?:\s*=\s*(.+?))?\s*(?=\n|$)/gi;
  let keyMatch;

  while ((keyMatch = keyRegex.exec(keysText))) {
    const number = Number(keyMatch[1]);
    const index = answerLetterToIndex(keyMatch[2]);
    if (number > 0 && index >= 0) {
      keyMap.set(number, {
        index,
        answerText: keyMatch[3] ? keyMatch[3].trim() : '',
      });
    }
  }

  const blocks = tasksText
    .split(/\n(?=\s*\d{1,2}\.\s+)/)
    .map((block) => block.trim())
    .filter(Boolean);

  const parsed = [];
  for (const block of blocks) {
    const numberMatch = block.match(/^\s*(\d{1,2})\.\s*(.*)$/m);
    if (!numberMatch) continue;

    const number = Number(numberMatch[1]);
    const key = keyMap.get(number);
    if (!key) continue;

    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    const optionLines = [];
    const bodyLines = [];

    for (const line of lines) {
      const optionMatch = line.match(/^([ABCD])[\)\.:]\s*(.+)$/i);
      if (optionMatch) {
        optionLines.push({
          label: optionMatch[1].toUpperCase(),
          value: optionMatch[2].trim(),
        });
      } else if (!/^\d{1,2}\.\s*$/.test(line)) {
        bodyLines.push(line.replace(/^\d{1,2}\.\s*/, '').trim());
      }
    }

    if (optionLines.length !== 4) continue;
    const orderedOptions = ['A', 'B', 'C', 'D'].map((label) => optionLines.find((option) => option.label === label)?.value || '');
    if (orderedOptions.some((option) => !option)) continue;
    if (new Set(orderedOptions.map(normalizeAnswerText)).size !== 4) continue;

    if (key.answerText) {
      const keyText = normalizeAnswerText(key.answerText);
      const optionText = normalizeAnswerText(orderedOptions[key.index]);
      if (keyText && keyText !== optionText) continue;
    }

    const instructionLine = bodyLines.find((line) => /^Anweisung\s*:/i.test(line));
    const displayLine = bodyLines.find((line) => /^(Satz|Aufgabe|Wörter|Woerter)\s*:/i.test(line));
    const instruction = instructionLine
      ? instructionLine.replace(/^Anweisung\s*:\s*/i, '').trim()
      : 'Выбери правильный вариант.';
    const display = displayLine
      ? displayLine.replace(/^(Satz|Aufgabe|Wörter|Woerter)\s*:\s*/i, '').trim()
      : bodyLines.filter((line) => !/^Anweisung\s*:/i.test(line))[0];

    const question = {
      text: instruction,
      display,
      options: orderedOptions,
      correct: key.index,
    };

    if (isValidQuestion(question)) parsed.push(question);
    if (parsed.length >= expectedCount) break;
  }

  return parsed;
}

function parseJsonQuestions(rawText) {
  const text = String(rawText || '').trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text;
  const parsed = JSON.parse(jsonStr);
  return Array.isArray(parsed) ? parsed.filter(isValidQuestion) : [];
}

function stripOuterQuotes(value) {
  return String(value || '')
    .replace(/^[\s"'`«»„“”]+|[\s"'`«»„“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAudioPairs(rawText, expectedCount) {
  const text = String(rawText || '')
    .replace(/\r/g, '')
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ''))
    .trim();
  const chunks = text
    .split(/\n+|(?=\s*\d{1,2}[\).]\s+)/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = [];
  const seen = new Set();
  for (const chunk of chunks) {
    const line = chunk.replace(/^\s*(?:[-*•]\s*)?(?:\d{1,2}[\).:-]\s*)?/, '').trim();
    if (!line || /^(paare|pairs|sätze|saetze|sentences|antworten|translations)/i.test(line)) continue;

    let match = line.match(/^(?:DE|Deutsch|Original)\s*:\s*(.+?)\s*(?:RU|Russisch|Russian|Русский|Перевод)\s*:\s*(.+)$/i);
    if (!match) match = line.match(/^(.+?)\s*(?:—|–|->|=>|\|)\s*(.+)$/);
    if (!match) match = line.match(/^(.+?)\s+-\s+(.+)$/);
    if (!match) match = line.match(/^(.+?)\s*:\s*(.+)$/);
    if (!match) continue;

    const de = stripOuterQuotes(match[1]);
    const ru = stripOuterQuotes(match[2]);
    if (!de || !ru) continue;
    if (CYRILLIC_RE.test(de)) continue;
    if (!CYRILLIC_RE.test(ru)) continue;
    if (de.length < 8 || ru.length < 8 || de.length > 220 || ru.length > 220) continue;

    const key = normalizeAnswerText(de);
    if (seen.has(key)) continue;
    seen.add(key);
    parsed.push({ de, ru });
    if (parsed.length >= expectedCount) break;
  }
  return parsed;
}

function normalizeAudioQuestion(raw, level, lexicalTopic) {
  if (!raw || typeof raw !== 'object') return null;
  const audioText = stripOuterQuotes(raw.audioText || raw.audio || raw.de || raw.satz || raw.sentence);
  if (!audioText || CYRILLIC_RE.test(audioText)) return null;

  const options = Array.isArray(raw.options)
    ? raw.options.map((option) => stripOuterQuotes(option)).filter(Boolean)
    : [];
  if (options.length !== 4 || options.some((option) => !CYRILLIC_RE.test(option))) return null;

  let correct = Number.isInteger(raw.correct) ? raw.correct : Number.NaN;
  if (!Number.isInteger(correct)) correct = answerLetterToIndex(raw.correct);
  if (correct < 0 && raw.correctAnswer) {
    const correctAnswer = normalizeAnswerText(raw.correctAnswer);
    correct = options.findIndex((option) => normalizeAnswerText(option) === correctAnswer);
  }
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) return null;
  if (new Set(options.map(normalizeAnswerText)).size !== 4) return null;

  const question = {
    mode: 'audio',
    level,
    topic: lexicalTopic || 'Audio',
    text: raw.text || 'Прослушай немецкое предложение и выбери точный русский перевод.',
    display: raw.display || 'Немецкая фраза звучит вслух. Выбери перевод.',
    audioText,
    options,
    correct,
  };
  return isValidQuestion(question) ? question : null;
}

function parseJsonAudioQuestions(rawText, expectedCount, level, lexicalTopic) {
  const text = String(rawText || '').trim();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text;
  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((item) => normalizeAudioQuestion(item, level, lexicalTopic))
    .filter(Boolean)
    .slice(0, expectedCount);
}

function buildRussianDistractors(correct, allPairs) {
  const base = stripOuterQuotes(correct);
  const normalizedCorrect = normalizeAnswerText(base);
  const options = [];
  const add = (value) => {
    const option = stripOuterQuotes(value);
    if (!option) return;
    const norm = normalizeAnswerText(option);
    if (!norm || norm === normalizedCorrect) return;
    if (options.some((existing) => normalizeAnswerText(existing) === norm)) return;
    options.push(option);
  };

  const neighbors = (allPairs || [])
    .map((pair) => pair.ru)
    .filter(Boolean)
    .sort((a, b) => Math.abs(a.length - base.length) - Math.abs(b.length - base.length));
  for (const neighbor of neighbors) add(neighbor);

  return options.slice(0, 3);
}

function formatAudioQuestion(pair, allPairs, level, lexicalTopic) {
  const distractors = buildRussianDistractors(pair.ru, allPairs);
  if (distractors.length < 3) return null;

  const correctAnswer = stripOuterQuotes(pair.ru);
  const options = shuffle([correctAnswer, ...distractors]).slice(0, 4);
  const correct = options.findIndex((option) => normalizeAnswerText(option) === normalizeAnswerText(correctAnswer));
  if (correct < 0) return null;
  if (new Set(options.map(normalizeAnswerText)).size !== 4) return null;

  return {
    mode: 'audio',
    level,
    topic: lexicalTopic || 'Audio',
    text: 'Прослушай немецкое предложение и выбери точный русский перевод.',
    display: 'Немецкая фраза звучит вслух. Выбери перевод.',
    audioText: pair.de,
    options,
    correct,
  };
}

function buildSyntheticPrompt({ level, lexicalTopic, grammarTopic, isWortstellung, questionsCount, exclude, topicRule }) {
  const ruleBlock = topicRule ? `\nSpecific rule for "${grammarTopic}":\n${topicRule}\n` : '';
  const excludeBlock = exclude && exclude.length
    ? `\nDo not reuse these German sentences: ${exclude.slice(-12).map((item) => `"${item}"`).join(', ')}\n`
    : '';
  const isAttributiveDegrees =
    normalizeTopicKey(grammarTopic) === normalizeTopicKey('Komparativ oder Superlativ vor Nomen');
  const taskKind = isWortstellung
    ? 'word-order exercises. The Aufgabe/Satz line contains shuffled words or sentence parts.'
    : isAttributiveDegrees
      ? 'a varied mix of four multiple-choice formats described in the specific topic rule. Do not make every task a gap-fill.'
      : 'gap-fill exercises. The Satz line contains one German sentence with exactly one blank ___.';

  return `You are an experienced DaF teacher and textbook author.

Create exactly ${questionsCount} German multiple-choice grammar exercises.
Level: ${level}. Do not use grammar or vocabulary above ${level}.
Grammar topic: ${grammarTopic}.
Lexical topic: ${lexicalTopic || 'frei'}.
Exercise type: ${taskKind}
${ruleBlock}${excludeBlock}
Quality rules:
1. Every task has exactly four answer options A, B, C, D.
2. Exactly one option is grammatically correct.
3. Wrong options are plausible but clearly wrong for the grammar topic.
4. The correct option must be fully correct. If unsure, rewrite the task.
5. Sentences must be natural, complete, and varied.
6. Solve every task yourself before writing the answer key.
7. In LOESUNGEN, write the letter and the exact text of the correct option.
8. No explanations, no Markdown, no JSON.

Output format exactly:
AUFGABEN
1. Anweisung: Выбери правильный вариант.
Satz: ...
A) ...
B) ...
C) ...
D) ...

2. Anweisung: Выбери правильный вариант.
Satz: ...
A) ...
B) ...
C) ...
D) ...

LOESUNGEN
1: A = exact text of option A
2: C = exact text of option C

Now write the full block with ${questionsCount} tasks and then LOESUNGEN.`;
}

function buildAudioPrompt({ level, lexicalTopic, questionsCount, exclude }) {
  const excludePart = exclude && exclude.length
    ? `\nDo not reuse these German sentences: ${exclude.slice(-12).map((item) => `"${item}"`).join(', ')}\n`
    : '';

  return `You are an experienced DaF teacher building listening-comprehension tasks with strong, fair distractors.

Create exactly ${questionsCount} short German listening tasks with one exact Russian translation and three wrong Russian options.
Level: ${level}. Do not use grammar or vocabulary above ${level}.
Lexical topic: ${lexicalTopic || 'Alltag'}.
${excludePart}
Rules:
1. Every German sentence is natural, complete, and 6 to 14 words long.
2. The correct Russian option is an exact translation.
3. Wrong options are realistic learner traps: similar word field, separable prefix, modal verb, preposition, case relation, movement direction, false friend, or verb valency.
4. All four options are Russian, similarly short, plausible, and distinct.

Output only a JSON array, no Markdown:
[
  {
    "audioText": "Ich hole das Rezept in der Apotheke ab.",
    "options": [
      "Я забираю рецепт в аптеке.",
      "Я отдаю рецепт в аптеке.",
      "Я забираю чек в аптеке.",
      "Я забираю рецепт у врача."
    ],
    "correct": 0
  }
]

Write exactly ${questionsCount} objects now.`;
}

async function requestAiText(prompt, maxTokens) {
  const key = aiKey();
  if (!key) {
    const error = new Error('AITUNNEL_API_KEY or OPENAI_API_KEY is not configured');
    error.statusCode = 503;
    throw error;
  }

  const errors = [];
  for (const model of AITUNNEL_MODELS) {
    try {
      const response = await fetch(`${aiBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const bodyText = await response.text();
      if (!response.ok) {
        errors.push(`${model}: HTTP ${response.status} ${bodyText.slice(0, 220)}`);
        continue;
      }

      const data = JSON.parse(bodyText);
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim()) return content.trim();
      errors.push(`${model}: empty response`);
    } catch (error) {
      errors.push(`${model}: ${error?.message || String(error)}`);
    }
  }

  const error = new Error(`AI Tunnel: all models failed: ${errors.join(' | ')}`);
  error.statusCode = 502;
  throw error;
}

function putTtsCache(key, entry) {
  if (ttsAudioCache.has(key)) ttsAudioCache.delete(key);
  ttsAudioCache.set(key, entry);
  while (ttsAudioCache.size > TTS_CACHE_LIMIT) {
    const oldestKey = ttsAudioCache.keys().next().value;
    ttsAudioCache.delete(oldestKey);
  }
}

function installQuizRoutes(app) {
  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/quiz/status', (_req, res) => {
    res.json({
      ok: true,
      generationConfigured: Boolean(aiKey()),
      ttsConfigured: Boolean(ELEVENLABS_API_KEY),
      models: AITUNNEL_MODELS,
    });
  });

  app.post('/api/generate-questions', async (req, res) => {
    const { level, lexicalTopic, grammarTopic, isWortstellung, difficulty, count, exclude } = req.body || {};
    if (!level || !grammarTopic) {
      return res.status(400).json({ error: 'level and grammarTopic are required' });
    }

    const questionsCount = Math.max(1, Math.min(30, Number(count) || 10));
    const difficultyTier = Math.min(4, Math.max(1, Number(difficulty) || 1));
    const cacheKey = `${level}:${grammarTopic}:${lexicalTopic || ''}:${isWortstellung ? 'w' : 'g'}:d${difficultyTier}`;
    if (questionPool[cacheKey] && questionPool[cacheKey].length >= questionsCount) {
      return res.json({ questions: questionPool[cacheKey].splice(0, questionsCount) });
    }

    const prompt = buildSyntheticPrompt({
      level,
      lexicalTopic,
      grammarTopic,
      isWortstellung,
      questionsCount,
      exclude: Array.isArray(exclude) ? exclude : [],
      topicRule: topicRuleFor(grammarTopic),
    });

    try {
      const text = await requestAiText(prompt, 8192);
      let valid = parseSyntheticQuestions(text, questionsCount);
      if (!valid.length) {
        try {
          valid = parseJsonQuestions(text).slice(0, questionsCount);
        } catch (_) {
          valid = [];
        }
      }
      if (!valid.length) {
        return res.status(502).json({ error: 'No valid synthetic questions in LLM response' });
      }

      if (valid.length > questionsCount) {
        if (!questionPool[cacheKey]) questionPool[cacheKey] = [];
        questionPool[cacheKey].push(...valid.slice(questionsCount));
      }

      return res.json({ questions: valid.slice(0, questionsCount) });
    } catch (error) {
      return res.status(error.statusCode || 502).json({ error: error.message || 'Failed to generate questions' });
    }
  });

  app.post('/api/generate-audio-questions', async (req, res) => {
    const { level, lexicalTopic, count, exclude } = req.body || {};
    if (!level) return res.status(400).json({ error: 'level is required' });

    const questionsCount = Math.max(1, Math.min(30, Number(count) || 10));
    const cacheKey = `audio:${level}:${lexicalTopic || ''}`;
    if (audioQuestionPool[cacheKey] && audioQuestionPool[cacheKey].length >= questionsCount) {
      return res.json({ questions: audioQuestionPool[cacheKey].splice(0, questionsCount) });
    }

    const requestCount = Math.max(questionsCount, 10);
    const prompt = buildAudioPrompt({
      level,
      lexicalTopic,
      questionsCount: requestCount,
      exclude: Array.isArray(exclude) ? exclude : [],
    });

    try {
      const text = await requestAiText(prompt, 4096);
      let valid = [];
      try {
        valid = parseJsonAudioQuestions(text, requestCount, level, lexicalTopic);
      } catch (_) {
        valid = [];
      }

      if (!valid.length) {
        const pairs = parseAudioPairs(text, requestCount);
        valid = pairs.map((pair) => formatAudioQuestion(pair, pairs, level, lexicalTopic)).filter(isValidQuestion);
      }
      if (!valid.length) {
        return res.status(502).json({ error: 'No valid audio questions in LLM response' });
      }

      if (valid.length > questionsCount) {
        if (!audioQuestionPool[cacheKey]) audioQuestionPool[cacheKey] = [];
        audioQuestionPool[cacheKey].push(...valid.slice(questionsCount));
      }

      return res.json({ questions: valid.slice(0, questionsCount) });
    } catch (error) {
      return res.status(error.statusCode || 502).json({ error: error.message || 'Failed to generate audio questions' });
    }
  });

  app.post('/api/tts', async (req, res) => {
    const text = String(req.body?.text || '').replace(/\s+/g, ' ').trim();
    if (!text) return res.status(400).json({ error: 'text is required' });
    if (text.length > 420) return res.status(400).json({ error: 'text is too long' });
    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({ error: 'ELEVENLABS_API_KEY is not configured' });
    }

    const cacheKey = `${ELEVENLABS_VOICE_ID}:${ELEVENLABS_MODEL_ID}:${text}`;
    const cached = ttsAudioCache.get(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-TTS-Cache', 'HIT');
      return res.send(cached.buffer);
    }

    try {
      const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(ELEVENLABS_VOICE_ID)}`, {
        method: 'POST',
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL_ID,
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.75,
            use_speaker_boost: true,
          },
        }),
      });

      if (!ttsResponse.ok) {
        const detail = await ttsResponse.text().catch(() => '');
        return res.status(502).json({ error: 'ElevenLabs TTS failed', detail: detail.slice(0, 500) });
      }

      const contentType = ttsResponse.headers.get('content-type') || 'audio/mpeg';
      const buffer = Buffer.from(await ttsResponse.arrayBuffer());
      if (!buffer.length) return res.status(502).json({ error: 'ElevenLabs returned empty audio' });

      putTtsCache(cacheKey, { buffer, contentType });
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-TTS-Cache', 'MISS');
      return res.send(buffer);
    } catch (error) {
      return res.status(502).json({ error: 'ElevenLabs TTS request failed', detail: error?.message || String(error) });
    }
  });
}

module.exports = { installQuizRoutes };
