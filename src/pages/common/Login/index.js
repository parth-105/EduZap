import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { Helmet } from "react-helmet-async";

function Login() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
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
        <title>Login | Quiz Application - Practice CMAT, NEET, JEE Exams</title>
        <meta name="description" content="Login to your account to practice for CMAT, NEET, JEE, and other competitive exams. Access free online mock tests and quizzes on Quiz Application." />
        <meta name="keywords" content="login, CMAT, NEET, JEE, competitive exam, online quiz, mock test, exam platform" />
        <meta property="og:title" content="Login | Quiz Application - Practice CMAT, NEET, JEE Exams" />
        <meta property="og:description" content="Login to your account to practice for CMAT, NEET, JEE, and other competitive exams. Access free online mock tests and quizzes on Quiz Application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edu-zap.vercel.app/login" />
        <meta property="og:image" content="https://edu-zap.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | Quiz Application - Practice CMAT, NEET, JEE Exams" />
        <meta name="twitter:description" content="Login to your account to practice for CMAT, NEET, JEE, and other competitive exams. Access free online mock tests and quizzes on Quiz Application." />
        <meta name="twitter:image" content="https://edu-zap.vercel.app/og-image.png" />
        <link rel="canonical" href="https://edu-zap.vercel.app/login" />
      </Helmet>
      <div className="flex justify-center items-center h-screen w-screen bg-primary">
        <div className="card w-400 p-3 bg-white">
          <div className="flex flex-col">
            <div className="flex">
              <h1 className="text-2xl">QUIZ - LOGIN <i class="ri-login-circle-line"></i></h1>
              
            </div>
            <div className="divider"></div>
            <Form layout="vertical" className="mt-2" onFinish={onFinish}>
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
                  Login
                </button>
                <Link to="/register" className="underline">
                  Not a member? Register
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
