import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Clock, Calendar, ArrowLeft, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Table, Modal, Loading, EmptyState } from '../components/common';
import { groupsAPI, teachersAPI, studentsAPI, gradesAPI, attendanceAPI, scheduleAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatMoney } from '../utils/helpers';
import { checkLimit, SUBSCRIPTION_PLANS } from '../utils/subscriptions';

const Groups = () => {
  const { userData, role, centerData } = useAuth();
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Group Details View
  const [viewingGroup, setViewingGroup] = useState(null);
  const [groupStudents, setGroupStudents] = useState([]);
  const [groupGrades, setGroupGrades] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    teacherId: '', 
    scheduleDays: [], // Dars kunlari array
    startTime: '09:00',
    endTime: '10:30',
    price: '', 
    maxStudents: '',
    room: '' // Xona
  });
  const [formLoading, setFormLoading] = useState(false);

  // Hafta kunlari
  const WEEKDAYS = [
    { id: 1, short: 'Du', full: 'Dushanba' },
    { id: 2, short: 'Se', full: 'Seshanba' },
    { id: 3, short: 'Chor', full: 'Chorshanba' },
    { id: 4, short: 'Pay', full: 'Payshanba' },
    { id: 5, short: 'Ju', full: 'Juma' },
    { id: 6, short: 'Sha', full: 'Shanba' },
    { id: 0, short: 'Yak', full: 'Yakshanba' },
  ];

  const toggleDay = (dayId) => {
    setFormData(prev => ({
      ...prev,
      scheduleDays: prev.scheduleDays.includes(dayId)
        ? prev.scheduleDays.filter(d => d !== dayId)
        : [...prev.scheduleDays, dayId]
    }));
  };

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isDirector = role === ROLES.DIRECTOR; // Faqat direktor o'chira oladi

  // Subscription limit
  const subscription = centerData?.subscription || 'trial';
  const limitCheck = checkLimit(subscription, 'groups', groups.length);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      let groupsData;
      const teachersData = await teachersAPI.getAll();
      
      if (isTeacher) {
        // O'qituvchi faqat o'z guruhlarini ko'radi
        // Users ID yoki Teachers ID bo'yicha qidirish
        const teacher = teachersData.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email
        );
        
        if (teacher) {
          // Avval teachers ID bilan qidiramiz
          let groups1 = await groupsAPI.getByTeacher(teacher.id);
          // Keyin users ID bilan ham qidiramiz
          let groups2 = await groupsAPI.getByTeacher(userData?.id);
          // Birlashtirish (dublikatlarni olib tashlash)
          const allGroups = [...groups1, ...groups2];
          const uniqueGroups = allGroups.filter((g, index, self) => 
            index === self.findIndex(t => t.id === g.id)
          );
          groupsData = uniqueGroups;
        } else {
          groupsData = await groupsAPI.getByTeacher(userData?.id);
        }
      } else {
        groupsData = await groupsAPI.getAll();
      }
      
      // Haqiqiy o'quvchilar sonini hisoblash
      const groupsWithRealCount = await Promise.all(
        groupsData.map(async (group) => {
          const students = await studentsAPI.getByGroup(group.id);
          return { ...group, studentsCount: students.length, realStudentsCount: students.length };
        })
      );
      
      setGroups(groupsWithRealCount);
      setTeachers(teachersData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredGroups = groups.filter(g => g.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const resetForm = () => setFormData({ 
    name: '', 
    teacherId: '', 
    scheduleDays: [], 
    startTime: '09:00', 
    endTime: '10:30', 
    price: '', 
    maxStudents: '',
    room: ''
  });

  // Guruh tafsilotlarini ko'rish
  const viewGroupDetails = async (group) => {
    setLoadingDetails(true);
    setViewingGroup(group);
    
    try {
      const [students, grades] = await Promise.all([
        studentsAPI.getByGroup(group.id),
        gradesAPI.getByGroup(group.id)
      ]);
      setGroupStudents(students);
      setGroupGrades(grades);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // O'quvchi statistikasi hisoblash
  const getStudentStats = (studentId) => {
    const studentGrades = groupGrades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return { average: 0, count: 0 };
    
    const total = studentGrades.reduce((sum, g) => sum + ((g.grade / g.maxGrade) * 100), 0);
    return {
      average: Math.round(total / studentGrades.length),
      count: studentGrades.length
    };
  };

  // Eng yaxshi va orqada qolayotgan o'quvchilar
  const getTopAndBottomStudents = () => {
    const studentsWithStats = groupStudents.map(s => ({
      ...s,
      stats: getStudentStats(s.id)
    })).filter(s => s.stats.count > 0);

    const sorted = studentsWithStats.sort((a, b) => b.stats.average - a.stats.average);
    
    return {
      top: sorted.slice(0, 3),
      bottom: sorted.slice(-3).reverse().filter(s => s.stats.average < 70)
    };
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (formData.scheduleDays.length === 0) {
      alert("Kamida bitta dars kunini tanlang");
      return;
    }
    setFormLoading(true);
    try {
      const teacher = teachers.find(t => t.id === formData.teacherId);
      const daysText = formData.scheduleDays
        .sort((a,b) => a-b)
        .map(d => WEEKDAYS.find(w => w.id === d)?.short)
        .join(', ');
      const timeText = `${formData.startTime}-${formData.endTime}`;
      
      const newGroup = await groupsAPI.create({
        name: formData.name,
        teacherId: formData.teacherId,
        teacherName: teacher?.fullName || '',
        schedule: { 
          days: daysText, 
          time: timeText,
          scheduleDays: formData.scheduleDays, // Array sifatida ham saqlash
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.room
        },
        price: Number(formData.price),
        maxStudents: Number(formData.maxStudents),
        room: formData.room,
        studentsCount: 0,
        status: 'active'
      });
      
      // Jadvalga avtomatik qo'shish (har bir kun uchun)
      for (const dayId of formData.scheduleDays) {
        await scheduleAPI.create({
          groupId: newGroup.id,
          groupName: formData.name,
          teacherId: formData.teacherId,
          teacherName: teacher?.fullName || '',
          dayOfWeek: dayId,
          dayName: WEEKDAYS.find(w => w.id === dayId)?.full,
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.room || '',
          status: 'active'
        });
      }
      
      setGroups([newGroup, ...groups]);
      setShowAddModal(false);
      resetForm();
    } catch (err) { 
      console.error(err);
      alert("Xatolik yuz berdi: " + err.message); 
    }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const teacher = teachers.find(t => t.id === formData.teacherId);
      const daysText = formData.scheduleDays
        .sort((a,b) => a-b)
        .map(d => WEEKDAYS.find(w => w.id === d)?.short)
        .join(', ');
      const timeText = `${formData.startTime}-${formData.endTime}`;
      
      await groupsAPI.update(selectedGroup.id, {
        name: formData.name,
        teacherId: formData.teacherId,
        teacherName: teacher?.fullName || '',
        schedule: { 
          days: daysText, 
          time: timeText,
          scheduleDays: formData.scheduleDays,
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.room
        },
        price: Number(formData.price),
        maxStudents: Number(formData.maxStudents),
        room: formData.room
      });
      
      // Eski jadval yozuvlarini o'chirish va yangilarini qo'shish
      try {
        const existingSchedule = await scheduleAPI.getByGroup(selectedGroup.id);
        for (const entry of existingSchedule) {
          await scheduleAPI.delete(entry.id);
        }
        
        // Yangi jadval yozuvlarini qo'shish
        for (const dayId of formData.scheduleDays) {
          await scheduleAPI.create({
            groupId: selectedGroup.id,
            groupName: formData.name,
            teacherId: formData.teacherId,
            teacherName: teacher?.fullName || '',
            dayOfWeek: dayId,
            dayName: WEEKDAYS.find(w => w.id === dayId)?.full,
            startTime: formData.startTime,
            endTime: formData.endTime,
            room: formData.room || '',
            status: 'active'
          });
        }
      } catch (scheduleErr) {
        console.log('Schedule update warning:', scheduleErr);
      }
      
      setGroups(groups.map(g => g.id === selectedGroup.id ? {
        ...g,
        name: formData.name,
        teacherId: formData.teacherId,
        teacherName: teacher?.fullName || '',
        schedule: { days: daysText, time: timeText, scheduleDays: formData.scheduleDays },
        price: Number(formData.price),
        maxStudents: Number(formData.maxStudents)
      } : g));
      setShowEditModal(false);
      resetForm();
    } catch (err) { 
      console.error(err);
      alert("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await groupsAPI.delete(selectedGroup.id);
      setGroups(groups.filter(g => g.id !== selectedGroup.id));
      setShowDeleteModal(false);
    } catch (err) { alert("O'chirishda xatolik"); }
    finally { setFormLoading(false); }
  };

  const openEditModal = (group, e) => {
    e?.stopPropagation();
    setSelectedGroup(group);
    
    // Eski format (days string) dan scheduleDays array ga o'tkazish
    let scheduleDays = group.schedule?.scheduleDays || [];
    if (scheduleDays.length === 0 && group.schedule?.days) {
      // Eski formatdan konvertatsiya
      const daysStr = group.schedule.days.toLowerCase();
      if (daysStr.includes('du')) scheduleDays.push(1);
      if (daysStr.includes('se')) scheduleDays.push(2);
      if (daysStr.includes('chor')) scheduleDays.push(3);
      if (daysStr.includes('pay')) scheduleDays.push(4);
      if (daysStr.includes('ju')) scheduleDays.push(5);
      if (daysStr.includes('sha')) scheduleDays.push(6);
      if (daysStr.includes('yak')) scheduleDays.push(0);
    }
    
    // Vaqtni ajratish
    const timeStr = group.schedule?.time || '';
    const [startTime, endTime] = timeStr.split('-').map(t => t?.trim() || '');
    
    setFormData({
      name: group.name || '',
      teacherId: group.teacherId || '',
      scheduleDays: scheduleDays,
      startTime: group.schedule?.startTime || startTime || '09:00',
      endTime: group.schedule?.endTime || endTime || '10:30',
      price: group.price?.toString() || '',
      maxStudents: group.maxStudents?.toString() || '',
      room: group.room || group.schedule?.room || ''
    });
    setShowEditModal(true);
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // Guruh tafsilotlari ko'rinishi
  if (viewingGroup) {
    const { top, bottom } = getTopAndBottomStudents();
    
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewingGroup(null)} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{viewingGroup.name}</h1>
            <p className="text-gray-500">{viewingGroup.teacherName} • {viewingGroup.schedule?.days} • {viewingGroup.schedule?.time}</p>
          </div>
        </div>

        {loadingDetails ? (
          <Loading text="Ma'lumotlar yuklanmoqda..." />
        ) : (
          <>
            {/* Statistika */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card padding="p-4" className="text-center">
                <Users className="w-6 h-6 mx-auto text-primary-500 mb-2" />
                <p className="text-2xl font-bold">{groupStudents.length}</p>
                <p className="text-sm text-gray-500">O'quvchilar</p>
              </Card>
              <Card padding="p-4" className="text-center">
                <TrendingUp className="w-6 h-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-bold">{groupGrades.length}</p>
                <p className="text-sm text-gray-500">Baholar</p>
              </Card>
              <Card padding="p-4" className="text-center bg-green-50">
                <Award className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-600">{top.length}</p>
                <p className="text-sm text-green-600">A'lochilar</p>
              </Card>
              <Card padding="p-4" className="text-center bg-red-50">
                <AlertTriangle className="w-6 h-6 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-600">{bottom.length}</p>
                <p className="text-sm text-red-600">E'tibor kerak</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* O'quvchilar ro'yxati */}
              <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">O'quvchilar ro'yxati</h3>
                {groupStudents.length > 0 ? (
                  <Table>
                    <Table.Head>
                      <Table.Row>
                        <Table.Header>#</Table.Header>
                        <Table.Header>O'quvchi</Table.Header>
                        <Table.Header>Telefon</Table.Header>
                        <Table.Header>O'rtacha ball</Table.Header>
                        <Table.Header>Holat</Table.Header>
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {groupStudents.map((student, index) => {
                        const stats = getStudentStats(student.id);
                        return (
                          <Table.Row key={student.id}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>
                              <div className="flex items-center gap-2">
                                <Avatar name={student.fullName} size="sm" />
                                <span className="font-medium">{student.fullName}</span>
                              </div>
                            </Table.Cell>
                            <Table.Cell>{student.phone}</Table.Cell>
                            <Table.Cell>
                              <span className={`font-bold ${stats.average >= 80 ? 'text-green-600' : stats.average >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {stats.count > 0 ? `${stats.average}%` : '-'}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              {stats.average >= 80 ? (
                                <Badge variant="success">A'lochi</Badge>
                              ) : stats.average >= 60 ? (
                                <Badge variant="warning">O'rta</Badge>
                              ) : stats.count > 0 ? (
                                <Badge variant="danger">Past</Badge>
                              ) : (
                                <Badge>Yangi</Badge>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table>
                ) : (
                  <EmptyState icon={Users} title="O'quvchilar yo'q" description="Bu guruhga hali o'quvchi qo'shilmagan" />
                )}
              </Card>

              {/* Eng yaxshi va orqada qolayotganlar */}
              <div className="space-y-4">
                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-500" /> Eng yaxshilar
                  </h3>
                  {top.length > 0 ? (
                    <div className="space-y-3">
                      {top.map((student, index) => (
                        <div key={student.id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}>
                            {index + 1}
                          </span>
                          <Avatar name={student.fullName} size="sm" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{student.fullName}</p>
                            <p className="text-xs text-gray-500">{student.stats.average}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Hali baholar yo'q</p>
                  )}
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" /> E'tibor kerak
                  </h3>
                  {bottom.length > 0 ? (
                    <div className="space-y-3">
                      {bottom.map(student => (
                        <div key={student.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                          <Avatar name={student.fullName} size="sm" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{student.fullName}</p>
                            <p className="text-xs text-red-600">{student.stats.average}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Hammasi yaxshi!</p>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Guruhlar ro'yxati
  const handleAddClick = () => {
    if (!limitCheck.allowed) {
      setShowLimitModal(true);
      return;
    }
    resetForm();
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Limit warning */}
      {limitCheck.limit !== -1 && limitCheck.remaining <= 3 && limitCheck.remaining > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">
            <span className="font-medium">Limit yaqinlashmoqda!</span> {limitCheck.remaining} ta guruh qo'shish mumkin.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isTeacher ? 'Guruhlarim' : 'Guruhlar'}
          </h1>
          <p className="text-gray-500">
            Jami {groups.length} ta guruh
            {limitCheck.limit !== -1 && <span className="ml-2 text-sm">(limit: {limitCheck.limit})</span>}
          </p>
        </div>
        {isAdmin && (
          <Button 
            icon={Plus} 
            onClick={handleAddClick}
            disabled={!limitCheck.allowed}
          >
            Yangi guruh
          </Button>
        )}
      </div>

      <Card padding="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Guruh nomi bo'yicha qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500" />
        </div>
      </Card>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map(group => (
            <Card 
              key={group.id} 
              className="hover:shadow-md transition cursor-pointer"
              onClick={() => viewGroupDetails(group)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <Badge variant={group.studentsCount >= group.maxStudents ? 'warning' : 'success'}>
                  {group.studentsCount >= group.maxStudents ? "To'lgan" : 'Faol'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Avatar name={group.teacherName} size="sm" />
                <span className="text-sm text-gray-600">{group.teacherName || "O'qituvchi yo'q"}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{group.studentsCount || 0}/{group.maxStudents} o'quvchi</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{group.schedule?.days}</span></div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{group.schedule?.time}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="font-bold text-primary-600">{formatMoney(group.price)}</span>
                <div className="flex gap-1">
                  {isAdmin && (
                    <button onClick={(e) => openEditModal(group, e)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                  )}
                  {isDirector && (
                    <button onClick={(e) => { e.stopPropagation(); setSelectedGroup(group); setShowDeleteModal(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={Users} title="Guruhlar topilmadi" action={<Button onClick={() => setSearchQuery('')}>Tozalash</Button>} /></Card>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi guruh" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Guruh nomi" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ingliz tili - Beginner" required />
          <Select label="O'qituvchi" value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} options={teachers.map(t => ({ value: t.id, label: `${t.fullName} (${t.subject})` }))} required />
          
          {/* Dars kunlari */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dars kunlari</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                    formData.scheduleDays.includes(day.id)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {formData.scheduleDays.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Tanlangan: {formData.scheduleDays.sort((a,b) => a-b).map(d => WEEKDAYS.find(w => w.id === d)?.full).join(', ')}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Input label="Boshlanish vaqti" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
            <Input label="Tugash vaqti" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
            <Input label="Xona" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="101" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Narxi (so'm)" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="850000" required />
            <Input label="Max o'quvchilar" type="number" value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} placeholder="15" required />
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            <p>📅 Tanlangan kunlar avtomatik dars jadvaliga qo'shiladi</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Yaratish</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Guruhni tahrirlash" size="lg">
        <form onSubmit={handleEdit} className="space-y-4">
          <Input label="Guruh nomi" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Select label="O'qituvchi" value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} options={teachers.map(t => ({ value: t.id, label: t.fullName }))} />
          
          {/* Dars kunlari */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dars kunlari</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition ${
                    formData.scheduleDays.includes(day.id)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Input label="Boshlanish vaqti" type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
            <Input label="Tugash vaqti" type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
            <Input label="Xona" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Narxi" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            <Input label="Max o'quvchilar" type="number" value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Guruhni o'chirish">
        <p className="text-gray-600 mb-4"><strong>{selectedGroup?.name}</strong> guruhini o'chirishni xohlaysizmi?</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Bekor qilish</Button>
          <Button variant="danger" loading={formLoading} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>

      {/* Limit Modal */}
      <Modal isOpen={showLimitModal} onClose={() => setShowLimitModal(false)} title="Limit tugadi">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Guruhlar limiti tugadi</h3>
          <p className="text-gray-600 mb-4">
            {SUBSCRIPTION_PLANS[subscription]?.nameUz || 'Joriy'} tarifda {limitCheck.limit} ta guruh cheklovi mavjud.
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="ghost" onClick={() => setShowLimitModal(false)}>Yopish</Button>
            <Button onClick={() => window.location.href = '/settings'}>Tarifni yangilash</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
