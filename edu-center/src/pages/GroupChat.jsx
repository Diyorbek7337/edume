import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, Users, ChevronLeft, Image, Paperclip,
  Smile, MoreVertical, Check, CheckCheck, Search
} from 'lucide-react';
import { Card, Button, Input, Avatar, Badge, Loading } from '../components/common';
import { chatAPI, groupsAPI, studentsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const GroupChat = () => {
  const { userData, role } = useAuth();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  useEffect(() => { fetchGroups(); }, []);
  
  useEffect(() => { 
    if (selectedGroup) {
      fetchMessages();
      fetchMembers();
      
      // Real-time listener (polling)
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchGroups = async () => {
    try {
      let groupsData = [];
      
      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || 
          t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        
        const allGroups = await groupsAPI.getAll();
        if (teacher) {
          groupsData = allGroups.filter(g => g.teacherId === teacher.id);
        }
        const groups2 = allGroups.filter(g => g.teacherId === userData?.id);
        groupsData = [...groupsData, ...groups2].filter((g, i, self) => 
          i === self.findIndex(t => t.id === g.id)
        );
      } else if (isStudentOrParent) {
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
          const allGroups = await groupsAPI.getAll();
          groupsData = allGroups.filter(g => 
            g.id === student.groupId || g.studentIds?.includes(student.id)
          );
        }
      } else {
        groupsData = await groupsAPI.getAll();
      }
      
      setGroups(groupsData);
      
      // Har bir guruh uchun o'qilmagan xabarlar sonini olish
      const counts = {};
      for (const group of groupsData) {
        const unread = await chatAPI.getUnreadCount(group.id, userData?.id);
        counts[group.id] = unread;
      }
      setUnreadCounts(counts);
      
      // Birinchi guruhni tanlash
      if (groupsData.length === 1) {
        setSelectedGroup(groupsData[0]);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMessages = async () => {
    try {
      const messagesData = await chatAPI.getMessages(selectedGroup.id);
      setMessages(messagesData);
      
      // Xabarlarni o'qilgan deb belgilash
      await chatAPI.markAsRead(selectedGroup.id, userData?.id);
      setUnreadCounts(prev => ({ ...prev, [selectedGroup.id]: 0 }));
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try {
      const students = await studentsAPI.getByGroup(selectedGroup.id);
      
      // O'qituvchini ham qo'shish
      const allTeachers = await teachersAPI.getAll();
      const teacher = allTeachers.find(t => t.id === selectedGroup.teacherId);
      
      const membersList = [
        ...(teacher ? [{ ...teacher, role: 'teacher' }] : []),
        ...students.map(s => ({ ...s, role: 'student' }))
      ];
      
      setMembers(membersList);
    } catch (err) { console.error(err); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const message = await chatAPI.sendMessage(selectedGroup.id, {
        text: newMessage,
        senderId: userData?.id,
        senderName: userData?.fullName,
        senderRole: role,
        timestamp: new Date().toISOString()
      });
      
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) + 
           ' ' + date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (senderRole) => {
    switch (senderRole) {
      case 'teacher': return 'bg-blue-500';
      case 'admin':
      case 'director': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadge = (senderRole) => {
    switch (senderRole) {
      case 'teacher': return <Badge variant="primary" className="text-xs">O'qituvchi</Badge>;
      case 'admin': return <Badge variant="info" className="text-xs">Admin</Badge>;
      case 'director': return <Badge variant="info" className="text-xs">Direktor</Badge>;
      case 'parent': return <Badge variant="warning" className="text-xs">Ota-ona</Badge>;
      default: return null;
    }
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="h-[calc(100vh-120px)] flex animate-fade-in">
      {/* Guruhlar ro'yxati */}
      <div className={`${selectedGroup ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r bg-white`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Guruh chatlar
          </h2>
          <div className="mt-3 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())).map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition border-b ${
                selectedGroup?.id === group.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{group.name}</p>
                  {unreadCounts[group.id] > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCounts[group.id]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {group.schedule?.days} • {group.schedule?.time}
                </p>
              </div>
            </button>
          ))}
          
          {groups.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Guruhlar yo'q</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat oynasi */}
      {selectedGroup ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-4 bg-white border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setSelectedGroup(null)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{selectedGroup.name}</h3>
                <p className="text-sm text-gray-500">{members.length} a'zo</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowMembers(!showMembers)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length > 0 ? messages.map((msg, index) => {
              const isMe = msg.senderId === userData?.id;
              const showDate = index === 0 || 
                new Date(messages[index - 1]?.timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
              
              return (
                <div key={msg.id || index}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                        {formatDate(msg.timestamp, 'd MMMM yyyy')}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-700">{msg.senderName}</span>
                          {getRoleBadge(msg.senderRole)}
                        </div>
                      )}
                      <div className={`px-4 py-2 rounded-2xl ${
                        isMe 
                          ? 'bg-primary-500 text-white rounded-br-md' 
                          : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isMe ? 'text-primary-100' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">{formatMessageTime(msg.timestamp)}</span>
                          {isMe && <CheckCheck className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                    
                    {!isMe && (
                      <Avatar name={msg.senderName} size="sm" className="order-0 mr-2 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400">Hali xabarlar yo'q</p>
                <p className="text-sm text-gray-400 mt-1">Birinchi bo'lib yozing!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Xabar yozing..."
                className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                  newMessage.trim() && !sending
                    ? 'bg-primary-500 text-white hover:bg-primary-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Suhbat boshlash uchun guruhni tanlang</p>
          </div>
        </div>
      )}

      {/* A'zolar paneli */}
      {showMembers && selectedGroup && (
        <div className="w-64 border-l bg-white overflow-y-auto">
          <div className="p-4 border-b">
            <h4 className="font-semibold">Guruh a'zolari</h4>
            <p className="text-sm text-gray-500">{members.length} a'zo</p>
          </div>
          <div className="p-2">
            {members.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <Avatar name={member.fullName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{member.fullName}</p>
                  <p className="text-xs text-gray-500">
                    {member.role === 'teacher' ? "O'qituvchi" : "O'quvchi"}
                  </p>
                </div>
                {member.role === 'teacher' && (
                  <Badge variant="primary" className="text-xs">👨‍🏫</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
