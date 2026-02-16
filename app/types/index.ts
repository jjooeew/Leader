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