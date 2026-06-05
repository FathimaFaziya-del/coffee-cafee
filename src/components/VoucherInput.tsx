/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Voucher } from '../types';
import { VALID_VOUCHERS } from '../data';

interface VoucherInputProps {
  onApplyVoucher: (voucher: Voucher | null) => void;
  appliedVoucher: Voucher | null;
}

export default function VoucherInput({ onApplyVoucher, appliedVoucher }: VoucherInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    setError(null);

    // Simulate validation request with a brief 600ms transition to match the smooth micro-interactions
    setTimeout(() => {
      const match = VALID_VOUCHERS.find(
        (v) => v.code.toUpperCase() === code.trim().toUpperCase()
      );

      if (match) {
        onApplyVoucher(match);
        setCode('');
      } else {
        setError('Invalid voucher code. Try "COFFEE10" or "WELCOME5".');
      }
      setIsSubmitting(false);
    }, 600);
  };

  const handleRemove = () => {
    onApplyVoucher(null);
    setError(null);
  };

  return (
    <div id="voucher-input-container" className="w-full">
      <AnimatePresence mode="wait">
        {!appliedVoucher ? (
          <motion.form
            id="voucher-form"
            key="input-form"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="flex items-center justify-between border border-neutral-200 bg-white rounded-2xl px-5 py-4 w-full transition-all duration-300 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400/20"
          >
            <div className="flex items-center gap-4 flex-1">
              <Ticket id="ticket-icon" className="w-6 h-6 text-neutral-400 stroke-[1.5]" />
              <input
                id="voucher-text-input"
                type="text"
                placeholder="Enter voucher code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isSubmitting}
                className="w-full text-base font-sans text-neutral-800 placeholder-neutral-400 bg-transparent outline-none border-none py-1 focus:outline-none"
              />
            </div>
            
            <button
              id="voucher-submit-btn"
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="text-sm font-medium text-neutral-900 hover:text-neutral-600 disabled:text-neutral-300 underline underline-offset-4 cursor-pointer transition-colors duration-200 px-1 py-1 shrink-0"
            >
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </button>
          </motion.form>
        ) : (
          <motion.div
            id="applied-voucher-badge"
            key="success-badge"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between border border-emerald-100 bg-emerald-50/40 rounded-2xl px-5 py-4 w-full"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-sm font-semibold tracking-wide text-emerald-800 font-mono">
                  {appliedVoucher.code}
                </span>
                <span className="text-xs text-emerald-600 block sm:inline sm:ml-2">
                  Applied ({appliedVoucher.description})
                </span>
              </div>
            </div>
            <button
              id="remove-voucher-btn"
              type="button"
              onClick={handleRemove}
              className="text-xs font-medium text-neutral-500 hover:text-red-500 underline underline-offset-2 transition-colors duration-200"
            >
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            id="voucher-error-msg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-rose-600 mt-2 pl-1 overflow-hidden"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs font-sans font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
