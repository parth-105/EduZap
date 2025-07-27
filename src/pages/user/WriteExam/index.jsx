import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { Helmet } from "react-helmet-async";

// Option Card Component with ScrollArea
function OptionCard({ option, content, isSelected, onClick }) {
  return (
    <div
      className={`cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg border-2 pt-1 ${
        isSelected 
          ? "border-blue-500 bg-blue-50 shadow-md" 
          : "border-gray-200 hover:border-gray-300 bg-white"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
            isSelected 
              ? "border-blue-500 bg-blue-500 text-white" 
              : "border-gray-400 bg-white text-gray-700"
          }`}
        >
          {option}
        </div>
        <div className="flex-1 min-w-0">
          <div className="max-h-32 overflow-y-auto pr-2">
            <p className="text-sm leading-relaxed break-words">{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [markedForReview, setMarkedForReview] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [showMobilePalette, setShowMobilePalette] = useState(false);
  const { user } = useSelector((state) => state.users);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];
      let unattempted = [];
      let totalMarksObtained = 0;

      questions.forEach((question, index) => {
        const selected = selectedOptions[index];
        if (selected === undefined || selected === null) {
          unattempted.push(question);
        } else if (question.correctOption === selected) {
          correctAnswers.push(question);
          totalMarksObtained += 4;
        } else {
          wrongAnswers.push(question);
          totalMarksObtained -= 1;
        }
      });

      let verdict = "Pass";
      if (totalMarksObtained < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        unattempted,
        verdict,
        totalMarksObtained,
        selectedOptions,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
    // eslint-disable-next-line
  }, []);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getPaletteColor = (idx) => {
    if (selectedOptions[idx] !== undefined) return "bg-green-500 text-white";
    if (markedForReview[idx]) return "bg-purple-500 text-white";
    if (idx === selectedQuestionIndex) return "bg-blue-500 text-white";
    return "bg-gray-200 text-gray-700";
  };

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [selectedQuestionIndex]: option,
    });
  };

  if (!examData) return null;

  const currentQuestion = questions[selectedQuestionIndex];

  return (
    <>
      <Helmet>
        <title>Take Online Exam | Quiz Application - Practice CMAT, NEET, JEE</title>
        <meta name="description" content="Take free online mock tests for CMAT, NEET, JEE, and other competitive exams. Practice with instant feedback and detailed explanations on Quiz Application." />
        <meta name="keywords" content="take exam, online test, CMAT, NEET, JEE, competitive exam, mock test, quiz, exam platform" />
        <meta property="og:title" content="Take Online Exam | Quiz Application - Practice CMAT, NEET, JEE" />
        <meta property="og:description" content="Take free online mock tests for CMAT, NEET, JEE, and other competitive exams. Practice with instant feedback and detailed explanations on Quiz Application." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://edu-zap.vercel.app/user/write-exam" />
        <meta property="og:image" content="https://edu-zap.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Take Online Exam | Quiz Application - Practice CMAT, NEET, JEE" />
        <meta name="twitter:description" content="Take free online mock tests for CMAT, NEET, JEE, and other competitive exams. Practice with instant feedback and detailed explanations on Quiz Application." />
        <meta name="twitter:image" content="https://edu-zap.vercel.app/og-image.png" />
        <link rel="canonical" href="https://edu-zap.vercel.app/user/write-exam" />
      </Helmet>

      {view === "instructions" && (
        <Instructions
          examData={examData}
          setView={setView}
          startTimer={startTimer}
        />
      )}

      {view === "questions" && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <h1 className="font-bold text-lg text-gray-900">{examData.name}</h1>
                  <div className="flex gap-4 text-gray-600">
                    <span>Total: {examData.totalMarks}</span>
                    <span>Passing: {examData.passingMarks}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="bg-gray-900 text-white px-3 py-1 rounded-lg font-mono text-sm">
                    {formatTime(secondsLeft)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 ">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Question Palette - Desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-24 bg-white rounded-lg border shadow-sm">
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-semibold">Question Palette</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {questions.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-10 h-10 p-1 rounded  border text-xs font-bold transition-all duration-150  ${
                            getPaletteColor(idx)
                          } ${idx === selectedQuestionIndex ? "ring-2 ring-blue-400" : ""}`}
                          onClick={() => setSelectedQuestionIndex(idx)}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-200 rounded"></div>
                        <span>Not Visited</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span>Marked for Review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Current</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Mobile Question Palette */}
                <div className="lg:hidden mb-4 bg-white rounded-lg border shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Questions</span>
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-sm"
                        onClick={() => setShowMobilePalette(!showMobilePalette)}
                      >
                        {showMobilePalette ? "Hide" : "Show"} Palette
                      </button>
                    </div>
                    {showMobilePalette && (
                      <div className="grid grid-cols-6 gap-2">
                        {questions.map((_, idx) => (
                          <button
                            key={idx}
                            className={`w-8 h-8 rounded border text-xs font-bold transition-all duration-150 ${
                              getPaletteColor(idx)
                            }`}
                            onClick={() => {
                              setSelectedQuestionIndex(idx);
                              setShowMobilePalette(false);
                            }}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-lg border shadow-sm mb-1">
                  <div className="p-1 border-b">
                    <div className="flex justify-between items-start gap-4">
                      <h2 className="text-lg font-semibold leading-relaxed">
                        Q{selectedQuestionIndex + 1}: {currentQuestion.name}
                      </h2>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium flex-shrink-0">
                        {selectedQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                      {Object.entries(currentQuestion.options).map(([option, content]) => (
                        <OptionCard
                          key={option}
                          option={option}
                          content={content}
                          isSelected={selectedOptions[selectedQuestionIndex] === option}
                          onClick={() => handleOptionSelect(option)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={() => {
                        setMarkedForReview({
                          ...markedForReview,
                          [selectedQuestionIndex]: !markedForReview[selectedQuestionIndex],
                        });
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {markedForReview[selectedQuestionIndex] ? "Unmark Review" : "Mark for Review"}
                    </button>
                    <button
                      className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: undefined,
                        });
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear
                    </button>
                  </div>

                  <div className="flex justify-between gap-3">
                    <button
                      className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
                      disabled={selectedQuestionIndex === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    {selectedQuestionIndex < questions.length - 1 ? (
                      <button 
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                      >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        onClick={() => {
                          clearInterval(intervalId);
                          setTimeUp(true);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result and Review sections remain as previously designed */}
      {view === "result" && (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 mt-8 border border-primary/10">
          <h1 className="text-3xl font-bold text-primary mb-2 drop-shadow">RESULT</h1>
          <div className="w-full border-b-2 border-primary mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="font-semibold">Total Marks (Assessment Scheme):</div>
              <div className="text-2xl font-bold text-blue-700">{result.totalMarksObtained}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="font-semibold">Correct Answers:</div>
              <div className="text-2xl font-bold text-green-700">{result.correctAnswers.length}</div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center">
              <div className="font-semibold">Wrong Answers:</div>
              <div className="text-2xl font-bold text-red-700">{result.wrongAnswers.length}</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center">
              <div className="font-semibold">Unattempted:</div>
              <div className="text-2xl font-bold text-yellow-700">{result.unattempted.length}</div>
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-lg">Passing Marks: <span className="font-bold">{examData.passingMarks}</span></div>
            <div className="text-lg">Verdict: <span className={`font-bold ${result.verdict === "Pass" ? "text-green-600" : "text-red-600"}`}>{result.verdict}</span></div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 text-base shadow"
              onClick={() => {
                setView("review");
              }}
            >
              Review Answers
            </button>
          </div>
          <div className="lottie-animation mt-6">
            {result.verdict === "Pass" && (
              <lottie-player
                src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              ></lottie-player>
            )}

            {result.verdict === "Fail" && (
              <lottie-player
                src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                background="transparent"
                speed="1"
                loop
                autoplay
              ></lottie-player>
            )}
          </div>
        </div>
      )}

      {view === "review" && (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 mt-8 border border-primary/10">
          <div className="text-lg mb-2 font-semibold text-primary">Marking Scheme: Correct +4, Wrong -1, Unattempted 0</div>
          <div className="text-lg mb-2 font-semibold">Total Marks Obtained: {result.totalMarksObtained}</div>
          {questions.map((question, index) => {
            const isCorrect =
              question.correctOption === selectedOptions[index];
            const selected = selectedOptions[index];
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
                <h1 className="text-md">
                  Explanation: {question.explanation ? question.explanation : "No explanation provided."}
                </h1>
              </div>
            );
          })}
          <div className="flex justify-center gap-4 mt-6">
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-base shadow"
              onClick={() => {
                navigate("/");
              }}
            >
              Close
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 text-base shadow"
              onClick={() => {
                setView("instructions");
                setSelectedQuestionIndex(0);
                setSelectedOptions({});
                setSecondsLeft(examData.duration);
              }}
            >
              Retake Exam
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default WriteExam;
