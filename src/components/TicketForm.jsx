export default function TicketForm({
  provider,
  apiKey,
  setApiKey,
  ticket,
  setTicket,
  loading,
  onAnalyze,
}) {
  const getProviderLabel = () => {
    if (provider === "openai") return "OpenAI API Key";
    if (provider === "google") return "Gemini API Key";
    if (provider === "grok") return "Grok API Key";
    return "";
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {getProviderLabel()}
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          ERP Support Ticket
        </label>
        <textarea
          rows="4"
          value={ticket}
          onChange={(e) => setTicket(e.target.value)}
          placeholder="Example: Unable to post invoice in SAP Finance module..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading}
        className={`w-full font-medium py-2 rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Ticket"}
      </button>
    </>
  );
}
