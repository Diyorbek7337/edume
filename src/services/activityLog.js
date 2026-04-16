import {
  collection, addDoc, getDocs, query, orderBy, limit as firestoreLimit, serverTimestamp
} from 'firebase/firestore';
import { db, getCurrentCenter } from './firebase';

const centerCollection = (name) => {
  const centerId = getCurrentCenter();
  if (!centerId) throw new Error('No center selected');
  return collection(db, `centers/${centerId}/${name}`);
};

// ==================== ACTION TYPES ====================
export const LOG_ACTIONS = {
  // Students
  STUDENT_ADDED:     { key: 'student_added',     label: "O'quvchi qo'shildi",    color: 'green',  icon: 'UserPlus' },
  STUDENT_UPDATED:   { key: 'student_updated',   label: "O'quvchi tahrirlandi",  color: 'blue',   icon: 'Edit' },
  STUDENT_DELETED:   { key: 'student_deleted',   label: "O'quvchi o'chirildi",   color: 'red',    icon: 'Trash' },
  STUDENT_GRADUATED: { key: 'student_graduated', label: "O'quvchi bitirdi",      color: 'purple', icon: 'GraduationCap' },
  // Teachers
  TEACHER_ADDED:   { key: 'teacher_added',   label: "O'qituvchi qo'shildi",   color: 'green', icon: 'UserPlus' },
  TEACHER_UPDATED: { key: 'teacher_updated', label: "O'qituvchi tahrirlandi", color: 'blue',  icon: 'Edit' },
  TEACHER_DELETED: { key: 'teacher_deleted', label: "O'qituvchi o'chirildi",  color: 'red',   icon: 'Trash' },
  // Groups
  GROUP_ADDED:   { key: 'group_added',   label: "Guruh qo'shildi",   color: 'green', icon: 'Users' },
  GROUP_UPDATED: { key: 'group_updated', label: 'Guruh tahrirlandi', color: 'blue',  icon: 'Edit' },
  GROUP_DELETED: { key: 'group_deleted', label: "Guruh o'chirildi",  color: 'red',   icon: 'Trash' },
  // Payments
  PAYMENT_ADDED: { key: 'payment_added', label: "To'lov qabul qilindi", color: 'green', icon: 'CreditCard' },
  // Leads
  LEAD_ADDED:          { key: 'lead_added',          label: "Lid qo'shildi",         color: 'green',  icon: 'UserPlus' },
  LEAD_STATUS_CHANGED: { key: 'lead_status_changed', label: 'Lid holati o\'zgartirildi', color: 'orange', icon: 'RefreshCw' },
};

// Find action meta by key string (for display)
export const getActionMeta = (key) => {
  return Object.values(LOG_ACTIONS).find(a => a.key === key) || { label: key, color: 'gray', icon: 'Activity' };
};

// ==================== API ====================
export const activityLogAPI = {
  /**
   * Log an admin/director action.
   * @param {object} opts
   * @param {string} opts.action   - LOG_ACTIONS.XXX.key
   * @param {string} opts.entityType - 'student' | 'teacher' | 'group' | 'payment' | 'lead'
   * @param {string} opts.entityName - Human-readable name of the entity
   * @param {object} [opts.details]  - Extra details (amount, groupName, etc.)
   * @param {object} opts.performer  - { id, fullName, role }
   */
  log: async ({ action, entityType, entityName, details = {}, performer }) => {
    try {
      await addDoc(centerCollection('activityLogs'), {
        action,
        entityType,
        entityName,
        details,
        performer,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Silent fail — logging must never block user actions
      console.warn('Activity log error:', err);
    }
  },

  getRecent: async (count = 100) => {
    try {
      const q = query(
        centerCollection('activityLogs'),
        orderBy('createdAt', 'desc'),
        firestoreLimit(count)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('Activity log fetch error:', err);
      return [];
    }
  },
};
