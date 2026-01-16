
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
