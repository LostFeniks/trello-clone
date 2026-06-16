import React, { useRef } from 'react';
import styles from './Card.module.css';

interface CardProps {
  id: string;
  text: string;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
}

export const Card: React.FC<CardProps> = ({
  id,
  text,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging,
  isDragOver
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    // Store the offset of the click relative to the card
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      e.dataTransfer.setData('text/plain', JSON.stringify({ 
        cardId: id, 
        offsetX, 
        offsetY 
      }));
    }
    onDragStart(e, id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`${styles.card} ${isDragging ? styles.dragging : ''} ${isDragOver ? styles.dragOver : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        onDragOver={(e) => onDragOver(e, id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, id)}
      >
        <span className={styles.text}>{text}</span>
        <button 
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Удалить карточку"
        >
          <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
        </button>
      </div>
    </>
  );
};