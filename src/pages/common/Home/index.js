import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Helmet } from "react-helmet-async";

function Home() {
  const [exams, setExams] = React.useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams({ page, limit, search: debouncedSearch, category });
      if (response.success) {
        setExams(response.data);
        setTotal(response.total);
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
    getExams();
    // eslint-disable-next-line
  }, [page, debouncedSearch, category]);

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Helmet>
        <title>Practice CMAT, NEET, JEE, and More | Quiz Application</title>
        <meta name="description" content="Practice for CMAT, NEET, JEE, JEE Advanced and other competitive exams with free online mock tests and quizzes. Improve your score with instant feedback and detailed explanations." />
        <meta name="keywords" content="CMAT, NEET, JEE, JEE Advanced, mock test, online quiz, competitive exam, practice, free test, exam platform" />
        <meta property="og:title" content="Practice CMAT, NEET, JEE, and More | Quiz Application" />
        <meta property="og:description" content="Practice for CMAT, NEET, JEE, JEE Advanced and other competitive exams with free online mock tests and quizzes. Improve your score with instant feedback and detailed explanations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edu-zap.vercel.app/" />
        <meta property="og:image" content="https://edu-zap.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Practice CMAT, NEET, JEE, and More | Quiz Application" />
        <meta name="twitter:description" content="Practice for CMAT, NEET, JEE, JEE Advanced and other competitive exams with free online mock tests and quizzes." />
        <meta name="twitter:image" content="https://edu-zap.vercel.app/og-image.png" />
        <link rel="canonical" href="https://edu-zap.vercel.app/" />
      </Helmet>
      {user && (
        <div className="max-w-6xl mx-auto px-2 py-6">
          <PageTitle title={`Hi ${user.name}, Welcome to Quiz Application`} />
          <div className="border-b-2 border-primary mb-6"></div>
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Search exams..."
              className="border rounded px-3 py-2 w-full sm:w-1/2"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 w-full sm:w-1/4"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="LanguageComprehension">Language Comprehension</option>
              <option value="LogicalReasoning">Logical Reasoning</option>
              <option value="QuantitativeTechniques">Quantitative Techniques</option>
              <option value="GeneralAwareness">General Awareness</option>
              <option value="InnovationEntrepreneurship">Innovation & Entrepreneurship</option>

            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col gap-3 border border-gray-100 hover:border-primary"
              >
                <h1 className="text-xl font-bold text-primary mb-1 break-words" title={exam.name}>{exam.name}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">Category: {exam.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Total: {exam.totalMarks}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Passing: {exam.passingMarks}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Duration: {exam.duration} sec</span>
                </div>
                <button
                  className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            ))}
          </div>
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
      )}
    </>
  );
}

export default Home;
