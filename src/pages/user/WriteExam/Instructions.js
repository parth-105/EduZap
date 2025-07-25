import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto flex flex-col items-center gap-6">
      <ul className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl font-bold text-primary underline mb-2 text-center">Instructions</h1>
        <li className="text-md">Exam must be completed in <span className="font-semibold">{examData.duration} seconds</span>.</li>
        <li className="text-md">Exam will be submitted automatically after <span className="font-semibold">{examData.duration} seconds</span>.</li>
        <li className="text-md">Once submitted, you cannot change your answers.</li>
        <li className="text-md">Do not refresh the page.</li>
        <li className="text-md">You can use the <span className="font-bold">"Previous"</span> and <span className="font-bold">"Next"</span> buttons to navigate between questions.</li>
        <li className="text-md">Total marks of the exam is <span className="font-bold">{examData.totalMarks}</span>.</li>
        <li className="text-md">Passing marks of the exam is <span className="font-bold">{examData.passingMarks}</span>.</li>
        <li className="text-md">Marking Scheme: <span className="font-bold">+4</span> for correct, <span className="font-bold">-1</span> for wrong, <span className="font-bold">0</span> for unattempted.</li>
      </ul>
      <div className="flex gap-4 mt-4">
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate("/")}
        >
          Close
        </button>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          onClick={() => {
            startTimer();
            setView("questions");
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default Instructions;
