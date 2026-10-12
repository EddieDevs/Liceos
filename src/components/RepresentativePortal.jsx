import React, { useState, useRef } from 'react';
import {
  CreditCard,
  BookOpen,
  Clock,
  User,
  Upload,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ReportCardModal from './ReportCardModal';
import { readFileAsDataURL } from '../lib/fileUpload';

export default function RepresentativePortal() {
  const {
    currentUser,
    students,
    grades,
    subjects,
    payments,
    addPayment,
    institution,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments', 'grades', 'profile'
  const [reportCardModalOpen, setReportCardModalOpen] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);

  // Wards (represented students)
  const myStudents = students.filter(
    (s) =>
      s.representativeId === currentUser?.id ||
      s.representativeName?.toLowerCase() === currentUser?.name?.toLowerCase() ||
      s.representativePhone === currentUser?.phone
  );

  // Selected student for paying / viewing (fallback to first ward or first student in system)
  const [selectedStudentId, setSelectedStudentId] = useState(myStudents[0]?.id || students[0]?.id || '');
  const activeStudent = students.find((s) => s.id === selectedStudentId) || myStudents[0] || students[0] || null;

  // Receipt File upload state
  const receiptFileInputRef = useRef(null);
  const [receiptPreview, setReceiptPreview] = useState('');

  const activeYear = institution.currentSchoolYear || '2027-2028';

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    concept: 'Mensualidad Escolar',
    paymentMethod: 'Pago Móvil Interbancario',
    amount: '',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const handleReceiptFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataURL(file);
      setReceiptPreview(dataUrl);
    } catch (err) {
      notify('Error al leer el archivo de comprobante', 'error');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.referenceNumber.trim()) {
      notify('Introduce el número de referencia bancaria', 'error');
      return;
    }

    if (Number(paymentForm.amount) <= 0) {
      notify('El monto del pago debe ser mayor a 0', 'error');
      return;
    }

    if (!activeStudent) {
      notify('Selecciona o registra un alumno para asociar el pago', 'error');
      return;
    }

    await addPayment({
      representativeName: currentUser?.name || 'Representante Legal',
      studentName: activeStudent.name,
      studentGrade: `${activeStudent.grade_year || activeStudent.gradeLevel} (${activeStudent.section || 'A'})`,
      paymentConcept: paymentForm.concept,
      paymentMethod: paymentForm.paymentMethod,
      amount: Number(paymentForm.amount),
      referenceNumber: paymentForm.referenceNumber,
      paymentDate: paymentForm.paymentDate,
      receiptUrl: receiptPreview || ''
    });

    setPaymentForm({
      concept: 'Mensualidad Escolar',
      paymentMethod: 'Pago Móvil Interbancario',
      amount: '',
      referenceNumber: '',
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setReceiptPreview('');
  };

  // Student specific grades
  const studentGrades = grades.filter(
    (g) => g.studentId === activeStudent?.id || g.studentName === activeStudent?.name
  );

  return (
    <div className="min-h-screen denim-pattern text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Profile Summary */}
        <div className="denim-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#223C63] border-2 border-[#DCB35C] flex items-center justify-center text-[#DCB35C] shadow-lg">
              <CreditCard className="w-8 h-8 text-[#DCB35C]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 denim-patch px-2.5 py-0.5 text-[11px] mb-1">
                <Sparkles className="w-3 h-3 text-[#DCB35C]" />
                <span>Portal de Representantes Legales</span>
                <span className="text-slate-500">•</span>
                <span className="text-white font-semibold">Año Escolar {activeYear}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-slab text-white tracking-tight">
                {currentUser?.name || 'Representante Legal'}
              </h1>
              <p className="text-xs text-slate-300 font-mono">
                {currentUser?.email} • U.E. Colegio Integral Venezuela
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeStudent && (
              <button
                onClick={() => {
                  setSelectedStudentForReport(activeStudent);
                  setReportCardModalOpen(true);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] hover:brightness-105 text-[#1A2B45] font-bold font-slab rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Boletín de {activeStudent.name.split(' ')[0]}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 text-xs font-medium">
          {[
            { id: 'payments', label: 'Reportar Pagos y Aranceles', icon: CreditCard },
            { id: 'grades', label: 'Rendimiento y Boletín de Representados', icon: BookOpen },
            { id: 'profile', label: 'Datos del Representante', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#223C63] text-white font-bold font-slab border border-[#DCB35C]/50 shadow-inner'
                    : 'bg-[#152338]/80 text-slate-300 hover:text-white hover:bg-[#1A2B45] border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DCB35C]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUBTAB: PAYMENTS */}
        {activeSubTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Formulario de Reporte de Pago */}
            <div className="lg:col-span-7 denim-card p-6 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h2 className="text-base font-bold font-slab text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#DCB35C]" />
                  <span>Reportar Pago o Transferencia Bancaria</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Registra tu referencia y sube el comprobante directamente en archivo
                </p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-3.5 text-xs">
                {/* Selector de Estudiante */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Estudiante Asociado (Selector)</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    {students.length === 0 ? (
                      <option value="">No hay alumnos matriculados por la dirección</option>
                    ) : (
                      students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — C.I: {s.cedula || 'Sin cédula'} ({s.grade_year || s.gradeLevel} {s.section})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Concepto</label>
                    <select
                      value={paymentForm.concept}
                      onChange={(e) => setPaymentForm({ ...paymentForm, concept: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    >
                      <option value="Mensualidad Escolar">Mensualidad Escolar</option>
                      <option value="Matrícula Oficial">Matrícula Oficial</option>
                      <option value="Seguro Escolar">Seguro Escolar</option>
                      <option value="Constancia o Trámites">Constancia o Trámites</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Método de Pago</label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    >
                      <option value="Pago Móvil Interbancario">Pago Móvil Interbancario</option>
                      <option value="Transferencia Banesco / Mercantil">Transferencia Bancaria Nacional</option>
                      <option value="Efectivo en Caja">Efectivo en Administración</option>
                      <option value="Zelle / Divisas">Zelle / Transferencia Internacional</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Monto Pagado ($ o Bs)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ej. 65.00"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Número de Referencia</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 094812"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                    />
                  </div>
                </div>

                {/* Subida Directa de Archivo de Comprobante */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Comprobante de Pago (Foto o Captura)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => receiptFileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#223C63] hover:bg-[#1A2B45] border border-[#DCB35C]/50 rounded-xl text-[#f0c36d] font-bold font-slab flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Comprobante (Archivo)</span>
                    </button>
                    <input
                      type="file"
                      ref={receiptFileInputRef}
                      accept="image/*,.pdf"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                    {receiptPreview && (
                      <span className="text-[11px] text-emerald-400 font-medium">Comprobante adjuntado</span>
                    )}
                  </div>

                  {receiptPreview && (
                    <div className="mt-2.5 h-24 rounded-xl overflow-hidden border border-slate-700 max-w-xs">
                      <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-lg transition cursor-pointer"
                >
                  Enviar Comprobante a Administración
                </button>
              </form>
            </div>

            {/* Datos Bancarios y Resumen */}
            <div className="lg:col-span-5 space-y-4">
              <div className="denim-card p-6 space-y-3">
                <h3 className="text-sm font-bold font-slab text-[#f0c36d] uppercase tracking-wider">
                  Coordenadas Bancarias del Plantel
                </h3>
                <div className="text-xs text-slate-300 space-y-2 font-mono p-3.5 bg-[#101c30] rounded-xl border border-slate-700">
                  <div><strong>Banco:</strong> Banesco Banco Universal</div>
                  <div><strong>Cuenta:</strong> 0134-0374-91-3741029384</div>
                  <div><strong>Pago Móvil:</strong> Banesco (0134)</div>
                  <div><strong>RIF:</strong> J-30491823-1</div>
                  <div><strong>Teléfono:</strong> 0414-8201122</div>
                  <div><strong>Titular:</strong> U.E. Colegio Integral Venezuela</div>
                </div>
              </div>

              {/* Historial de Pagos Reportados */}
              <div className="denim-card p-6 space-y-3">
                <h3 className="text-sm font-bold font-slab text-white">Mis Pagos Reportados</h3>
                {payments.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-3 text-center">No has reportado pagos recientes.</div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {payments.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-[#101c30] border border-slate-700/80 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{p.concept || p.payment_concept}</div>
                          <div className="text-[11px] text-slate-400 font-mono">Ref: {p.referenceNumber || p.reference_number} • ${p.amount}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'}`}>
                          {p.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: GRADES & REPORT CARD */}
        {activeSubTab === 'grades' && (
          <div className="denim-card p-6 space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div>
                <h2 className="text-base font-bold font-slab text-white">Rendimiento Académico del Alumno</h2>
                <p className="text-xs text-slate-400">
                  Boletín y calificaciones oficiales para {activeStudent?.name || 'el estudiante'}
                </p>
              </div>

              {activeStudent && (
                <button
                  onClick={() => {
                    setSelectedStudentForReport(activeStudent);
                    setReportCardModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Boletín Oficial</span>
                </button>
              )}
            </div>

            {/* Selector de estudiante */}
            <div className="max-w-md">
              <label className="block text-xs font-medium text-slate-300 mb-1">Seleccionar Representado</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white text-xs focus:border-[#DCB35C]"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade_year || s.gradeLevel} {s.section})
                  </option>
                ))}
              </select>
            </div>

            {studentGrades.length === 0 ? (
              <div className="p-10 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="font-bold text-slate-300 font-slab">No hay calificaciones publicadas aún</div>
                <p className="text-xs text-slate-500 mt-1">Los docentes registrarán las notas a medida que se cumpla el plan de evaluación.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studentGrades.map((g) => (
                  <div key={g.id} className="p-4 rounded-xl bg-[#101c30] border border-slate-700 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white font-slab">{g.subjectName || g.subject_name}</div>
                      <div className="text-slate-400">{g.evaluationTitle || g.evaluation_title || 'Evaluación'}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-[#f0c36d]">{g.score || g.nota} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: PROFILE */}
        {activeSubTab === 'profile' && (
          <div className="denim-card p-6 max-w-xl mx-auto space-y-4 animate-fade-in text-xs">
            <h2 className="text-base font-bold font-slab text-white border-b border-slate-700/60 pb-2">
              Ficha del Representante Legal
            </h2>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase">Nombre:</span>
                <strong className="text-white text-sm font-slab">{currentUser?.name}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase">Correo Registrado:</span>
                <strong className="text-white font-mono">{currentUser?.email}</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-700">
                <span className="text-slate-400 block text-[10px] uppercase">Teléfono de Contacto:</span>
                <strong className="text-white">{currentUser?.phone || 'No registrado'}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Report Card Modal */}
      {reportCardModalOpen && selectedStudentForReport && (
        <ReportCardModal
          student={selectedStudentForReport}
          grades={grades}
          subjects={subjects}
          onClose={() => setReportCardModalOpen(false)}
        />
      )}
    </div>
  );
}
