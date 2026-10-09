import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
          isError
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : isInfo
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        )}
        <span className="flex-1">{toastMessage.msg}</span>
      </div>
    </div>
  );
}
