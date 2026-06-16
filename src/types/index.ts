export interface Card {
  id: string;
  text: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface BoardState {
  columns: Column[];
}