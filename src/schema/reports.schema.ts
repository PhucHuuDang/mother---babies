import { Schema, model, Document } from "mongoose";

interface IReport extends Document {
  title: string;
  content: string;
  status: "pending" | "resolved";
  createBy: Schema.Types.ObjectId;
}

const reportSchema = new Schema<IReport>({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  status: { type: String, required: true },
  createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const ReportModel = model<IReport>("Report", reportSchema);
