export default function ErrorAlert({ message }) {
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg text-sm">
      {message}
    </div>
  );
}