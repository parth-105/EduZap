import React from "react";

function ReviewModal({ open, onClose, report }) {
  if (!open || !report) return null;
  const { exam, result } = report;
  const questions = exam.questions || [];
  const selectedOptions = result.selectedOptions || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Exam Review: {exam.name}</h2>
          <button className="text-2xl text-gray-500 hover:text-primary" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Total Marks: </span>{exam.totalMarks} &nbsp;
          <span className="font-semibold">Obtained: </span>{result.totalMarksObtained}
        </div>
        {questions.map((question, index) => {
          const isCorrect = question.correctOption === result.selectedOptions?.[index];
          const selected = result.selectedOptions?.[index];
          let mark = 0;
          if (selected === undefined || selected === null) mark = 0;
          else if (isCorrect) mark = 4;
          else mark = -1;
          return (
            <div
              className={`flex flex-col gap-1 p-6 rounded-xl border shadow-sm mb-2
                ${isCorrect ? "bg-green-50 border-green-200" : (selected ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200")}
              `}
              key={index}
            >
              <h1 className="text-lg font-semibold text-primary">
                {index + 1} : {question.name}
              </h1>
              <h1 className="text-md">
                Submitted Answer : {selected ? `${selected} - ${question.options[selected]}` : "Unattempted"}
              </h1>
              <h1 className="text-md">
                Correct Answer : {question.correctOption} - {question.options[question.correctOption]}
              </h1>
              <h1 className="text-md">
                Marks for this question: <span className="font-bold">{mark}</span>
              </h1>
              <div className="mt-2 p-3 rounded-lg bg-yellow-100 border-l-4 border-yellow-400">
                <span className="font-bold text-yellow-800">Explanation:</span>
                <span className="ml-2 text-gray-800">{question.explanation ? question.explanation : "No explanation provided."}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewModal;
