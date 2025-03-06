export interface ISubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  startDate: Date;
  endDate?: Date | null; // Allow null values
  subscriptionType: string;
  status: string;
  duration: number;
}