import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import ReviewModal from "./ReviewModal";
import { Helmet } from "react-helmet-async";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  // Summary stats
  const totalAttempts = reportsData.length;
  const bestScore = Math.max(...reportsData.map(r => r.result?.totalMarksObtained ?? 0), 0);
  const avgScore = totalAttempts
    ? (
        reportsData.reduce((sum, r) => sum + (r.result?.totalMarksObtained ?? 0), 0) /
        totalAttempts
      ).toFixed(2)
    : 0;

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser({ page, limit });
      if (response.success) {
        setReportsData(response.data);
        setTotal(response.total || response.data.length);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  // Filtered data
  const filteredReports = reportsData.filter(
    (r) =>
      r.exam.name.toLowerCase().includes(search.toLowerCase()) ||
      moment(r.createdAt).format("DD-MM-YYYY").includes(search)
  );

  return (
    <>
      <Helmet>
        <title>Your Exam Reports | Quiz Application - Track Your Progress</title>
        <meta name="description" content="View your exam reports and analytics for CMAT, NEET, JEE, and other competitive exams. Track your progress and review your answers on Quiz Application." />
        <meta name="keywords" content="exam reports, analytics, CMAT, NEET, JEE, competitive exam, progress, review, quiz, exam platform" />
        <meta property="og:title" content="Your Exam Reports | Quiz Application - Track Your Progress" />
        <meta property="og:description" content="View your exam reports and analytics for CMAT, NEET, JEE, and other competitive exams. Track your progress and review your answers on Quiz Application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/user/reports" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Exam Reports | Quiz Application - Track Your Progress" />
        <meta name="twitter:description" content="View your exam reports and analytics for CMAT, NEET, JEE, and other competitive exams. Track your progress and review your answers on Quiz Application." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
        <link rel="canonical" href="https://yourdomain.com/user/reports" />
      </Helmet>
      <div className="max-w-5xl mx-auto px-2 py-6">
        <PageTitle title="Your Exam Reports" />
        <div className="border-b-2 border-primary mb-6"></div>

        {/* Summary Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 bg-primary text-white rounded-lg p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">Total Attempts</span>
            <span className="text-2xl font-bold">{totalAttempts}</span>
          </div>
          <div className="flex-1 bg-green-600 text-white rounded-lg p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">Best Score</span>
            <span className="text-2xl font-bold">{bestScore}</span>
          </div>
          <div className="flex-1 bg-blue-600 text-white rounded-lg p-4 flex flex-col items-center">
            <span className="text-lg font-semibold">Average Score</span>
            <span className="text-2xl font-bold">{avgScore}</span>
          </div>
        </div>




        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredReports.length === 0 && (
            <div className="text-center text-gray-500 py-6">No reports found.</div>
          )}
          {filteredReports.map((record, idx) => (
            <div
              key={record._id || idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer"
              onClick={() => { setSelectedReport(record); setShowReview(true); }}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary">{record.exam.name}</span>
                {record.result.verdict === "Pass" ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <FaCheckCircle className="text-green-500" /> Pass
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                    <FaTimesCircle className="text-red-500" /> Fail
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {moment(record.createdAt).format("DD-MM-YYYY hh:mm A")}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Total: {record.exam.totalMarks}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Passing: {record.exam.passingMarks}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                  Obtained: {record.result.totalMarksObtained !== undefined
                    ? record.result.totalMarksObtained
                    : record.result.correctAnswers.length}
                </span>
              </div>
            </div>
          ))}
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-primary hover:text-white disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1 rounded ${p === page ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-primary hover:text-white"}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-primary hover:text-white disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
        <ReviewModal
          open={showReview}
          onClose={() => setShowReview(false)}
          report={selectedReport}
        />
      </div>
    </>
  );
}

export default UserReports;
