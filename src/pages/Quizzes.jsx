import { useState, useEffect, useRef } from 'react';
import { 
  FileQuestion, Plus, Clock, CheckCircle, XCircle, Play, Trophy,
  Users, BarChart3, Eye, Trash2, ChevronRight, ChevronLeft, Target, Percent,
  Upload, Download, Sparkles, FileSpreadsheet, Wand2, Loader2, AlertCircle
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { quizAPI, groupsAPI, studentsAPI, teachersAPI } from '../services/api';
import { geminiAPI } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Quizzes = () => {
  const { userData, role } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef(null);

  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiLanguage, setAiLanguage] = useState('uz');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);

  const [quizForm, setQuizForm] = useState({
    title: '', description: '', groupId: '', timeLimit: 30, passingScore: 60, questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '', type: 'single', options: ['', '', '', ''], correctAnswer: 0, points: 10
  });

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const isTeacher = role === ROLES.TEACHER;
  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canCreate = isTeacher || isAdmin;

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) fetchQuizzes(); }, [selectedGroup]);

  useEffect(() => {
    let interval;
    if (quizStarted && timeLeft > 0 && !quizFinished) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleSubmitQuiz(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, quizFinished]);

  const fetchData = async () => {
    try {
      let groupsData = [];
      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => t.id === userData?.id || t.email === userData?.email || normalizePhone(t.phone) === normalizePhone(userData?.phone));
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

  const fetchQuizzes = async () => {
    try {
      const [quizzesData, studentsData] = await Promise.all([
        quizAPI.getByGroup(selectedGroup), studentsAPI.getByGroup(selectedGroup)
      ]);
      const quizzesWithResults = await Promise.all(
        quizzesData.map(async (quiz) => {
          const results = await quizAPI.getResults(quiz.id);
          return { ...quiz, results };
        })
      );
      setQuizzes(quizzesWithResults.sort((a, b) => new Date(b.createdAt?.seconds * 1000 || b.createdAt) - new Date(a.createdAt?.seconds * 1000 || a.createdAt)));
      setStudents(studentsData);
    } catch (err) { console.error(err); }
  };

  // Excel Import
  const handleExcelImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        if (data.length === 0) { toast.error("Excel fayl bo'sh"); return; }
        
        const questions = data.map((row, index) => {
          const question = row['Savol'] || row['savol'] || row['question'] || '';
          const options = [
            row['A'] || row['a'] || row['variant1'] || '',
            row['B'] || row['b'] || row['variant2'] || '',
            row['C'] || row['c'] || row['variant3'] || '',
            row['D'] || row['d'] || row['variant4'] || '',
          ];
          let correctAnswer = row["To'g'ri javob"] || row['togri_javob'] || row['correct'] || 'A';
          if (typeof correctAnswer === 'string') {
            correctAnswer = correctAnswer.toUpperCase().trim();
            if (correctAnswer === 'A') correctAnswer = 0;
            else if (correctAnswer === 'B') correctAnswer = 1;
            else if (correctAnswer === 'C') correctAnswer = 2;
            else if (correctAnswer === 'D') correctAnswer = 3;
            else correctAnswer = parseInt(correctAnswer) - 1 || 0;
          } else correctAnswer = parseInt(correctAnswer) - 1 || 0;
          const points = parseInt(row['Ball'] || row['ball'] || 10);
          return { id: Date.now() + index, question, type: 'single', options, correctAnswer, points };
        }).filter(q => q.question);

        if (questions.length === 0) { toast.error("Savollar topilmadi"); return; }
        setQuizForm({ ...quizForm, questions: [...quizForm.questions, ...questions] });
        toast.success(questions.length + " ta savol yuklandi!");
      } catch (err) { console.error(err); toast.error("Excel xatolik"); }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Excel Export
  const exportToExcel = (quiz) => {
    const data = quiz.questions.map((q, index) => ({
      '№': index + 1, 'Savol': q.question,
      'A': q.options[0] || '', 'B': q.options[1] || '', 'C': q.options[2] || '', 'D': q.options[3] || '',
      "To'g'ri javob": String.fromCharCode(65 + q.correctAnswer), 'Ball': q.points
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Savollar');
    XLSX.writeFile(wb, quiz.title.replace(/\s+/g, '_') + '_savollar.xlsx');
    toast.success("Excel yuklab olindi!");
  };

  const downloadTemplate = () => {
    const template = [
      { 'Savol': '2 + 2 = ?', 'A': '3', 'B': '4', 'C': '5', 'D': '6', "To'g'ri javob": 'B', 'Ball': 10 },
      { 'Savol': "O'zbekiston poytaxti?", 'A': 'Samarqand', 'B': 'Buxoro', 'C': 'Toshkent', 'D': 'Xiva', "To'g'ri javob": 'C', 'Ball': 10 },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shablon');
    XLSX.writeFile(wb, 'test_shablon.xlsx');
    toast.success("Shablon yuklab olindi!");
  };

  // AI Generation - Gemini API
  const generateAIQuestions = async () => {
    if (!aiTopic.trim()) { 
      toast.error("Mavzuni kiriting"); 
      return; 
    }
    
    // API key tekshirish
    if (!geminiAPI.isConfigured()) {
      toast.error("Gemini API key sozlanmagan. .env faylga VITE_GEMINI_API_KEY qo'shing.");
      return;
    }
    
    setAiGenerating(true);
    try {
      const questions = await geminiAPI.generateQuestions(
        aiTopic, 
        aiQuestionCount, 
        aiDifficulty, 
        aiLanguage
      );
      
      setAiQuestions(questions);
      toast.success(`${questions.length} ta savol yaratildi! To'g'ri javoblarni tekshiring!`);
    } catch (err) { 
      console.error('AI generation error:', err); 
      
      if (err.message?.includes('API key')) {
        toast.error("API key xato yoki muddati tugagan");
      } else if (err.message?.includes('quota')) {
        toast.error("API limit tugadi. Keyinroq urinib ko'ring.");
      } else {
        toast.error("AI xatolik: " + (err.message || "Noma'lum xato"));
      }
    }
    finally { setAiGenerating(false); }
  };

  const updateAiQuestion = (index, field, value) => {
    const updated = [...aiQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setAiQuestions(updated);
  };

  const updateAiQuestionOption = (qIndex, optIndex, value) => {
    const updated = [...aiQuestions];
    updated[qIndex].options[optIndex] = value;
    setAiQuestions(updated);
  };

  const removeAiQuestion = (index) => setAiQuestions(aiQuestions.filter((_, i) => i !== index));

  const addAIQuestionsToQuiz = () => {
    if (aiQuestions.length === 0) { toast.error("Savollar yo'q"); return; }
    setQuizForm({ ...quizForm, questions: [...quizForm.questions, ...aiQuestions] });
    setAiQuestions([]);
    setShowAIModal(false);
    toast.success("Savollar qo'shildi!");
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) { toast.error("Savol kiriting"); return; }
    if (currentQuestion.options.filter(o => o.trim()).length < 2) { toast.error("Kamida 2 ta variant"); return; }
    setQuizForm({ ...quizForm, questions: [...quizForm.questions, { ...currentQuestion, id: Date.now() }] });
    setCurrentQuestion({ question: '', type: 'single', options: ['', '', '', ''], correctAnswer: 0, points: 10 });
    toast.success("Savol qo'shildi");
  };

  const removeQuestion = (index) => setQuizForm({ ...quizForm, questions: quizForm.questions.filter((_, i) => i !== index) });

  const handleCreateQuiz = async () => {
    if (!quizForm.title.trim()) { toast.error("Test nomini kiriting"); return; }
    if (quizForm.questions.length < 1) { toast.error("Kamida 1 ta savol qo'shing"); return; }
    try {
      const group = groups.find(g => g.id === quizForm.groupId);
      const totalPoints = quizForm.questions.reduce((sum, q) => sum + q.points, 0);
      const newQuiz = await quizAPI.create({
        ...quizForm, groupName: group?.name || '', teacherId: userData?.id, teacherName: userData?.fullName, totalPoints, status: 'active'
      });
      setQuizzes([{ ...newQuiz, results: [] }, ...quizzes]);
      setShowCreateModal(false);
      setQuizForm({ title: '', description: '', groupId: selectedGroup, timeLimit: 30, passingScore: 60, questions: [] });
      toast.success("Test yaratildi!");
    } catch (err) { toast.error("Xatolik"); }
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz); setAnswers({}); setCurrentQuestionIndex(0);
    setTimeLeft(quiz.timeLimit * 60); setQuizStarted(true); setQuizFinished(false);
    setQuizResult(null); setShowQuizModal(true);
  };

  const handleAnswer = (questionId, answer) => setAnswers({ ...answers, [questionId]: answer });

  const handleSubmitQuiz = async () => {
    setQuizFinished(true); setQuizStarted(false);
    let correctCount = 0, totalPoints = 0, earnedPoints = 0;
    const questionResults = selectedQuiz.questions.map(q => {
      totalPoints += q.points;
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) { correctCount++; earnedPoints += q.points; }
      return { questionId: q.id, userAnswer, correctAnswer: q.correctAnswer, isCorrect, points: isCorrect ? q.points : 0 };
    });
    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passed = percentage >= selectedQuiz.passingScore;
    const result = {
      quizId: selectedQuiz.id, studentId: studentData.id, studentName: studentData.fullName,
      answers: questionResults, correctCount, totalQuestions: selectedQuiz.questions.length,
      earnedPoints, totalPoints, percentage, passed, timeSpent: (selectedQuiz.timeLimit * 60) - timeLeft,
      completedAt: new Date().toISOString()
    };
    setQuizResult(result);
    try { await quizAPI.submitResult(selectedQuiz.id, result); fetchQuizzes(); } catch (err) { console.error(err); }
  };

  const handleDeleteQuiz = async (id) => {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    try { await quizAPI.delete(id); setQuizzes(quizzes.filter(q => q.id !== id)); toast.success("O'chirildi"); }
    catch (err) { toast.error("Xatolik"); }
  };

  const formatTime = (seconds) => Math.floor(seconds / 60) + ':' + (seconds % 60).toString().padStart(2, '0');

  const getQuizStatus = (quiz) => {
    if (isStudentOrParent) {
      const myResult = quiz.results?.find(r => r.studentId === studentData?.id);
      if (myResult) return myResult.passed ? <Badge variant="success">O'tdi: {myResult.percentage}%</Badge> : <Badge variant="danger">O'tmadi: {myResult.percentage}%</Badge>;
      return <Badge variant="warning">Yechilmagan</Badge>;
    }
    return <Badge variant="primary">{quiz.results?.length || 0}/{students.length} yechdi</Badge>;
  };

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  // Student view
  if (isStudentOrParent) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><h1 className="text-2xl font-bold text-gray-900">Online Testlar</h1><p className="text-gray-500">Bilimingizni sinab ko'ring</p></div>
          <div className="flex items-center gap-2">
            {groups.length > 1 && (<Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} options={groups.map(g => ({ value: g.id, label: g.name }))} className="w-48" />)}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card padding="p-4" className="bg-gradient-to-br from-blue-50 to-blue-100 text-center"><FileQuestion className="w-8 h-8 text-blue-500 mx-auto mb-2" /><p className="text-2xl font-bold text-blue-700">{quizzes.length}</p><p className="text-sm text-blue-600">Jami testlar</p></Card>
          <Card padding="p-4" className="bg-gradient-to-br from-green-50 to-green-100 text-center"><CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" /><p className="text-2xl font-bold text-green-700">{quizzes.filter(q => q.results?.find(r => r.studentId === studentData?.id)?.passed).length}</p><p className="text-sm text-green-600">O'tilgan</p></Card>
          <Card padding="p-4" className="bg-gradient-to-br from-yellow-50 to-yellow-100 text-center"><Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" /><p className="text-2xl font-bold text-yellow-700">{quizzes.filter(q => !q.results?.find(r => r.studentId === studentData?.id)).length}</p><p className="text-sm text-yellow-600">Kutilmoqda</p></Card>
          <Card padding="p-4" className="bg-gradient-to-br from-purple-50 to-purple-100 text-center"><Percent className="w-8 h-8 text-purple-500 mx-auto mb-2" /><p className="text-2xl font-bold text-purple-700">{quizzes.filter(q => q.results?.find(r => r.studentId === studentData?.id)).length > 0 ? Math.round(quizzes.filter(q => q.results?.find(r => r.studentId === studentData?.id)).reduce((sum, q) => sum + (q.results?.find(r => r.studentId === studentData?.id)?.percentage || 0), 0) / quizzes.filter(q => q.results?.find(r => r.studentId === studentData?.id)).length) : 0}%</p><p className="text-sm text-purple-600">O'rtacha</p></Card>
        </div>

        <div className="space-y-4">
          {quizzes.map(quiz => {
            const myResult = quiz.results?.find(r => r.studentId === studentData?.id);
            return (
              <Card key={quiz.id} className={myResult?.passed ? 'border-green-200' : ''}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${myResult?.passed ? 'bg-green-100' : myResult ? 'bg-red-100' : 'bg-blue-100'}`}>
                      {myResult?.passed ? <Trophy className="w-7 h-7 text-green-600" /> : myResult ? <XCircle className="w-7 h-7 text-red-600" /> : <FileQuestion className="w-7 h-7 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <p className="text-gray-600 mt-1">{quiz.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{quiz.questions?.length || 0} savol</span>
                        <span>{quiz.timeLimit} daqiqa</span>
                        <span>O'tish: {quiz.passingScore}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getQuizStatus(quiz)}
                    {myResult ? (<div className="text-center"><p className="text-2xl font-bold text-gray-700">{myResult.percentage}%</p><p className="text-sm text-gray-500">{myResult.correctCount}/{myResult.totalQuestions} to'g'ri</p></div>) : (<Button onClick={() => startQuiz(quiz)}><Play className="w-4 h-4 mr-2" />Boshlash</Button>)}
                  </div>
                </div>
              </Card>
            );
          })}
          {quizzes.length === 0 && (<Card className="text-center py-12"><FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Testlar yo'q</p></Card>)}
        </div>

        {/* Quiz Modal */}
        <Modal isOpen={showQuizModal} onClose={() => { if (quizStarted && !quizFinished) { if (!confirm("Testni yakunlamasdan chiqmoqchimisiz?")) return; } setShowQuizModal(false); setQuizStarted(false); }} title={selectedQuiz?.title} size="xl">
          {selectedQuiz && !quizFinished && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span>Savol {currentQuestionIndex + 1}/{selectedQuiz.questions.length}</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}><Clock className="w-4 h-4" /><span className="font-mono font-bold">{formatTime(timeLeft)}</span></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: ((currentQuestionIndex + 1) / selectedQuiz.questions.length * 100) + '%' }} /></div>
              {selectedQuiz.questions[currentQuestionIndex] && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded-lg"><p className="text-lg font-medium">{currentQuestionIndex + 1}. {selectedQuiz.questions[currentQuestionIndex].question}</p><p className="text-sm text-gray-500 mt-1">{selectedQuiz.questions[currentQuestionIndex].points} ball</p></div>
                  <div className="space-y-2">
                    {selectedQuiz.questions[currentQuestionIndex].options.filter(o => o.trim()).map((option, idx) => {
                      const questionId = selectedQuiz.questions[currentQuestionIndex].id;
                      const isSelected = answers[questionId] === idx;
                      return (
                        <button key={idx} onClick={() => handleAnswer(questionId, idx)} className={`w-full p-4 text-left rounded-lg border-2 transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-center gap-3"><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>{isSelected && <CheckCircle className="w-4 h-4 text-white" />}</div><span>{String.fromCharCode(65 + idx)}) {option}</span></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}><ChevronLeft className="w-4 h-4 mr-1" />Oldingi</Button>
                {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (<Button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Keyingi<ChevronRight className="w-4 h-4 ml-1" /></Button>) : (<Button variant="primary" onClick={handleSubmitQuiz}>Yakunlash</Button>)}
              </div>
            </div>
          )}
          {quizFinished && quizResult && (
            <div className="space-y-6 text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${quizResult.passed ? 'bg-green-100' : 'bg-red-100'}`}>{quizResult.passed ? <Trophy className="w-12 h-12 text-green-600" /> : <XCircle className="w-12 h-12 text-red-600" />}</div>
              <div><h3 className={`text-2xl font-bold ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>{quizResult.passed ? "Tabriklaymiz! 🎉" : "Afsuski o'tmadingiz"}</h3></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold">{quizResult.percentage}%</p><p className="text-sm text-gray-500">Natija</p></div>
                <div className="p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold text-green-600">{quizResult.correctCount}</p><p className="text-sm text-gray-500">To'g'ri</p></div>
                <div className="p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold text-red-600">{quizResult.totalQuestions - quizResult.correctCount}</p><p className="text-sm text-gray-500">Noto'g'ri</p></div>
                <div className="p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold">{formatTime(quizResult.timeSpent)}</p><p className="text-sm text-gray-500">Vaqt</p></div>
              </div>
              <Button onClick={() => setShowQuizModal(false)} className="w-full">Yopish</Button>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // Teacher/Admin view
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Online Testlar</h1><p className="text-gray-500">Test yaratish va natijalarni ko'rish</p></div>
        <div className="flex items-center gap-2">
          <Select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} options={groups.map(g => ({ value: g.id, label: g.name }))} placeholder="Guruhni tanlang" className="w-48" />
          {canCreate && selectedGroup && (<Button icon={Plus} onClick={() => { setQuizForm({ ...quizForm, groupId: selectedGroup }); setShowCreateModal(true); }}>Test yaratish</Button>)}
        </div>
      </div>

      {selectedGroup ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="p-4" className="text-center"><FileQuestion className="w-6 h-6 text-blue-500 mx-auto mb-2" /><p className="text-2xl font-bold">{quizzes.length}</p><p className="text-sm text-gray-500">Jami testlar</p></Card>
            <Card padding="p-4" className="text-center"><Users className="w-6 h-6 text-green-500 mx-auto mb-2" /><p className="text-2xl font-bold">{students.length}</p><p className="text-sm text-gray-500">O'quvchilar</p></Card>
            <Card padding="p-4" className="text-center"><CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" /><p className="text-2xl font-bold">{quizzes.reduce((sum, q) => sum + (q.results?.length || 0), 0)}</p><p className="text-sm text-gray-500">Yechilgan</p></Card>
            <Card padding="p-4" className="text-center"><Percent className="w-6 h-6 text-purple-500 mx-auto mb-2" /><p className="text-2xl font-bold">{quizzes.length > 0 && quizzes.reduce((sum, q) => sum + (q.results?.length || 0), 0) > 0 ? Math.round(quizzes.reduce((sum, q) => sum + (q.results?.reduce((s, r) => s + r.percentage, 0) || 0), 0) / quizzes.reduce((sum, q) => sum + (q.results?.length || 0), 0)) : 0}%</p><p className="text-sm text-gray-500">O'rtacha</p></Card>
          </div>

          <div className="space-y-4">
            {quizzes.map(quiz => (
              <Card key={quiz.id}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between"><div><h3 className="font-semibold text-lg">{quiz.title}</h3><p className="text-gray-600 mt-1">{quiz.description}</p></div>{getQuizStatus(quiz)}</div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500"><span>{quiz.questions?.length || 0} savol</span><span>{quiz.timeLimit} daqiqa</span><span>O'tish: {quiz.passingScore}%</span><span>{formatDate(quiz.createdAt)}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => exportToExcel(quiz)} title="Excelga yuklash"><Download className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedQuiz(quiz); setShowResultsModal(true); }}><BarChart3 className="w-4 h-4 mr-1" />Natijalar</Button>
                    {canCreate && (<Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteQuiz(quiz.id)}><Trash2 className="w-4 h-4" /></Button>)}
                  </div>
                </div>
              </Card>
            ))}
            {quizzes.length === 0 && (<Card className="text-center py-12"><FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Bu guruhda testlar yo'q</p>{canCreate && (<Button className="mt-4" onClick={() => { setQuizForm({ ...quizForm, groupId: selectedGroup }); setShowCreateModal(true); }}><Plus className="w-4 h-4 mr-2" />Test yaratish</Button>)}</Card>)}
          </div>
        </>
      ) : (<Card className="text-center py-12"><FileQuestion className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">Guruhni tanlang</p></Card>)}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Yangi test yaratish" size="xl">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Test nomi" value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} placeholder="1-bob test" required />
            <div className="grid grid-cols-2 gap-2"><Input type="number" label="Vaqt (daqiqa)" value={quizForm.timeLimit} onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })} min="5" /><Input type="number" label="O'tish (%)" value={quizForm.passingScore} onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) })} min="1" max="100" /></div>
          </div>
          <Textarea label="Tavsif" value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} rows={2} />
          
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            <input type="file" ref={fileInputRef} onChange={handleExcelImport} accept=".xlsx,.xls" className="hidden" />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4 mr-2" />Exceldan</Button>
            <Button variant="outline" size="sm" onClick={downloadTemplate}><FileSpreadsheet className="w-4 h-4 mr-2" />Shablon</Button>
            <Button variant="outline" size="sm" onClick={() => setShowAIModal(true)} className="bg-gradient-to-r from-purple-50 to-blue-50"><Sparkles className="w-4 h-4 mr-2 text-purple-600" />AI bilan</Button>
          </div>

          {quizForm.questions.length > 0 && (
            <div className="border rounded-lg p-4"><h4 className="font-medium mb-3">Savollar ({quizForm.questions.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {quizForm.questions.map((q, idx) => (<div key={q.id} className="flex items-center justify-between p-2 bg-gray-50 rounded"><span className="text-sm">{idx + 1}. {q.question.substring(0, 40)}...</span><button onClick={() => removeQuestion(idx)} className="text-red-500"><XCircle className="w-4 h-4" /></button></div>))}
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4 bg-blue-50"><h4 className="font-medium mb-3">Qo'lda savol qo'shish</h4>
            <div className="space-y-4">
              <Textarea label="Savol" value={currentQuestion.question} onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })} rows={2} />
              <div className="grid grid-cols-2 gap-4"><Select label="Tur" value={currentQuestion.type} onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })} options={[{ value: 'single', label: 'Bitta javob' }]} /><Input type="number" label="Ball" value={currentQuestion.points} onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })} min="1" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Variantlar</label>
                {currentQuestion.options.map((opt, idx) => (<div key={idx} className="flex items-center gap-2"><input type="radio" name="correctAnswer" checked={currentQuestion.correctAnswer === idx} onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: idx })} /><span className="w-6">{String.fromCharCode(65 + idx)})</span><Input value={opt} onChange={(e) => { const opts = [...currentQuestion.options]; opts[idx] = e.target.value; setCurrentQuestion({ ...currentQuestion, options: opts }); }} className="flex-1" /></div>))}
              </div>
              <Button variant="outline" onClick={addQuestion} className="w-full"><Plus className="w-4 h-4 mr-2" />Qo'shish</Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t"><Button onClick={handleCreateQuiz} className="flex-1" disabled={quizForm.questions.length === 0}>Test yaratish ({quizForm.questions.length})</Button><Button variant="outline" onClick={() => setShowCreateModal(false)}>Bekor</Button></div>
        </div>
      </Modal>

      {/* AI Modal */}
      <Modal isOpen={showAIModal} onClose={() => { setShowAIModal(false); setAiQuestions([]); }} title="AI bilan test" size="xl">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {aiQuestions.length === 0 ? (
            <>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg">AI yordamida test yarating</h3>
                <p className="text-gray-600 mt-2">Mavzu kiriting, Google Gemini AI savollar tuzib beradi</p>
              </div>
              
              {!geminiAPI.isConfigured() && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">API key sozlanmagan!</p>
                      <p className="text-sm text-red-700 mt-1">
                        1. <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">Google AI Studio</a> dan API key oling<br/>
                        2. <code className="bg-red-100 px-1 rounded">.env</code> faylga qo'shing:<br/>
                        <code className="bg-red-100 px-1 rounded text-xs">VITE_GEMINI_API_KEY=sizning_api_key</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <Input label="Mavzu" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Matematika - Kvadrat tenglamalar" />
              <div className="grid grid-cols-3 gap-4">
                <Input type="number" label="Savollar" value={aiQuestionCount} onChange={(e) => setAiQuestionCount(parseInt(e.target.value))} min="1" max="20" />
                <Select label="Qiyinlik" value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)} options={[{ value: 'easy', label: 'Oson' }, { value: 'medium', label: "O'rta" }, { value: 'hard', label: 'Qiyin' }]} />
                <Select label="Til" value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)} options={[{ value: 'uz', label: "O'zbek" }, { value: 'ru', label: 'Rus' }, { value: 'en', label: 'English' }]} />
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-yellow-800"><strong>⚠️</strong> AI yaratgan savollarni tekshiring va to'g'ri javoblarni belgilang!</p></div>
              <Button onClick={generateAIQuestions} className="w-full" loading={aiGenerating} disabled={!aiTopic.trim() || !geminiAPI.isConfigured()}>{aiGenerating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Yaratilmoqda...</>) : (<><Wand2 className="w-4 h-4 mr-2" />Yaratish</>)}</Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between"><h3 className="font-semibold">Savollar ({aiQuestions.length})</h3><Button variant="outline" size="sm" onClick={() => setAiQuestions([])}><Wand2 className="w-4 h-4 mr-1" />Qayta</Button></div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-yellow-800"><strong>⚠️</strong> To'g'ri javoblarni belgilang!</p></div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {aiQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2"><span className="font-medium text-sm text-gray-500">Savol {idx + 1}</span><button onClick={() => removeAiQuestion(idx)} className="text-red-500"><XCircle className="w-4 h-4" /></button></div>
                    <Textarea value={q.question} onChange={(e) => updateAiQuestion(idx, 'question', e.target.value)} rows={2} className="mb-3" />
                    <div className="space-y-2">{q.options.map((opt, optIdx) => (<div key={optIdx} className="flex items-center gap-2"><input type="radio" name={'correct-' + q.id} checked={q.correctAnswer === optIdx} onChange={() => updateAiQuestion(idx, 'correctAnswer', optIdx)} /><span className="w-6">{String.fromCharCode(65 + optIdx)})</span><Input value={opt} onChange={(e) => updateAiQuestionOption(idx, optIdx, e.target.value)} className="flex-1" /></div>))}</div>
                    <div className="flex items-center gap-2 mt-2"><span className="text-sm text-gray-500">Ball:</span><Input type="number" value={q.points} onChange={(e) => updateAiQuestion(idx, 'points', parseInt(e.target.value))} className="w-20" min="1" /></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2"><Button onClick={addAIQuestionsToQuiz} className="flex-1"><Plus className="w-4 h-4 mr-2" />Qo'shish ({aiQuestions.length})</Button><Button variant="outline" onClick={() => setShowAIModal(false)}>Bekor</Button></div>
            </>
          )}
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal isOpen={showResultsModal} onClose={() => setShowResultsModal(false)} title={selectedQuiz?.title + ' - Natijalar'} size="xl">
        {selectedQuiz && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center"><div className="p-3 bg-blue-50 rounded-lg"><p className="text-2xl font-bold text-blue-600">{selectedQuiz.results?.length || 0}</p><p className="text-sm text-blue-500">Yechganlar</p></div><div className="p-3 bg-green-50 rounded-lg"><p className="text-2xl font-bold text-green-600">{selectedQuiz.results?.filter(r => r.passed).length || 0}</p><p className="text-sm text-green-500">O'tganlar</p></div><div className="p-3 bg-purple-50 rounded-lg"><p className="text-2xl font-bold text-purple-600">{selectedQuiz.results?.length > 0 ? Math.round(selectedQuiz.results.reduce((s, r) => s + r.percentage, 0) / selectedQuiz.results.length) : 0}%</p><p className="text-sm text-purple-500">O'rtacha</p></div></div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {students.map(student => {
                const result = selectedQuiz.results?.find(r => r.studentId === student.id);
                return (<div key={student.id} className={`p-3 rounded-lg border-2 ${result?.passed ? 'border-green-200 bg-green-50' : result ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Avatar name={student.fullName} size="sm" /><div><p className="font-medium">{student.fullName}</p>{result && (<p className="text-sm text-gray-500">{result.correctCount}/{result.totalQuestions} to'g'ri • {formatTime(result.timeSpent)}</p>)}</div></div>{result ? (<div className="text-right"><p className={`text-2xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>{result.percentage}%</p><Badge variant={result.passed ? 'success' : 'danger'}>{result.passed ? "O'tdi" : "O'tmadi"}</Badge></div>) : (<Badge variant="warning">Yechilmagan</Badge>)}</div></div>);
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Quizzes;
