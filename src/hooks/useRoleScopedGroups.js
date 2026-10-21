import { useState, useEffect } from 'react';
import { groupsAPI, studentsAPI, teachersAPI } from '../services/api';
import { ROLES } from '../utils/constants';

// Attendance.jsx, Grades.jsx, Leaderboard.jsx, Quizzes.jsx va Payments.jsx da
// so'zma-so'zga yaqin holda takrorlangan (lekin bir-biridan sal farq qiluvchi)
// "foydalanuvchi roliga qarab tegishli guruh/talabani aniqlash" mantig'ini
// birlashtiradi. Moslash strategiyasi — barcha 5 sahifada ilgari ishlatilgan
// usullarning BIRLASHMASI (eng ishonchlisidan boshlab):
//   1) To'g'ridan-to'g'ri ID havolasi (userData.studentId / childId / childIds)
//      — Payments.jsx'da bor edi, boshqalarida yo'q edi. Eng ishonchli, chunki
//      foydalanuvchi tahrirlay oladigan maydonga (email/telefon) bog'liq emas.
//   2) Email — aniq moslik
//   3) Telefon — normallashtirilgan solishtirish (+998, bo'sh joy, tire farq
//      qilmaydi) — boshqa 4 sahifada bor edi, Payments.jsx'da yo'q edi (u faqat
//      aniq moslikni tekshirardi).
//   4) O'qituvchi uchun — to'liq ism (fullName) va guruhning teacherEmail
//      maydoni — faqat Payments.jsx'da bor edi.
// Endi bitta joyda tuzatiladi — masalan telefon-moslashtirish mantig'ida bug
// topilsa, 5 faylni emas, shu faylni tuzatish kifoya.

const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';

function findTeacherRecord(teachers, userData) {
  return teachers.find(t =>
    t.id === userData?.id ||
    t.email === userData?.email ||
    normalizePhone(t.phone) === normalizePhone(userData?.phone) ||
    (userData?.fullName && t.fullName === userData.fullName)
  );
}

function findStudentRecord(students, role, userData) {
  if (role === ROLES.PARENT) {
    if (userData?.childId) {
      const byId = students.find(s => s.id === userData.childId);
      if (byId) return byId;
    }
    if (userData?.childIds?.length > 0) {
      const byId = students.find(s => s.id === userData.childIds[0]);
      if (byId) return byId;
    }
    return students.find(s => s.isMine) || null; // o'z farzandi (studentsAPI: childIds)
  }

  if (userData?.studentId) {
    const byId = students.find(s => s.id === userData.studentId);
    if (byId) return byId;
  }
  return students.find(s => s.isMine) || null; // o'z yozuvi (studentsAPI: userId)
}

/**
 * Foydalanuvchi roliga qarab tegishli guruhlarni (va o'quvchi/ota-ona bo'lsa —
 * talaba yozuvini) yuklaydi.
 *
 * @param {string} role
 * @param {object} userData
 * @returns {{ groups: object[], studentData: object|null, loading: boolean, error: Error|null }}
 */
export function useRoleScopedGroups(role, userData) {
  const [groups, setGroups] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = userData?.id;
  const userEmail = userData?.email;
  const userPhone = userData?.phone;
  const userFullName = userData?.fullName;
  const userStudentId = userData?.studentId;
  const userChildId = userData?.childId;
  const userChildIds = userData?.childIds?.join(',');

  useEffect(() => {
    let cancelled = false;

    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        let groupsData = [];

        if (role === ROLES.TEACHER) {
          const allTeachers = await teachersAPI.getAll();
          const teacher = findTeacherRecord(allTeachers, userData);

          const allGroups = await groupsAPI.getAll();
          if (teacher) groupsData = allGroups.filter(g => g.teacherId === teacher.id);
          // Legacy/qo'shimcha moslashlar: users ID yoki guruhning o'z teacherEmail maydoni
          const groups2 = allGroups.filter(g =>
            g.teacherId === userId || (userEmail && g.teacherEmail === userEmail)
          );
          groupsData = [...groupsData, ...groups2].filter((g, i, self) =>
            i === self.findIndex(t => t.id === g.id)
          );
        } else if (role === ROLES.STUDENT || role === ROLES.PARENT) {
          const allStudents = await studentsAPI.getAll();
          const student = findStudentRecord(allStudents, role, userData);

          if (student) {
            if (!cancelled) setStudentData(student);
            const allGroups = await groupsAPI.getAll();
            groupsData = allGroups.filter(g =>
              g.id === student.groupId || g.studentIds?.includes(student.id)
            );
          }
        } else {
          groupsData = await groupsAPI.getAll();
        }

        if (!cancelled) setGroups(groupsData);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGroups();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId, userEmail, userPhone, userFullName, userStudentId, userChildId, userChildIds]);

  return { groups, studentData, loading, error };
}
