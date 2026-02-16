export interface Lead {
  id: string;
  clientId: string;
  customerName?: string;
  source: string;
  status: 'new' | 'contacted' | 'booked' | 'won' | 'lost';
  priority: 'hot' | 'warm' | 'cold';
  customerPhoneE164: string;
  jobSummary: string | null;
  suburb: string | null;
  urgency: string;
  createdAt: string | any; // Firestore Timestamp
  lastMessageAt: string | any;
}

export interface Message {
  id: string;
  text: string;
  sender: "lead" | "user"; // 'lead' is the customer, 'user' is the tradie
  createdAt: string;
}