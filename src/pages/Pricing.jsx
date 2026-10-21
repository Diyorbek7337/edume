import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Card, Modal, Button, Input, Textarea, Loading } from '../components/common';
import PricingPlans from '../components/subscription/PricingPlans';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionRequestsAPI } from '../services/api';
import { SUBSCRIPTION_PLANS, formatPrice } from '../utils/subscriptions';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Pricing = () => {
  const { centerData, userData, centerId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ contactName: '', contactPhone: '', note: '' });

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    const data = await subscriptionRequestsAPI.getMine();
    setRequests(data);
    setLoading(false);
  };

  const openRequest = (planKey) => {
    setSelectedPlan(planKey);
    setForm({
      contactName: userData?.fullName || '',
      contactPhone: userData?.phone || centerData?.phone || '',
      note: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactPhone.trim()) {
      toast.error("Bog'lanish uchun telefon raqamini kiriting");
      return;
    }

    setSubmitting(true);
    try {
      await subscriptionRequestsAPI.create({
        plan: selectedPlan,
        centerId,
        centerName: centerData?.name,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        note: form.note,
      });
      toast.success("Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.");
      setSelectedPlan(null);
      await fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error("Ariza yuborilmadi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Yuklanmoqda..." />;

  const pendingRequests = requests.filter(r => r.status === 'new');
  const plan = selectedPlan ? SUBSCRIPTION_PLANS[selectedPlan] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tariflar</h1>
        <p className="text-gray-500">O'zingizga mos tarifni tanlang</p>
      </div>

      {pendingRequests.length > 0 && (
        <Card padding="p-4" className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-blue-900">Arizangiz ko'rib chiqilmoqda</p>
              {pendingRequests.map(r => (
                <p key={r.id} className="text-sm text-blue-700 mt-0.5">
                  {SUBSCRIPTION_PLANS[r.plan]?.nameUz || r.plan} tarifi
                  {r.createdAt && ` — ${formatDate(r.createdAt)}`}
                </p>
              ))}
              <p className="text-sm text-blue-600 mt-1">
                Tez orada siz bilan bog'lanamiz. Savollaringiz bo'lsa:{' '}
                <a
                  href="https://t.me/Diyorbek7337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  Telegram
                </a>
              </p>
            </div>
          </div>
        </Card>
      )}

      <PricingPlans centerData={centerData} onSelectPlan={openRequest} />

      {/* Ariza modali */}
      <Modal
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        title={plan ? `${plan.nameUz} tarifiga ariza` : 'Ariza'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {plan && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="font-semibold text-gray-900">{plan.nameUz}</p>
              <p className="text-sm text-gray-600">{formatPrice(plan)}</p>
            </div>
          )}

          <Input
            label="Bog'lanish uchun ism"
            value={form.contactName}
            onChange={(e) => setForm({ ...form, contactName: e.target.value })}
            placeholder="Ism Familiya"
          />

          <Input
            label="Telefon *"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
            placeholder="+998901234567"
            required
          />

          <Textarea
            label="Qo'shimcha izoh"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Savol yoki so'rovingiz bo'lsa yozing"
            rows={3}
          />

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            Ariza yuborilgach biz siz bilan bog'lanamiz va to'lovdan keyin tarif faollashadi.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setSelectedPlan(null)}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={submitting}>
              Ariza yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pricing;
