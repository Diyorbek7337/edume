// Google Gemini AI Service
// Test savollarini avtomatik yaratish uchun

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const geminiAPI = {
  /**
   * Test savollarini yaratish
   * @param {string} topic - Mavzu nomi
   * @param {number} count - Savollar soni
   * @param {string} difficulty - Qiyinlik darajasi (easy, medium, hard)
   * @param {string} language - Til (uz, ru, en)
   * @returns {Promise<Array>} - Savollar ro'yxati
   */
  generateQuestions: async (topic, count = 5, difficulty = 'medium', language = 'uz') => {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key topilmadi. .env faylga VITE_GEMINI_API_KEY qo\'shing.');
    }

    const difficultyMap = {
      easy: "oson (boshlang'ich daraja)",
      medium: "o'rta (o'rta daraja)", 
      hard: "qiyin (yuqori daraja)"
    };

    const languageMap = {
      uz: "o'zbek tilida",
      ru: "rus tilida",
      en: "ingliz tilida"
    };

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
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(errorData.error?.message || 'API xatolik');
      }

      const data = await response.json();
      
      // Response dan textni olish
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('Javob bo\'sh qaytdi');
      }

      // JSON ni parse qilish
      // Ba'zan Gemini ```json ... ``` bilan o'rab yuboradi
      let jsonStr = text.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const questions = JSON.parse(jsonStr);

      // Validatsiya va formatlash
      return questions.map((q, index) => ({
        id: Date.now() + index,
        question: q.question || '',
        type: 'single',
        options: q.options || ['', '', '', ''],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        points: difficulty === 'easy' ? 5 : difficulty === 'hard' ? 15 : 10
      }));

    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },

  /**
   * API key mavjudligini tekshirish
   */
  isConfigured: () => {
    return !!GEMINI_API_KEY && GEMINI_API_KEY !== 'your_gemini_api_key';
  }
};

export default geminiAPI;
