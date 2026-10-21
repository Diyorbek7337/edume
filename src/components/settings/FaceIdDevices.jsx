import { useEffect, useState } from 'react';
import { ScanFace, Plus, Trash2, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, Button } from '../common';
import { faceIdDevicesAPI } from '../../services/api';

/**
 * Face ID terminals (Hikvision + "Davomat" program on the centre's PC).
 * The director creates a device account here and pastes its connection code into "Davomat" → Sozlamalar.
 * The device account can only read students / groups and write attendance (firestore.rules → isDevice).
 */
const FaceIdDevices = ({ centerName }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null); // { code } — shown once
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      setDevices(await faceIdDevicesAPI.list());
    } catch (err) {
      console.error('faceId devices list error:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    setBusy(true);
    try {
      const res = await faceIdDevicesAPI.create(centerName);
      setCreated(res);
      setCopied(false);
      await load();
    } catch (err) {
      toast.error("Qurilma yaratilmadi: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (d) => {
    if (!window.confirm("Bu qurilma o'chirilsinmi? Shu kod bilan ulangan Davomat dasturi Edume'ga yoza olmay qoladi.")) return;
    try {
      await faceIdDevicesAPI.remove(d.id);
      toast.success("Qurilma o'chirildi");
      await load();
    } catch (err) {
      toast.error("Xatolik: " + err.message);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(created.code);
      setCopied(true);
    } catch {
      toast.info('Kodni belgilab, qo\'lda nusxalang');
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <ScanFace className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Face ID davomat (Hikvision)</h3>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Markazdagi Face ID terminal o&apos;quvchini taniganda davomat shu yerga o&apos;zi yoziladi: darsga kelsa — &quot;keldi&quot;
        yoki &quot;kechikdi&quot;, dars tugagach kelmaganlar — &quot;kelmadi&quot;. Ota-onaga Telegram bot orqali xabar boradi.
        O&apos;qituvchi belgini istalgan vaqtda o&apos;zgartira oladi.
      </p>

      {created && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 text-sm">
          <p className="font-medium text-green-800 mb-1">✅ Qurilma yaratildi. Ulanish kodi (faqat hozir ko&apos;rinadi):</p>
          <textarea readOnly value={created.code} rows={3} onFocus={(e) => e.target.select()}
            className="w-full font-mono text-xs p-2 border border-green-300 rounded bg-white" />
          <div className="flex items-center gap-2 mt-2">
            <Button type="button" size="sm" icon={copied ? CheckCircle : Copy} onClick={copy}>{copied ? 'Nusxalandi' : 'Nusxalash'}</Button>
            <span className="text-green-700">→ Davomat dasturi → Sozlamalar → <b>Edume CRM</b> → kodni qo&apos;ying → &quot;Ulash&quot;.</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Kodni begonalarga bermang: u bilan shu markaz o&apos;quvchilar ro&apos;yxatini o&apos;qish va davomat yozish mumkin.</p>
        </div>
      )}

      {!loading && devices.length > 0 && (
        <ul className="divide-y border rounded-lg mb-3">
          {devices.map((d) => (
            <li key={d.id} className="flex items-center justify-between p-2 text-sm">
              <span>
                <b>{d.fullName || 'Face ID'}</b>
                <span className="text-gray-500"> · {d.createdAt?.toDate ? d.createdAt.toDate().toLocaleDateString() : ''}</span>
              </span>
              <button type="button" onClick={() => remove(d)} className="text-red-600 hover:text-red-800 p-1" title="O'chirish">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button type="button" icon={Plus} loading={busy} onClick={create}>
        {devices.length ? 'Yana qurilma yaratish' : 'Qurilma yaratish'}
      </Button>
    </Card>
  );
};

export default FaceIdDevices;
