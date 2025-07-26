import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { Helmet } from "react-helmet-async";

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
        selectedOptions, // <-- store user's answers for review
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

  // Convert seconds to minutes and seconds format
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min : ${seconds} sec`;
  };

  // Palette color logic
  const getPaletteColor = (idx) => {
    if (selectedOptions[idx] !== undefined) return "bg-green-500 text-white";
    if (markedForReview[idx]) return "bg-purple-500 text-white";
    if (idx === selectedQuestionIndex) return "bg-primary text-white";
    return "bg-gray-200 text-gray-700";
  };

  // Responsive: palette as drawer on mobile
  const [showPalette, setShowPalette] = useState(false);

  return (
    examData && (
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
        <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col overflow-hidden">
          {/* Timer and Exam Info */}
          <div className="w-full bg-primary text-white flex flex-wrap justify-between items-center px-2 py-1 sticky top-0 z-20 shadow text-sm mt-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-lg md:text-xl tracking-wide drop-shadow">{examData.name}</span>
              <span className="hidden sm:inline mx-1">|</span>
              <span>Total: {examData.totalMarks}</span>
              <span>Passing: {examData.passingMarks}</span>
              <span>Duration: {formatTime(examData.duration)}s</span>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span>Time Left</span>
              <div className="bg-black text-primary rounded-lg px-4 py-2 flex items-center justify-center text-sm font-bold border-2 border-primary shadow min-w-[120px]">
                {formatTime(secondsLeft)}
              </div>
            </div>
          </div>

          {view === "instructions" && (
            <Instructions
              examData={examData}
              setView={setView}
              startTimer={startTimer}
            />
          )}

          {view === "questions" && (
            <div className="flex-1 flex  md:flex-row overflow-hidden">
              {/* Palette (left) */}
              <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 border-r w-60 py-2 px-2 gap-1 h-[calc(100vh-56px)] sticky top-[56px] overflow-hidden shadow-xl rounded-r-2xl">
                <div className="font-bold text-sm text-primary mb-2 tracking-wide">Questions</div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {questions.map((q, idx) => (
                    <button
                      key={idx}
                      className={`w-8 h-8 rounded-full font-bold border text-xs focus:outline-none transition-all duration-150 shadow-md
                        ${getPaletteColor(idx)} ${idx === selectedQuestionIndex ? 'ring-2 ring-primary scale-110' : ''}`}
                      onClick={() => setSelectedQuestionIndex(idx)}
                      aria-label={`Go to question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                {/* Legend */}
                <div className="mt-1 flex flex-col gap-1 text-xs w-full">
                  <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>Answered</div>
                  <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-gray-200 rounded mr-1"></span>Not Visited</div>
                  <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-1"></span>Review</div>
                  <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-primary rounded mr-1"></span>Current</div>
                </div>
              </div>

              {/* Main Question Area */}
              <div className="flex-1 flex flex-col items-center justify-center p-1 md:p-2 overflow-hidden">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-2 md:p-3 flex flex-col gap-1 border border-primary/10">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-0.5">
                    <h2 className="text-base md:text-lg font-bold mb-0.5 sm:mb-0 text-primary drop-shadow">
                      Q{selectedQuestionIndex + 1}: {questions[selectedQuestionIndex].name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.keys(questions[selectedQuestionIndex].options).map(
                      (option, index) => {
                        const isSelected = selectedOptions[selectedQuestionIndex] === option;
                        return (
                          <button
                            key={index}
                            className={`w-full text-left px-2 py-0.5 rounded-xl border transition-all duration-150 font-medium text-sm shadow-sm break-words min-h-[25px] flex items-center
                              ${isSelected ? "bg-primary text-white border-primary scale-105" : "bg-gray-50 border-gray-200 hover:bg-primary/10 hover:scale-105"}
                            `}
                            onClick={() => {
                              setSelectedOptions({
                                ...selectedOptions,
                                [selectedQuestionIndex]: option,
                              });
                            }}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 text-center font-bold flex items-center justify-center ${
                                isSelected 
                                  ? "border-white bg-white text-black" 
                                  : "border-primary bg-white text-primary"
                              }`}>
                                {option}
                              </span>
                              <span className="flex-1 break-words leading-relaxed">
                                {questions[selectedQuestionIndex].options[option]}
                              </span>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex flex-wrap justify-between gap-2 mt-0.5">
                    <button
                      className="bg-purple-500 text-white px-3 py-1.5 rounded-lg hover:bg-purple-600 text-xs shadow"
                      onClick={() => {
                        setMarkedForReview({
                          ...markedForReview,
                          [selectedQuestionIndex]: !markedForReview[selectedQuestionIndex],
                        });
                      }}
                    >
                      {markedForReview[selectedQuestionIndex] ? "Unmark Review" : "Mark for Review"}
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 text-xs shadow"
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: undefined,
                        });
                      }}
                    >
                      Clear
                    </button>
                    {selectedQuestionIndex > 0 && (
                      <button
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 text-xs shadow"
                        onClick={() => {
                          setSelectedQuestionIndex(selectedQuestionIndex - 1);
                        }}
                      >
                        Previous
                      </button>
                    )}
                    {selectedQuestionIndex < questions.length - 1 && (
                      <button
                        className="bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 text-xs shadow"
                        onClick={() => {
                          setSelectedQuestionIndex(selectedQuestionIndex + 1);
                        }}
                      >
                        Next
                      </button>
                    )}
                    {selectedQuestionIndex === questions.length - 1 && (
                      <button
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-xs shadow"
                        onClick={() => {
                          clearInterval(intervalId);
                          setTimeUp(true);
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result and Review sections remain as previously designed, but polish with more spacing and color */}
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
                {/* <button
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-base shadow"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
                  }}
                >
                  Retake Exam
                </button> */}
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
        </div>
      </>
    )
  );
}

export default WriteExam;
