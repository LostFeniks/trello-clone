import React, { useState, useCallback, useEffect } from 'react';
import { Column } from '../Column/Column';
import { BoardState, Card } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './Board.module.css';

const INITIAL_STATE: BoardState = {
  columns: [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: 'card-1', text: 'Изучить React' },
        { id: 'card-2', text: 'Создать проект' }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      cards: [
        { id: 'card-3', text: 'Написать код' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: 'card-4', text: 'Завершить ДЗ' }
      ]
    }
  ]
};

export const Board: React.FC = () => {
  const [state, setState] = useLocalStorage<BoardState>('trello-board', INITIAL_STATE);
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);

  const addCard = useCallback((columnId: string, text: string) => {
    setState((prev: BoardState) => ({
      ...prev,
      columns: prev.columns.map((col) => 
        col.id === columnId 
          ? { 
              ...col, 
              cards: [
                ...col.cards, 
                { 
                  id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
                  text 
                }
              ] 
            }
          : col
      )
    }));
  }, [setState]);

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setState((prev: BoardState) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card: Card) => card.id !== cardId) }
          : col
      )
    }));
  }, [setState]);

  const handleDragStart = useCallback((e: React.DragEvent, cardId: string, columnId: string) => {
    setDraggingCardId(cardId);
    setSourceColumnId(columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    const dragData = JSON.stringify({ cardId, columnId });
    e.dataTransfer.setData('text/plain', dragData);
    
    // Правильное вычисление смещения курсора
    const ghost = e.target as HTMLElement;
    if (ghost) {
      const rect = ghost.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      // Устанавливаем изображение-призрак с правильным смещением
      e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggingCardId(null);
    setDragOverCardId(null);
    setSourceColumnId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggingCardId !== cardId) {
      setDragOverCardId(cardId);
    }
  }, [draggingCardId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCardId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetCardId: string, targetColumnId: string) => {
    e.preventDefault();
    setDragOverCardId(null);

    let dragData: { cardId: string; columnId: string };
    try {
      const data = e.dataTransfer.getData('text/plain');
      dragData = JSON.parse(data);
    } catch {
      return;
    }

    const { cardId, columnId: sourceColId } = dragData;

    if (cardId === targetCardId && sourceColId === targetColumnId) {
      return;
    }

    setState((prev: BoardState) => {
      let sourceCard: Card | null = null;
      let sourceColumnIndex = -1;
      let sourceCardIndex = -1;

      prev.columns.forEach((col, colIdx) => {
        if (col.id === sourceColId) {
          const cardIdx = col.cards.findIndex((c: Card) => c.id === cardId);
          if (cardIdx !== -1) {
            sourceCard = col.cards[cardIdx];
            sourceColumnIndex = colIdx;
            sourceCardIndex = cardIdx;
          }
        }
      });

      if (!sourceCard) return prev;

      const newColumns = prev.columns.map((col) => ({
        ...col,
        cards: [...col.cards]
      }));

      if (sourceColumnIndex !== -1 && sourceCardIndex !== -1) {
        newColumns[sourceColumnIndex].cards.splice(sourceCardIndex, 1);
      }

      let targetColumnIndex = newColumns.findIndex((col) => col.id === targetColumnId);
      let targetIndex = -1;

      if (targetCardId === 'empty') {
        targetIndex = newColumns[targetColumnIndex].cards.length;
      } else {
        const targetCardIndex = newColumns[targetColumnIndex].cards.findIndex(
          (c: Card) => c.id === targetCardId
        );
        if (targetCardIndex !== -1) {
          targetIndex = targetCardIndex;
          if (sourceColId === targetColumnId && sourceCardIndex < targetCardIndex) {
            targetIndex = targetCardIndex - 1;
          }
        }
      }

      if (targetIndex !== -1 && targetColumnIndex !== -1) {
        newColumns[targetColumnIndex].cards.splice(targetIndex, 0, sourceCard);
      }

      return { ...prev, columns: newColumns };
    });

    setDraggingCardId(null);
    setSourceColumnId(null);
  }, [setState]);

  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener('dragover', handleGlobalDragOver);

    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver);
    };
  }, []);

  return (
    <div className={styles.board}>
      <div className={styles.boardTitle}>
        📋 Trello Clone
      </div>
      <div className={styles.columnsContainer}>
        {state.columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggingCardId={draggingCardId}
            dragOverCardId={dragOverCardId}
            sourceColumnId={sourceColumnId}
          />
        ))}
      </div>
    </div>
  );
};