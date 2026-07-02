import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function RelatedProducts({
    relatedProducts,
    addToCart,
    addToWishlist,
}) {
    return (
        <section className="related-products">

            <h2>You May Also Like</h2>

            <div className="related-grid">

                {relatedProducts.map((product) => (

                    <div
                        key={product._id}
                        className="related-card"
                    >

                        <Link
                            to={`/product/${product._id}`}
                        >

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                        </Link>

                        <h3>{product.name}</h3>

                        <p className="related-price">
                            ₹{product.price}
                        </p>

                        <p className="related-stock">

                            {product.stock > 0
                                ? "🟢 In Stock"
                                : "🔴 Out Of Stock"}

                        </p>

                        <div className="related-buttons">

                            <button
                                disabled={
                                    product.stock <= 0
                                }
                                onClick={() => {

                                    const added =
                                        addToCart(product);

                                    if (added) {

                                        toast.success(
                                            `${product.name} added to cart!`
                                        );

                                    }

                                }}
                            >
                                Add To Cart
                            </button>

                            <button
                                onClick={() =>
                                    addToWishlist(product)
                                }
                            >
                                ♡
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default RelatedProducts;