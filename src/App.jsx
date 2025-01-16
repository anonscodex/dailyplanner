import React, { useState, useEffect } from "react";
import axios from "axios";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [tasks, setTasks] = useState("");
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Wallet setup
   const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: "mainnet-beta" }),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  useEffect(() => {
    const isWalletConnected = localStorage.getItem("walletConnected");
    if (isWalletConnected) {
      setWalletConnected(true);
    }
  }, []);

  const handleWalletConnect = async (wallet) => {
    try {
      // Connect wallet
      await wallet.connect();
      // Save connection state
      localStorage.setItem("walletConnected", "true");
      setWalletConnected(true);
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

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
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold text-white mb-6">DailyPlanner AI</h1>
            {!walletConnected ? (
              <button
                className="bg-white text-black font-bold px-6 py-2 rounded-md hover:bg-black-600 mb-4"
                onClick={() => handleWalletConnect(wallets[0])}
              >
                Connect Wallet
              </button>
            ) : (
              <>
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
              </>
            )}
             <Analytics />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
   
  );
  
}

export default App;

