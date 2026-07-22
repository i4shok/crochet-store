function ProductManager({

    products,

    editingProduct,

    editPrice,
    setEditPrice,

    editStock,
    setEditStock,

    editProduct,

    saveProduct,

    deleteProduct,

    productSearch,

    setProductSearch,

    stockFilter,

    setStockFilter,

}) {

    return (

        <section className="product-manager">

            <h2>

                Products

            </h2>

            <div className="product-toolbar">

                <input

                    type="text"

                    placeholder="Search products..."

                    value={productSearch}

                    onChange={(e) =>

                        setProductSearch(

                            e.target.value

                        )

                    }

                />

                <select

                    value={stockFilter}

                    onChange={(e) =>

                        setStockFilter(

                            e.target.value

                        )

                    }

                >

                    <option>

                        All

                    </option>

                    <option>

                        In Stock

                    </option>

                    <option>

                        Low Stock

                    </option>

                    <option>

                        Out of Stock

                    </option>

                </select>

            </div>

            {

                <div className="admin-products-table">

                    <div className="table-head">

                        <span>Image</span>

                        <span>Product</span>

                        <span>Price</span>

                        <span>Stock</span>

                        <span>Actions</span>

                    </div>

                    {

                        products

                            .filter(product => {

                                const matchesSearch =

                                    product.name

                                        .toLowerCase()

                                        .includes(

                                            productSearch.toLowerCase()

                                        );

                                const matchesStock =

                                    stockFilter === "All"

                                    ||

                                    (stockFilter === "In Stock"

                                        && product.stock > 5)

                                    ||

                                    (stockFilter === "Low Stock"

                                        && product.stock > 0

                                        && product.stock <= 5)

                                    ||

                                    (stockFilter === "Out of Stock"

                                        && product.stock === 0);

                                return matchesSearch

                                    && matchesStock;

                            })

                            .map((product) => (

                                <div

                                    key={product._id}

                                    className="table-row"

                                >

                                    <img

                                        src={product.image}

                                        alt={product.name}

                                    />

                                    <div className="table-row-name">

                                        <strong>

                                            {product.name}

                                        </strong>

                                        <p>

                                            {product.category}

                                        </p>

                                    </div>

                                    {
                                        editingProduct === product._id
                                            ? (
                                                <input
                                                    type="number"
                                                    value={editPrice}
                                                    onChange={(e) =>
                                                        setEditPrice(e.target.value)
                                                    }
                                                />
                                            )
                                            : (
                                                <span className="table-row-price">
                                                    ₹{product.price}
                                                </span>
                                            )
                                    }

                                    {
                                        editingProduct === product._id
                                            ? (
                                                <input
                                                    type="number"
                                                    value={editStock}
                                                    onChange={(e) =>
                                                        setEditStock(e.target.value)
                                                    }
                                                />
                                            )
                                            : (
                                                <div className="stock-info">

                                                    <span>

                                                        {product.stock}

                                                    </span>

                                                    <div

                                                        className={`stock-badge ${product.stock === 0

                                                            ? "out"

                                                            : product.stock <= 5

                                                                ? "low"

                                                                : "available"

                                                            }`}

                                                    >

                                                        {

                                                            product.stock === 0

                                                                ? "Out of Stock"

                                                                : product.stock <= 5

                                                                    ? "Low Stock"

                                                                    : "In Stock"

                                                        }

                                                    </div>

                                                </div>
                                            )
                                    }

                                    <div className="table-actions">

                                        {
                                            editingProduct === product._id
                                                ? (
                                                    <button
                                                        onClick={() =>
                                                            saveProduct(product._id)
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        onClick={() =>
                                                            editProduct(product)
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                )
                                        }

                                        <button
                                            onClick={() =>
                                                deleteProduct(product._id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))

                    }

                </div>

            }

        </section>

    );

}

export default ProductManager;