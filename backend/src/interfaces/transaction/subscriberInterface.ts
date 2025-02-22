export interface ISubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  startDate: Date;
  endDate?: Date;
  subscriptionType: string;
}