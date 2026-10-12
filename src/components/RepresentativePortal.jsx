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
  Calendar,
  DollarSign,
  FileText
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
    attendances,
    reportAbsence,
    institution,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments', 'grades', 'absences', 'profile'
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
  const bcvRate = Number(institution.bcvRate) || 48.50;

  // Requisito 7: Payment amounts in USD & VES with conversion and payment date
  const [rateForDate, setRateForDate] = useState(bcvRate);
  const [amountUSD, setAmountUSD] = useState('');
  const [amountVES, setAmountVES] = useState('');

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    concept: 'Mensualidad Escolar',
    paymentMethod: 'Pago Móvil Interbancario',
    amount: '',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const handleUSDChange = (val) => {
    setAmountUSD(val);
    if (!val || isNaN(val)) {
      setAmountVES('');
      setPaymentForm((prev) => ({ ...prev, amount: '' }));
    } else {
      const converted = (parseFloat(val) * rateForDate).toFixed(2);
      setAmountVES(converted);
      setPaymentForm((prev) => ({ ...prev, amount: val }));
    }
  };

  const handleVESChange = (val) => {
    setAmountVES(val);
    if (!val || isNaN(val)) {
      setAmountUSD('');
      setPaymentForm((prev) => ({ ...prev, amount: '' }));
    } else {
      const converted = (parseFloat(val) / rateForDate).toFixed(2);
      setAmountUSD(converted);
      setPaymentForm((prev) => ({ ...prev, amount: converted }));
    }
  };

  // Requisito 6: Representative absence reporting form
  const [absenceForm, setAbsenceForm] = useState({
    studentId: selectedStudentId || (myStudents[0]?.id || ''),
    date: new Date().toISOString().split('T')[0],
    reason: 'Cita médica / Reposo de salud',
    notes: ''
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
      amountVES: amountVES ? Number(amountVES) : (Number(paymentForm.amount) * rateForDate),
      rateUsed: rateForDate,
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
    setAmountUSD('');
    setAmountVES('');
    setReceiptPreview('');
  };

  // Requisito 6: Submit absence handler
  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    const st = students.find((s) => s.id === (absenceForm.studentId || selectedStudentId)) || activeStudent;
    if (!st) {
      notify('Selecciona el representado al que corresponde la falta', 'error');
      return;
    }

    await reportAbsence({
      studentId: st.id,
      studentName: st.name,
      gradeYear: `${st.grade_year || st.gradeLevel || '1er Año'} - ${st.section || 'A'}`,
      date: absenceForm.date,
      reason: absenceForm.reason,
      notes: absenceForm.notes
    });

    setAbsenceForm({
      studentId: st.id,
      date: new Date().toISOString().split('T')[0],
      reason: 'Cita médica / Reposo de salud',
      notes: ''
    });
  };

  // Student specific grades
  const studentGrades = grades.filter(
    (g) => g.studentId === activeStudent?.id || g.studentName === activeStudent?.name
  );

  // Represented absences
  const wardIds = myStudents.map((s) => s.id);
  const wardNames = myStudents.map((s) => s.name?.toLowerCase());
  const myWardAbsences = attendances.filter(
    (a) =>
      wardIds.includes(a.studentId) ||
      (a.studentName && wardNames.includes(a.studentName.toLowerCase())) ||
      a.reported_by === 'Representante Legal' ||
      (activeStudent && (a.studentId === activeStudent.id || a.studentName === activeStudent.name))
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
                {currentUser?.email} • U.E. Colegio Integral Venezuela • Código DEA: {institution.deaCode || 'PD11370304'}
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
            { id: 'payments', label: 'Reportar Pagos & Aranceles', icon: CreditCard },
            { id: 'absences', label: `Reporte de Faltas (${myWardAbsences.length})`, icon: Calendar },
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

        {/* ============================================================== */}
        {/* SUBTAB 1: PAYMENTS & BCV CALCULATOR (Requisito 7)              */}
        {/* ============================================================== */}
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
                  Calcula el monto exacto en bolívares y divisas según la tasa del día
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

                {/* Fecha del Pago y Tasa de Conversión (Requisito 7) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Fecha del Pago (Operación)</label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Tasa BCV Aplicada (Bs / USD)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={rateForDate}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value) || bcvRate;
                          setRateForDate(newRate);
                          if (amountUSD) setAmountVES((parseFloat(amountUSD) * newRate).toFixed(2));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setRateForDate(bcvRate);
                          if (amountUSD) setAmountVES((parseFloat(amountUSD) * bcvRate).toFixed(2));
                        }}
                        className="px-2.5 py-2 bg-[#223C63] hover:bg-[#1A2B45] text-[10px] text-[#f0c36d] rounded-xl border border-[#DCB35C]/40 whitespace-nowrap"
                        title="Restablecer a tasa oficial del plantel"
                      >
                        Oficial
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculadora Simultánea de Monto en Dólares y Bolívares (Requisito 7) */}
                <div className="p-3.5 rounded-xl bg-[#101c30] border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold font-slab text-[#f0c36d] flex items-center justify-between">
                    <span>Calculadora de Monto Equivalente:</span>
                    <span className="font-mono text-[10px] text-slate-400">1 USD = Bs. {rateForDate.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Monto en Dólares ($ USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Ej. 65.00"
                          value={amountUSD}
                          onChange={(e) => handleUSDChange(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#152338] border border-slate-700 text-white focus:border-[#DCB35C] font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Monto en Bolívares (Bs. VES)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">Bs.</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder={`Ej. ${(65 * rateForDate).toFixed(2)}`}
                          value={amountVES}
                          onChange={(e) => handleVESChange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#152338] border border-slate-700 text-white focus:border-[#DCB35C] font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Número de Referencia Bancaria</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 094812"
                    value={paymentForm.referenceNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C] font-mono"
                  />
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

            {/* Datos Bancarios y Tasa BCV (Requisito 7 & Requisito 2) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="denim-card p-6 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-slab text-[#f0c36d] uppercase tracking-wider">
                    Datos del Pago Móvil y Banco
                  </h3>
                  <span className="denim-patch px-2 py-0.5 text-[10px] text-emerald-400 font-mono">
                    Canal Oficial
                  </span>
                </div>

                {/* Tasa Oficial BCV Prominente */}
                <div className="p-3 bg-gradient-to-r from-[#1A2B45] to-[#223C63] rounded-xl border border-[#DCB35C]/60 flex items-center justify-between shadow-inner">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#DCB35C] block">
                      Tasa Oficial del Dólar BCV
                    </span>
                    <span className="text-lg font-black font-mono text-white tracking-tight">
                      Bs. {bcvRate.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ USD</span>
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#DCB35C]/20 text-[#f0c36d] text-[10px] font-bold font-mono">
                    Banco Central
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-2 font-mono p-3.5 bg-[#101c30] rounded-xl border border-slate-700">
                  <div><strong>Banco:</strong> Banesco Banco Universal (0134)</div>
                  <div><strong>Cuenta Corriente:</strong> 0134-0374-91-3741029384</div>
                  <div><strong>Pago Móvil:</strong> Banesco (0134)</div>
                  <div><strong>RIF:</strong> J-30491823-1</div>
                  <div><strong>Teléfonos Oficiales:</strong> 0416-6802168 / 0412-8637615</div>
                  <div><strong>Titular:</strong> U.E. Colegio Integral Venezuela</div>
                  <div><strong>Correo Pagos:</strong> integralvenezuela@gmail.com</div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  * Nota: Los pagos en bolívares se calculan a la tasa oficial del Banco Central de Venezuela (BCV) de la fecha valor de la operación.
                </p>
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
                          <div className="text-[11px] text-slate-400 font-mono">
                            Ref: {p.referenceNumber || p.reference_number} • ${p.amount} {p.paymentDate && `(${p.paymentDate})`}
                          </div>
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

        {/* ============================================================== */}
        {/* SUBTAB 2: REPORTE DE FALTAS Y JUSTIFICACIONES (Requisito 6)    */}
        {/* ============================================================== */}
        {activeSubTab === 'absences' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Formulario de Reporte de Falta por el Representante */}
            <div className="lg:col-span-5 denim-card p-6 space-y-4">
              <div className="border-b border-slate-700/60 pb-3">
                <h2 className="text-base font-bold font-slab text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#DCB35C]" />
                  <span>Reportar Falta de Representado</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Los representantes notifican las inasistencias para su justificación oficial
                </p>
              </div>

              <form onSubmit={handleAbsenceSubmit} className="space-y-3.5 text-xs">
                {/* Selector de Representado */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Representado (Alumno)</label>
                  <select
                    required
                    value={absenceForm.studentId}
                    onChange={(e) => setAbsenceForm({ ...absenceForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade_year || s.gradeLevel} - {s.section || 'A'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fecha de la Falta */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Fecha de la Inasistencia</label>
                  <input
                    type="date"
                    required
                    value={absenceForm.date}
                    onChange={(e) => setAbsenceForm({ ...absenceForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  />
                </div>

                {/* Motivo de la Inasistencia */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Motivo Principal</label>
                  <select
                    value={absenceForm.reason}
                    onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white focus:border-[#DCB35C]"
                  >
                    <option value="Cita médica / Reposo de salud">Cita médica / Reposo de salud</option>
                    <option value="Motivos de salud / Reposo en casa">Motivos de salud / Reposo en casa</option>
                    <option value="Motivos familiares de fuerza mayor">Motivos familiares de fuerza mayor</option>
                    <option value="Trámites de identidad / Legales">Trámites de identidad / Legales</option>
                    <option value="Diligencia justificada">Diligencia justificada</option>
                  </select>
                </div>

                {/* Observaciones adicionales */}
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Detalles o Justificación</label>
                  <textarea
                    rows={3}
                    placeholder="Ej. Consulta con pediatra en la mañana, reposo por 24 horas..."
                    value={absenceForm.notes}
                    onChange={(e) => setAbsenceForm({ ...absenceForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#101c30] border border-slate-700 text-white placeholder-slate-500 focus:border-[#DCB35C]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-[#DCB35C] to-[#f0c36d] text-[#1A2B45] font-bold font-slab rounded-xl shadow-md transition cursor-pointer"
                >
                  Registrar y Justificar Falta
                </button>
              </form>
            </div>

            {/* Historial de Faltas Reportadas con Fecha y Representado (Requisito 6) */}
            <div className="lg:col-span-7 denim-card p-6 space-y-4">
              <div className="border-b border-slate-700/60 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-slab text-white">Historial de Faltas y Justificaciones</h3>
                  <p className="text-xs text-slate-400">
                    Inasistencias registradas donde se especifica claramente la fecha y el alumno representado
                  </p>
                </div>
              </div>

              {myWardAbsences.length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-[#101c30] border-stitch-subtle">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="font-bold text-slate-300 font-slab">No hay inasistencias reportadas</div>
                  <p className="text-xs text-slate-500 mt-1">Tus representados tienen asistencia regular al 100%.</p>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  {myWardAbsences.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl bg-[#101c30] border border-slate-700/80 hover:border-[#DCB35C]/40 transition space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-white font-slab text-sm">
                              {att.studentName || att.student_name}
                            </strong>
                            <span className="denim-patch px-2 py-0.5 text-[10px] text-[#f0c36d]">
                              {att.grade_year || 'Media General'}
                            </span>
                          </div>
                          <div className="text-slate-300 text-xs mt-1">
                            Motivo: <span className="text-white font-medium">{att.reason || 'Inasistencia justificada'}</span>
                          </div>
                        </div>

                        <div className="text-right sm:text-right">
                          <span className="denim-patch px-2.5 py-1 text-[11px] font-mono text-white block">
                            Fecha: {att.date}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-block">
                            Justificada por Representante
                          </span>
                        </div>
                      </div>

                      {att.notes && (
                        <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                          "{att.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 3: GRADES & REPORT CARD */}
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

        {/* SUBTAB 4: PROFILE */}
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
