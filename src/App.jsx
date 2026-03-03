import { useState, useEffect } from "react";
import ProviderSelector from "./components/ProviderSelector";
import TicketForm from "./components/TicketForm";
import ResultCard from "./components/ResultCard";
import Dashboard from "./components/Dashboard";
import ErrorAlert from "./components/ErrorAlert";
import { analyzeTicket } from "./services/triageService";

export default function App() {
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("ticketHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ticketHistory", JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!ticket) {
      setError("Please enter ticket description.");
      return;
    }

    if (!apiKey) {
      setError("Please enter API key.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResult(null);

      const analysis = await analyzeTicket(provider, apiKey, ticket);

      setResult(analysis);
      setHistory((prev) => [analysis, ...prev]);
      setTicket("");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    localStorage.removeItem("ticketHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-2xl font-semibold">
            AI-Powered ERP Ticket Triaging System
          </h1>

          <ProviderSelector provider={provider} setProvider={setProvider} />

          <TicketForm
            provider={provider}
            apiKey={apiKey}
            setApiKey={setApiKey}
            ticket={ticket}
            setTicket={setTicket}
            loading={loading}
            onAnalyze={handleAnalyze}
          />

          {error && <ErrorAlert message={error} />}
          {result && <ResultCard result={result} />}
        </div>

        {history.length > 0 && (
          <Dashboard history={history} onClear={clearHistory} />
        )}
      </div>
    </div>
  );
}
