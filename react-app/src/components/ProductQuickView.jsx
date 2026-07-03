import {
    useContext,
    useEffect,
    useState,
} from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishListContext";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import "../styles/ProductQuickView.css";
import { Link } from "react-router-dom";

function ProductQuickView({

    product,

    isOpen,

    onClose,

}) {

    const {

        addToCart,

    } = useContext(CartContext);

    const {

        addToWishlist,

    } = useContext(WishlistContext);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {

        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const handleEsc = (e) => {

            if (e.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener(
            "keydown",
            handleEsc
        );

        return () => {

            document.body.style.overflow = "auto";

            window.removeEventListener(
                "keydown",
                handleEsc
            );

        };

    }, [isOpen, onClose]);

    useEffect(() => {

        if (product) {

            setQuantity(1);

        }

    }, [product]);

    if (!isOpen || !product) return null;

    return (

        <div
            className="quickview-overlay"
            onClick={onClose}
        >

            <div
                className="quickview-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="close-btn"
                    onClick={onClose}
                >

                    ✕

                </button>

                <div className="quickview-left">

                    <img
                        src={product.image}
                        alt={product.name}
                        draggable="false"
                    />

                </div>

                <div className="quickview-right">

                    <span className="quickview-category">

                        {product.category}

                    </span>

                    <h2>

                        {product.name}

                    </h2>

                    <StarRating
                        rating={product.rating || 5}
                    />

                    <h3>

                        ₹{product.price}

                    </h3>

                    <p>

                        {product.description}

                    </p>

                    <div className="quickview-stock">

                        {product.stock > 0

                            ? "🟢 In Stock"

                            : "🔴 Out Of Stock"}

                    </div>

                    <div className="quickview-quantity">

                        <span>

                            Quantity

                        </span>

                        <div className="quantity-selector">

                            <button

                                onClick={() =>

                                    setQuantity(q =>

                                        Math.max(1, q - 1)

                                    )

                                }

                            >

                                −

                            </button>

                            <span>

                                {quantity}

                            </span>

                            <button

                                onClick={() =>

                                    setQuantity(q =>

                                        Math.min(product.stock, q + 1)

                                    )

                                }

                            >

                                +

                            </button>

                        </div>

                    </div>

                    <div className="quickview-buttons">

                        <button

                            onClick={() => {

                                let added = true;

                                for (

                                    let i = 0;

                                    i < quantity;

                                    i++

                                ) {

                                    const success = addToCart(product);

                                    if (!success) {

                                        added = false;

                                        break;

                                    }

                                }

                                if (added) {

                                    toast.success(

                                        `${quantity} ${product.name} added to cart`

                                    );

                                }

                                if (added) {

                                    toast.success(
                                        `${product.name} added to cart`
                                    );

                                }

                            }}

                        >

                            Add To Cart

                        </button>

                        <button

                            onClick={() => {

                                addToWishlist(product);

                                toast.success(
                                    "Added to wishlist"
                                );

                            }}

                        >

                            Wishlist

                        </button>

                    </div>

                    <Link

                        to={`/product/${product._id}`}

                        className="view-full-btn"

                        onClick={onClose}

                    >

                        View Full Details →

                    </Link>

                </div>

            </div>

        </div>

    );

}

export default ProductQuickView;