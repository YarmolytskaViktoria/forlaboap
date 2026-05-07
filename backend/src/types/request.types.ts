export interface IRequest {
  id: string;
  userId: string;
  productId: string;
  status: "pending" | "approved" | "rejected";
  comment: string;
  createdAt: string;
}