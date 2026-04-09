export interface IProduct {
  id: string;
  name: string;
  licenseType: "Free" | "Academic" | "Commercial";
  userEmail: string;
  createdAt: string;
  comment?: string;
}