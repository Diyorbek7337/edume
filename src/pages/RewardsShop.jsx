import { useState, useEffect } from 'react';
import { 
  Gift, Star, ShoppingCart, Plus, Trash2, Edit, Package, 
  Award, Coins, Check, AlertTriangle, History, Trophy
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { rewardsAPI, studentsAPI, groupsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, formatMoney } from '../utils/helpers';
import { toast } from 'react-toastify';

const RewardsShop = () => {
  const { userData, role } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [myPoints, setMyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('shop'); // shop, history, manage

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: '',
    stock: '',
    category: 'stationery', // stationery, gadget, voucher, other
    imageUrl: ''
  });

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canManage = isAdmin;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      // Sovg'alar ro'yxati
      const rewardsData = await rewardsAPI.getAll();
      setRewards(rewardsData.filter(r => r.status === 'active' || canManage));

      // Sotib olishlar tarixi
      const purchasesData = await rewardsAPI.getPurchases();
      setPurchases(purchasesData);

      // O'quvchi ma'lumotlari
      if (isStudentOrParent) {
        const allStudents = await studentsAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        
        let student;
        if (role === ROLES.PARENT) {
          student = allStudents.find(s => 
            s.parentPhone === userData?.phone || 
            normalizePhone(s.parentPhone) === normalizePhone(userData?.phone)
          );
        } else {
          student = allStudents.find(s => 
            s.email === userData?.email || 
            normalizePhone(s.phone) === normalizePhone(userData?.phone)
          );
        }
        
        if (student) {
          setStudentData(student);
          setMyPoints(student.points || 0);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddReward = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.pointsCost) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }

    try {
      const newReward = await rewardsAPI.create({
        ...formData,
        pointsCost: parseInt(formData.pointsCost),
        stock: parseInt(formData.stock) || 0,
        status: 'active',
        createdBy: userData?.id
      });

      setRewards([newReward, ...rewards]);
      setShowAddModal(false);
      setFormData({ name: '', description: '', pointsCost: '', stock: '', category: 'stationery', imageUrl: '' });
      toast.success("Sovg'a qo'shildi!");
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handlePurchase = async () => {
    if (!selectedReward || !studentData) return;

    if (myPoints < selectedReward.pointsCost) {
      toast.error("Ballaringiz yetarli emas!");
      return;
    }

    if (selectedReward.stock !== undefined && selectedReward.stock <= 0) {
      toast.error("Bu sovg'a tugagan!");
      return;
    }

    try {
      // Sotib olish
      await rewardsAPI.purchase({
        rewardId: selectedReward.id,
        rewardName: selectedReward.name,
        studentId: studentData.id,
        studentName: studentData.fullName,
        pointsCost: selectedReward.pointsCost,
        status: 'pending' // pending, delivered
      });

      // Ballarni kamaytirish
      const newPoints = myPoints - selectedReward.pointsCost;
      await studentsAPI.update(studentData.id, { points: newPoints });
      setMyPoints(newPoints);

      // Stock kamaytirish
      if (selectedReward.stock !== undefined) {
        await rewardsAPI.update(selectedReward.id, { stock: selectedReward.stock - 1 });
        setRewards(rewards.map(r => 
          r.id === selectedReward.id ? { ...r, stock: r.stock - 1 } : r
        ));
      }

      setShowPurchaseModal(false);
      toast.success("Tabriklaymiz! Sovg'a sotib olindi! 🎉");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDeleteReward = async (id) => {
    if (!confirm("Bu sovg'ani o'chirishni xohlaysizmi?")) return;
    try {
      await rewardsAPI.delete(id);
      setRewards(rewards.filter(r => r.id !== id));
      toast.success("O'chirildi");
    } catch (err) { toast.error("Xatolik"); }
  };

  const handleDelivered = async (purchaseId) => {
    try {
      await rewardsAPI.updatePurchase(purchaseId, { status: 'delivered', deliveredAt: new Date().toISOString() });
      setPurchases(purchases.map(p => 
        p.id === purchaseId ? { ...p, status: 'delivered' } : p
      ));
      toast.success("Topshirildi deb belgilandi");
    } catch (err) { toast.error("Xatolik"); }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'stationery': return '📚';
      case 'gadget': return '📱';
      case 'voucher': return '🎫';
      case 'food': return '🍕';
      default: return '🎁';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'stationery': return 'Kansler tovarlar';
      case 'gadget': return 'Gadjetlar';
      case 'voucher': return 'Vaucherlar';
      case 'food': return 'Ovqat';
      default: return 'Boshqa';
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sovg'alar Do'koni</h1>
          <p className="text-gray-500">Ball yig'ib, sovg'alar sotib oling!</p>
        </div>
        
        <div className="flex items-center gap-2">
          {isStudentOrParent && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl">
              <Coins className="w-5 h-5" />
              <span className="font-bold">{myPoints}</span>
              <span className="text-sm">ball</span>
            </div>
          )}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Barchasi</option>
            <option value="stationery">Kansler</option>
            <option value="gadget">Gadjetlar</option>
            <option value="voucher">Vaucherlar</option>
            <option value="food">Ovqat</option>
          </select>
          {canManage && (
            <Button icon={Plus} onClick={() => setShowAddModal(true)}>
              Sovg'a qo'shish
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab('shop')}
          className={`px-4 py-2 font-medium transition ${
            tab === 'shop' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
          }`}
        >
          <Gift className="w-4 h-4 inline mr-2" />
          Do'kon
        </button>
        {isStudentOrParent && (
          <button
            onClick={() => setTab('myPurchases')}
            className={`px-4 py-2 font-medium transition ${
              tab === 'myPurchases' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Mening xaridlarim
          </button>
        )}
        {canManage && (
          <button
            onClick={() => setTab('manage')}
            className={`px-4 py-2 font-medium transition ${
              tab === 'manage' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Boshqaruv
          </button>
        )}
      </div>

      {/* Do'kon */}
      {tab === 'shop' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rewards
            .filter(r => filter === 'all' || r.category === filter)
            .filter(r => r.status === 'active')
            .map(reward => {
              const canAfford = myPoints >= reward.pointsCost;
              const inStock = reward.stock === undefined || reward.stock > 0;
              
              return (
                <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition">
                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {reward.imageUrl ? (
                      <img src={reward.imageUrl} alt={reward.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">{getCategoryIcon(reward.category)}</span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{reward.name}</h3>
                      <Badge variant={canAfford && inStock ? 'success' : 'secondary'}>
                        {reward.pointsCost} ball
                      </Badge>
                    </div>

                    {reward.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{reward.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {getCategoryName(reward.category)}
                        {reward.stock !== undefined && ` • ${reward.stock} dona`}
                      </span>
                    </div>

                    {isStudentOrParent && (
                      <Button 
                        className="w-full mt-3"
                        disabled={!canAfford || !inStock}
                        onClick={() => {
                          setSelectedReward(reward);
                          setShowPurchaseModal(true);
                        }}
                      >
                        {!inStock ? "Tugagan" : !canAfford ? "Ball yetmaydi" : "Sotib olish"}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}

          {rewards.filter(r => r.status === 'active').length === 0 && (
            <Card className="col-span-full text-center py-12">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Sovg'alar yo'q</p>
            </Card>
          )}
        </div>
      )}

      {/* Mening xaridlarim */}
      {tab === 'myPurchases' && (
        <div className="space-y-4">
          {purchases
            .filter(p => p.studentId === studentData?.id)
            .map(purchase => (
              <Card key={purchase.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                      🎁
                    </div>
                    <div>
                      <h3 className="font-semibold">{purchase.rewardName}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(purchase.createdAt)} • {purchase.pointsCost} ball
                      </p>
                    </div>
                  </div>
                  <Badge variant={purchase.status === 'delivered' ? 'success' : 'warning'}>
                    {purchase.status === 'delivered' ? 'Topshirildi' : 'Kutilmoqda'}
                  </Badge>
                </div>
              </Card>
            ))}

          {purchases.filter(p => p.studentId === studentData?.id).length === 0 && (
            <Card className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Hali xarid qilmagansiz</p>
            </Card>
          )}
        </div>
      )}

      {/* Boshqaruv */}
      {tab === 'manage' && canManage && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold mb-4">Barcha xaridlar</h3>
            <div className="space-y-3">
              {purchases.map(purchase => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar name={purchase.studentName} size="sm" />
                    <div>
                      <p className="font-medium">{purchase.studentName}</p>
                      <p className="text-sm text-gray-500">{purchase.rewardName} • {purchase.pointsCost} ball</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{formatDate(purchase.createdAt)}</span>
                    {purchase.status === 'pending' ? (
                      <Button size="sm" onClick={() => handleDelivered(purchase.id)}>
                        <Check className="w-4 h-4 mr-1" />
                        Topshirildi
                      </Button>
                    ) : (
                      <Badge variant="success">✓ Topshirildi</Badge>
                    )}
                  </div>
                </div>
              ))}
              {purchases.length === 0 && (
                <p className="text-center text-gray-500 py-4">Xaridlar yo'q</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Sovg'alar boshqaruvi</h3>
            <div className="space-y-3">
              {rewards.map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(reward.category)}</span>
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-gray-500">{reward.pointsCost} ball • {reward.stock !== undefined ? `${reward.stock} dona` : 'Cheksiz'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={reward.status === 'active' ? 'success' : 'secondary'}>
                      {reward.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600"
                      onClick={() => handleDeleteReward(reward.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Sovg'a qo'shish modali */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi sovg'a qo'shish">
        <form onSubmit={handleAddReward} className="space-y-4">
          <Input
            label="Sovg'a nomi"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masalan: Daftar"
            required
          />

          <Textarea
            label="Tavsif"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Sovg'a haqida..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Ball narxi"
              value={formData.pointsCost}
              onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
              placeholder="100"
              required
            />
            <Input
              type="number"
              label="Soni (bo'sh = cheksiz)"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="10"
            />
          </div>

          <Select
            label="Kategoriya"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: 'stationery', label: '📚 Kansler tovarlar' },
              { value: 'gadget', label: '📱 Gadjetlar' },
              { value: 'voucher', label: '🎫 Vaucherlar' },
              { value: 'food', label: '🍕 Ovqat' },
              { value: 'other', label: '🎁 Boshqa' },
            ]}
          />

          <Input
            label="Rasm URL (ixtiyoriy)"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://..."
          />

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">Qo'shish</Button>
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sotib olish modali */}
      <Modal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)} 
        title="Sotib olish"
      >
        {selectedReward && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-5xl">{getCategoryIcon(selectedReward.category)}</span>
              </div>
              <h3 className="text-xl font-bold">{selectedReward.name}</h3>
              {selectedReward.description && (
                <p className="text-gray-600 mt-2">{selectedReward.description}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Narx:</span>
                <span className="font-bold">{selectedReward.pointsCost} ball</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Sizning ballaringiz:</span>
                <span className="font-bold">{myPoints} ball</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Qoladi:</span>
                <span className={`font-bold ${myPoints - selectedReward.pointsCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {myPoints - selectedReward.pointsCost} ball
                </span>
              </div>
            </div>

            {myPoints < selectedReward.pointsCost && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Ballaringiz yetarli emas. Yana {selectedReward.pointsCost - myPoints} ball kerak.</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={handlePurchase} 
                className="flex-1"
                disabled={myPoints < selectedReward.pointsCost}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Sotib olish
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                Bekor qilish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RewardsShop;
