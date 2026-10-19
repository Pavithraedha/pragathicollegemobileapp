import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Receipt,
  ShieldCheck,
  ArrowRight,
  FileText
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { FeeInvoice, FeeReceipt } from '../../types';

interface ParentFeesProps {
  onOpenPayModal: (invoiceId: string) => void;
  onOpenReceiptModal: (receipt: FeeReceipt, invoice: FeeInvoice) => void;
}

export const ParentFees: React.FC<ParentFeesProps> = ({
  onOpenPayModal,
  onOpenReceiptModal,
}) => {
  const { selectedChild, feeInvoices } = useCampus();

  const childInvoices = feeInvoices.filter((i) => i.studentId === selectedChild.id);

  // Financial aggregates
  const totalBilled = childInvoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = childInvoices.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const totalBalance = childInvoices.reduce((acc, curr) => acc + curr.balanceAmount, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Fee Summary Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>School Fees & Online Payments</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fee Ledger for {selectedChild.fullName} (Academic Year 2026-27)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Razorpay Direct Gateway Connected</span>
          </div>
        </div>

        {/* Aggregate KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Annual Billed</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">All Tuition, Lab & Services</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[11px] text-emerald-800 font-semibold uppercase">Total Amount Paid</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Verified By Treasury</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <div className="text-[11px] text-amber-800 font-semibold uppercase">Outstanding Balance</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-900 mt-1 tabular-nums">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
              {totalBalance > 0 ? 'Due by 05 Nov 2026' : 'No Overdue Dues'}
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Fee Invoices & Breakdowns
        </h3>

        {childInvoices.map((inv) => {
          const isPending = inv.status === 'pending' || inv.status === 'overdue';
          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Invoice top bar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{inv.term}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-900'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Invoice #{inv.invoiceNo} · Due Date: {inv.dueDate}
                  </div>
                </div>

                {isPending && (
                  <button
                    onClick={() => onOpenPayModal(inv.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    <span>Pay Balance ₹{inv.balanceAmount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Fee Component Breakdown */}
              <div className="p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-700">Detailed Fee Heads:</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Tuition Fee</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ₹{inv.tuitionFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Examination Fee</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ₹{inv.examFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Transport Fee</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ₹{inv.transportFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Hostel & Mess</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ₹{inv.hostelFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[11px]">Lab & Library</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      ₹{inv.labAndLibraryFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress bar of payment */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>
                      Paid: <strong className="text-emerald-700">₹{inv.amountPaid.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>
                      Balance: <strong className="text-amber-800">₹{inv.balanceAmount.toLocaleString('en-IN')}</strong> of ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((inv.amountPaid / inv.totalAmount) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Verified Receipts for this Invoice */}
                {inv.receipts && inv.receipts.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Issued Payment Receipts ({inv.receipts.length})
                    </div>
                    <div className="space-y-1.5">
                      {inv.receipts.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/40 border border-blue-100 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <Receipt className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <div className="font-semibold text-slate-900">
                                Receipt #{rec.receiptNo} — ₹{rec.amount.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                Date: {rec.paymentDate} · Method: {rec.paymentMethod} ({rec.transactionRef})
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onOpenReceiptModal(rec, inv)}
                            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
