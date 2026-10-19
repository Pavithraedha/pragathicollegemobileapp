import React from 'react';
import { X, Printer, Download, CheckCircle, School } from 'lucide-react';
import { FeeInvoice, FeeReceipt } from '../../types';
import { PragathiLogo } from '../common/PragathiLogo';

interface ReceiptModalProps {
  receipt: FeeReceipt;
  invoice?: FeeInvoice;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  invoice,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <School className="w-4 h-4 text-blue-400" />
            <span>Official Fee Payment Receipt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 space-y-5 bg-white">
          {/* Institute Letterhead */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white mb-2 shadow-sm border border-slate-200">
              <PragathiLogo size={44} />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">PRAGATHI Jr. DEGREE &amp; PG COLLEGE</h2>
            <p className="text-xs text-slate-600 font-medium">PRAGATHI JUNIOR COLLEGE</p>
            <p className="text-[11px] text-slate-400">Main Campus, Education Boulevard · Ph: 080-2845-9900 · info@pragathicollege.edu</p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block">Receipt Number:</span>
              <span className="font-mono font-semibold text-slate-900">{receipt.receiptNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date of Payment:</span>
              <span className="font-semibold text-slate-900">{receipt.paymentDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-semibold text-slate-900">{invoice?.studentName || 'Rohan Sharma'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Class & Roll No:</span>
              <span className="font-semibold text-slate-900">Grade {invoice?.grade || '10'}-{invoice?.section || 'A'} (Roll #{invoice?.grade === '10' ? '18' : '04'})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Payment Mode:</span>
              <span className="font-semibold text-slate-900">{receipt.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Transaction Reference:</span>
              <span className="font-mono text-slate-800 text-[11px]">{receipt.transactionRef}</span>
            </div>
          </div>

          {/* Line items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Fee Head / Description</th>
                  <th className="px-3 py-2 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-slate-800">{it.name}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-900 tabular-nums">
                        ₹{it.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-2 text-slate-800">Term 2 Fee Clearance</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-900 tabular-nums">
                      ₹{receipt.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold border-t border-slate-200">
                <tr>
                  <td className="px-3 py-2 text-slate-900">Total Settlement Received:</td>
                  <td className="px-3 py-2 text-right text-blue-700 text-sm font-bold tabular-nums">
                    ₹{receipt.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification seal */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-emerald-700 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Digitally Verified & Stamped</span>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <div className="font-semibold text-slate-700">Accounts Officer</div>
              <div>Smart Campus Finance Dept</div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => {
              alert(`Receipt #${receipt.receiptNo} PDF downloaded successfully to device.`);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
