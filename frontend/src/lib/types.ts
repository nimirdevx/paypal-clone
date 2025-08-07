export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Wallet {
  id: number;
  userId: number;
  balance: number;
}

export interface Transaction {
  id: number;
  senderId: number;
  recipientId: number;
  senderEmail: string;
  recipientEmail: string;
  amount: number;
  status: string;
  timestamp: string;
}
