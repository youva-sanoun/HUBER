export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'work' | 'ideas';
  date: string;
}
