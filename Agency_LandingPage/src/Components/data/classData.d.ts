export interface ClassItem {
  id: number;
  title: string;
  day: string;
  time: string;
  ticketType: string;
  theme: string;
  category: string;
  description: string;
  price: number;
  spotsTotal: number;
  spotsTaken: number;
  status: 'ongoing' | 'upcoming';
  featured?: boolean;
}

export const classes: ClassItem[];
