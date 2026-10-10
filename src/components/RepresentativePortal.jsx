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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ReportCardModal from './ReportCardModal';
import { readFileAsDataURL } from '../lib/fileUpload';

export default function RepresentativePortal() {
  const {
    currentUser,
    updateUserProfile,
    students,
    grades,
    subjects,
    payments,
    addPayment,
    attendances,
    setActiveTab,
    notify
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payments'); // 'payments', 'grades', 'attendance', 'profile'
  const [reportCardModalOpen, setReportCardModalOpen] = useState(false);

  // Wards (represented students)
  const myStudents = students.filter(
    (s) => s.representativeId === currentUser?.id || s.representativeEmail === currentUser?.email
  );
  const activeStudent = myStudents[0] || null;

  // Receipt File upload state
  const receiptFileInputRef = useRef(null);
  const [receiptPreview, setReceiptPreview] = useState('');

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    studentId: activeStudent?.id || '',
    studentName: activeStudent?.name || '',
    studentGrade: activeStudent?.gradeLevel || '4to Año',
    concept: 'Mensualidad Escolar',
    paymentMethod: 'Pago Móvil',
    amount: 0,
    currency: 'USD',
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

    await addPayment({
      representativeId: currentUser?.id || 'rep-anon',
      representativeName: currentUser?.name || 'Representante',
      studentId: paymentForm.studentId || (activeStudent?.id || 'sin-alumno'),
      studentName: paymentForm.studentName || (activeStudent?.name || 'Alumno sin asignar'),
      studentGrade: paymentForm.studentGrade || (activeStudent?.gradeLevel || 'Bachillerato'),
      paymentConcept: paymentForm.concept,
      paymentMethod: paymentForm.paymentMethod,
      amount: Number(paymentForm.amount),
      currency: paymentForm.currency,
      referenceNumber: paymentForm.referenceNumber,
      paymentDate: paymentForm.paymentDate,
      receiptUrl: receiptPreview || ''
    });

    setPaymentForm({
      ...paymentForm,
      referenceNumber: '',
      amount: 0
    });
    setReceiptPreview('');
  };

  // Student specific grades
  const studentGrades = activeStudent
    ? grades.filter((g) => g.studentId === activeStudent.id || g.studentName === activeStudent.name)
    : [];

  // Student attendances
  const studentAtts = activeStudent
    ? attendances.filter((a) => a.studentId === activeStudent.id || a.studentName === activeStudent.name)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Portal de Padres y Representantes</span>
          </div>

          <div className="glass-surface p-6 sm:p-7 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-8 h-8" />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold border border-emerald-400/20 inline-block mb-1">
                  Representante Titular
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                  {currentUser?.name || 'Representante Legal'}
                </h1>
                <p className="text-xs text-slate-400">
                  {currentUser?.email || 'Sin correo asignado'} • Representados: <strong className="text-white">{activeStudent ? activeStudent.name : '0 asignados'}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-center w-full md:w-auto">
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-white">
                  {activeStudent ? `${activeStudent.overallAverage || '0.0'} pts` : '0'}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Promedio Hijo</div>
              </div>
              <div className="glass-surface-subtle px-4 py-2.5 rounded-xl text-center">
                <div className="text-xl font-bold font-heading text-emerald-400">
                  {payments.filter((p) => p.status === 'approved').length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Pagos Solvente</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="glass-surface rounded-xl p-1 flex gap-1 overflow-x-auto text-xs font-semibold shadow-md">
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'payments' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gestión de Pagos y Comprobantes</span>
          </button>

          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Boletín de Notas del Alumno</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Asistencias y Faltas ({studentAtts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Ficha del Representante</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUBTAB 1: PAYMENTS */}
        {activeSubTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario de Pago */}
            <div className="lg:col-span-5 glass-card p-6 sm:p-7 rounded-2xl">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold font-heading text-white">
                  Reportar Pago o Transferencia
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-5">
                Carga directamente el soporte bancario para su verificación
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Alumno Representado</label>
                  {myStudents.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                      Sin alumnos asociados en este momento
                    </div>
                  ) : (
                    <select
                      value={paymentForm.studentId}
                      onChange={(e) => {
                        const st = myStudents.find((s) => s.id === e.target.value);
                        setPaymentForm({
                          ...paymentForm,
                          studentId: e.target.value,
                          studentName: st?.name || '',
                          studentGrade: st?.gradeLevel || ''
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      {myStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.gradeLevel || 'Bachillerato'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Concepto de Pago</label>
                  <select
                    value={paymentForm.concept}
                    onChange={(e) => setPaymentForm({ ...paymentForm, concept: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Mensualidad Escolar">Mensualidad Escolar</option>
                    <option value="Matrícula y Seguro Escolar">Matrícula y Seguro Escolar</option>
                    <option value="Constancia de Notas / Estudio">Constancia de Notas / Estudio</option>
                    <option value="Trámite Administrativo">Trámite Administrativo</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Método de Pago</label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Pago Móvil">Pago Móvil</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Efectivo Divisas">Efectivo Divisas en Sede</option>
                      <option value="Punto de Venta">Punto de Venta en Sede</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Monto ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Nº de Referencia</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 0102-849201"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Fecha de la Operación</label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Direct Comprobante Upload Button */}
                <div>
                  <label className="block text-slate-400 mb-1">Comprobante / Captura Bancaria</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => receiptFileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-white font-medium flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      <span>Subir Comprobante Directamente</span>
                    </button>
                    <input
                      type="file"
                      ref={receiptFileInputRef}
                      accept="image/*,.pdf"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                    {receiptPreview && (
                      <span className="text-[11px] text-emerald-400 font-medium">Archivo cargado</span>
                    )}
                  </div>

                  {receiptPreview && (
                    <div className="mt-2 h-24 rounded-lg overflow-hidden border border-slate-700">
                      <img src={receiptPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-xs transition"
                >
                  Enviar Pago a Administración
                </button>
              </form>
            </div>

            {/* Listado de Pagos */}
            <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm font-heading">
                  Historial de Pagos y Estado de Cuenta
                </h3>
                <span className="text-xs text-slate-400">{payments.length} transacciones</span>
              </div>

              {payments.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-500 italic">
                  No hay pagos reportados en la plataforma.
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{p.paymentConcept}</span>
                          <span className="text-slate-400 font-mono text-[11px]">#{p.referenceNumber}</span>
                        </div>
                        <div className="text-slate-400">
                          {p.paymentMethod} • Fecha: {p.paymentDate}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Alumno: {p.studentName || 'Sin asignar'}
                        </div>
                        {p.admin_notes && (
                          <div className="text-[11px] text-slate-400 mt-1 italic">
                            Nota de Dirección: "{p.admin_notes}"
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-white font-heading">
                          ${Number(p.amount).toFixed(2)} {p.currency}
                        </div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                            p.status === 'approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : p.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {p.status === 'approved'
                            ? 'Aprobado y Solvente'
                            : p.status === 'rejected'
                            ? 'Rechazado'
                            : 'En Verificación'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 2: GRADES */}
        {activeSubTab === 'grades' && (
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold font-heading text-white">
                  Boletín del Alumno: {activeStudent?.name || 'Sin alumno asignado'}
                </h2>
                <p className="text-xs text-slate-400">
                  Año Escolar 2024-2025 • {activeStudent?.gradeLevel || 'Bachillerato'}
                </p>
              </div>

              {activeStudent && (
                <button
                  onClick={() => setReportCardModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Boletín Oficial</span>
                </button>
              )}
            </div>

            {!activeStudent ? (
              <div className="p-10 text-center text-xs text-slate-500 italic">
                No tienes representados vinculados actualmente en la base de datos.
              </div>
            ) : studentGrades.length === 0 ? (
              <div className="p-10 text-center text-xs text-slate-500 italic">
                No hay calificaciones cargadas aún para tu representado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Materia</th>
                      <th className="py-2.5 px-3">Evaluación</th>
                      <th className="py-2.5 px-3">Lapso</th>
                      <th className="py-2.5 px-3 text-center">Nota</th>
                      <th className="py-2.5 px-3 text-center">Ponderación</th>
                      <th className="py-2.5 px-3">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {studentGrades.map((gr) => (
                      <tr key={gr.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-bold text-white">{gr.subjectName}</td>
                        <td className="py-3 px-3 text-slate-200">{gr.evaluationTitle}</td>
                        <td className="py-3 px-3 text-slate-400">{gr.term}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded">
                            {gr.score} / {gr.maxScore || 20}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 font-medium">{gr.percentage}%</td>
                        <td className="py-3 px-3 text-slate-400 italic">{gr.comments || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-4">
            <h2 className="text-base font-bold font-heading text-white">
              Notificaciones de Asistencia y Faltas
            </h2>
            {studentAtts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                Tu representado no tiene inasistencias reportadas en la institución.
              </div>
            ) : (
              <div className="space-y-3">
                {studentAtts.map((att) => (
                  <div key={att.id} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{att.subject} • {att.date}</div>
                      <div className="text-slate-400 mt-0.5">{att.notes}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      {att.statusLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: PROFILE */}
        {activeSubTab === 'profile' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-6 max-w-2xl">
            <h2 className="text-base font-bold font-heading text-white">Ficha del Representante Legal</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 block mb-0.5">Nombre Completo</label>
                <div className="font-bold text-white text-sm">{currentUser?.name || 'Representante'}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Correo Electrónico</label>
                <div className="font-bold text-white text-sm">{currentUser?.email || 'Sin correo'}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Alumno Vinculado</label>
                <div className="font-bold text-white text-sm">{activeStudent?.name || 'Sin alumno asignado'}</div>
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Sede Escolar</label>
                <div className="font-bold text-white text-sm">Colinas del Neverí, Barcelona</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Card Modal */}
      {reportCardModalOpen && activeStudent && (
        <ReportCardModal
          student={activeStudent}
          grades={grades}
          subjects={subjects}
          onClose={() => setReportCardModalOpen(false)}
        />
      )}
    </div>
  );
}
