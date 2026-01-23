// services/attendanceAPI.js
import {
  getDocs,
  query,
  where,
  writeBatch,
  doc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from './firebase';
// import { centerCollection } from './helpers'; 
// 👆 sening loyihangda bor helper

const attendanceAPI = {

  // ✅ Guruh + sana bo‘yicha o‘qish
  getByGroupAndDate: async (groupId, date) => {
    try {
      const q = query(
        centerCollection('attendance'),
        where('groupId', '==', groupId),
        where('date', '==', date)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('attendance getByGroupAndDate error:', err);
      throw err; // ❗️yutma, tashqariga chiqar
    }
  },

  // ✅ SAQLASH (ASOSIY FUNKSIYA)
  save: async (groupId, date, records) => {
    try {
      const batch = writeBatch(db);

      records.forEach(record => {
        const ref = doc(centerCollection('attendance'));

        batch.set(ref, {
          groupId,
          date,
          studentId: record.studentId,
          studentName: record.studentName,
          status: record.status,
          createdAt: serverTimestamp()
        });
      });

      await batch.commit();
    } catch (err) {
      console.error('attendance save error:', err);
      throw err;
    }
  }

};

export default attendanceAPI;
