export default function ResultCard({ result }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Ticket Analysis
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

        <div>
          <p className="text-gray-500">Ticket ID</p>
          <p className="font-medium">{result.ticket_id}</p>
        </div>

        <div>
          <p className="text-gray-500">Timestamp</p>
          <p className="font-medium">{result.timestamp}</p>
        </div>

        <div>
          <p className="text-gray-500">Confidence</p>
          <p className="font-medium">{result.confidence}</p>
        </div>

        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-medium">{result.business_category}</p>
        </div>

        <div>
          <p className="text-gray-500">Issue Type</p>
          <p className="font-medium">{result.issue_type}</p>
        </div>

        <div>
          <p className="text-gray-500">Assigned Team</p>
          <p className="font-medium">{result.assigned_team}</p>
        </div>

        <div>
          <p className="text-gray-500">Priority</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              result.priority === "High"
                ? "bg-red-100 text-red-700"
                : result.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {result.priority}
          </span>
        </div>

        <div>
          <p className="text-gray-500">Escalation</p>
          <p className="font-medium">
            {result.escalation_required ? "Yes" : "No"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Human Review</p>
          <p className="font-medium">
            {result.human_review_required ? "Required" : "Not Required"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">SLA (Hours)</p>
          <p className="font-medium">{result.sla_target_hours}</p>
        </div>

      </div>

      <div>
        <p className="text-gray-500 text-sm mb-1">
          First Level Response
        </p>
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-700">
          {result.first_level_response}
        </div>
      </div>
    </div>
  );
}