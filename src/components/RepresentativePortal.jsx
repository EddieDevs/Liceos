import React, { useState } from 'react';
import {
  CreditCard,
  FileText,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  DollarSign,
  ChevronRight,
  BookOpen,
  Printer,
  ShieldCheck,
  Send,
  User,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RepresentativePortal() {
  const {
    currentUser,
    representative,
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

  // Representative's wards (children)
  const myStudents = students.filter(
    (s) => s.representativeId === (currentUser?.id || representative.id) || s.name.includes('Valeria')
  );
  const activeStudent = myStudents[0] || students[0];

  // Payments form state
  const [paymentForm, setPaymentForm] = useState({
    studentId: activeStudent.id,
    studentName: activeStudent.name,
    studentGrade: activeStudent.gradeLevel,
    concept: 'Mensualidad Noviembre 2024',
    paymentMethod: 'Pago Móvil',
    amount: 60.00,
    currency: 'USD',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    receiptUrl: '',
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.referenceNumber.trim()) {
      notify('Por favor introduce el número de referencia bancaria', 'error');
      return;
    }

    await addPayment({
      studentId: paymentForm.studentId,
      studentName: paymentForm.studentName,
      studentGrade: paymentForm.studentGrade,
      paymentConcept: paymentForm.concept,
      paymentMethod: paymentForm.paymentMethod,
      amount: Number(paymentForm.amount),
      currency: paymentForm.currency,
      referenceNumber: paymentForm.referenceNumber,
      paymentDate: paymentForm.paymentDate,
      receiptUrl: paymentForm.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    });

    setPaymentForm({
      ...paymentForm,
      referenceNumber: '',
      receiptUrl: '',
      concept: 'Mensualidad Diciembre 2024'
    });
  };

  // Filter student grades
  const studentGrades = grades.filter(
    (g) => g.studentId === activeStudent.id || g.studentName === activeStudent.name
  );

  // Filter student attendances
  const studentAtts = attendances.filter(
    (a) => a.studentId === activeStudent.id || a.studentName === activeStudent.name
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <button onClick={() => setActiveTab('home')} className="hover:text-white transition">
              Inicio
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">Portal de Padres y Representantes</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar || representative.avatar}
                alt="Representante"
                className="w-16 h-16 rounded-xl object-cover border border-slate-600"
              />
              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-400/20 inline-block mb-1">
                  Representante Titular
                </span>
                <h1 className="text-2xl font-bold font-heading text-white">
                  {currentUser?.name || representative.name}
                </h1>
                <p className="text-xs text-slate-300">
                  C.I. {representative.idNumber} • Representado: <strong className="text-white">{activeStudent.name}</strong> ({activeStudent.gradeLevel})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                <div className="text-lg font-bold text-white font-heading">
                  {activeStudent.overallAverage} pts
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Promedio Hijo</div>
              </div>
              <div className="bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-700 text-center">
                <div className="text-lg font-bold text-emerald-400 font-heading">Solvente</div>
                <div className="text-[10px] text-slate-400 uppercase">Estado Pagos</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1 flex gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'payments'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gestión de Pagos y Comprobantes</span>
          </button>

          <button
            onClick={() => setActiveSubTab('grades')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'grades'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Boletín de Notas del Representado</span>
          </button>

          <button
            onClick={() => setActiveSubTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'attendance'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Asistencias y Faltas ({studentAtts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition shrink-0 ${
              activeSubTab === 'profile'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos de Contacto y Emergencia</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: PAYMENTS */}
        {activeSubTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Formulario para registrar pago */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 font-heading">
                  Registrar Pago o Transferencia
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Envía el número de referencia y soporte bancario para su verificación
              </p>

              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Alumno Representado</label>
                  <select
                    value={paymentForm.studentId}
                    onChange={(e) => {
                      const st = students.find((s) => s.id === e.target.value);
                      setPaymentForm({
                        ...paymentForm,
                        studentId: e.target.value,
                        studentName: st?.name || '',
                        studentGrade: st?.gradeLevel || ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    {myStudents.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.gradeLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Concepto de Pago</label>
                  <select
                    value={paymentForm.concept}
                    onChange={(e) => setPaymentForm({ ...paymentForm, concept: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Mensualidad Octubre 2024">Mensualidad Octubre 2024</option>
                    <option value="Mensualidad Noviembre 2024">Mensualidad Noviembre 2024</option>
                    <option value="Mensualidad Diciembre 2024">Mensualidad Diciembre 2024</option>
                    <option value="Matrícula y Seguro Escolar">Matrícula y Seguro Escolar</option>
                    <option value="Constancia de Estudio / Notas">Constancia de Estudio / Notas</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Método de Pago</label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Pago Móvil">Pago Móvil (Banesco/Mercantil)</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Efectivo Divisas">Efectivo Divisas en Caja</option>
                      <option value="Punto de Venta">Punto de Venta en Sede</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Monto ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Nº de Referencia / Comprobante</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 0102-948102"
                      value={paymentForm.referenceNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Fecha de la Operación</label>
                    <input
                      type="date"
                      required
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Enlace o Captura de Comprobante (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://... captura de pago"
                    value={paymentForm.receiptUrl}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiptUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Reportar Pago a Administración</span>
                </button>
              </form>
            </div>

            {/* Listado de Pagos Realizados */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm font-heading">
                  Historial de Pagos y Estado de Cuenta
                </h3>
                <span className="text-xs text-slate-500">{payments.length} transacciones</span>
              </div>

              <div className="space-y-3">
                {payments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{p.paymentConcept}</span>
                        <span className="text-slate-500 font-mono">#{p.referenceNumber}</span>
                      </div>
                      <div className="text-slate-600">
                        {p.paymentMethod} • Fecha: {p.paymentDate}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Estudiante: <strong className="text-slate-700">{p.studentName}</strong>
                      </div>
                      {p.adminNotes && (
                        <div className="text-[11px] text-slate-500 mt-1 italic">
                          Nota del colegio: "{p.adminNotes}"
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-bold text-slate-900 font-heading">
                        ${Number(p.amount).toFixed(2)} {p.currency}
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                          p.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
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
            </div>
          </div>
        )}

        {/* TAB 2: GRADES VIEW */}
        {activeSubTab === 'grades' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-heading text-slate-900">
                  Calificaciones de {activeStudent.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Año Escolar 2024-2025 • {activeStudent.gradeLevel}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Boletín Oficial</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Materia</th>
                    <th className="py-3 px-3">Evaluación</th>
                    <th className="py-3 px-3">Lapso</th>
                    <th className="py-3 px-3 text-center">Nota</th>
                    <th className="py-3 px-3 text-center">Ponderación</th>
                    <th className="py-3 px-3">Observaciones Docente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map((gr) => (
                    <tr key={gr.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{gr.subjectName}</td>
                      <td className="py-3 px-3 text-slate-700">{gr.evaluationTitle}</td>
                      <td className="py-3 px-3 text-slate-500">{gr.term}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          {gr.score} / {gr.maxScore || 20}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-slate-600">
                        {gr.percentage}%
                      </td>
                      <td className="py-3 px-3 text-slate-500 italic">{gr.comments || 'Sin comentarios'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE */}
        {activeSubTab === 'attendance' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold font-heading text-slate-900">
              Notificaciones de Asistencia e Inasistencias
            </h2>
            <p className="text-xs text-slate-500">
              Registro transmitido por la coordinación del Colegio Integral Venezuela
            </p>

            <div className="space-y-3 pt-2">
              {studentAtts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 italic">
                  Tu representado no tiene inasistencias registradas.
                </div>
              ) : (
                studentAtts.map((att) => (
                  <div
                    key={att.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {att.subject} • {att.date}
                      </div>
                      <div className="text-slate-600 mt-0.5">{att.notes}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {att.statusLabel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeSubTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-2xl">
            <h2 className="text-lg font-bold font-heading text-slate-900">
              Ficha del Representante Legal
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-0.5">Nombre Completo</label>
                <div className="font-bold text-slate-800">{currentUser?.name || representative.name}</div>
              </div>
              <div>
                <label className="text-slate-400 block mb-0.5">Cédula de Identidad</label>
                <div className="font-bold text-slate-800">{representative.idNumber}</div>
              </div>
              <div>
                <label className="text-slate-400 block mb-0.5">Teléfono Principal</label>
                <div className="font-bold text-slate-800">{representative.phone}</div>
              </div>
              <div>
                <label className="text-slate-400 block mb-0.5">Correo Registrado</label>
                <div className="font-bold text-slate-800">{currentUser?.email || representative.email}</div>
              </div>
              <div className="col-span-2">
                <label className="text-slate-400 block mb-0.5">Dirección de Domicilio</label>
                <div className="font-bold text-slate-800">{representative.address}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
