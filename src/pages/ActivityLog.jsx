import { useState, useEffect, useRef } from 'react';
import {
  Activity, UserPlus, Edit2, Trash2, GraduationCap, CreditCard,
  ArrowRightLeft, Users, Search, Clock, RefreshCw
} from 'lucide-react';
import { Card, Loading, EmptyState, Input, Select } from '../components/common';
import { activityLogAPI } from '../services/activityLog';

// ==================== CONSTANTS ====================

const LEAD_STATUS_UZ = {
  new: 'Yangi',
  contacted: "Bog'lanildi",
  interested: 'Qiziqmoqda',
  trial: 'Sinov darsi',
  converted: "O'quvchiga aylandi",
  lost: 'Rad etdi',
};

const ROLE_LABELS = {
  director: 'Direktor',
  admin: 'Admin',
  teacher: "O'qituvchi",
};

// Each action: icon, border color, and sentence builder
const ACTION_CONFIG = {
  student_added: {
    Icon: UserPlus,
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni o'quvchilar ro'yxatiga qo'shdi`,
    sub: (log) => log.details?.groupName ? `Guruh: ${log.details.groupName}` : null,
  },
  student_updated: {
    Icon: Edit2,
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ma'lumotlarini yangiladi`,
    sub: (log) => log.details?.groupName ? `Guruh: ${log.details.groupName}` : null,
  },
  student_deleted: {
    Icon: Trash2,
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni o'quvchilar ro'yxatidan o'chirdi`,
    sub: () => null,
  },
  student_graduated: {
    Icon: GraduationCap,
    border: 'border-l-purple-500',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni bitiruvchi deb belgiladi`,
    sub: () => null,
  },
  teacher_added: {
    Icon: UserPlus,
    border: 'border-l-green-500',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni o'qituvchilar ro'yxatiga qo'shdi`,
    sub: (log) => log.details?.subject ? `Fan: ${log.details.subject}` : null,
  },
  teacher_updated: {
    Icon: Edit2,
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ma'lumotlarini yangiladi`,
    sub: () => null,
  },
  teacher_deleted: {
    Icon: Trash2,
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni o'qituvchilar ro'yxatidan o'chirdi`,
    sub: () => null,
  },
  group_added: {
    Icon: Users,
    border: 'border-l-teal-500',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} guruhini yaratdi`,
    sub: (log) => log.details?.teacherName ? `O'qituvchi: ${log.details.teacherName}` : null,
  },
  group_updated: {
    Icon: Edit2,
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} guruhini tahrirladi`,
    sub: () => null,
  },
  group_deleted: {
    Icon: Trash2,
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} guruhini o'chirdi`,
    sub: () => null,
  },
  payment_added: {
    Icon: CreditCard,
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    sentence: (log) => {
      const amount = log.details?.amount ? `${Number(log.details.amount).toLocaleString()} so'm` : '';
      return `${bold(log.performer?.fullName)} ${bold(log.entityName)} dan ${bold(amount)} to'lov qabul qildi`;
    },
    sub: (log) => {
      const parts = [];
      if (log.details?.method) parts.push(log.details.method);
      if (log.details?.groupName) parts.push(`Guruh: ${log.details.groupName}`);
      return parts.join(' • ') || null;
    },
  },
  lead_added: {
    Icon: UserPlus,
    border: 'border-l-orange-500',
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    sentence: (log) =>
      `${bold(log.performer?.fullName)} ${bold(log.entityName)} ni yangi lid sifatida qo'shdi`,
    sub: (log) => {
      const parts = [];
      if (log.details?.subject) parts.push(`Fan: ${log.details.subject}`);
      if (log.details?.source) parts.push(`Manba: ${log.details.source}`);
      return parts.join(' • ') || null;
    },
  },
  lead_status_changed: {
    Icon: ArrowRightLeft,
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    sentence: (log) => {
      const from = LEAD_STATUS_UZ[log.details?.fromStatus] || log.details?.fromStatus || '';
      const to = LEAD_STATUS_UZ[log.details?.toStatus] || log.details?.toStatus || '';
      return `${bold(log.performer?.fullName)} ${bold(log.entityName)} holatini ${bold(from)} → ${bold(to)} ga o'zgartirdi`;
    },
    sub: () => null,
  },
};

const DEFAULT_CONFIG = {
  Icon: Activity,
  border: 'border-l-gray-400',
  bg: 'bg-gray-50',
  iconColor: 'text-gray-500',
  sentence: (log) => `${log.performer?.fullName || 'Noma\'lum'} amal bajardi`,
  sub: () => null,
};

// bold() returns a marker object — rendered in SentenceText
const bold = (text) => ({ __bold: true, text: text || '' });

// ==================== RENDER HELPERS ====================

// Renders a sentence that may contain bold() markers
const SentenceText = ({ parts }) => {
  if (typeof parts === 'string') return <span>{parts}</span>;
  if (Array.isArray(parts)) {
    return parts.map((part, i) =>
      part?.__bold
        ? <strong key={i} className="font-semibold text-gray-900">{part.text}</strong>
        : <span key={i}>{part}</span>
    );
  }
  // Function returns mixed array — we need to handle template literal style
  return null;
};

// Build sentence parts from the config sentence function
// The sentence function returns a string mix — we parse bold markers
const buildSentence = (sentenceFn, log) => {
  // Call sentence fn — it returns a "mixed" result from template literal with bold() calls
  // We need to split the string by bold() objects
  // Strategy: collect all parts by overriding bold() locally
  const parts = [];
  let currentText = '';

  const result = sentenceFn(log);

  // result is a string with embedded objects from template literals
  // Actually template literals convert objects to "[object Object]"
  // Better approach: use a different pattern — return array from sentence fns

  // Since template literals stringify objects, let's parse differently:
  // We'll use the result as-is but extract bold portions via regex on the stringified
  // result, cross-referencing with the known bold values

  // Simplest working approach: return the sentence as JSX directly from config
  return result;
};

const timeAgo = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} soniya oldin`;
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 172800) return 'Kecha';
  return `${Math.floor(diff / 86400)} kun oldin`;
};

const exactTime = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
};

const formatDateHeader = (ts) => {
  if (!ts) return '';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Bugun';
  if (date.toDateString() === yesterday.toDateString()) return 'Kecha';
  return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
};

const groupByDate = (logs) => {
  const groups = {};
  logs.forEach(log => {
    const date = log.createdAt?.toDate ? log.createdAt.toDate() : new Date(log.createdAt || Date.now());
    const key = date.toDateString();
    if (!groups[key]) groups[key] = { label: formatDateHeader(log.createdAt), items: [], sortKey: date.getTime() };
    groups[key].items.push(log);
  });
  return Object.values(groups).sort((a, b) => b.sortKey - a.sortKey);
};

// ==================== SENTENCE BUILDER (JSX) ====================

const buildSentenceJSX = (config, log) => {
  // Re-implement sentence as JSX directly for each action
  const perf = <strong className="font-semibold text-gray-900">{log.performer?.fullName || "Noma'lum"}</strong>;
  const name = <strong className="font-semibold text-gray-900">{log.entityName}</strong>;

  switch (log.action) {
    case 'student_added':
      return <>{perf} {name} ni o'quvchilar ro'yxatiga qo'shdi</>;
    case 'student_updated':
      return <>{perf} {name} ma'lumotlarini yangiladi</>;
    case 'student_deleted':
      return <>{perf} {name} ni o'quvchilar ro'yxatidan o'chirdi</>;
    case 'student_graduated':
      return <>{perf} {name} ni bitiruvchi deb belgiladi</>;
    case 'teacher_added':
      return <>{perf} {name} ni o'qituvchilar ro'yxatiga qo'shdi</>;
    case 'teacher_updated':
      return <>{perf} {name} ma'lumotlarini yangiladi</>;
    case 'teacher_deleted':
      return <>{perf} {name} ni o'qituvchilar ro'yxatidan o'chirdi</>;
    case 'group_added':
      return <>{perf} {name} guruhini yaratdi</>;
    case 'group_updated':
      return <>{perf} {name} guruhini tahrirladi</>;
    case 'group_deleted':
      return <>{perf} {name} guruhini o'chirdi</>;
    case 'payment_added': {
      const amount = log.details?.amount
        ? <strong className="font-semibold text-emerald-700">{Number(log.details.amount).toLocaleString()} so'm</strong>
        : null;
      return <>{perf} {name} dan {amount} to'lov qabul qildi</>;
    }
    case 'lead_added':
      return <>{perf} {name} ni yangi lid sifatida qo'shdi</>;
    case 'lead_status_changed': {
      const from = LEAD_STATUS_UZ[log.details?.fromStatus] || log.details?.fromStatus || '?';
      const to = LEAD_STATUS_UZ[log.details?.toStatus] || log.details?.toStatus || '?';
      return (
        <>{perf} {name} holatini{' '}
          <span className="text-gray-500">{from}</span>
          {' → '}
          <strong className="font-semibold text-gray-900">{to}</strong>
          {' '}ga o'zgartirdi
        </>
      );
    }
    default:
      return <>{perf} amal bajardi</>;
  }
};

const buildSubtext = (config, log) => {
  switch (log.action) {
    case 'student_added':
    case 'student_updated':
      return log.details?.groupName ? `Guruh: ${log.details.groupName}` : null;
    case 'teacher_added':
      return log.details?.subject ? `Fan: ${log.details.subject}` : null;
    case 'group_added':
      return log.details?.teacherName ? `O'qituvchi: ${log.details.teacherName}` : null;
    case 'payment_added': {
      const parts = [];
      if (log.details?.method) parts.push(log.details.method);
      if (log.details?.groupName) parts.push(`Guruh: ${log.details.groupName}`);
      return parts.length ? parts.join(' • ') : null;
    }
    case 'lead_added': {
      const parts = [];
      if (log.details?.subject) parts.push(`Fan: ${log.details.subject}`);
      if (log.details?.source) parts.push(`Manba: ${log.details.source}`);
      return parts.length ? parts.join(' • ') : null;
    }
    default:
      return null;
  }
};

// ==================== FILTER BAR ====================

const FILTER_BUTTONS = [
  { key: '', label: 'Barchasi', color: 'bg-gray-900 text-white', outline: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' },
  { key: 'student', label: "O'quvchilar", color: 'bg-blue-600 text-white', outline: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50' },
  { key: 'teacher', label: "O'qituvchilar", color: 'bg-purple-600 text-white', outline: 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50' },
  { key: 'group', label: 'Guruhlar', color: 'bg-teal-600 text-white', outline: 'bg-white text-teal-600 border border-teal-200 hover:bg-teal-50' },
  { key: 'payment', label: "To'lovlar", color: 'bg-emerald-600 text-white', outline: 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50' },
  { key: 'lead', label: 'Lidlar', color: 'bg-orange-500 text-white', outline: 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50' },
];

// ==================== MAIN COMPONENT ====================

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchLogs = async () => {
      try {
        const data = await activityLogAPI.getRecent(200);
        if (isMountedRef.current) setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };
    fetchLogs();
    return () => { isMountedRef.current = false; };
  }, []);

  const filtered = logs.filter(log => {
    const matchesType = !filterType || log.entityType === filterType;
    const matchesSearch = !search
      || log.entityName?.toLowerCase().includes(search.toLowerCase())
      || log.performer?.fullName?.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const grouped = groupByDate(filtered);

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faoliyat tarixi</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Adminlar tomonidan amalga oshirilgan barcha o'zgartirishlar
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>So'nggi 200 ta amal</span>
        </div>
      </div>

      {/* Search + filter chips */}
      <div className="space-y-3">
        <Input
          placeholder="Ism yoki admin bo'yicha qidiring..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={Search}
        />
        <div className="flex flex-wrap gap-2">
          {FILTER_BUTTONS.map(btn => {
            const active = filterType === btn.key;
            const count = btn.key === ''
              ? filtered.length
              : logs.filter(l => l.entityType === btn.key).length;
            return (
              <button
                key={btn.key}
                onClick={() => setFilterType(btn.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  active ? btn.color : btn.outline
                }`}
              >
                {btn.label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${
                  active ? 'bg-white/25' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Log list */}
      {grouped.length === 0 ? (
        <div className="py-16 text-center">
          <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Faoliyat topilmadi</p>
          <p className="text-sm text-gray-400 mt-1">
            {search ? `"${search}" bo'yicha natija yo'q` : "Hozircha hech qanday o'zgarish qayd etilmagan"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group, gi) => (
            <div key={gi}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-700">{group.label}</span>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400">{group.items.length} ta amal</span>
              </div>

              {/* Entries */}
              <div className="space-y-1.5">
                {group.items.map((log) => {
                  const config = ACTION_CONFIG[log.action] || DEFAULT_CONFIG;
                  const { Icon, border, bg, iconColor } = config;
                  const subtext = buildSubtext(config, log);
                  const roleLabel = ROLE_LABELS[log.performer?.role] || log.performer?.role || '';

                  return (
                    <div
                      key={log.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-l-4 ${border} ${bg} group`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>

                      {/* Main text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">
                          {buildSentenceJSX(config, log)}
                        </p>

                        {/* Subtext row */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                          {subtext && (
                            <span className="text-xs text-gray-400">{subtext}</span>
                          )}
                          {subtext && <span className="text-gray-300 text-xs">·</span>}
                          {roleLabel && (
                            <span className="text-xs text-gray-400">{roleLabel}</span>
                          )}
                          <span className="text-gray-300 text-xs">·</span>
                          <span
                            className="text-xs text-gray-400"
                            title={log.createdAt?.toDate
                              ? log.createdAt.toDate().toLocaleString('uz-UZ')
                              : ''}
                          >
                            {exactTime(log.createdAt)} — {timeAgo(log.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
