export default function ConfirmationModal({ show, onClose, onConfirm, message }) {
  if (!show) return null;

  return (
    <div onClick={onClose} className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50">
      <div onClick={(e) => e.stopPropagation()} className="rounded-md bg-white p-4">
        <p className="text-xl font-semibold">{message.title}</p>
        {message.content && <p className="text-sm text-gray-600">{message.content}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onConfirm} className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-gray-50 hover:bg-transparent hover:text-red-600">
            Supprimer
          </button>
          <button onClick={onClose} className="rounded-md border border-gray-500 bg-gray-500 px-4 py-2 text-gray-50 hover:bg-transparent hover:text-gray-500">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
