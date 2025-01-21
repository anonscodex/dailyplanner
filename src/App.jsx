import React, { useState, useEffect } from "react";
import './App.css';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Analytics } from "@vercel/analytics/react";

function AppContent() {
  const { publicKey, connect, connected } = useWallet(); // Access wallet context
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {
    // Auto-connect the wallet if previously connected
    const storedPublicKey = localStorage.getItem("connectedPublicKey");
    if (storedPublicKey && !connected) {
      connect().catch(() => console.log("Auto-connect failed"));
    }
  }, [connect, connected]);

  useEffect(() => {
    // Save the public key to localStorage when wallet connects
    if (publicKey) {
      localStorage.setItem("connectedPublicKey", publicKey.toString());
    }
  }, [publicKey]);

  const handleSubmit = async () => {
    if (!publicKey) {
      setError("Please connect your wallet to proceed.");
      return;
    }

    try {
      const response = await fetch(`https://todoai-wn6s.onrender.com/plan-day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await response.json();
      setPlan(data.plan);
      setError(null);
    } catch (err) {
      setError("Failed to fetch the plan. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-white mb-6">DailyPlanner AI</h1>
      <WalletMultiButton />
      
      <textarea
        className="w-2/3 mt-4 p-4 border bg-gray-900 text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        rows="6"
        placeholder="Enter your to-do list (one task per line)..."
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
      />
      <button
        className={`font-bold px-6 py-2 rounded-md ${
          publicKey
            ? "bg-white text-black hover:bg-gray-300"
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!publicKey || isLoading} 
      >
        {isLoading ? "Generating..." : "Plan My Day"}
      </button>
      {isLoading && (
        <div className="text-white mt-4">
          <div className="dot-typing"></div>
        </div>
      )}
      {plan && (
        <div className="w-3/3 bg-gray-900 mt-6 p-4 rounded-md shadow-md">
          <h2 className="text-xl font-semibold text-white mb-2">Your Plan:</h2>
          <pre className="text-white whitespace-pre-wrap">{plan}</pre>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <Analytics />
    </div>
  );
}

function App() {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: "mainnet-beta" }),
    new TorusWalletAdapter(),
  ];

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
