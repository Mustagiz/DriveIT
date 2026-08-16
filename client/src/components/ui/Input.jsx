import React from 'react';
import styles from './Input.module.css';

export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) => {
  const inputClassNames = [
    styles.input,
    error ? styles.inputError : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input type={type} className={inputClassNames} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

export const Textarea = ({ label, error, helperText, className = '', ...props }) => {
  const textareaClassNames = [
    styles.textarea,
    error ? styles.inputError : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={textareaClassNames} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

export const Select = ({ label, error, helperText, children, className = '', ...props }) => {
  const selectClassNames = [
    styles.select,
    error ? styles.inputError : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={selectClassNames} {...props}>
        {children}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

export default Input;
