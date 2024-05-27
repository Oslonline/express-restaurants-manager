export default function SuccessMessage({ show, message }) {
  if (!show) return null;

  return <div className="fixed bottom-4 right-4 rounded-md bg-green-500 px-4 py-2 text-white">{message}</div>;
}
