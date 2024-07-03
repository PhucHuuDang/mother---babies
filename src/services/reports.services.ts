import { IReport, ReportModel } from "../schema";

export const getAllReports = async (
  query: string = "",
  page: number = 1,
  limit: number = 10
) => {
  let filter: any = {};
  if (query) {
    const regex = new RegExp(query, "i");
    filter = { $or: [{ title: regex }, { status: regex }] };
  }

  const skip = (page - 1) * limit;
  const reports = await ReportModel.find(filter)
    .populate("reportedItemId", "name")
    .populate("reporterId", "username")
    .populate("reviewedBy", "username")
    .skip(skip)
    .limit(limit)
    .lean<IReport[]>();

  const total = await ReportModel.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  return { reports, totalPages, page, limit };
};

export const getReportById = async (id: string) => {
  const report = await ReportModel.findById(id)
    .populate("reportedItemId", "name")
    .populate("reporterId", "username")
    .populate("reviewedBy", "username")
    .lean<IReport>()
    .exec();
  return report;
};

export const getReportsByTitle = async (title: string) => {
  const report = await ReportModel.find({ title })
    .populate("reportedItemId", "name")
    .populate("reporterId", "username")
    .populate("reviewedBy", "username")
    .lean<IReport>();
  return report;
};

export const createReport = (values: Record<string, any>) =>
  new ReportModel(values).save().then((report) => report.toObject());

export const deleteReportById = (id: string) =>
  ReportModel.findByIdAndDelete({ _id: id });

export const updateReportById = (id: string, values: Record<string, any>) =>
  ReportModel.findByIdAndUpdate(id, values);
