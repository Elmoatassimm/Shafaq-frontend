import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ success, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message && duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <div className="toast toast-top toast-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`alert ${
              success ? 'bg-green-100 text-green-800 border border-green-300' : 
                        'bg-red-100 text-red-800 border border-red-300'
            } shadow-lg relative flex items-center gap-3 px-4 py-3 rounded-lg`}
          >
            {success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
