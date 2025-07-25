import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { Helmet } from "react-helmet-async";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Quiz Application - Free CMAT, NEET, JEE Practice</title>
        <meta name="description" content="Create your free account to practice for CMAT, NEET, JEE, and other competitive exams. Access online mock tests and quizzes on Quiz Application." />
        <meta name="keywords" content="register, signup, CMAT, NEET, JEE, competitive exam, online quiz, mock test, exam platform" />
        <meta property="og:title" content="Register | Quiz Application - Free CMAT, NEET, JEE Practice" />
        <meta property="og:description" content="Create your free account to practice for CMAT, NEET, JEE, and other competitive exams. Access online mock tests and quizzes on Quiz Application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/register" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register | Quiz Application - Free CMAT, NEET, JEE Practice" />
        <meta name="twitter:description" content="Create your free account to practice for CMAT, NEET, JEE, and other competitive exams. Access online mock tests and quizzes on Quiz Application." />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
        <link rel="canonical" href="https://yourdomain.com/register" />
      </Helmet>
      <div className="flex justify-center items-center h-screen w-screen bg-primary">
        <div className="card w-400 p-3 bg-white">
          <div className="flex flex-col">
            <h1 className="text-2xl">
              QUIZ - REGISTER<i class="ri-user-add-line"></i>
            </h1>
            <div className="divider"></div>
            <Form layout="vertical" className="mt-2" onFinish={onFinish}>
              <Form.Item name="name" label="Name">
                <input type="text" />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <input type="text" />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <input type="password" />
              </Form.Item>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="primary-contained-btn mt-2 w-100"
                >
                  Register
                </button>
                <Link to="/login">Already a member? Login</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
