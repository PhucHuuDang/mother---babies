import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId; // User
  reportedItemId: Schema.Types.ObjectId; // Product
  reportType:
    | "product_quality"
    | "delivery_issue"
    | "payment_problem"
    | "customer_service"
    | "other";
  description: string;
  status: "pending" | "reviewed" | "resolved";
  reviewedBy?: Schema.Types.ObjectId;
  reviewedAt?: Date;
}

export interface RequestReport {
  reporter?: string;
  reportedItem: string;
  reportType:
    | "product_quality"
    | "delivery_issue"
    | "payment_problem"
    | "customer_service"
    | "other";
  description: string;
  status: "pending" | "reviewed" | "resolved";
  reviewedBy?: string;
  reviewedAt?: Date;
}

export const reportSchema = new Schema<IReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: "User" },
  reportedItemId: { type: Schema.Types.ObjectId, ref: "Product" },
  reportType: {
    type: String,
    enum: [
      "product_quality",
      "delivery_issue",
      "payment_problem",
      "customer_service",
      "other",
    ],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
});

export const ReportModel = model<IReport>("Report", reportSchema);
