import React, { useState } from "react";
import axios from "axios";


function App() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  //const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`https://todoai-wn6s.onrender.com/plan-day`, {
        tasks,
      });
      setPlan(response.data.plan);
      setError(null);
    } catch (err) {
      setError("Failed to fetch the plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-white mb-6">DailyPlanner AI</h1>
      <textarea
        className="w-2/3 p-4 border bg-gray-900 text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        rows="6"
        placeholder="Enter your to-do list (one task per line)..."
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />
      <button
        className="bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-black-600"
        onClick={handleSubmit}
      >
        Plan My Day
      </button>
      {plan && (
        <div className="w-3/3 bg-gray-900 mt-6 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Plan:</h2>
          <pre className="text-white whitespace-pre-wrap">{plan}</pre>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default App;
