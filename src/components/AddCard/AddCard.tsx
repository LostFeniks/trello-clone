import React, { useState, useRef, useEffect } from 'react';
import styles from './AddCard.module.css';

interface AddCardProps {
  onAdd: (text: string) => void;
}

export const AddCard: React.FC<AddCardProps> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAdd(trimmedText);
      setText('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <div className={styles.addCardContainer}>
        <form onSubmit={handleSubmit} className={styles.addCardForm}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите текст карточки..."
            rows={2}
          />
          <div className={styles.addCardActions}>
            <button type="submit" className={styles.addCardSubmit}>
              Добавить
            </button>
            <button type="button" onClick={handleCancel} className={styles.addCardCancel}>
              <span className="material-icons" style={{ fontSize: '24px' }}>close</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.addCardContainer}>
      <button 
        className={styles.addCardButton} 
        onClick={() => setIsAdding(true)}
      >
        <span className="material-icons" style={{ fontSize: '20px' }}>add</span>
        Добавить карточку
      </button>
    </div>
  );
};