export interface Lead {
  id: string;
  clientId: string;
  source: string;
  status: 'new' | 'contacted' | 'booked' | 'won' | 'lost';
  priority: 'hot' | 'warm' | 'cold';
  customerPhoneE164: string;
  jobSummary: string | null;
  suburb: string | null;
  urgency: string;
  createdAt: any; // Firestore Timestamp
}