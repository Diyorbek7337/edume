import { useState, useEffect } from 'react';
import { 
  Award, Download, Users, Search, Eye, Trash2, Plus, 
  Calendar, FileText, Printer, CheckCircle, Medal, QrCode
} from 'lucide-react';
import { Card, Button, Input, Select, Badge, Avatar, Modal, Loading } from '../components/common';
import { Textarea } from '../components/common/Textarea';
import { certificatesAPI, studentsAPI, groupsAPI, teachersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const Certificates = () => {
  const { userData, role } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const [formData, setFormData] = useState({
    studentId: '',
    courseName: '',
    completionDate: new Date().toISOString().split('T')[0],
    grade: '',
    description: '',
    templateStyle: 'classic',
    hoursCompleted: ''
  });

  const isAdmin = role === ROLES.ADMIN || role === ROLES.DIRECTOR;
  const isTeacher = role === ROLES.TEACHER;
  const isStudentOrParent = role === ROLES.STUDENT || role === ROLES.PARENT;
  const canCreate = isAdmin || isTeacher;

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedGroup) fetchStudents(); }, [selectedGroup]);

  const fetchData = async () => {
    try {
      const [certsData, groupsData] = await Promise.all([
        certificatesAPI.getAll(),
        groupsAPI.getAll()
      ]);

      if (isTeacher) {
        const allTeachers = await teachersAPI.getAll();
        const normalizePhone = (phone) => phone?.replace(/\D/g, '') || '';
        const teacher = allTeachers.find(t => 
          t.id === userData?.id || t.email === userData?.email ||
          normalizePhone(t.phone) === normalizePhone(userData?.phone)
        );
        if (teacher) {
          setGroups(groupsData.filter(g => g.teacherId === teacher.id || g.teacherId === userData?.id));
        }
        setCertificates(certsData.filter(c => c.createdBy === userData?.id || c.createdBy === teacher?.id));
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
          setCertificates(certsData.filter(c => c.studentId === student.id));
        }
      } else {
        setGroups(groupsData);
        setCertificates(certsData);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentsAPI.getByGroup(selectedGroup);
      setStudents(data);
    } catch (err) { console.error(err); }
  };

  // QR Code yaratish
  const generateQRCode = async (certNumber, verifyUrl) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      return qrDataUrl;
    } catch (err) {
      console.error('QR code generation error:', err);
      return null;
    }
  };

  // PDF Sertifikat yaratish
  const generateCertificatePDF = async (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background color
    if (cert.templateStyle === 'classic') {
      doc.setFillColor(255, 248, 220);
    } else if (cert.templateStyle === 'modern') {
      doc.setFillColor(240, 248, 255);
    } else {
      doc.setFillColor(255, 250, 250);
    }
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Corner decorations
    const corners = [[20, 20], [pageWidth - 20, 20], [20, pageHeight - 20], [pageWidth - 20, pageHeight - 20]];
    doc.setFillColor(218, 165, 32);
    corners.forEach(([x, y]) => {
      doc.circle(x, y, 3, 'F');
    });

    // Header decorations
    doc.setFillColor(218, 165, 32);
    doc.circle(pageWidth / 2, 30, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('★', pageWidth / 2, 33, { align: 'center' });

    // Title
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('SERTIFIKAT', pageWidth / 2, 60, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Ushbu sertifikat tasdiqlaydiki', pageWidth / 2, 75, { align: 'center' });

    // Student Name
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(cert.studentName, pageWidth / 2, 100, { align: 'center' });

    // Line under name
    doc.setDrawColor(218, 165, 32);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 60, 105, pageWidth / 2 + 60, 105);

    // Course completion text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('muvaffaqiyatli yakunladi', pageWidth / 2, 120, { align: 'center' });

    // Course Name
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 150);
    doc.text(`"${cert.courseName}"`, pageWidth / 2, 140, { align: 'center' });

    // Hours and Grade
    let yPos = 155;
    if (cert.hoursCompleted) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`Davomiyligi: ${cert.hoursCompleted} soat`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;
    }
    
    if (cert.grade) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(34, 139, 34);
      doc.text(`Baho: ${cert.grade}`, pageWidth / 2, yPos, { align: 'center' });
    }

    // QR Code
    const certNumber = cert.certificateNumber || cert.id?.substring(0, 8).toUpperCase();
    const verifyUrl = `${window.location.origin}/certificates?verify=${certNumber}`;
    const qrDataUrl = await generateQRCode(certNumber, verifyUrl);
    
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', pageWidth - 50, pageHeight - 55, 30, 30);
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      doc.text('Tekshirish uchun skanerlang', pageWidth - 35, pageHeight - 22, { align: 'center' });
    }

    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Sana: ${formatDate(cert.completionDate)}`, pageWidth / 2, pageHeight - 40, { align: 'center' });

    // Certificate number
    doc.setFontSize(10);
    doc.text(`Sertifikat raqami: ${certNumber}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

    // Footer line
    doc.setDrawColor(218, 165, 32);
    doc.line(30, pageHeight - 50, 80, pageHeight - 50);
    doc.line(pageWidth - 100, pageHeight - 50, pageWidth - 50, pageHeight - 50);

    // Signature labels
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Direktor", 55, pageHeight - 45, { align: 'center' });
    doc.text("O'qituvchi", pageWidth - 75, pageHeight - 45, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = async (cert) => {
    try {
      const doc = await generateCertificatePDF(cert);
      doc.save(`Sertifikat_${cert.studentName.replace(/\s+/g, '_')}.pdf`);
      toast.success("Sertifikat yuklab olindi!");
    } catch (err) {
      console.error(err);
      toast.error("PDF yaratishda xatolik");
    }
  };

  const handlePrint = async (cert) => {
    try {
      const doc = await generateCertificatePDF(cert);
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  // Sertifikatni tekshirish
  const handleVerify = () => {
    if (!verifyCode.trim()) {
      toast.error("Sertifikat raqamini kiriting");
      return;
    }

    const cert = certificates.find(c => 
      (c.certificateNumber || c.id?.substring(0, 8).toUpperCase()) === verifyCode.toUpperCase()
    );

    if (cert) {
      setVerifyResult({
        valid: true,
        certificate: cert
      });
    } else {
      setVerifyResult({
        valid: false,
        message: "Bunday raqamli sertifikat topilmadi"
      });
    }
  };

  // URL dan verify parametrini tekshirish
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyParam = urlParams.get('verify');
    if (verifyParam) {
      setVerifyCode(verifyParam);
      setShowVerifyModal(true);
      // Avtomatik tekshirish
      setTimeout(() => {
        const cert = certificates.find(c => 
          (c.certificateNumber || c.id?.substring(0, 8).toUpperCase()) === verifyParam.toUpperCase()
        );
        if (cert) {
          setVerifyResult({ valid: true, certificate: cert });
        } else if (certificates.length > 0) {
          setVerifyResult({ valid: false, message: "Bunday raqamli sertifikat topilmadi" });
        }
      }, 500);
    }
  }, [certificates]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.courseName.trim()) {
      toast.error("O'quvchi va kurs nomini tanlang");
      return;
    }

    try {
      const student = students.find(s => s.id === formData.studentId);
      const group = groups.find(g => g.id === selectedGroup);

      const newCert = await certificatesAPI.create({
        ...formData,
        studentName: student?.fullName || '',
        groupId: selectedGroup,
        groupName: group?.name || '',
        createdBy: userData?.id,
        createdByName: userData?.fullName,
        certificateNumber: `CERT-${Date.now().toString(36).toUpperCase()}`
      });

      setCertificates([newCert, ...certificates]);
      setShowCreateModal(false);
      setFormData({
        studentId: '', courseName: '', completionDate: new Date().toISOString().split('T')[0],
        grade: '', description: '', templateStyle: 'classic', hoursCompleted: ''
      });
      toast.success("Sertifikat yaratildi!");
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu sertifikatni o'chirishni xohlaysizmi?")) return;
    try {
      await certificatesAPI.delete(id);
      setCertificates(certificates.filter(c => c.id !== id));
      toast.success("O'chirildi");
    } catch (err) { toast.error("Xatolik"); }
  };

  const filteredCertificates = certificates.filter(c =>
    c.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading fullScreen text="Yuklanmoqda..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sertifikatlar</h1>
          <p className="text-gray-500">Kurs yakunlash sertifikatlari</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" onClick={() => setShowVerifyModal(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            Tekshirish
          </Button>
          {canCreate && (
            <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
              Sertifikat yaratish
            </Button>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="p-4" className="text-center">
          <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{certificates.length}</p>
          <p className="text-sm text-gray-500">Jami sertifikatlar</p>
        </Card>
        <Card padding="p-4" className="text-center">
          <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {new Set(certificates.map(c => c.studentId)).size}
          </p>
          <p className="text-sm text-gray-500">O'quvchilar</p>
        </Card>
        <Card padding="p-4" className="text-center">
          <Medal className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {certificates.filter(c => c.grade === "A'lo" || c.grade?.includes('5')).length}
          </p>
          <p className="text-sm text-gray-500">A'lo baholar</p>
        </Card>
        <Card padding="p-4" className="text-center">
          <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {certificates.filter(c => {
              const date = new Date(c.completionDate);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="text-sm text-gray-500">Bu oy</p>
        </Card>
      </div>

      {/* Sertifikatlar ro'yxati */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCertificates.map(cert => (
          <Card key={cert.id} className="hover:shadow-lg transition">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{cert.studentName}</h3>
                <p className="text-sm text-gray-600">{cert.courseName}</p>
                <div className="flex items-center gap-2 mt-1">
                  {cert.grade && <Badge variant="success">{cert.grade}</Badge>}
                  <span className="text-xs text-gray-500">{formatDate(cert.completionDate)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  #{cert.certificateNumber || cert.id?.substring(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSelectedCertificate(cert);
                  setShowPreviewModal(true);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadPDF(cert)}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handlePrint(cert)}
              >
                <Printer className="w-4 h-4" />
              </Button>
              {canCreate && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 ml-auto"
                  onClick={() => handleDelete(cert.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <Card className="text-center py-12">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? "Sertifikat topilmadi" : "Sertifikatlar yo'q"}
          </p>
          {canCreate && !searchQuery && (
            <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Birinchi sertifikat yaratish
            </Button>
          )}
        </Card>
      )}

      {/* Sertifikat yaratish modali */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Yangi sertifikat yaratish" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select
            label="Guruh"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            options={groups.map(g => ({ value: g.id, label: g.name }))}
            placeholder="Guruhni tanlang"
          />

          {selectedGroup && (
            <Select
              label="O'quvchi"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              options={students.map(s => ({ value: s.id, label: s.fullName }))}
              placeholder="O'quvchini tanlang"
              required
            />
          )}

          <Input
            label="Kurs nomi"
            value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            placeholder="Masalan: Ingliz tili - Beginner"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="date"
              label="Yakunlash sanasi"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
            />
            <Select
              label="Baho"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              options={[
                { value: '', label: 'Tanlanmagan' },
                { value: "A'lo", label: "A'lo" },
                { value: 'Yaxshi', label: 'Yaxshi' },
                { value: "Qoniqarli", label: "Qoniqarli" },
              ]}
            />
            <Input
              type="number"
              label="Soatlar soni"
              value={formData.hoursCompleted}
              onChange={(e) => setFormData({ ...formData, hoursCompleted: e.target.value })}
              placeholder="72"
            />
          </div>

          <Select
            label="Shablon"
            value={formData.templateStyle}
            onChange={(e) => setFormData({ ...formData, templateStyle: e.target.value })}
            options={[
              { value: 'classic', label: '📜 Klassik (sariq)' },
              { value: 'modern', label: '🎨 Zamonaviy (ko\'k)' },
              { value: 'elegant', label: '✨ Elegant (pushti)' },
            ]}
          />

          <Textarea
            label="Qo'shimcha izoh"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ixtiyoriy..."
            rows={2}
          />

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" className="flex-1">Yaratish</Button>
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview modali */}
      <Modal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
        title="Sertifikat ko'rish"
        size="xl"
      >
        {selectedCertificate && (
          <div className="space-y-4">
            {/* Preview */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-600 rounded-lg p-8 text-center relative">
              <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white">★</span>
              </div>
              <h2 className="text-3xl font-bold text-yellow-800 mb-2">SERTIFIKAT</h2>
              <p className="text-gray-600 mb-4">Ushbu sertifikat tasdiqlaydiki</p>
              <h3 className="text-2xl font-bold mb-2">{selectedCertificate.studentName}</h3>
              <div className="w-32 h-0.5 bg-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">muvaffaqiyatli yakunladi</p>
              <h4 className="text-xl font-semibold text-blue-700 mb-4">"{selectedCertificate.courseName}"</h4>
              {selectedCertificate.hoursCompleted && (
                <p className="text-sm text-gray-500 mb-2">Davomiyligi: {selectedCertificate.hoursCompleted} soat</p>
              )}
              {selectedCertificate.grade && (
                <Badge variant="success" className="mb-4">{selectedCertificate.grade}</Badge>
              )}
              <p className="text-sm text-gray-500">Sana: {formatDate(selectedCertificate.completionDate)}</p>
              <p className="text-xs text-gray-400 mt-2">
                Sertifikat raqami: #{selectedCertificate.certificateNumber || selectedCertificate.id?.substring(0, 8).toUpperCase()}
              </p>
              
              {/* QR kod belgisi */}
              <div className="absolute bottom-4 right-4 text-center">
                <QrCode className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-xs text-gray-400">QR Code</p>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleDownloadPDF(selectedCertificate)}>
                <Download className="w-4 h-4 mr-2" />
                PDF Yuklab olish
              </Button>
              <Button variant="outline" onClick={() => handlePrint(selectedCertificate)}>
                <Printer className="w-4 h-4 mr-2" />
                Chop etish
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Tekshirish modali */}
      <Modal 
        isOpen={showVerifyModal} 
        onClose={() => {
          setShowVerifyModal(false);
          setVerifyCode('');
          setVerifyResult(null);
        }} 
        title="Sertifikatni tekshirish"
      >
        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Sertifikat haqiqiyligini tekshirish uchun sertifikat raqamini kiriting
            </p>
          </div>

          <Input
            label="Sertifikat raqami"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="CERT-XXXXXX"
          />

          <Button onClick={handleVerify} className="w-full">
            Tekshirish
          </Button>

          {verifyResult && (
            <div className={`p-4 rounded-lg ${verifyResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {verifyResult.valid ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-green-700">Sertifikat haqiqiy! ✓</h4>
                  <div className="mt-3 text-left text-sm">
                    <p><strong>O'quvchi:</strong> {verifyResult.certificate.studentName}</p>
                    <p><strong>Kurs:</strong> {verifyResult.certificate.courseName}</p>
                    <p><strong>Sana:</strong> {formatDate(verifyResult.certificate.completionDate)}</p>
                    {verifyResult.certificate.grade && (
                      <p><strong>Baho:</strong> {verifyResult.certificate.grade}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Award className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  <h4 className="font-bold text-red-700">Sertifikat topilmadi</h4>
                  <p className="text-sm text-red-600 mt-1">{verifyResult.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Certificates;
