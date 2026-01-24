import { useState, useEffect } from 'react';
import { 
  Trophy, Star, Award, TrendingUp, Medal, Crown, Zap, Target,
  Users, Calendar, BookOpen, CheckCircle, Clock, Gift, Flame
} from 'lucide-react';
import { Card, Button, Select, Badge, Avatar, Loading } from '../components/common';
import { 
  studentsAPI, groupsAPI, gradesAPI, attendanceAPI, homeworkAPI, 
  quizAPI, teachersAPI 
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate, toISODateString } from '../utils/helpers';

const Leaderboard = () => {
  const { userData, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [period, setPeriod] = useState('month');
  const [view, setView] = useState('leaderboard');

  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;

  const POINT_RULES = {
    grade_excellent: { points: 50, label: 'A\'lo baho (90%+)', icon: Star },
    grade_good: { points: 30, label: 'Yaxshi baho (70-89%)', icon: Star },
    grade_average: { points: 10, label: 'O\'rta baho (50-69%)', icon: Star },
    attendance_present: { points: 10, label: 'Darsga keldi', icon: CheckCircle },
    attendance_streak_7: { points: 100, label: '7 kun ketma-ket', icon: Flame },
    attendance_streak_30: { points: 500, label: '30 kun ketma-ket', icon: Flame },
    homework_ontime: { points: 30, label: 'Vazifa o\'z vaqtida', icon: BookOpen },
    homework_excellent: { points: 50, label: 'A\'lo vazifa (90%+)', icon: BookOpen },
    quiz_passed: { points: 40, label: 'Test o\'tdi', icon: Target },
    quiz_excellent: { points: 100, label: 'A\'lo test (90%+)', icon: Trophy },
  };

  const ACHIEVEMENTS = [
    { id: 'first_grade', name: 'Birinchi baho', description: 'Birinchi bahoni olish', icon: Star, condition: (stats) => stats.totalGrades >= 1 },
    { id: 'grade_10', name: '10 ta baho', description: '10 ta baho to\'plash', icon: Star, condition: (stats) => stats.totalGrades >= 10 },
    { id: 'grade_50', name: '50 ta baho', description: '50 ta baho to\'plash', icon: Award, condition: (stats) => stats.totalGrades >= 50 },
    { id: 'attendance_7', name: 'Hafta davomchisi', description: '7 kun ketma-ket kelish', icon: Flame, condition: (stats) => stats.attendanceStreak >= 7 },
    { id: 'attendance_30', name: 'Oy davomchisi', description: '30 kun ketma-ket kelish', icon: Crown, condition: (stats) => stats.attendanceStreak >= 30 },
    { id: 'homework_5', name: 'Ish boshi', description: '5 ta vazifa topshirish', icon: BookOpen, condition: (stats) => stats.totalHomework >= 5 },
    { id: 'quiz_master', name: 'Test ustasi', description: '5 ta testdan o\'tish', icon: Target, condition: (stats) => stats.quizzesPassed >= 5 },
    { id: 'perfect_score', name: 'Mukammal', description: '100% natija olish', icon: Trophy, condition: (stats) => stats.perfectScores >= 1 },
    { id: 'point_100', name: '100 ball', description: '100 ball to\'plash', icon: Zap, condition: (stats) => stats.totalPoints >= 100 },
    { id: 'point_500', name: '500 ball', description: '500 ball to\'plash', icon: Zap, condition: (stats) => stats.totalPoints >= 500 },
    { id: 'point_1000', name: '1000 ball', description: '1000 ball to\'plash', icon: Medal, condition: (stats) => stats.totalPoints >= 1000 },
  ];

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) calculateLeaderboard(); }, [selectedGroup, period]);

  const fetchData = async () => {
    try {
      let groupsData = [];
      
      if (role === ROLES.TEACHER) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        
        const allGroups = await groupsAPI.getAll();
        if (teacher) groupsData = allGroups.filter(g => g.teacherId === teacher.id);
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
          setStudentData(student);
          const allGroups = await groupsAPI.getAll();
          groupsData = allGroups.filter(g => 
            g.id === student.groupId || g.studentIds?.includes(student.id)
          );
        }
      } else {
        groupsData = await groupsAPI.getAll();
      }
      
      setGroups(groupsData);
      if (groupsData.length > 0) setSelectedGroup(groupsData[0].id);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const calculateLeaderboard = async () => {
    try {
      const [studentsData, grades, attendance, homework, quizzes] = await Promise.all([
        studentsAPI.getByGroup(selectedGroup),
        gradesAPI.getByGroup(selectedGroup),
        attendanceAPI.getByGroup(selectedGroup),
        homeworkAPI.getByGroup(selectedGroup),
        quizAPI.getByGroup(selectedGroup)
      ]);

      setStudents(studentsData);

      const now = new Date();
      const filterByPeriod = (dateValue) => {
        const dateStr = toISODateString(dateValue);
        if (!dateStr) return false;
        const todayStr = now.toISOString().split('T')[0];
        
        switch (period) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return dateStr >= weekAgo.toISOString().split('T')[0];
          case 'month':
            return dateStr.startsWith(todayStr.substring(0, 7));
          default:
            return true;
        }
      };

      const leaderboard = await Promise.all(studentsData.map(async (student) => {
        let totalPoints = 0;

        // Baholar
        const myGrades = grades.filter(g => g.studentId === student.id && filterByPeriod(g.date || g.createdAt));
        myGrades.forEach(g => {
          const percent = (g.grade / g.maxGrade) * 100;
          if (percent >= 90) totalPoints += POINT_RULES.grade_excellent.points;
          else if (percent >= 70) totalPoints += POINT_RULES.grade_good.points;
          else if (percent >= 50) totalPoints += POINT_RULES.grade_average.points;
        });

        // Davomat
        const myAttendance = attendance.filter(a => a.studentId === student.id && filterByPeriod(a.date));
        const presentDays = myAttendance.filter(a => a.status === 'present').length;
        totalPoints += presentDays * POINT_RULES.attendance_present.points;

        // Streak
        let streak = 0;
        const sortedAttendance = myAttendance
          .filter(a => a.status === 'present')
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (let i = 0; i < sortedAttendance.length; i++) {
          if (i === 0) streak = 1;
          else {
            const prevDate = new Date(sortedAttendance[i - 1].date);
            const currDate = new Date(sortedAttendance[i].date);
            const diffDays = (prevDate - currDate) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) streak++;
            else break;
          }
        }

        if (streak >= 30) totalPoints += POINT_RULES.attendance_streak_30.points;
        else if (streak >= 7) totalPoints += POINT_RULES.attendance_streak_7.points;

        // Uy vazifalari
        let completedHomework = 0;
        for (const hw of homework) {
          const subs = await homeworkAPI.getSubmissions(hw.id);
          const mySub = subs.find(s => s.studentId === student.id);
          if (mySub) {
            completedHomework++;
            if (mySub.score !== undefined) {
              const percent = (mySub.score / hw.maxScore) * 100;
              if (percent >= 90) totalPoints += POINT_RULES.homework_excellent.points;
              else totalPoints += POINT_RULES.homework_ontime.points;
            } else {
              totalPoints += POINT_RULES.homework_ontime.points;
            }
          }
        }

        // Testlar
        let quizzesPassed = 0;
        let perfectScores = 0;
        for (const q of quizzes) {
          const results = await quizAPI.getResults(q.id);
          const myResult = results.find(r => r.studentId === student.id);
          if (myResult?.passed) {
            quizzesPassed++;
            if (myResult.percentage >= 90) totalPoints += POINT_RULES.quiz_excellent.points;
            else totalPoints += POINT_RULES.quiz_passed.points;
            if (myResult.percentage === 100) perfectScores++;
          }
        }

        const stats = {
          totalPoints,
          totalGrades: myGrades.length,
          gradeAvg: myGrades.length > 0 
            ? Math.round(myGrades.reduce((sum, g) => sum + (g.grade / g.maxGrade) * 100, 0) / myGrades.length)
            : 0,
          attendancePercent: myAttendance.length > 0 
            ? Math.round((presentDays / myAttendance.length) * 100) 
            : 0,
          attendanceStreak: streak,
          totalHomework: completedHomework,
          quizzesPassed,
          perfectScores: perfectScores + myGrades.filter(g => g.grade === g.maxGrade).length,
        };

        return { student, totalPoints, stats };
      }));

      const sortedLeaderboard = leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
      setLeaderboardData(sortedLeaderboard);

      if (studentData) {
        const myData = sortedLeaderboard.find(l => l.student.id === studentData.id);
        if (myData) {
          const myRank = sortedLeaderboard.findIndex(l => l.student.id === studentData.id) + 1;
          setMyStats({ ...myData.stats, rank: myRank, totalPoints: myData.totalPoints });
        }
      }
    } catch (err) { console.error(err); }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"><Crown className="w-5 h-5 text-white" /></div>;
      case 2:
        return <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center"><Medal className="w-5 h-5 text-white" /></div>;
      case 3:
        return <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center"><Medal className="w-5 h-5 text-white" /></div>;
      default:
        return <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">{rank}</div>;
    }
  };

  const getUnlockedAchievements = (stats) => ACHIEVEMENTS.filter(a => a.condition(stats));

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reyting va Ballar</h1>
          <p className="text-gray-500">Ball to'plang va yutuqlarga erishing</p>
        </div>
        
        <div className="flex items-center gap-2">
          {groups.length > 1 && (
            <Select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              options={groups.map(g => ({ value: g.id, label: g.name }))}
              className="w-48"
            />
          )}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="all">Jami</option>
          </select>
        </div>
      </div>

      {/* Mening statistikam */}
      {isStudentOrParent && myStats && (
        <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <p className="text-white/80">Mening ballarim</p>
                <p className="text-4xl font-bold">{myStats.totalPoints}</p>
                <p className="text-white/80">#{myStats.rank} o'rin</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{myStats.gradeAvg}%</p>
                <p className="text-sm text-white/80">O'rtacha</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{myStats.attendancePercent}%</p>
                <p className="text-sm text-white/80">Davomat</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{myStats.attendanceStreak}</p>
                <p className="text-sm text-white/80">Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{getUnlockedAchievements(myStats).length}</p>
                <p className="text-sm text-white/80">Yutuqlar</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setView('leaderboard')}
          className={`px-4 py-2 font-medium transition ${
            view === 'leaderboard' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" />Reyting
        </button>
        <button
          onClick={() => setView('achievements')}
          className={`px-4 py-2 font-medium transition ${
            view === 'achievements' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
          }`}
        >
          <Award className="w-4 h-4 inline mr-2" />Yutuqlar
        </button>
        <button
          onClick={() => setView('rules')}
          className={`px-4 py-2 font-medium transition ${
            view === 'rules' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />Ball qoidalari
        </button>
      </div>

      {/* Reyting */}
      {view === 'leaderboard' && (
        <div className="space-y-3">
          {leaderboardData.map((item, index) => {
            const isMe = studentData?.id === item.student.id;
            return (
              <Card key={item.student.id} className={isMe ? 'ring-2 ring-primary-500 bg-primary-50' : ''}>
                <div className="flex items-center gap-4">
                  {getRankBadge(index + 1)}
                  <Avatar name={item.student.fullName} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.student.fullName}</p>
                      {isMe && <Badge variant="primary">Siz</Badge>}
                      {index === 0 && <Badge variant="warning">🏆 Lider</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>Baho: {item.stats.gradeAvg}%</span>
                      <span>Davomat: {item.stats.attendancePercent}%</span>
                      <span>🔥 {item.stats.attendanceStreak} kun</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{item.totalPoints}</p>
                    <p className="text-sm text-gray-500">ball</p>
                  </div>
                </div>
              </Card>
            );
          })}
          {leaderboardData.length === 0 && (
            <Card className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Ma'lumotlar yo'q</p>
            </Card>
          )}
        </div>
      )}

      {/* Yutuqlar */}
      {view === 'achievements' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = myStats ? achievement.condition(myStats) : false;
            const Icon = achievement.icon;
            return (
              <Card 
                key={achievement.id}
                className={`text-center ${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-300' : 'opacity-50 grayscale'}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isUnlocked ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                  <Icon className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <h4 className="font-semibold mt-3">{achievement.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                {isUnlocked && <Badge variant="success" className="mt-2">✓ Erishildi</Badge>}
              </Card>
            );
          })}
        </div>
      )}

      {/* Ball qoidalari */}
      {view === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(POINT_RULES).map(([key, rule]) => {
            const Icon = rule.icon;
            return (
              <Card key={key} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{rule.label}</p>
                </div>
                <Badge variant="success">+{rule.points}</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
