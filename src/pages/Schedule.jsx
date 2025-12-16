import { useState, useEffect } from 'react';
import { 
  Calendar, Plus, Edit, Trash2, Clock, Users, ChevronLeft, ChevronRight,
  BookOpen, GraduationCap
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Modal, Loading, EmptyState } from '../components/common';
import { scheduleAPI, groupsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { toast } from 'react-toastify';

const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
const DAYS_SHORT = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-cyan-100 border-cyan-300 text-cyan-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
];

const Schedule = () => {
  const { userData, role } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('week'); // week | day | list
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7); // 1-7
  const [filterGroup, setFilterGroup] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    groupId: '', teacherId: '', daysOfWeek: [], startTime: '09:00', endTime: '10:30', room: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;

  useEffect(() => { fetchData(); }, []);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const fetchData = async () => {
    try {
      const [scheduleData, groupsData, teachersData] = await Promise.all([
        scheduleAPI.getAll(),
        groupsAPI.getAll(),
        teachersAPI.getAll()
      ]);
      setSchedule(scheduleData);
      setGroups(groupsData);
      setTeachers(teachersData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getGroupColor = (groupId) => {
    const index = groups.findIndex(g => g.id === groupId);
    return COLORS[index % COLORS.length];
  };

  const getScheduleForDay = (dayOfWeek) => {
    let filtered = schedule.filter(s => parseInt(s.dayOfWeek) === dayOfWeek);
    if (filterGroup) filtered = filtered.filter(s => s.groupId === filterGroup);
    if (filterTeacher) filtered = filtered.filter(s => s.teacherId === filterTeacher);
    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (formData.daysOfWeek.length === 0) {
      toast.error("Kamida bitta kun tanlang");
      return;
    }
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === formData.groupId);
      const teacher = teachers.find(t => t.id === formData.teacherId);
      
      // Har bir tanlangan kun uchun alohida dars yaratish
      const newSchedules = [];
      for (const day of formData.daysOfWeek) {
        const newSchedule = await scheduleAPI.create({
          groupId: formData.groupId,
          teacherId: formData.teacherId,
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.room,
          groupName: group?.name || '',
          teacherName: teacher?.fullName || '',
          dayOfWeek: parseInt(day)
        });
        newSchedules.push({ ...newSchedule, groupName: group?.name, teacherName: teacher?.fullName });
      }
      
      setSchedule([...schedule, ...newSchedules]);
      setShowAddModal(false);
      resetForm();
      toast.success(`${formData.daysOfWeek.length} ta dars qo'shildi`);
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const group = groups.find(g => g.id === formData.groupId);
      const teacher = teachers.find(t => t.id === formData.teacherId);
      const dayOfWeek = formData.daysOfWeek[0] ? parseInt(formData.daysOfWeek[0]) : selectedSchedule.dayOfWeek;
      
      await scheduleAPI.update(selectedSchedule.id, {
        groupId: formData.groupId,
        teacherId: formData.teacherId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        groupName: group?.name || '',
        teacherName: teacher?.fullName || '',
        dayOfWeek
      });
      
      setSchedule(schedule.map(s => s.id === selectedSchedule.id ? {
        ...s, 
        groupId: formData.groupId,
        teacherId: formData.teacherId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        groupName: group?.name, 
        teacherName: teacher?.fullName, 
        dayOfWeek
      } : s));
      setShowEditModal(false);
      toast.success("Dars jadvali yangilandi");
    } catch (err) { toast.error("Xatolik yuz berdi"); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu darsni o'chirishni xohlaysizmi?")) return;
    try {
      await scheduleAPI.delete(id);
      setSchedule(schedule.filter(s => s.id !== id));
      toast.success("Dars o'chirildi");
    } catch (err) { toast.error("Xatolik yuz berdi"); }
  };

  const resetForm = () => {
    setFormData({ groupId: '', teacherId: '', daysOfWeek: [], startTime: '09:00', endTime: '10:30', room: '' });
  };

  const openEditModal = (item) => {
    setSelectedSchedule(item);
    setFormData({
      groupId: item.groupId,
      teacherId: item.teacherId,
      daysOfWeek: [String(item.dayOfWeek)],
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room || ''
    });
    setShowEditModal(true);
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day) 
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatWeekRange = () => {
    const start = currentWeekStart;
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dars jadvali</h1>
          <p className="text-gray-500">Haftalik dars jadvali</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button icon={Plus} onClick={() => { resetForm(); setShowAddModal(true); }}>
              Dars qo'shish
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Navigation */}
      <Card padding="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold min-w-[120px] text-center">{formatWeekRange()}</span>
            <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setCurrentWeekStart(getWeekStart(new Date()))}
            >
              Bugun
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">Barcha guruhlar</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">Barcha o'qituvchilar</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.fullName}</option>
              ))}
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 text-sm ${viewMode === 'week' ? 'bg-primary-100 text-primary-700' : ''}`}
              >
                Hafta
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : ''}`}
              >
                Ro'yxat
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="p-2 text-center text-sm font-medium text-gray-500">Vaqt</div>
              {getWeekDates().map((date, i) => {
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div 
                    key={i} 
                    className={`p-2 text-center rounded-lg ${isToday ? 'bg-primary-100' : ''}`}
                  >
                    <p className={`text-sm font-medium ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                      {DAYS_SHORT[i]}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-primary-700' : ''}`}>
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="border rounded-lg overflow-hidden">
              {TIME_SLOTS.map((time, timeIndex) => (
                <div key={time} className={`grid grid-cols-8 gap-px ${timeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="p-2 text-xs text-gray-500 text-center border-r">{time}</div>
                  {DAYS.map((_, dayIndex) => {
                    const daySchedule = getScheduleForDay(dayIndex + 1);
                    const lesson = daySchedule.find(s => s.startTime === time);
                    
                    return (
                      <div key={dayIndex} className="min-h-[60px] p-1 border-r last:border-r-0 relative">
                        {lesson && (
                          <div 
                            className={`absolute inset-1 p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition ${getGroupColor(lesson.groupId)}`}
                            onClick={() => isAdmin && openEditModal(lesson)}
                          >
                            <p className="font-medium text-xs truncate">{lesson.groupName}</p>
                            <p className="text-xs opacity-75 truncate">{lesson.teacherName}</p>
                            <p className="text-xs opacity-75">{lesson.startTime}-{lesson.endTime}</p>
                            {lesson.room && <p className="text-xs opacity-75">📍 {lesson.room}</p>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {DAYS.map((day, dayIndex) => {
            const daySchedule = getScheduleForDay(dayIndex + 1);
            if (daySchedule.length === 0) return null;
            
            return (
              <Card key={day}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  {day}
                </h3>
                <div className="space-y-2">
                  {daySchedule.map(lesson => (
                    <div 
                      key={lesson.id} 
                      className={`p-3 rounded-lg border-l-4 flex items-center justify-between ${getGroupColor(lesson.groupId)}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-bold">{lesson.startTime}</p>
                          <p className="text-xs opacity-75">{lesson.endTime}</p>
                        </div>
                        <div>
                          <p className="font-medium">{lesson.groupName}</p>
                          <p className="text-sm opacity-75 flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {lesson.teacherName}
                          </p>
                          {lesson.room && (
                            <p className="text-sm opacity-75">📍 {lesson.room}</p>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => openEditModal(lesson)}
                            className="p-2 hover:bg-white/50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(lesson.id)}
                            className="p-2 hover:bg-white/50 rounded-lg text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
          
          {schedule.length === 0 && (
            <Card>
              <EmptyState 
                icon={Calendar} 
                title="Dars jadvali bo'sh" 
                description="Hali dars jadvali qo'shilmagan"
              />
            </Card>
          )}
        </div>
      )}

      {/* Legend */}
      <Card padding="p-4">
        <h4 className="font-medium mb-3">Guruhlar</h4>
        <div className="flex flex-wrap gap-2">
          {groups.map((group, index) => (
            <span key={group.id} className={`px-3 py-1 rounded-full text-sm ${COLORS[index % COLORS.length]}`}>
              {group.name}
            </span>
          ))}
        </div>
      </Card>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi dars qo'shish">
        <form onSubmit={handleAdd} className="space-y-4">
          <Select
            label="Guruh"
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            options={groups.map(g => ({ value: g.id, label: g.name }))}
            required
          />
          <Select
            label="O'qituvchi"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={teachers.map(t => ({ value: t.id, label: t.fullName }))}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hafta kunlari *</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(String(i + 1))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    formData.daysOfWeek.includes(String(i + 1))
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
            {formData.daysOfWeek.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Tanlangan: {formData.daysOfWeek.map(d => DAYS[parseInt(d) - 1]?.slice(0, 3)).join(', ')}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Boshlanish vaqti"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="Tugash vaqti"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
          <Input
            label="Xona (ixtiyoriy)"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="201-xona"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Qo'shish</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Darsni tahrirlash">
        <form onSubmit={handleEdit} className="space-y-4">
          <Select
            label="Guruh"
            value={formData.groupId}
            onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
            options={groups.map(g => ({ value: g.id, label: g.name }))}
            required
          />
          <Select
            label="O'qituvchi"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            options={teachers.map(t => ({ value: t.id, label: t.fullName }))}
            required
          />
          <Select
            label="Hafta kuni"
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
            options={DAYS.map((d, i) => ({ value: String(i + 1), label: d }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Boshlanish vaqti"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="Tugash vaqti"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
          <Input
            label="Xona (ixtiyoriy)"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            placeholder="201-xona"
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowEditModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading}>Saqlash</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Schedule;
