import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, QrCode, CreditCard, Building2, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { FeeInvoice, FeeReceipt } from '../../types';

interface RazorpayModalProps {
  invoice: FeeInvoice;
  onClose: () => void;
  onSuccess: (receipt: FeeReceipt) => void;
  processPayment: (
    invoiceId: string,
    amount: number,
    paymentMethod: 'UPI' | 'Card' | 'NetBanking',
    referenceId: string
  ) => FeeReceipt;
}

export const RazorpayPaymentModal: React.FC<RazorpayModalProps> = ({
  invoice,
  onClose,
  onSuccess,
  processPayment,
}) => {
  const [method, setMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('parent@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<FeeReceipt | null>(null);

  const amountToPay = invoice.balanceAmount > 0 ? invoice.balanceAmount : invoice.totalAmount;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate real 1.5s gateway round-trip with secure callback verification
    setTimeout(() => {
      const txnRef = `PAYZ-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const receipt = processPayment(invoice.id, amountToPay, method, txnRef);
      setIsProcessing(false);
      setCompletedReceipt(receipt);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Razorpay Gateway Top Bar */}
        <div className="bg-[#0c2340] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight">Smart Campus Online Fees</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-mono">TEST GATEWAY</span>
              </div>
              <p className="text-xs text-slate-300">Verified School Merchant Account</p>
            </div>
          </div>
          {!isProcessing && !completedReceipt && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Amount Strip */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">Invoice: {invoice.invoiceNo}</div>
            <div className="text-xs font-medium text-slate-700">{invoice.studentName} ({invoice.term})</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Amount Payable</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{amountToPay.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {completedReceipt ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your payment of <strong className="text-slate-900">₹{completedReceipt.amount.toLocaleString('en-IN')}</strong> has been received by Smart Campus Treasury.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Receipt No:</span>
                  <span className="font-mono text-slate-800">{completedReceipt.receiptNo}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Transaction Ref:</span>
                  <span className="font-mono text-slate-800">{completedReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Method:</span>
                  <span className="text-slate-800">{completedReceipt.paymentMethod}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onSuccess(completedReceipt);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
              >
                View Official Receipt
              </button>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Securing payment with your bank...</p>
                <p className="text-xs text-slate-500 mt-1">Please do not refresh or close this window</p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Encrypted Session</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      method === 'UPI'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-xs font-medium block">UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('Card')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      method === 'Card'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                    <span className="text-xs font-medium block">Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('NetBanking')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      method === 'NetBanking'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span className="text-xs font-medium block">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {method === 'UPI' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800">Scan & Pay via any UPI App</div>
                      <div className="text-[11px] text-slate-500">GPay, PhonePe, Paytm, CRED or BHIM</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Or enter UPI VPA</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              )}

              {method === 'Card' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-600 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="•••"
                        maxLength={3}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'NetBanking' && (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="text-[11px] font-medium text-slate-600 block">Choose Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Pay ₹{amountToPay.toLocaleString('en-IN')} Securely</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Simulated Indian Payment Gateway · PCI-DSS Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
