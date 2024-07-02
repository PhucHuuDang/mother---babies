import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}

export interface RequestCategory {
  name: string;
  description: string;
  createdBy?: Schema.Types.ObjectId;
}

export const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const CategoryModel = model<ICategory>("Category", categorySchema);
