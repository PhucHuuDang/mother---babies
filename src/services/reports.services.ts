import { ReportModel } from "../schema";

export const getAllReports = () => ReportModel.find();

export const getReportById = (id: string) => ReportModel.findById(id);

export const createReport = (values: Record<string, any>) =>
  new ReportModel(values).save().then((report) => report.toObject());

export const deleteReportById = (id: string) =>
  ReportModel.findByIdAndDelete({ _id: id });

export const updateReportById = (id: string, values: Record<string, any>) =>
  ReportModel.findByIdAndUpdate(id, values);
