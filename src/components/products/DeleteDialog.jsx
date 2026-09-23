export default function DeleteDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true">
      <p>Are you sure you want to delete this product?</p>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onConfirm}>
        Delete
      </button>
    </div>
  );
}
