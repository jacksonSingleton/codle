import { useState, useEffect } from "react";
import clsx from "clsx";
import Editor from "./components/editor";
import TestResults from "./components/TestResults";

function App() {
  const [vim, setVim] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [success, setSuccess] = useState(false);
  const [questionId, setQuestionId] = useState("");

  const update = (val: string) => {
    setCode(val);
  };

  useEffect(() => {
    if (localStorage.getItem("attempt") === null) {
      localStorage.setItem("attempt", "0");
    }

    setAttempt(parseInt(localStorage.getItem("attempt") || "0"));
  }, []);

  const incrementAttempt = () => {
    const newAttempt = attempt + 1;
    localStorage.setItem("attempt", newAttempt.toString());
    setAttempt(newAttempt);
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/problem`);
      if (!res.ok) {
        throw new Error("Failed to fetch problem");
      }
      const data = await res.json();
      setQuestionId(data.id);
      setCode(data.startingCode.python);
    } catch (err) {
      console.error("Error fetching problem:", err);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    if (attempt >= 5) {
      alert("You've used all your attempts!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userCode: code,
          language: "python",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to run code");
      }

      const data = await res.json();
      console.log("Test results:", data);

      // Check if data.results exists before setting it
      if (data.results) {
        setTestResults(data.results);

        // Set success if all tests pass
        const allPassed = data.summary?.passed === data.summary?.total;
        setSuccess(allPassed);
        if (allPassed) localStorage.setItem("success", questionId);
      } else {
        console.error("No results found in response:", data);
      }

      incrementAttempt();
    } catch (err) {
      console.error("Error running code:", err);
    }
  };

  useEffect(() => {
    console.log("questionId:", questionId);
    if (
      questionId.length > 0 &&
      localStorage.getItem("success") === questionId
    ) {
      setSuccess(true);
    }
  }, [questionId]);

  useEffect(() => {
    fetchProblem();
  }, []);

  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen">
        <header
          className={clsx(
            "flex m-4 px-6 py-2 w-3/4 justify-between",
            attempt >= 4 ? "bg-primary" : "bg-success",
          )}
        >
          <h2 className="text-2xl text-base font-semibold select-none">
            CODLE
          </h2>
          <h2 className="text-2xl text-base font-semibold select-none">
            ATTEMPTS: {attempt}/5
          </h2>
        </header>

        {success ? (
          <div className="w-3/4 h-3/4 flex items-center justify-center">
            <div className="bg-success text-success-content p-8 rounded-lg text-center text-base">
              <h2 className="text-3xl font-bold mb-4">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-xl">
                You've successfully fixed all the issues!
              </p>
            </div>
          </div>
        ) : (
          <div className="w-3/4 h-3/4 flex">
            <div className="w-full h-full shadow-xl rounded-2xl overflow-hidden p-8 mb-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  Loading...
                </div>
              ) : (
                <Editor onChange={update} vim={vim} initialValue={code} />
              )}
            </div>

            {testResults && testResults.length > 0 && (
              <div className="h-full overflow-scroll">
                <TestResults testResults={testResults} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-8 mt-2 w-1/2">
          <button
            className={clsx(
              "bg-accent text-base px-4 py-2 rounded-md cursor-pointer font-semibold text-xl hover:brightness-80",
              (attempt >= 5 || success) && "opacity-50 cursor-not-allowed",
            )}
            onClick={runCode}
            disabled={attempt >= 5 || success}
          >
            <i className="bi bi-play-fill"></i>
            {attempt >= 5 ? "Out of Attempts" : "Run Code"}
          </button>
          <div className="flex items-center gap-2">
            <i className="devicon-vim-plain text-4xl text-accent"></i>
            <input
              type="checkbox"
              name="vim"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={vim}
              onChange={() => setVim(!vim)}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
