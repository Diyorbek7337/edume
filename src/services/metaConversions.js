import { auth } from './firebase';

const FUNCTION_URL = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/metaConversionsEvent`;

const sendEvent = async ({ eventName, email, phone, leadId }) => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) return;

    await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        event_name: eventName,
        email: email || undefined,
        phone: phone || undefined,
        lead_id: leadId || undefined,
      }),
    });
  } catch (e) {
    console.warn('Meta CAPI:', e.message);
  }
};

export const metaConversions = {
  // Yangi lid qo'shilganda
  trackLead: ({ email, phone, leadId }) =>
    sendEvent({ eventName: 'Lead', email, phone, leadId }),

  // Lid o'quvchiga aylanganda
  trackRegistration: ({ email, phone }) =>
    sendEvent({ eventName: 'CompleteRegistration', email, phone }),
};
