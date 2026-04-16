import { useState, useEffect } from 'react';
import { Send, MessageSquare, Lightbulb, AlertTriangle, CheckCircle, Users, Reply, Inbox, SendHorizontal } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading, Textarea, EmptyState } from '../components/common';
import { messagesAPI, feedbackAPI, usersAPI, studentsAPI, teachersAPI, groupsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const Messages = () => {
  const { userData, role } = useAuth();
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  
  // Recipients
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [myTeachers, setMyTeachers] = useState([]); // O'quvchi/ota-ona uchun o'z o'qituvchilari
  
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  const [formData, setFormData] = useState({ 
    type: 'message', 
    recipientType: '', 
    recipientIds: [], 
    subject: '', 
    content: '',
    requiresReply: false
  });
  const [replyContent, setReplyContent] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const allMessages = await messagesAPI.getAll();
      const allTeachers = await teachersAPI.getAll();
      
      // O'qituvchi uchun - teachers kolleksiyasidan ID ni topish
      let myTeacherId = userData?.id;
      if (isTeacher) {
        const myTeacherRecord = allTeachers.find(t => t.email === userData?.email);
        if (myTeacherRecord) {
          myTeacherId = myTeacherRecord.id;
        }
      }
      
      // Kelgan xabarlar - faqat menga yo'llangan
      const inboxMessages = allMessages.filter(msg => {
        // Direktor adminga yo'llangan xabarlarni ham ko'radi
        if (role === ROLES.DIRECTOR && msg.recipientType === 'admins') {
          return true;
        }
        
        // Umumiy xabarlar
        if (msg.recipientType === 'all_students' && (role === ROLES.STUDENT || role === ROLES.PARENT)) {
          return true;
        }
        if (msg.recipientType === 'all_teachers' && role === ROLES.TEACHER) {
          return true;
        }
        
        // Tanlangan qabul qiluvchilar (users ID)
        if (msg.recipientIds?.includes(userData?.id)) {
          return true;
        }
        
        // O'qituvchiga yo'llangan (teachers ID ham tekshirish)
        if (msg.recipientType === 'teachers') {
          if (msg.recipientIds?.includes(userData?.id) || msg.recipientIds?.includes(myTeacherId)) {
            return true;
          }
        }
        
        // Adminga yo'llangan
        if (msg.recipientType === 'admins' && msg.recipientIds?.includes(userData?.id)) {
          return true;
        }
        
        // O'quvchi/Ota-onaga yo'llangan javob
        if (msg.recipientId === userData?.id) {
          return true;
        }
        
        return false;
      });
      
      // Yuborgan xabarlar
      const sent = allMessages.filter(msg => msg.senderId === userData?.id);
      
      setMessages(inboxMessages);
      setSentMessages(sent);
      
      // Feedback
      if (isAdmin) {
        const allFeedback = await feedbackAPI.getAll();
        setFeedback(allFeedback);
      } else if (isStudentOrParent) {
        // O'quvchi o'z feedbacklarini ko'radi
        const allFeedback = await feedbackAPI.getAll();
        const myFeedback = allFeedback.filter(f => f.userId === userData?.id);
        setFeedback(myFeedback);
      }
      
      // Recipients
      if (isAdmin) {
        const [teachersData, adminsData] = await Promise.all([
          teachersAPI.getAll(),
          usersAPI.getByRole(ROLES.ADMIN)
        ]);
        setTeachers(teachersData);
        setAdmins(adminsData.filter(a => a.id !== userData?.id));
      }
      
      // O'quvchi/Ota-ona uchun o'z o'qituvchilarini topish
      if (isStudentOrParent) {
        try {
          const allStudents = await studentsAPI.getAll();
          const allGroups = await groupsAPI.getAll();
          const allTeachers = await teachersAPI.getAll();
          
          // O'quvchini topish
          let myStudent;
          if (role === ROLES.PARENT) {
            myStudent = allStudents.find(s => 
              s.parentPhone === userData?.phone || 
              userData?.childId === s.id
            );
          } else {
            myStudent = allStudents.find(s => 
              s.email === userData?.email || 
              s.phone === userData?.phone
            );
          }
          
          if (myStudent && myStudent.groupId) {
            // O'quvchining guruhini topish
            const myGroup = allGroups.find(g => g.id === myStudent.groupId);
            if (myGroup && myGroup.teacherId) {
              // Guruhning o'qituvchisini topish
              const teacher = allTeachers.find(t => 
                t.id === myGroup.teacherId || 
                t.email === myGroup.teacherEmail
              );
              if (teacher) {
                setMyTeachers([teacher]);
              }
            }
          }
        } catch (err) {
        }
      }
    } catch (err) { 
      console.error(err); 
      toast.error("Xatolik yuz berdi");
    }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ type: 'message', recipientType: '', recipientIds: [], subject: '', content: '', requiresReply: false });
    setReplyContent('');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (formData.type === 'message') {
        // Xabar yuborish
        let recipientIds = formData.recipientIds.length > 0 ? formData.recipientIds : ['all'];
        let recipientType = formData.recipientType;
        
        // O'qituvchiga xabar yuborish
        if (formData.recipientType === 'my_teacher' && myTeachers.length > 0) {
          recipientIds = myTeachers.map(t => t.id);
          recipientType = 'teachers';
        }
        
        const messageData = {
          senderId: userData?.id,
          senderName: userData?.fullName,
          senderRole: role,
          recipientType: recipientType,
          recipientIds: recipientIds,
          subject: formData.subject,
          content: formData.content,
          read: false,
          requiresReply: formData.requiresReply
        };
        
        await messagesAPI.create(messageData);
        toast.success("Xabar yuborildi!");
      } else {
        // Taklif/Shikoyat
        await feedbackAPI.create({
          userId: userData?.id,
          userName: userData?.fullName,
          userRole: role,
          type: formData.type,
          subject: formData.subject,
          content: formData.content,
          status: 'pending'
        });
        toast.success("Taklif yuborildi!");
      }
      await fetchData();
      setShowComposeModal(false);
      resetForm();
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  // Xabarga javob
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Javob matnini kiriting");
      return;
    }
    setFormLoading(true);
    try {
      const messageData = {
        senderId: userData?.id,
        senderName: userData?.fullName,
        senderRole: role,
        recipientId: selectedMessage?.senderId,
        recipientType: 'direct',
        subject: `Re: ${selectedMessage?.subject}`,
        content: replyContent,
        replyTo: selectedMessage?.id,
        read: false
      };
      
      await messagesAPI.create(messageData);
      toast.success("Javob yuborildi!");
      setShowReplyModal(false);
      setSelectedMessage(null);
      setReplyContent('');
      await fetchData();
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  // Feedbackga javob
  const handleFeedbackReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Javob matnini kiriting");
      return;
    }
    setFormLoading(true);
    try {
      // Feedback yangilash
      await feedbackAPI.update(selectedFeedback.id, { 
        status: 'resolved',
        reply: replyContent,
        repliedBy: userData?.fullName,
        repliedAt: new Date().toISOString()
      });
      
      // Xabar yuborish
      const messageData = {
        senderId: userData?.id,
        senderName: userData?.fullName,
        senderRole: role,
        recipientId: selectedFeedback.userId,
        recipientType: 'direct',
        subject: `Javob: ${selectedFeedback.subject}`,
        content: replyContent,
        read: false
      };
      await messagesAPI.create(messageData);
      
      toast.success("Javob yuborildi va hal qilindi!");
      setSelectedFeedback(null);
      setReplyContent('');
      await fetchData();
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
    finally { setFormLoading(false); }
  };

  const handleResolveFeedback = async (id) => {
    try {
      await feedbackAPI.update(id, { status: 'resolved' });
      setFeedback(feedback.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
      toast.success("Hal qilindi deb belgilandi");
    } catch (err) { 
      toast.error("Xatolik yuz berdi"); 
    }
  };

  const getRecipientOptions = () => {
    switch (formData.recipientType) {
      case 'teachers':
        return teachers.map(t => ({ value: t.id, label: t.fullName }));
      case 'admins':
        return admins.map(a => ({ value: a.id, label: a.fullName }));
      default:
        return [];
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  const tabs = [
    { id: 'inbox', label: 'Kirish qutisi', icon: Inbox, count: messages.filter(m => !m.read).length },
    { id: 'sent', label: 'Yuborilgan', icon: SendHorizontal },
  ];
  
  if (isAdmin) {
    tabs.push({ 
      id: 'feedback', 
      label: 'Taklif/Shikoyatlar', 
      icon: Lightbulb, 
      count: feedback.filter(f => f.status === 'pending').length 
    });
  }
  
  if (isStudentOrParent) {
    tabs.push({ id: 'my-feedback', label: 'Mening takliflarim', icon: Lightbulb });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xabarlar</h1>
          <p className="text-gray-500">Ichki xabar almashish tizimi</p>
        </div>
        <Button icon={Send} onClick={() => { resetForm(); setShowComposeModal(true); }}>
          {isStudentOrParent ? 'Xabar/Taklif yuborish' : 'Yangi xabar'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="danger">{tab.count}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Inbox */}
      {activeTab === 'inbox' && (
        <Card padding="p-0">
          <div className="divide-y">
            {messages.length > 0 ? messages.map(msg => (
              <div
                key={msg.id}
                className={`p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition ${!msg.read ? 'bg-primary-50/50' : ''}`}
              >
                <Avatar name={msg.senderName} />
                <div className="flex-1 min-w-0" onClick={() => setSelectedMessage(msg)}>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold">{msg.senderName}</span>
                    <Badge variant="default">{msg.senderRole}</Badge>
                    {!msg.read && <Badge variant="primary">Yangi</Badge>}
                    {msg.requiresReply && <Badge variant="warning">Javob kutilmoqda</Badge>}
                  </div>
                  <p className="font-medium text-gray-800">{msg.subject}</p>
                  <p className="text-sm text-gray-500 truncate">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {!msg.read && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={async (e) => { 
                        e.stopPropagation();
                        try {
                          await messagesAPI.update(msg.id, { read: true });
                          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                          toast.success("O'qildi deb belgilandi");
                        } catch (err) {
                          console.error('Mark as read error:', err);
                        }
                      }}
                    >
                      O'qildi
                    </Button>
                  )}
                  {(isAdmin || isTeacher) && (
                    <Button size="sm" variant="ghost" icon={Reply} onClick={(e) => { 
                      e.stopPropagation(); 
                      setSelectedMessage(msg); 
                      setShowReplyModal(true); 
                    }}>
                      Javob
                    </Button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-12">
                <EmptyState icon={MessageSquare} title="Xabarlar yo'q" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Sent */}
      {activeTab === 'sent' && (
        <Card padding="p-0">
          <div className="divide-y">
            {sentMessages.length > 0 ? sentMessages.map(msg => (
              <div key={msg.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-gray-500">Kimga:</span>
                  <Badge variant="info">
                    {msg.recipientType === 'all_students' ? "Barcha o'quvchilar" : 
                     msg.recipientType === 'all_teachers' ? "Barcha o'qituvchilar" : 
                     msg.recipientType === 'direct' ? 'Shaxsiy' :
                     msg.recipientType}
                  </Badge>
                </div>
                <p className="font-medium text-gray-800">{msg.subject}</p>
                <p className="text-sm text-gray-500 truncate">{msg.content}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
              </div>
            )) : (
              <div className="p-12">
                <EmptyState icon={SendHorizontal} title="Yuborilgan xabarlar yo'q" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Feedback (Admin) */}
      {activeTab === 'feedback' && isAdmin && (
        <Card padding="p-0">
          <div className="divide-y">
            {feedback.length > 0 ? feedback.map(fb => (
              <div key={fb.id} className="p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fb.type === 'complaint' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                  {fb.type === 'complaint' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Lightbulb className="w-5 h-5 text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold">{fb.userName}</span>
                    <Badge variant={fb.type === 'complaint' ? 'danger' : 'warning'}>
                      {fb.type === 'complaint' ? 'Shikoyat' : 'Taklif'}
                    </Badge>
                    <Badge variant={fb.status === 'resolved' ? 'success' : 'default'}>
                      {fb.status === 'resolved' ? 'Hal qilindi' : 'Kutilmoqda'}
                    </Badge>
                  </div>
                  <p className="font-medium">{fb.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">{fb.content}</p>
                  {fb.reply && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">Javob ({fb.repliedBy}):</p>
                      <p className="text-sm text-green-800">{fb.reply}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{formatDate(fb.createdAt)}</p>
                </div>
                {fb.status !== 'resolved' && (
                  <div className="flex flex-col gap-2">
                    <Button size="sm" icon={Reply} onClick={() => { setSelectedFeedback(fb); setReplyContent(''); }}>
                      Javob
                    </Button>
                    <Button size="sm" variant="ghost" icon={CheckCircle} onClick={() => handleResolveFeedback(fb.id)}>
                      Hal qilindi
                    </Button>
                  </div>
                )}
              </div>
            )) : (
              <div className="p-12">
                <EmptyState icon={Lightbulb} title="Taklif/Shikoyatlar yo'q" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* My Feedback (Student/Parent) */}
      {activeTab === 'my-feedback' && isStudentOrParent && (
        <Card padding="p-0">
          <div className="divide-y">
            {feedback.length > 0 ? feedback.map(fb => (
              <div key={fb.id} className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant={fb.type === 'complaint' ? 'danger' : 'warning'}>
                    {fb.type === 'complaint' ? 'Shikoyat' : 'Taklif'}
                  </Badge>
                  <Badge variant={fb.status === 'resolved' ? 'success' : 'default'}>
                    {fb.status === 'resolved' ? 'Hal qilindi' : 'Kutilmoqda'}
                  </Badge>
                </div>
                <p className="font-medium">{fb.subject}</p>
                <p className="text-sm text-gray-600 mt-1">{fb.content}</p>
                {fb.reply && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Javob ({fb.repliedBy}):</p>
                    <p className="text-sm text-green-800">{fb.reply}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">{formatDate(fb.createdAt)}</p>
              </div>
            )) : (
              <div className="p-12">
                <EmptyState icon={Lightbulb} title="Siz hali taklif yoki shikoyat yubormadingiz" />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Compose Modal */}
      <Modal isOpen={showComposeModal} onClose={() => setShowComposeModal(false)} title="Yangi xabar" size="lg">
        <form onSubmit={handleSend} className="space-y-4">
          {isStudentOrParent && (
            <Select
              label="Xabar turi"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'message', label: 'Oddiy xabar' },
                { value: 'suggestion', label: 'Taklif' },
                { value: 'complaint', label: 'Shikoyat' },
              ]}
              required
            />
          )}
          
          {isAdmin && formData.type === 'message' && (
            <>
              <Select
                label="Kimga yuborish"
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value, recipientIds: [] })}
                options={[
                  { value: 'all_students', label: "Barcha o'quvchi va ota-onalarga" },
                  { value: 'all_teachers', label: "Barcha o'qituvchilarga" },
                  { value: 'teachers', label: "Tanlangan o'qituvchilarga" },
                  { value: 'admins', label: "Tanlangan adminlarga" },
                ]}
                required
              />
              
              {(formData.recipientType === 'teachers' || formData.recipientType === 'admins') && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Qabul qiluvchilarni tanlang</label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                    {getRecipientOptions().map(opt => (
                      <label key={opt.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.recipientIds.includes(opt.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, recipientIds: [...formData.recipientIds, opt.value] });
                            } else {
                              setFormData({ ...formData, recipientIds: formData.recipientIds.filter(id => id !== opt.value) });
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData.recipientIds.length > 0 && (
                    <p className="text-sm text-primary-600">{formData.recipientIds.length} ta tanlandi</p>
                  )}
                </div>
              )}
            </>
          )}
          
          {!isAdmin && formData.type === 'message' && (
            <>
              <Select
                label="Kimga"
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value, recipientIds: [] })}
                options={[
                  { value: 'admin', label: 'Administratorga' },
                  { value: 'my_teacher', label: 'O\'qituvchimga' },
                ]}
                required
              />
              {formData.recipientType === 'my_teacher' && myTeachers.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">O'qituvchi(lar):</p>
                  {myTeachers.map(t => (
                    <p key={t.id} className="text-blue-600">{t.fullName}</p>
                  ))}
                </div>
              )}
            </>
          )}
          
          <Input
            label="Mavzu"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
          <Textarea
            label="Xabar matni"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
            required
          />
          
          {/* Javob talab qilinadi checkbox */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
            <input
              type="checkbox"
              checked={formData.requiresReply}
              onChange={(e) => setFormData({ ...formData, requiresReply: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-primary-600"
            />
            <div>
              <p className="font-medium">Javob talab qilinadi</p>
              <p className="text-xs text-gray-500">Bu xabarga javob kutilayotganini belgilash</p>
            </div>
          </label>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowComposeModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading} icon={Send}>Yuborish</Button>
          </div>
        </form>
      </Modal>

      {/* Reply to Message Modal */}
      <Modal isOpen={showReplyModal} onClose={() => setShowReplyModal(false)} title="Javob yozish">
        <form onSubmit={handleReply} className="space-y-4">
          {selectedMessage && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Asl xabar:</p>
              <p className="font-medium">{selectedMessage.subject}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedMessage.content}</p>
              <p className="text-xs text-gray-400 mt-2">— {selectedMessage.senderName}</p>
            </div>
          )}
          <Textarea
            label="Javobingiz"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            required
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setShowReplyModal(false)}>Bekor qilish</Button>
            <Button type="submit" loading={formLoading} icon={Send}>Yuborish</Button>
          </div>
        </form>
      </Modal>

      {/* Reply to Feedback Modal */}
      <Modal isOpen={!!selectedFeedback} onClose={() => setSelectedFeedback(null)} title="Taklifga javob">
        <div className="space-y-4">
          {selectedFeedback && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <Badge variant={selectedFeedback.type === 'complaint' ? 'danger' : 'warning'} className="mb-2">
                {selectedFeedback.type === 'complaint' ? 'Shikoyat' : 'Taklif'}
              </Badge>
              <p className="font-medium">{selectedFeedback.subject}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedFeedback.content}</p>
              <p className="text-xs text-gray-400 mt-2">— {selectedFeedback.userName}</p>
            </div>
          )}
          <Textarea
            label="Javobingiz"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
            placeholder="Javob yozing..."
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setSelectedFeedback(null)}>Bekor qilish</Button>
            <Button onClick={handleFeedbackReply} loading={formLoading} icon={Send}>Yuborish va hal qilish</Button>
          </div>
        </div>
      </Modal>

      {/* Message Detail Modal */}
      <Modal isOpen={!!selectedMessage && !showReplyModal} onClose={() => setSelectedMessage(null)} title="Xabar" size="lg">
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selectedMessage.senderName} size="lg" />
              <div>
                <p className="font-semibold">{selectedMessage.senderName}</p>
                <p className="text-sm text-gray-500">{formatDate(selectedMessage.createdAt)}</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{selectedMessage.subject}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="ghost" onClick={() => setSelectedMessage(null)}>Yopish</Button>
              {(isAdmin || isTeacher) && (
                <Button icon={Reply} onClick={() => setShowReplyModal(true)}>Javob yozish</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Messages;
