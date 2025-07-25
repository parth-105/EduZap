import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { Helmet } from "react-helmet-async";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getExamsData();
  }, []);
  return (
    <>
      <Helmet>
        <title>Manage Exams | Admin | Quiz Application</title>
        <meta name="description" content="Admin panel to manage exams for CMAT, NEET, JEE, and other competitive exams. Add, edit, and review online mock tests on Quiz Application." />
        <meta name="keywords" content="admin, manage exams, CMAT, NEET, JEE, competitive exam, online quiz, mock test, exam platform" />
        <meta property="og:title" content="Manage Exams | Admin | Quiz Application" />
        <meta property="og:description" content="Admin panel to manage exams for CMAT, NEET, JEE, and other competitive exams. Add, edit, and review online mock tests on Quiz Application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/admin/exams" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manage Exams | Admin | Quiz Application" />
        <meta name="twitter:description" content="Admin panel to manage exams for CMAT, NEET, JEE, and other competitive exams. Add, edit, and review online mock tests on Quiz Application." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
        <link rel="canonical" href="https://yourdomain.com/admin/exams" />
      </Helmet>
      <div>
        <div className="flex justify-between mt-2 items-end">
          <PageTitle title="Exams" />

          <button
            className="primary-outlined-btn flex items-center"
            onClick={() => navigate("/admin/exams/add")}
          >
            <i className="ri-add-line"></i>
            Add Exam
          </button>
        </div>
        <div className="divider"></div>

        <Table columns={columns} dataSource={exams} />
      </div>
    </>
  );
}

export default Exams;
