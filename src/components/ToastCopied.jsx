import React from 'react';

const ToastCopied = ({ visible = false }) => {
  if (!visible) return null;
  return <div className="copied-toast">Código copiado ✅</div>;
};

export default ToastCopied;
