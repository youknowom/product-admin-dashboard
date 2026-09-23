export default function ProductForm({ initialData, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          defaultValue={initialData?.title || ""}
          placeholder="Title"
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          defaultValue={initialData?.price || ""}
          placeholder="Price"
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}
