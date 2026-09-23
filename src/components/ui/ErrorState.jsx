export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert">
      <p>{message || "Something went wrong."}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
