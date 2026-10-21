import { useState, useEffect } from 'react';
import { 
  Video, FileText, Plus, Play, Download, Trash2, Eye, Upload,
  Youtube, File, FolderOpen, Search, Filter, Link, Clock, Users
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Modal, Loading } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { materialsAPI, groupsAPI, teachersAPI, studentsAPI, gradesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import {
  GRADE_LEVEL_META,
  getCourse,
  getCourseOptions,
  getLessonOptions,
  getLesson,
  getLevelNudge,
} from '../utils/curriculum';
import { getLessonContent, hasLessonContent } from '../data/lessonContent';
import LessonContent from '../components/common/LessonContent';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

// Materialni qaysi darsga tegishli ekaniga qarab guruhlaymiz.
// Darsga bog'lanmagan eski materiallar oxirida alohida bo'limda qoladi.
const UNLINKED = '__unlinked__';

const Materials = () => {
  const { userData, role } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [filter, setFilter] = useState('all');
  const [studentData, setStudentData] = useState(null);
  // O'quvchining dars bo'yicha darajasi: { 'junior.m1.l8': 'bronze', ... }
  const [myLevels, setMyLevels] = useState({});
  // Ochiq turgan dars (bir vaqtda bittasi) va o'qituvchi qismi ochiqmi
  const [openLesson, setOpenLesson] = useState(null);
  const [showTeacherNotes, setShowTeacherNotes] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video', // video, pdf, link
    groupId: '',
    youtubeUrl: '',
    linkUrl: '',
    category: 'lesson', // lesson, homework, extra
    courseId: '',
    lessonId: '',
  });

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canCreate = isTeacher || isAdmin;

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) fetchMaterials(); }, [selectedGroup]);

  const fetchData = async () => {
    try {
      let groupsData = [];
      
      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        const allGroups = await groupsAPI.getAll();
        if (teacher) groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);
        groupsData = [...groupsData, ...groups2].filter((g, i, self) => i === self.findIndex(t => t.id === g.id));
      } else if (isStudentOrParent) {
        const allStudents = await studentsAPI.getAll();
        // O'z yozuvi: o'quvchi — userId, ota-ona — childIds (studentsAPI to'liq faqat shularni qaytaradi)
        let student = allStudents.find(s => s.isMine);
        if (student) {
          setStudentData(student);
          const allGroups = await groupsAPI.getAll();
          groupsData = allGroups.filter(g => g.id === student.groupId || g.studentIds?.includes(student.id));
        }
      } else {
        groupsData = await groupsAPI.getAll();
      }
      
      setGroups(groupsData);
      if (groupsData.length === 1) setSelectedGroup(groupsData[0].id);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMaterials = async () => {
    try {
      const data = await materialsAPI.getByGroup(selectedGroup);
      setMaterials(data.sort((a, b) => 
        new Date(b.createdAt?.seconds * 1000 || b.createdAt) - 
        new Date(a.createdAt?.seconds * 1000 || a.createdAt)
      ));
    } catch (err) { console.error(err); }
  };

  // O'quvchining har dars bo'yicha ENG YUQORI darajasini yig'amiz.
  // Eng oxirgisini emas — eng yaxshisini. Bola bir marta Gold qilgan bo'lsa,
  // keyingi Bronze uni orqaga tortmasligi kerak.
  useEffect(() => {
    if (!isStudentOrParent || !studentData?.id) return;
    let cancelled = false;

    const rank = { bronze: 1, silver: 2, gold: 3 };

    (async () => {
      try {
        const myGrades = await gradesAPI.getByStudent(studentData.id);
        if (cancelled) return;
        const best = {};
        myGrades.forEach(g => {
          if (!g.lessonId || !g.level || !rank[g.level]) return;
          if (!best[g.lessonId] || rank[g.level] > rank[best[g.lessonId]]) {
            best[g.lessonId] = g.level;
          }
        });
        setMyLevels(best);
      } catch {
        /* baholar yuklanmasa — daraja ko'rsatilmaydi, sahifa baribir ishlaydi */
      }
    })();

    return () => { cancelled = true; };
  }, [isStudentOrParent, studentData?.id]);

  // Materiallarni lessonId bo'yicha indekslash
  const materialsByLesson = (list) => {
    const map = new Map();
    list.forEach(m => {
      const key = m.lessonId && getLesson(m.lessonId) ? m.lessonId : UNLINKED;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    });
    return map;
  };

  // YouTube URL dan video ID olish
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // YouTube thumbnail
  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Sarlavhani kiriting");
      return;
    }

    if (formData.type === 'video' && !formData.youtubeUrl) {
      toast.error("YouTube linkini kiriting");
      return;
    }

    if (formData.type === 'link' && !formData.linkUrl) {
      toast.error("Linkni kiriting");
      return;
    }

    try {
      const group = groups.find(g => g.id === formData.groupId);
      
      const newMaterial = await materialsAPI.create({
        ...formData,
        groupName: group?.name || '',
        teacherId: userData?.id,
        teacherName: userData?.fullName,
        videoId: formData.type === 'video' ? getYoutubeVideoId(formData.youtubeUrl) : null,
        thumbnail: formData.type === 'video' ? getYoutubeThumbnail(formData.youtubeUrl) : null,
      });

      setMaterials([newMaterial, ...materials]);
      setShowAddModal(false);
      setFormData({
        title: '', description: '', type: 'video', groupId: selectedGroup,
        youtubeUrl: '', linkUrl: '', category: 'lesson',
        // Kurs tanlovi saqlanadi — o'qituvchi ketma-ket material qo'shsa qulay
        courseId: formData.courseId, lessonId: '',
      });
      toast.success("Material qo'shildi!");
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu materialni o'chirishni xohlaysizmi?")) return;
    try {
      await materialsAPI.delete(id);
      setMaterials(materials.filter(m => m.id !== id));
      toast.success("O'chirildi");
    } catch (err) { toast.error("Xatolik"); }
  };

  const openVideo = (material) => {
    setSelectedMaterial(material);
    setShowVideoModal(true);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'lesson': return <Badge variant="primary">Dars</Badge>;
      case 'homework': return <Badge variant="warning">Uy vazifasi</Badge>;
      case 'extra': return <Badge variant="success">Qo'shimcha</Badge>;
      default: return <Badge>{category}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'video': return <Badge variant="danger"><Youtube className="w-3 h-3 mr-1" />Video</Badge>;
      case 'pdf': return <Badge variant="primary"><FileText className="w-3 h-3 mr-1" />PDF</Badge>;
      case 'link': return <Badge variant="secondary"><Link className="w-3 h-3 mr-1" />Link</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  // Bitta material kartochkasi. Dars ichida ham, "Umumiy materiallar"
  // bo'limida ham xuddi shu ko'rinish ishlatiladi.
  const renderMaterialCard = (material) => (
    <Card key={material.id} className="overflow-hidden hover:shadow-lg transition">
      {material.type === 'video' && material.thumbnail && (
        <div
          className="relative h-40 bg-gray-100 cursor-pointer group"
          onClick={() => openVideo(material)}
        >
          <img
            src={material.thumbnail}
            alt={material.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>
      )}

      {material.type !== 'video' && (
        <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          {material.type === 'pdf' ? (
            <FileText className="w-16 h-16 text-blue-500" />
          ) : (
            <Link className="w-16 h-16 text-purple-500" />
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold line-clamp-2">{material.title}</h3>
          <div className="flex gap-1">{getTypeBadge(material.type)}</div>
        </div>

        {material.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{material.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getCategoryBadge(material.category)}
            <span className="text-xs text-gray-500">{formatDate(material.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1">
            {material.type === 'video' && (
              <Button size="sm" variant="outline" onClick={() => openVideo(material)}>
                <Play className="w-4 h-4" />
              </Button>
            )}
            {material.type === 'link' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(material.linkUrl, '_blank')}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            {canCreate && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(material.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quv Materiallari</h1>
          <p className="text-gray-500">Video darslar va qo'shimcha materiallar</p>
        </div>
        
        <div className="flex items-center gap-2">
          {groups.length > 1 && (
            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              options={groups.map(g => ({ value: g.id, label: g.name }))}
              placeholder="Guruhni tanlang"
              className="w-48"
            />
          )}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Barchasi</option>
            <option value="video">Videolar</option>
            <option value="pdf">PDF</option>
            <option value="link">Linklar</option>
          </select>
          {canCreate && selectedGroup && (
            <Button icon={Plus} onClick={() => {
              setFormData({ ...formData, groupId: selectedGroup });
              setShowAddModal(true);
            }}>
              Qo'shish
            </Button>
          )}
        </div>
      </div>

      {selectedGroup ? (
        <>
          {/* Statistika */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="p-4" className="text-center">
              <FolderOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{materials.length}</p>
              <p className="text-sm text-gray-500">Jami materiallar</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <Youtube className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{materials.filter(m => m.type === 'video').length}</p>
              <p className="text-sm text-gray-500">Videolar</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{materials.filter(m => m.type === 'pdf').length}</p>
              <p className="text-sm text-gray-500">PDF fayllar</p>
            </Card>
            <Card padding="p-4" className="text-center">
              <Link className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{materials.filter(m => m.type === 'link').length}</p>
              <p className="text-sm text-gray-500">Linklar</p>
            </Card>
          </div>

          {/* ── Mavzulashtirilgan dastur ─────────────────────────────
              Guruhga kurs biriktirilgan bo'lsa, BARCHA darslar ro'yxati
              chiqadi — materiali yo'q darslar ham. Chunki dars matni
              o'zi ham material. Video kutib turish shart emas. */}
          {(() => {
            const visible = materials.filter(m => filter === 'all' || m.type === filter);
            const byLesson = materialsByLesson(visible);
            const group = groups.find(g => g.id === selectedGroup);
            const course = getCourse(group?.courseId);
            const unlinked = byLesson.get(UNLINKED) || [];

            return (
              <>
                {!course && canCreate && (
                  <Card className="bg-amber-50 border-amber-200">
                    <p className="text-sm text-amber-900">
                      <b>Bu guruhga kurs dasturi biriktirilmagan.</b> Guruhlar bo'limidan
                      "Kurs dasturi"ni tanlasangiz, bu yerda barcha darslar mavzu bo'yicha
                      chiqadi va o'quvchi dars matnini o'qiy oladi.
                    </p>
                  </Card>
                )}

                {course && course.modules.map(mod => (
                  <Card key={mod.id} padding="p-0" className="overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <h3 className="font-semibold text-gray-900">{mod.name}</h3>
                      <p className="text-xs text-gray-500">{mod.lessons.length} ta dars</p>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {mod.lessons.map(lesson => {
                        const items = byLesson.get(lesson.id) || [];
                        const hasText = hasLessonContent(lesson.id);
                        const isOpen = openLesson === lesson.id;
                        const myLevel = myLevels[lesson.id];
                        const meta = myLevel ? GRADE_LEVEL_META[myLevel] : null;
                        const nudge = myLevel ? getLevelNudge(myLevel) : null;
                        const content = isOpen
                          ? getLessonContent(lesson.id, { includeTeacher: canCreate })
                          : null;

                        return (
                          <div key={lesson.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenLesson(isOpen ? null : lesson.id);
                                setShowTeacherNotes(false);
                              }}
                              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition"
                            >
                              <span className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                hasText || items.length
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {lesson.n}
                              </span>

                              <span className="flex-1 min-w-0">
                                <span className={`block font-medium ${hasText || items.length ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {lesson.title}
                                </span>
                                <span className="flex flex-wrap items-center gap-2 mt-1">
                                  {hasText && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                                      📖 Dars matni
                                    </span>
                                  )}
                                  {items.length > 0 && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-700">
                                      🎬 {items.length} material
                                    </span>
                                  )}
                                  {!hasText && items.length === 0 && (
                                    <span className="text-xs text-gray-400">Hali tayyorlanmagan</span>
                                  )}
                                  {isStudentOrParent && meta && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${meta.badgeClass}`}>
                                      {meta.emoji} {meta.label}
                                    </span>
                                  )}
                                </span>
                              </span>

                              <span className="text-gray-400 text-sm mt-1 flex-shrink-0">
                                {isOpen ? '▲' : '▼'}
                              </span>
                            </button>

                            {isOpen && (
                              <div className="px-4 pb-5 space-y-4 bg-gray-50/50">
                                {/* Maqsad */}
                                {content?.goal && (
                                  <div className="rounded-xl bg-white border border-gray-200 px-4 py-3">
                                    <p className="text-sm text-gray-700">
                                      <b>Maqsad:</b> {content.goal}
                                    </p>
                                  </div>
                                )}

                                {/* Keyingi daraja undovi */}
                                {isStudentOrParent && nudge && (
                                  <div className={`rounded-xl px-4 py-2 text-sm ${
                                    nudge.done
                                      ? 'bg-green-50 text-green-800 border border-green-200'
                                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                                  }`}>
                                    {nudge.text}
                                  </div>
                                )}

                                {/* Dars matni */}
                                {content?.student ? (
                                  <div className="rounded-xl bg-white border border-gray-200 p-4">
                                    <LessonContent markdown={content.student} />
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Bu dars uchun matn hali kiritilmagan.
                                  </p>
                                )}

                                {/* O'qituvchi qismi — faqat o'qituvchi/admin */}
                                {canCreate && content?.teacher && (
                                  <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-4">
                                    <button
                                      type="button"
                                      onClick={() => setShowTeacherNotes(!showTeacherNotes)}
                                      className="flex items-center gap-2 text-sm font-semibold text-amber-900"
                                    >
                                      🔒 Faqat o'qituvchi uchun
                                      <span className="text-xs font-normal text-amber-700">
                                        {showTeacherNotes ? '(yashirish)' : '(ochish)'}
                                      </span>
                                    </button>
                                    {showTeacherNotes && (
                                      <div className="mt-3">
                                        <LessonContent markdown={content.teacher} />
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Shu darsga biriktirilgan materiallar */}
                                {items.length > 0 && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map(material => renderMaterialCard(material))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}

                {/* Darsga bog'lanmagan materiallar */}
                {unlinked.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-500 pt-2">Umumiy materiallar</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {unlinked.map(material => renderMaterialCard(material))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Bo'sh holat faqat kurs dasturi biriktirilmagan guruhlarda —
              aks holda darslar ro'yxati o'zi ko'rinib turadi */}
          {materials.length === 0 && !groups.find(g => g.id === selectedGroup)?.courseId && (
            <Card className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Materiallar yo'q</p>
              {canCreate && (
                <Button className="mt-4" onClick={() => {
                  setFormData({ ...formData, groupId: selectedGroup });
                  setShowAddModal(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Birinchi material qo'shish
                </Button>
              )}
            </Card>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Guruhni tanlang</p>
        </Card>
      )}

      {/* Ma'lumot */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Youtube className="w-6 h-6 text-red-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">YouTube videolar haqida</h4>
            <p className="text-sm text-blue-700 mt-1">
              YouTube'da video yuklang va <b>Unlisted (Ro'yxatda yo'q)</b> qilib sozlang. 
              Bu videolar faqat link orqali ko'rinadi va qidiruvda chiqmaydi.
            </p>
          </div>
        </div>
      </Card>

      {/* Material qo'shish modali */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Yangi material qo'shish" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Sarlavha"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Masalan: 1-dars: Kirish"
            required
          />

          <Textarea
            label="Tavsif"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Material haqida qisqacha..."
            rows={2}
          />

          {/* ── Qaysi darsga tegishli ───────────────────────────────
              Bog'lansa, o'quvchi kabinetida material o'sha dars ostida
              ko'rinadi va yonida uning Bronze/Silver/Gold darajasi chiqadi. */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Qaysi darsga tegishli?
              </label>
              {formData.lessonId && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, lessonId: '' })}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Bog'lamaslik
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value, lessonId: '' })}
                options={getCourseOptions()}
                placeholder="Kurs"
              />
              <Select
                value={formData.lessonId}
                onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                options={getLessonOptions(formData.courseId)}
                placeholder={formData.courseId ? 'Dars' : 'Avval kursni tanlang'}
                disabled={!formData.courseId}
              />
            </div>

            <p className="text-xs text-gray-500">
              Ixtiyoriy. Bo'sh qoldirsangiz material "Umumiy materiallar" bo'limiga tushadi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tur"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'video', label: 'YouTube Video' },
                { value: 'link', label: 'Havola (Link)' },
              ]}
            />
            <Select
              label="Kategoriya"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'lesson', label: 'Dars' },
                { value: 'homework', label: 'Uy vazifasi' },
                { value: 'extra', label: "Qo'shimcha" },
              ]}
            />
          </div>

          {formData.type === 'video' && (
            <div>
              <Input
                label="YouTube Video URL"
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {formData.youtubeUrl && getYoutubeVideoId(formData.youtubeUrl) && (
                <div className="mt-2">
                  <img 
                    src={getYoutubeThumbnail(formData.youtubeUrl)} 
                    alt="Video preview"
                    className="w-40 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {formData.type === 'link' && (
            <Input
              label="Havola URL"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://..."
            />
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">Qo'shish</Button>
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Video ko'rish modali */}
      <Modal 
        isOpen={showVideoModal} 
        onClose={() => setShowVideoModal(false)} 
        title={selectedMaterial?.title}
        size="xl"
      >
        {selectedMaterial && selectedMaterial.videoId && (
          <div className="space-y-4">
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedMaterial.videoId}`}
                title={selectedMaterial.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
            {selectedMaterial.description && (
              <p className="text-gray-600">{selectedMaterial.description}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Materials;
