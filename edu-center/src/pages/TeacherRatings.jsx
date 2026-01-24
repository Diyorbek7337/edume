import { useState, useEffect } from 'react';
import { Star, Send, User, MessageSquare, ThumbsUp, Award } from 'lucide-react';
import { Card, Button, Badge, Avatar, Modal, Loading, EmptyState, Textarea } from '../components/common';
import { teacherRatingsAPI, teachersAPI, groupsAPI, studentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const TeacherRatings = () => {
  const { userData, role } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [myTeachers, setMyTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [teachersData, ratingsData, groupsData] = await Promise.all([
        teachersAPI.getAll(),
        teacherRatingsAPI.getAll(),
        groupsAPI.getAll()
      ]);
      
      setTeachers(teachersData);
      setRatings(ratingsData);
      
      // O'quvchi/ota-ona uchun o'z guruhidagi o'qituvchilarni topish
      if (isStudentOrParent) {
        const allStudents = await studentsAPI.getAll();
        let student;
        
        if (role === ROLES.PARENT) {
          student = allStudents.find(s => 
            s.parentPhone === userData?.phone ||
            s.parentPhone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
          );
        } else {
          student = allStudents.find(s => 
            s.email === userData?.email ||
            s.phone?.replace(/\D/g, '') === userData?.phone?.replace(/\D/g, '')
          );
        }
        
        if (student) {
          // O'quvchi guruhlaridagi o'qituvchilarni topish
          const studentGroups = groupsData.filter(g => 
            g.id === student.groupId || g.studentIds?.includes(student.id)
          );
          const teacherIds = [...new Set(studentGroups.map(g => g.teacherId).filter(Boolean))];
          const myTeachersList = teachersData.filter(t => teacherIds.includes(t.id));
          setMyTeachers(myTeachersList);
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getTeacherRating = (teacherId) => {
    const teacherRatings = ratings.filter(r => r.teacherId === teacherId);
    if (teacherRatings.length === 0) return { avg: 0, count: 0 };
    const avg = teacherRatings.reduce((sum, r) => sum + r.rating, 0) / teacherRatings.length;
    return { avg: Math.round(avg * 10) / 10, count: teacherRatings.length };
  };

  const hasAlreadyRated = (teacherId) => {
    return ratings.some(r => r.teacherId === teacherId && r.odamId === userData?.id);
  };

  const openRateModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({ rating: 5, comment: '' });
    setShowRateModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Tekshirish - allaqachon baholaganmi
      const alreadyRated = await teacherRatingsAPI.checkExisting(selectedTeacher.id, userData?.id);
      if (alreadyRated) {
        toast.error("Siz bu o'qituvchini allaqachon bahologansiz");
        setShowRateModal(false);
        return;
      }
      
      const newRating = await teacherRatingsAPI.create({
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.fullName,
        odamId: userData?.id,
        odamName: userData?.fullName,
        odamRole: role,
        rating: formData.rating,
        comment: formData.comment
      });
      
      setRatings([...ratings, newRating]);
      setShowRateModal(false);
      toast.success("Bahoyingiz qabul qilindi!");
    } catch (err) { 
      console.error(err);
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const renderStars = (rating, size = 'md', interactive = false, onChange = null) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}
          >
            <Star 
              className={`${sizes[size]} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // Admin ko'rinishi - barcha o'qituvchilar va ularning baholari
  if (isAdmin) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'qituvchilar baholari</h1>
          <p className="text-gray-500">Ota-onalar va o'quvchilar tomonidan qo'yilgan baholar</p>
        </div>

        {/* Top rated teachers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachers
            .map(t => ({ ...t, rating: getTeacherRating(t.id) }))
            .sort((a, b) => b.rating.avg - a.rating.avg)
            .slice(0, 3)
            .map((teacher, index) => (
              <Card key={teacher.id} padding="p-4" className={index === 0 ? 'border-yellow-300 bg-yellow-50' : ''}>
                <div className="flex items-center gap-3">
                  {index === 0 && <Award className="w-8 h-8 text-yellow-500" />}
                  <Avatar name={teacher.fullName} size="lg" />
                  <div>
                    <p className="font-semibold">{teacher.fullName}</p>
                    <p className="text-sm text-gray-500">{teacher.subject}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(teacher.rating.avg, 'sm')}
                      <span className="text-sm font-medium">{teacher.rating.avg}</span>
                      <span className="text-xs text-gray-400">({teacher.rating.count} ta baho)</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {/* All teachers with ratings */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Barcha o'qituvchilar</h3>
          <div className="space-y-4">
            {teachers.map(teacher => {
              const teacherRating = getTeacherRating(teacher.id);
              const teacherReviews = ratings.filter(r => r.teacherId === teacher.id);
              
              return (
                <div key={teacher.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={teacher.fullName} />
                      <div>
                        <p className="font-semibold">{teacher.fullName}</p>
                        <p className="text-sm text-gray-500">{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {renderStars(teacherRating.avg, 'sm')}
                        <span className="font-bold text-lg">{teacherRating.avg || '-'}</span>
                      </div>
                      <p className="text-xs text-gray-500">{teacherRating.count} ta baho</p>
                    </div>
                  </div>
                  
                  {teacherReviews.length > 0 && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <p className="text-sm font-medium text-gray-600">Izohlar:</p>
                      {teacherReviews.filter(r => r.comment).slice(0, 3).map(review => (
                        <div key={review.id} className="bg-white p-2 rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default">{review.odamRole === 'parent' ? 'Ota-ona' : "O'quvchi"}</Badge>
                            {renderStars(review.rating, 'sm')}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // O'quvchi/Ota-ona ko'rinishi
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">O'qituvchilarni baholash</h1>
        <p className="text-gray-500">O'z o'qituvchilaringizga baho bering</p>
      </div>

      {myTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myTeachers.map(teacher => {
            const teacherRating = getTeacherRating(teacher.id);
            const alreadyRated = hasAlreadyRated(teacher.id);
            
            return (
              <Card key={teacher.id} className="hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={teacher.fullName} size="lg" />
                    <div>
                      <h3 className="font-semibold">{teacher.fullName}</h3>
                      <p className="text-sm text-primary-600">{teacher.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {renderStars(teacherRating.avg, 'sm')}
                        <span className="text-sm">{teacherRating.avg || '-'}</span>
                        <span className="text-xs text-gray-400">({teacherRating.count})</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  {alreadyRated ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm">Siz bahologansiz</span>
                    </div>
                  ) : (
                    <Button 
                      icon={Star} 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openRateModal(teacher)}
                    >
                      Baholash
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState 
            icon={User} 
            title="O'qituvchilar topilmadi" 
            description="Sizga biriktirilgan o'qituvchilar yo'q"
          />
        </Card>
      )}

      {/* Mening baholarim */}
      {ratings.filter(r => r.odamId === userData?.id).length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Mening baholarim
          </h3>
          <div className="space-y-3">
            {ratings.filter(r => r.odamId === userData?.id).map(review => (
              <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.teacherName}</span>
                  {renderStars(review.rating, 'sm')}
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Rate Modal */}
      <Modal isOpen={showRateModal} onClose={() => setShowRateModal(false)} title="O'qituvchini baholash">
        <form onSubmit={handleSubmitRating} className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Avatar name={selectedTeacher?.fullName} size="lg" className="mx-auto mb-2" />
            <p className="font-semibold">{selectedTeacher?.fullName}</p>
            <p className="text-sm text-gray-500">{selectedTeacher?.subject}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Bahoyingiz
            </label>
            <div className="flex justify-center">
              {renderStars(formData.rating, 'lg', true, (rating) => setFormData({ ...formData, rating }))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-1">
              {formData.rating === 1 && 'Juda yomon'}
              {formData.rating === 2 && 'Yomon'}
              {formData.rating === 3 && "O'rtacha"}
              {formData.rating === 4 && 'Yaxshi'}
              {formData.rating === 5 && "A'lo"}
            </p>
          </div>
          
          <Textarea
            label="Izoh (ixtiyoriy)"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={3}
            placeholder="O'qituvchi haqida fikringizni yozing..."
          />
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowRateModal(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" loading={formLoading} icon={Send}>
              Yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherRatings;
