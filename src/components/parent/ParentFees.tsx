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
  FileText,
  Bus,
  MapPin,
  Phone,
  UserCheck
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

  // Transport fee calculation
  const totalTransportBilled = childInvoices.reduce((acc, curr) => acc + curr.transportFee, 0);
  const paidInvoices = childInvoices.filter((i) => i.status === 'paid');
  const paidTransport = paidInvoices.reduce((acc, curr) => acc + curr.transportFee, 0);
  const pendingTransport = totalTransportBilled - paidTransport;

  return (
    <div className="space-y-4 pb-20">
      {/* Top Fee Summary Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>School Fees &amp; Online Payments</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fee Ledger for {selectedChild.fullName} (Academic Year 2026-27)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Razorpay Direct Gateway Connected</span>
          </div>
        </div>

        {/* Aggregate KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Annual Billed</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">All Tuition, Transport &amp; Services</div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase">Total Amount Paid</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Verified By Treasury</div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-center">
            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold uppercase">Outstanding Balance</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-300 mt-1 tabular-nums">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">
              {totalBalance > 0 ? 'Due by 05 Nov 2026' : 'No Overdue Dues'}
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED TRANSPORT FEE & COLLEGE BUS SERVICE SECTION */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-2xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Bus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Campus Transport &amp; Bus Fee Details
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official transport allocation for {selectedChild.fullName}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 uppercase">
            Route #14 Active
          </span>
        </div>

        {/* Transport Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Term 1 Transport Fee</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded">
                Paid
              </span>
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">₹7,500</div>
            <div className="text-[10px] text-slate-400">Settled via NetBanking</div>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">Term 2 Transport Fee</span>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.2 rounded">
                Pending
              </span>
            </div>
            <div className="text-base font-bold text-amber-950 dark:text-amber-200 tabular-nums">₹7,500</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400">Included in Term 2 Invoice</div>
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-1">
            <span className="text-[11px] text-blue-800 dark:text-blue-300 font-medium block">Annual Transport Total</span>
            <div className="text-base font-bold text-blue-900 dark:text-blue-200 tabular-nums">₹15,000</div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400">₹7,500 Paid · ₹7,500 Due</div>
          </div>
        </div>

        {/* Bus Route Details Strip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Route 14: Jubilee Hills Road 36 → Campus Gate 2</span>
            </span>
            <span className="font-mono text-[11px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Bus: AP-28-TC-4042
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700">
            <span>Pickup: 07:45 AM (Jubilee Checkpost)</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>Driver: Mr. Ramana (+91 98480 12345)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
          Fee Invoices &amp; Breakdowns
        </h3>

        {childInvoices.map((inv) => {
          const isPending = inv.status === 'pending' || inv.status === 'overdue';
          return (
            <div
              key={inv.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-all"
            >
              {/* Invoice top bar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{inv.term}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : inv.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Invoice #{inv.invoiceNo} · Due Date: {inv.dueDate}
                  </div>
                </div>

                {isPending && (
                  <button
                    onClick={() => onOpenPayModal(inv.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Pay Balance ₹{inv.balanceAmount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Fee Component Breakdown with Transport Fee emphasized */}
              <div className="p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Detailed Fee Heads:</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Tuition Fee</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      ₹{inv.tuitionFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Transport Fee Head - Highlighted */}
                  <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                    <span className="text-blue-700 dark:text-blue-300 font-semibold block text-[11px] flex items-center gap-1">
                      <Bus className="w-3 h-3" />
                      <span>Transport Fee</span>
                    </span>
                    <span className="font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                      ₹{inv.transportFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Examination Fee</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      ₹{inv.examFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Hostel &amp; Mess</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      ₹{inv.hostelFee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Lab &amp; Library</span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      ₹{inv.labAndLibraryFee.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Progress bar of payment */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>
                      Paid: <strong className="text-emerald-700 dark:text-emerald-400">₹{inv.amountPaid.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>
                      Balance: <strong className="text-amber-800 dark:text-amber-300">₹{inv.balanceAmount.toLocaleString('en-IN')}</strong> of ₹{inv.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((inv.amountPaid / inv.totalAmount) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Verified Receipts for this Invoice */}
                {inv.receipts && inv.receipts.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Issued Payment Receipts ({inv.receipts.length})
                    </div>
                    <div className="space-y-1.5">
                      {inv.receipts.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">
                                Receipt #{rec.receiptNo} — ₹{rec.amount.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                Date: {rec.paymentDate} · Method: {rec.paymentMethod} ({rec.transactionRef})
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onOpenReceiptModal(rec, inv)}
                            className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold shadow-2xs transition-colors shrink-0 cursor-pointer"
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
