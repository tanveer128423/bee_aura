export default function ProviderSelector({ provider, setProvider }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Select LLM Provider
      </label>
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="mock">Mock (Demo Mode)</option>
        <option value="openai">OpenAI</option>
        <option value="google">Google Gemini</option>
      </select>
    </div>
  );
}