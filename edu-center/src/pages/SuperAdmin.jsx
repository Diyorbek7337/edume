import { useState, useEffect } from 'react';
import { 
  Building2, Users, CreditCard, TrendingUp, Search, Eye, Ban, 
  CheckCircle, Clock, AlertTriangle, Calendar, RefreshCw, Crown, Zap, Shield,
  LogOut, GraduationCap, UsersRound, Plus
} from 'lucide-react';
import { Card, Button, Badge, Loading, Modal } from '../components/common';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { formatMoney, formatDate } from '../utils/helpers';
import { SUBSCRIPTION_PLANS, ADDON_SERVICES, calculateTotalPrice } from '../utils/subscriptions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SuperAdmin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [centerStats, setCenterStats] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Barcha markazlarni olish
      const centersSnapshot = await getDocs(collection(db, 'centers'));
      const centersData = centersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Har bir markaz uchun statistika
      const stats = {};
      for (const center of centersData) {
        try {
          const [studentsSnap, teachersSnap, groupsSnap, paymentsSnap] = await Promise.all([
            getDocs(collection(db, `centers/${center.id}/students`)),
            getDocs(collection(db, `centers/${center.id}/teachers`)),
            getDocs(collection(db, `centers/${center.id}/groups`)),
            getDocs(collection(db, `centers/${center.id}/payments`)),
          ]);
          
          const payments = paymentsSnap.docs.map(d => d.data());
          const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
          
          stats[center.id] = {
            students: studentsSnap.size,
            teachers: teachersSnap.size,
            groups: groupsSnap.size,
            revenue: totalRevenue
          };
        } catch (err) {
          stats[center.id] = { students: 0, teachers: 0, groups: 0, revenue: 0 };
        }
      }
      
      setCenters(centersData);
      setCenterStats(stats);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    }
    setLoading(false);
  };

  const handleStatusChange = async (centerId, newStatus) => {
    setActionLoading(centerId);
    try {
      const centerRef = doc(db, 'centers', centerId);
      await updateDoc(centerRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      setCenters(centers.map(c => c.id === centerId ? { ...c, status: newStatus } : c));
      toast.success(`Markaz holati "${newStatus === 'active' ? 'Faol' : "To'xtatilgan"}" ga o'zgartirildi`);
    } catch (err) {
      console.error('Status change error:', err);
      toast.error("Xatolik: " + err.message);
    }
    setActionLoading(null);
  };

  const handleSubscriptionChange = async (centerId, newSubscription) => {
    setActionLoading(centerId);
    try {
      const centerRef = doc(db, 'centers', centerId);
      const updates = { 
        subscription: newSubscription,
        updatedAt: new Date()
      };
      
      // Trial bo'lmasa, trial muddatini o'chirish
      if (newSubscription !== 'trial') {
        updates.trialEndsAt = null;
      }
      
      await updateDoc(centerRef, updates);
      setCenters(centers.map(c => c.id === centerId ? { ...c, ...updates } : c));
      toast.success(`Tarif "${newSubscription}" ga o'zgartirildi`);
    } catch (err) {
      console.error('Subscription change error:', err);
      toast.error("Xatolik: " + err.message);
    }
    setActionLoading(null);
  };

  const handleToggleAddon = async (centerId, addonKey, enable) => {
    setActionLoading(centerId);
    try {
      const center = centers.find(c => c.id === centerId);
      let addons = center?.addons || [];
      
      if (enable) {
        if (!addons.includes(addonKey)) {
          addons = [...addons, addonKey];
        }
      } else {
        addons = addons.filter(a => a !== addonKey);
      }
      
      const centerRef = doc(db, 'centers', centerId);
      await updateDoc(centerRef, { 
        addons,
        updatedAt: new Date()
      });
      
      setCenters(centers.map(c => c.id === centerId ? { ...c, addons } : c));
      setSelectedCenter(prev => prev?.id === centerId ? { ...prev, addons } : prev);
      
      const addon = ADDON_SERVICES[addonKey];
      toast.success(`${addon.nameUz} ${enable ? 'yoqildi' : "o'chirildi"}`);
    } catch (err) {
      console.error('Addon toggle error:', err);
      toast.error("Xatolik: " + err.message);
    }
    setActionLoading(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getSubscriptionBadge = (sub) => {
    const badges = {
      trial: { label: 'Trial', color: 'warning', icon: Clock },
      basic: { label: 'Basic', color: 'info', icon: Zap },
      pro: { label: 'Pro', color: 'success', icon: Crown },
      enterprise: { label: 'Enterprise', color: 'primary', icon: Shield },
    };
    return badges[sub] || badges.trial;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { label: 'Faol', color: 'success' },
      suspended: { label: "To'xtatilgan", color: 'danger' },
      pending: { label: 'Kutilmoqda', color: 'warning' },
    };
    return badges[status] || badges.active;
  };

  const isTrialExpired = (center) => {
    if (center.subscription !== 'trial' || !center.trialEndsAt) return false;
    const trialEnd = center.trialEndsAt?.toDate ? center.trialEndsAt.toDate() : new Date(center.trialEndsAt);
    return trialEnd < new Date();
  };

  const getDaysLeft = (center) => {
    if (center.subscription !== 'trial' || !center.trialEndsAt) return null;
    const trialEnd = center.trialEndsAt?.toDate ? center.trialEndsAt.toDate() : new Date(center.trialEndsAt);
    const diff = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Filter
  const filteredCenters = centers.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       c.phone?.includes(searchQuery);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSub = filterSubscription === 'all' || c.subscription === filterSubscription;
    return matchSearch && matchStatus && matchSub;
  });

  // Stats
  const totalStats = {
    centers: centers.length,
    activeCenters: centers.filter(c => c.status === 'active').length,
    trialCenters: centers.filter(c => c.subscription === 'trial').length,
    paidCenters: centers.filter(c => c.subscription !== 'trial').length,
    totalStudents: Object.values(centerStats).reduce((sum, s) => sum + (s.students || 0), 0),
    totalTeachers: Object.values(centerStats).reduce((sum, s) => sum + (s.teachers || 0), 0),
    totalRevenue: Object.values(centerStats).reduce((sum, s) => sum + (s.revenue || 0), 0),
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Super Admin Dashboard
              </h1>
              <p className="text-purple-200 mt-1">Barcha o'quv markazlarni boshqarish</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-white border-white/30 hover:bg-white/10" 
                icon={RefreshCw} 
                onClick={fetchData}
              >
                Yangilash
              </Button>
              <Button 
                variant="ghost" 
                className="text-white border-white/30 hover:bg-white/10" 
                icon={LogOut} 
                onClick={handleLogout}
              >
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card padding="p-4" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <Building2 className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.centers}</p>
            <p className="text-sm text-blue-100">Jami markazlar</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.activeCenters}</p>
            <p className="text-sm text-green-100">Faol</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <Clock className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.trialCenters}</p>
            <p className="text-sm text-yellow-100">Trial</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <Crown className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.paidCenters}</p>
            <p className="text-sm text-purple-100">Pullik</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <Users className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.totalStudents}</p>
            <p className="text-sm text-cyan-100">O'quvchilar</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <GraduationCap className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{totalStats.totalTeachers}</p>
            <p className="text-sm text-pink-100">O'qituvchilar</p>
          </Card>
          
          <Card padding="p-4" className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-xl font-bold">{formatMoney(totalStats.totalRevenue)}</p>
            <p className="text-sm text-emerald-100">Jami tushum</p>
          </Card>
        </div>

        {/* Filters */}
        <Card padding="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Markaz nomi, email yoki telefon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Barcha holatlar</option>
              <option value="active">Faol</option>
              <option value="suspended">To'xtatilgan</option>
            </select>
            <select
              value={filterSubscription}
              onChange={(e) => setFilterSubscription(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">Barcha tariflar</option>
              <option value="trial">Trial</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </Card>

        {/* Centers Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Markaz</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Tarif</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Holat</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">O'quvchilar</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">O'qituvchilar</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Guruhlar</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Tushum</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Yaratilgan</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCenters.map(center => {
                  const stats = centerStats[center.id] || {};
                  const subBadge = getSubscriptionBadge(center.subscription);
                  const statusBadge = getStatusBadge(center.status);
                  const daysLeft = getDaysLeft(center);
                  const expired = isTrialExpired(center);
                  const isLoading = actionLoading === center.id;
                  
                  return (
                    <tr key={center.id} className={`hover:bg-gray-50 ${expired ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {center.name?.charAt(0) || 'M'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{center.name}</p>
                            <p className="text-sm text-gray-500">{center.phone || center.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant={subBadge.color} className="flex items-center gap-1">
                            <subBadge.icon className="w-3 h-3" />
                            {subBadge.label}
                          </Badge>
                          {daysLeft !== null && (
                            <span className={`text-xs ${daysLeft <= 3 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                              {expired ? 'Tugagan!' : `${daysLeft} kun qoldi`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge variant={statusBadge.color}>{statusBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{stats.students || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{stats.teachers || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <UsersRound className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{stats.groups || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-green-600">
                        {formatMoney(stats.revenue || 0)}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-500">
                        {formatDate(center.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <select
                            value={center.subscription || 'trial'}
                            onChange={(e) => handleSubscriptionChange(center.id, e.target.value)}
                            disabled={isLoading}
                            className="text-xs border rounded px-2 py-1 disabled:opacity-50"
                          >
                            <option value="trial">Trial</option>
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                          
                          {center.status === 'active' ? (
                            <button 
                              onClick={() => handleStatusChange(center.id, 'suspended')}
                              disabled={isLoading}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                              title="To'xtatish"
                            >
                              {isLoading ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleStatusChange(center.id, 'active')}
                              disabled={isLoading}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                              title="Faollashtirish"
                            >
                              {isLoading ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          <button 
                            onClick={() => {
                              setSelectedCenter({ ...center, stats });
                              setShowDetailModal(true);
                            }}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                            title="Batafsil"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredCenters.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Markazlar topilmadi</p>
            </div>
          )}
        </Card>
      </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        title={selectedCenter?.name}
        size="lg"
      >
        {selectedCenter && (
          <div className="space-y-6">
            {/* Center Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedCenter.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{selectedCenter.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manzil</p>
                <p className="font-medium">{selectedCenter.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Yaratilgan</p>
                <p className="font-medium">{formatDate(selectedCenter.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tarif</p>
                <Badge variant={getSubscriptionBadge(selectedCenter.subscription).color}>
                  {getSubscriptionBadge(selectedCenter.subscription).label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Holat</p>
                <Badge variant={getStatusBadge(selectedCenter.status).color}>
                  {getStatusBadge(selectedCenter.status).label}
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">{selectedCenter.stats?.students || 0}</p>
                <p className="text-sm text-blue-600">O'quvchilar</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">{selectedCenter.stats?.teachers || 0}</p>
                <p className="text-sm text-green-600">O'qituvchilar</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <UsersRound className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">{selectedCenter.stats?.groups || 0}</p>
                <p className="text-sm text-purple-600">Guruhlar</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-emerald-600">{formatMoney(selectedCenter.stats?.revenue || 0)}</p>
                <p className="text-sm text-emerald-600">Tushum</p>
              </div>
            </div>

            {/* Qo'shimcha xizmatlar */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Qo'shimcha xizmatlar
              </h4>
              <div className="space-y-3">
                {Object.entries(ADDON_SERVICES).map(([key, addon]) => {
                  const isAvailable = addon.availableFor.includes(selectedCenter.subscription);
                  const isActive = selectedCenter.addons?.includes(key);
                  
                  return (
                    <div 
                      key={key} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isActive ? 'bg-green-50 border-green-200' : 
                        isAvailable ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isActive ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{addon.nameUz}</p>
                          <p className="text-sm text-gray-500">{addon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-primary-600">
                          +{formatMoney(addon.price)}/oy
                        </p>
                        {isAvailable && (
                          <button
                            onClick={() => handleToggleAddon(selectedCenter.id, key, !isActive)}
                            disabled={actionLoading === selectedCenter.id}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                              isActive 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {isActive ? "O'chirish" : 'Yoqish'}
                          </button>
                        )}
                        {!isAvailable && (
                          <span className="text-xs text-gray-400">
                            {selectedCenter.subscription === 'trial' ? 'Trial uchun mavjud emas' : 'Bu tarif uchun mavjud emas'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Jami narx */}
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Jami oylik to'lov:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatMoney(calculateTotalPrice(selectedCenter.subscription, selectedCenter.addons || []))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdmin;
