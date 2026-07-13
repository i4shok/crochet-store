import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";

function RelatedProducts({
    relatedProducts,
    addToCart,
    addToWishlist,
}) {
    return (
        <section>

            <h2>

                You May Also Like

            </h2>

            <div className="related-grid">
                {

                    relatedProducts.length === 0

                        ?

                        <ProductCardSkeleton

                            count={4}

                        />

                        :

                        relatedProducts.map(

                            (product) => (

                                <ProductCard

                                    key={product._id}

                                    product={product}

                                    showQuickView={false}

                                />

                            )

                        )

                }
            </div>

        </section>
    );
}

export default RelatedProducts;