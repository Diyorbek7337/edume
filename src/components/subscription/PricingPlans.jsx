import { Check, X, Crown, Zap, User, Sparkles } from 'lucide-react';
import { Card, Button, Badge } from '../common';
import {
  SUBSCRIPTION_PLANS,
  PLAN_FEATURES_LIST,
  formatPrice,
  getVisiblePlans,
  trialDaysLeft,
  isTrialExpired,
  getCenterAccess,
} from '../../utils/subscriptions';

const ICONS = { Crown, Zap, User };

// Tailwind sinflari to'liq yozilishi SHART — `bg-${color}-50` kabi qurilgan
// nomlarni Tailwind build paytida topa olmaydi va sinf umuman yaratilmaydi.
const COLORS = {
  emerald: { ring: 'ring-emerald-500', bg: 'bg-emerald-50',  text: 'text-emerald-700', icon: 'bg-emerald-500' },
  blue:    { ring: 'ring-blue-500',    bg: 'bg-blue-50',     text: 'text-blue-700',    icon: 'bg-blue-500' },
  purple:  { ring: 'ring-purple-500',  bg: 'bg-purple-50',   text: 'text-purple-700',  icon: 'bg-purple-500' },
  amber:   { ring: 'ring-amber-500',   bg: 'bg-amber-50',    text: 'text-amber-700',   icon: 'bg-amber-500' },
};

const limitText = (value) => (value === -1 ? 'Cheksiz' : value);

/**
 * Tarif rejalari — /pricing sahifasida ham, Sozlamalar ichida ham ishlatiladi.
 *
 * Ko'rsatiladigan tariflar markaz TURIGA qarab tanlanadi (getVisiblePlans):
 * yakka o'qituvchi Solo+Pro, o'quv markaz Basic+Pro ko'radi.
 */
const PricingPlans = ({ centerData, onSelectPlan, requestingPlan = null, compact = false }) => {
  const current = centerData?.subscription || 'trial';
  const planKeys = getVisiblePlans(centerData?.type, current);
  const daysLeft = trialDaysLeft(centerData);
  const expired = isTrialExpired(centerData);
  const access = getCenterAccess(centerData);

  return (
    <div className="space-y-6">
      {/* Joriy holat */}
      {current === 'trial' && (
        <div className={`rounded-xl border px-4 py-3 ${
          expired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <p className={`font-semibold ${expired ? 'text-red-800' : 'text-amber-800'}`}>
            {expired ? '30 kunlik VIP sinov muddati tugadi' : `👑 VIP sinov — ${daysLeft} kun qoldi`}
          </p>
          <p className={`text-sm mt-0.5 ${expired ? 'text-red-600' : 'text-amber-700'}`}>
            {expired
              ? 'Tizimdan foydalanishni davom ettirish uchun quyidagi tariflardan birini tanlang.'
              : 'Sinov davrida barcha imkoniyatlar cheksiz. Muddat tugagach tarif tanlaysiz.'}
          </p>
        </div>
      )}

      {current !== 'trial' && SUBSCRIPTION_PLANS[current] && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="font-semibold text-green-800">
            Joriy tarif: {SUBSCRIPTION_PLANS[current].nameUz}
          </p>
          <p className="text-sm text-green-700 mt-0.5">
            {formatPrice(SUBSCRIPTION_PLANS[current])}
            {access.endsAt && ` · ${access.state === 'active' ? 'Amal qiladi' : 'Tugagan'}: ${access.endsAt.toLocaleDateString('uz-UZ')}`}
          </p>
        </div>
      )}

      {/* Tarif kartalari */}
      <div className={`grid gap-5 ${planKeys.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {planKeys.map(key => {
          const plan = SUBSCRIPTION_PLANS[key];
          if (!plan) return null;
          const c = COLORS[plan.color] || COLORS.blue;
          const Icon = ICONS[plan.icon] || Zap;
          const isCurrent = key === current;
          const isRequesting = requestingPlan === key;

          return (
            <Card
              key={key}
              padding="p-6"
              className={`relative flex flex-col ${isCurrent ? `ring-2 ${c.ring}` : ''}`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 right-4">
                  <Badge variant="primary">{plan.badge}</Badge>
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plan.nameUz}</h3>
                  <p className="text-sm text-gray-500">{plan.name}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-3xl font-bold text-gray-900">
                  {plan.priceUzs.toLocaleString()}
                  <span className="text-base font-normal text-gray-500"> so'm/oy</span>
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {PLAN_FEATURES_LIST.map(f => {
                  const isLimit = f.type === 'limit';
                  const value = isLimit ? plan.limits[f.key] : plan.features[f.key];
                  const enabled = isLimit ? true : Boolean(value);

                  return (
                    <li key={f.key} className="flex items-start gap-2 text-sm">
                      {enabled
                        ? <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        : <X className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />}
                      <span className={enabled ? 'text-gray-700' : 'text-gray-400'}>
                        {f.label}
                        {isLimit && <strong className="ml-1 text-gray-900">{limitText(value)}</strong>}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {isCurrent ? (
                <div className={`text-center py-2.5 rounded-lg ${c.bg} ${c.text} font-medium text-sm`}>
                  Joriy tarifingiz
                </div>
              ) : (
                <Button
                  className="w-full"
                  loading={isRequesting}
                  onClick={() => onSelectPlan?.(key)}
                >
                  Shu tarifni tanlash
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {!compact && (
        <p className="text-sm text-gray-500 flex items-start gap-2">
          <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
          Tarifni tanlaganingizda bizga ariza yuboriladi va biz siz bilan bog'lanamiz.
          To'lov amalga oshirilgach tarif darhol faollashtiriladi.
        </p>
      )}
    </div>
  );
};

export default PricingPlans;
