import { useState, useEffect } from 'react';
import { 
  Video, FileText, Plus, Play, Download, Trash2, Eye, Upload,
  Youtube, File, FolderOpen, Search, Filter, Link, Clock, Users
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Modal, Loading } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { materialsAPI, groupsAPI, teachersAPI, studentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video', // video, pdf, link
    groupId: '',
    youtubeUrl: '',
    linkUrl: '',
    category: 'lesson' // lesson, homework, extra
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
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        let student;
        if (role === ROLES.PARENT) {
          student = allStudents.find(s => s.parentPhone === userData?.phone || normalizePhone(s.parentPhone) === normalizePhone(userData?.phone));
        } else {
          student = allStudents.find(s => s.email === userData?.email || normalizePhone(s.phone) === normalizePhone(userData?.phone));
        }
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
        youtubeUrl: '', linkUrl: '', category: 'lesson'
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

          {/* Materiallar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials
              .filter(m => filter === 'all' || m.type === filter)
              .map(material => (
              <Card key={material.id} className="overflow-hidden hover:shadow-lg transition">
                {/* Thumbnail */}
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
                    <div className="flex gap-1">
                      {getTypeBadge(material.type)}
                    </div>
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
            ))}
          </div>

          {materials.length === 0 && (
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
