export default function ProductCard({ product }) {
  return (
    <div>
      <h3>{product?.title}</h3>
      <p>{product?.price}</p>
    </div>
  );
}
