export function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="py-2 px-4 bg-blue-500 text-sm text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
