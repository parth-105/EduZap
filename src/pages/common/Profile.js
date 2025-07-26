import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Profile() {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Your Profile | Quiz Application - Competitive Exam Practice</title>
        <meta name="description" content="View your profile, account details, and role on Quiz Application. Practice for CMAT, NEET, JEE, and other competitive exams online." />
        <meta name="keywords" content="profile, user, account, CMAT, NEET, JEE, competitive exam, quiz, exam platform" />
        <meta property="og:title" content="Your Profile | Quiz Application - Competitive Exam Practice" />
        <meta property="og:description" content="View your profile, account details, and role on Quiz Application. Practice for CMAT, NEET, JEE, and other competitive exams online." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edu-zap.vercel.app/profile" />
        <meta property="og:image" content="https://edu-zap.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Profile | Quiz Application - Competitive Exam Practice" />
        <meta name="twitter:description" content="View your profile, account details, and role on Quiz Application. Practice for CMAT, NEET, JEE, and other competitive exams online." />
        <meta name="twitter:image" content="https://edu-zap.vercel.app/og-image.png" />
        <link rel="canonical" href="https://edu-zap.vercel.app/profile" />
      </Helmet>
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 border border-primary/10">
          <div className="w-24 h-24 rounded-full bg-black from-primary to-blue-400 flex items-center justify-center text-4xl text-white font-bold mb-2">
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{user.name}</h1>
          <div className="w-full flex flex-col gap-2 text-center">
            <div className="text-md text-gray-700">
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div className="text-md text-gray-700">
              <span className="font-semibold">Role:</span> {user.isAdmin ? "Admin" : "User"}
            </div>
            <div className="text-md text-gray-700">
              <span className="font-semibold">Registered:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </div>
          </div>
          <button
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 shadow"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile; 