import { Schema, model, Document } from "mongoose";

interface IReport extends Document {
  userId: Schema.Types.ObjectId;
  content: string;
  status: "pending" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = model<IReport>("Report", reportSchema);

export default Report;
