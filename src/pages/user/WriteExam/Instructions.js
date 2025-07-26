import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  
  // Convert seconds to minutes and seconds format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min : ${seconds} sec`;
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-primary underline mb-4 text-center">Instructions</h1>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Exam must be completed in <span className="font-semibold">{formatTime(examData.duration)}</span></p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Exam will be submitted automatically after <span className="font-semibold">{formatTime(examData.duration)}</span></p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Once submitted, you cannot change your answers</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Do not refresh the page</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Use <span className="font-bold">Previous/Next</span> buttons to navigate</p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Total marks: <span className="font-bold">{examData.totalMarks}</span> | Passing marks: <span className="font-bold">{examData.passingMarks}</span></p>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold">•</span>
          <p className="text-sm">Marking: <span className="font-bold text-green-600">+4</span> correct, <span className="font-bold text-red-600">-1</span> wrong, <span className="font-bold">0</span> unattempted</p>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
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
