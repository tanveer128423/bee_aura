export default function Dashboard({ history, onClear }) {
  const high = history.filter((t) => t.priority === "High").length;
  const medium = history.filter((t) => t.priority === "Medium").length;
  const low = history.filter((t) => t.priority === "Low").length;
  const escalated = history.filter((t) => t.escalation_required).length;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Ticket Dashboard Overview
        </h2>

        <button
          onClick={onClear}
          className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-lg"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-xl font-bold text-red-700">{high}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Medium Priority</p>
          <p className="text-xl font-bold text-yellow-700">{medium}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Low Priority</p>
          <p className="text-xl font-bold text-green-700">{low}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Escalated</p>
          <p className="text-xl font-bold text-purple-700">{escalated}</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {history.map((ticket) => (
          <div
            key={ticket.ticket_id}
            className="border rounded-lg p-3 text-sm bg-gray-50"
          >
            <div className="flex justify-between">
              <span className="font-medium">{ticket.ticket_id}</span>
              <span>{ticket.timestamp}</span>
            </div>
            <div className="text-gray-600 mt-1">
              {ticket.business_category} | {ticket.priority} |{" "}
              {ticket.assigned_team}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}