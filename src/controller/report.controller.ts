import express from "express";
import {
  createReport,
  deleteReportById,
  deleteReportFromUser,
  getAllReports,
  getProductsByName,
  getReportById,
  getReportsByTitle,
  updateReportById,
  updateReportFromUser,
} from "../services";
import { IReport, IUser, RequestReport } from "../schema";
export const getReports = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const query = (req.query.query as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { reports, totalPages } = await getAllReports(query, page, limit);

    if (reports.length === 0 || !reports) {
      return res
        .status(200)
        .json({ message: "Reports list is empty", reports: [] });
    }

    const formattedReports = reports.map((report: IReport) => {
      return {
        ...report,
        reportedItemId: (report.reportedItemId as any)._id,
        reporterId: (report.reporterId as any)._id,
        reviewedBy: (report.reviewedBy as any)?._id,
        reporter: (report.reporterId as any).username,
        reportedItem: (report.reportedItemId as any).name,
      };
    });

    return res
      .status(200)
      .json({ reports: formattedReports, total: totalPages, page, limit });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const findReport = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const report = await getReportById(id);

    if (!report) {
      return res.status(200).json({ message: "Report not found" });
    }

    const formattedReport = {
      ...report,
      reportedItemId: (report.reportedItemId as any)._id,
      reporterId: (report.reporterId as any)._id,
      reviewedBy: (report.reviewedBy as any)?._id,
      reporter: (report.reporterId as any).username,
      reportedItem: (report.reportedItemId as any).name,
    };

    return res.status(200).json({ report: formattedReport });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createdReport = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { reportedItem, reportType, description, status } =
      req.body as RequestReport;
    const { id: userId } = req.user as any;

    if (!reportedItem || !reportType || !description || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await getProductsByName(reportedItem);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    const values = {
      reporterId: userId,
      reportedItemId: product._id,
      reportType,
      description,
      status,
    };

    const report = await createReport(values);

    //Add report in user
    await updateReportFromUser(userId, report.id, values);

    return res
      .status(201)
      .json({ message: "Report created successfully", report });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Title already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReport = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user as any;

    const report = await getReportById(id);
    if (!report) {
      return res.status(200).json({ message: "Report not found" });
    }

    //Remove report in user
    await deleteReportFromUser(userId, id);
    //Remove report in database
    await deleteReportById(id);

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReport = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { status, reviewedAt } = req.body as RequestReport;
    const { id: userId } = req.user as any;

    const report = await getReportById(id);
    if (!report) {
      return res.status(200).json({ message: "Report not found" });
    }

    if (report.status === "resolved") {
      return res.status(400).json({ message: "Report already resolved" });
    }

    if (!status || !reviewedAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const values = {
      status,
      reviewedBy: userId,
      reviewedAt,
    };

    //Update report in user
    await updateReportFromUser(userId, id, values);

    //Update report in database
    await updateReportById(id, values);

    return res.status(200).json({ message: "Report updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
