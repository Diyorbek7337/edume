import { auth } from './firebase';

const FUNCTION_URL = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/generateAI`;

export const geminiAPI = {
  generateQuestions: async (topic, count = 5, difficulty = 'medium', language = 'uz') => {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error('Tizimga kiring');

    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ topic, count, difficulty, language }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI xatolik');
    return data.questions;
  },

  isConfigured: () => true,
  getProvider: () => 'gemini',
};

export default geminiAPI;
