export interface Quiz {
  [key: string]: Question[];
}

export interface Question {
  id: string;
  text: string;
  order: number;
  category: string;
  options: Option[];
}

export interface Option {
  option: string;
  text: string;
  isCorrect: boolean;
}
