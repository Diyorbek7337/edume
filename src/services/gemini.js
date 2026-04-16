// AI Service - Google Gemini va Groq
// Test savollarini avtomatik yaratish uchun
// ESLATMA: API kalitni Google Cloud Console'da domenga cheklang:
// https://console.cloud.google.com/apis/credentials → API key → Application restrictions → HTTP referrers

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const getActiveProvider = () => {
  if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key') return 'groq';
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key') return 'gemini';
  return null;
};

export const geminiAPI = {
  generateQuestions: async (topic, count = 5, difficulty = 'medium', language = 'uz') => {
    const provider = getActiveProvider();

    if (!provider) {
      throw new Error("AI API sozlanmagan. .env faylga VITE_GROQ_API_KEY yoki VITE_GEMINI_API_KEY qo'shing.");
    }

    const difficultyMap = {
      easy: "oson (boshlang'ich daraja)",
      medium: "o'rta (o'rta daraja)",
      hard: "qiyin (yuqori daraja)"
    };
    const languageMap = { uz: "o'zbek tilida", ru: "rus tilida", en: "ingliz tilida" };

    const prompt = `Sen test savollarini yaratuvchi mutaxassisan.

Vazifa: "${topic}" mavzusi bo'yicha ${count} ta test savoli yarat.
Qiyinlik darajasi: ${difficultyMap[difficulty]}
Til: ${languageMap[language]}

Har bir savol uchun:
- 1 ta savol matni
- 4 ta javob varianti (A, B, C, D)
- To'g'ri javob indeksi (0, 1, 2 yoki 3)

MUHIM: Faqat JSON formatida javob ber, boshqa hech narsa yozma!

JSON formati:
[
  {
    "question": "Savol matni",
    "options": ["A varianti", "B varianti", "C varianti", "D varianti"],
    "correctAnswer": 0
  }
]

Eslatma:
- Savollar aniq va tushunarli bo'lsin
- Variantlar mantiqiy bo'lsin
- Faqat bitta to'g'ri javob bo'lsin
- correctAnswer 0-3 orasida bo'lsin (0=A, 1=B, 2=C, 3=D)`;

    try {
      let text;

      if (provider === 'groq') {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 4096
          })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || 'Groq API xatolik');
        }
        const data = await response.json();
        text = data.choices?.[0]?.message?.content;

      } else {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
            })
          }
        );
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || 'Gemini API xatolik');
        }
        const data = await response.json();
        text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      if (!text) throw new Error("Javob bo'sh qaytdi");

      let jsonStr = text.trim();
      if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
      if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
      if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
      jsonStr = jsonStr.trim();

      const questions = JSON.parse(jsonStr);
      const points = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10;

      return questions.map((q, i) => ({
        id: Date.now() + i,
        question: q.question || '',
        type: 'single',
        options: q.options || ['', '', '', ''],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        points
      }));

    } catch (error) {
      console.error('AI API error:', error);
      throw error;
    }
  },

  isConfigured: () => getActiveProvider() !== null,
  getProvider: () => getActiveProvider()
};

export default geminiAPI;
