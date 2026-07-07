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

}) {

    return (

        <section className="product-manager">

            <h2>

                Products

            </h2>

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

                        products.map(product => (

                            <div

                                key={product._id}

                                className="table-row"

                            >

                                <img

                                    src={product.image}

                                    alt={product.name}

                                />

                                <div>

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
                                            <span>
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
                                            <span>
                                                {product.stock}
                                            </span>
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