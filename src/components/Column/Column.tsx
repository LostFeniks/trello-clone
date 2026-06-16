import React from 'react';
import { Card } from '../Card/Card';
import { AddCard } from '../AddCard/AddCard';
import { Card as CardType } from '../../types';
import styles from './Column.module.css';

interface ColumnProps {
  id: string;
  title: string;
  cards: CardType[];
  onAddCard: (columnId: string, text: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string, sourceColumnId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, cardId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetCardId: string, targetColumnId: string) => void;
  draggingCardId: string | null;
  dragOverCardId: string | null;
  sourceColumnId: string | null;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  cards,
  onAddCard,
  onDeleteCard,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  draggingCardId,
  dragOverCardId,
  sourceColumnId
}) => {
  const handleAddCard = (text: string) => {
    onAddCard(id, text);
  };

  const handleDeleteCard = (cardId: string) => {
    onDeleteCard(id, cardId);
  };

  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    onDragStart(e, cardId, id);
  };

  const handleDrop = (e: React.DragEvent, cardId: string) => {
    onDrop(e, cardId, id);
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    // If dropped on empty column area (not on a card)
    if (cards.length === 0) {
      onDrop(e, 'empty', id);
    }
  };

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span>{title}</span>
        <span className={styles.cardCount}>{cards.length}</span>
      </div>
      <div 
        className={styles.cardsContainer}
        onDragOver={(e) => {
          e.preventDefault();
          // Allow dropping on empty column
          if (cards.length === 0) {
            e.dataTransfer.dropEffect = 'move';
          }
        }}
        onDrop={handleColumnDrop}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            onDelete={handleDeleteCard}
            onDragStart={handleCardDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleDrop}
            isDragging={draggingCardId === card.id}
            isDragOver={dragOverCardId === card.id && sourceColumnId !== id}
          />
        ))}
      </div>
      <AddCard onAdd={handleAddCard} />
    </div>
  );
};