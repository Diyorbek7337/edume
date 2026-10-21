import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';
import { SUBSCRIPTION_PLANS, trialUpgradeHint, GRACE_DAYS } from '../../utils/subscriptions';

const SUPPORT_TELEGRAM = 'https://t.me/Diyorbek7337';
const WARN_BEFORE_DAYS = 5;

const fmt = (d) => (d ? d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');

/**
 * Obuna holati banneri — DashboardLayout'da barcha sahifalar tepasida.
 *
 *   active (≤5 kun qoldi) — sariq ogohlantirish
 *   grace                 — to'q sariq: muddat tugadi, N kundan keyin faqat o'qish
 *   expired / suspended   — qizil: faqat o'qish rejimi
 *
 * O'quvchi va ota-onaga faqat faqat-o'qish holatida qisqa xabar ko'rsatiladi.
 */
const SubscriptionBanner = () => {
  const { centerData, centerAccess, role } = useAuth();
  const navigate = useNavigate();

  if (!centerData || !centerAccess || role === ROLES.SUPER_ADMIN) return null;

  const { state, endsAt, graceEndsAt, daysLeft } = centerAccess;
  const isStaff = [ROLES.DIRECTOR, ROLES.ADMIN, ROLES.TEACHER].includes(role);
  const isDirector = role === ROLES.DIRECTOR;
  const isTrial = (centerData.subscription || 'trial') === 'trial';
  const planName = isTrial ? '30 kunlik sinov' : (SUBSCRIPTION_PLANS[centerData.subscription]?.nameUz || 'Tarif');

  let tone;
  let title;
  let text;

  if (state === 'active') {
    if (!isStaff || daysLeft === null || daysLeft > WARN_BEFORE_DAYS) return null;
    tone = 'amber';
    title = `${planName} ${daysLeft} kundan keyin tugaydi (${fmt(endsAt)})`;
    text = isTrial
      ? `Ma'lumotlaringiz saqlanib qoladi — ishni uzluksiz davom ettirish uchun tarif tanlang. ${trialUpgradeHint(centerData.type)}`
      : "Uzilishsiz ishlash uchun to'lovni oldindan amalga oshiring.";
  } else if (state === 'grace') {
    if (!isStaff) return null;
    tone = 'orange';
    title = `${planName} muddati tugadi — ${daysLeft} kun imtiyoz qoldi`;
    text = `${fmt(graceEndsAt)} dan keyin tizim faqat ko'rish rejimiga o'tadi: yangi o'quvchi, to'lov, davomat va baho kiritib bo'lmaydi. ${GRACE_DAYS} kunlik imtiyoz davrida hamma narsa odatdagidek ishlaydi.`;
  } else if (state === 'expired' || state === 'suspended') {
    tone = 'red';
    if (!isStaff) {
      title = "Markaz obunasi to'xtatilgan";
      text = "Ma'lumotlarni ko'rishingiz mumkin, lekin topshiriq yuborish va o'zgartirish vaqtincha yopiq.";
    } else if (state === 'suspended') {
      title = "Markaz faoliyati to'xtatilgan — faqat ko'rish rejimi";
      text = "Ma'lumotlar saqlangan. Qayta faollashtirish uchun biz bilan bog'laning.";
    } else {
      title = `${planName} muddati tugadi — faqat ko'rish rejimi`;
      text = isTrial
        ? `Barcha ma'lumotlaringiz saqlangan. Ishni davom ettirish uchun tarif tanlang. ${trialUpgradeHint(centerData.type)}`
        : "Barcha ma'lumotlaringiz saqlangan. Ishni davom ettirish uchun obunani yangilang.";
    }
  } else {
    return null;
  }

  const styles = {
    amber: { box: 'bg-amber-50 border-amber-200', title: 'text-amber-800', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
    orange: { box: 'bg-orange-50 border-orange-200', title: 'text-orange-800', text: 'text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
    red: { box: 'bg-red-50 border-red-200', title: 'text-red-800', text: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700' },
  }[tone];

  const showPricing = isDirector && state !== 'suspended';

  return (
    <div className={`mx-4 lg:mx-6 mt-4 p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${styles.box}`}>
      <div className="min-w-0">
        <p className={`font-semibold ${styles.title}`}>{title}</p>
        <p className={`text-sm mt-0.5 ${styles.text}`}>{text}</p>
      </div>
      {isStaff && (
        showPricing ? (
          <button
            onClick={() => navigate('/pricing')}
            className={`flex-shrink-0 px-4 py-2 text-white text-sm font-medium rounded-lg transition ${styles.btn}`}
          >
            {isTrial ? 'Tarifni tanlash' : 'Obunani yangilash'}
          </button>
        ) : (
          <a
            href={SUPPORT_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-shrink-0 px-4 py-2 text-white text-sm font-medium rounded-lg transition text-center ${styles.btn}`}
          >
            Bog'lanish
          </a>
        )
      )}
    </div>
  );
};

export default SubscriptionBanner;
