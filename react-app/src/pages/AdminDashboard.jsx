import {
  useEffect,
  useState,
} from "react";

function AdminDashboard() {

  const [stats,
    setStats] =
    useState(null);

  const [orders,
    setOrders] =
    useState([]);

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [orderSearch,
    setOrderSearch] =
    useState("");

  const [products,
    setProducts] =
    useState([]);

  const [name,
    setName] =
    useState("");

  const [category,
    setCategory] =
    useState("");

  const [price,
    setPrice] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [imageFile,
    setImageFile] =
    useState(null);

  const [imagePreview,
    setImagePreview] =
    useState("");

  const [editingProduct,
    setEditingProduct] =
    useState(null);

  const [editPrice,
    setEditPrice] =
    useState("");

  const [editStock,
    setEditStock] =
    useState("");

  const [stock,
    setStock] =
    useState("");

  const [isAdding,
     setIsAdding] = 
     useState(false);

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );



    fetch(
      `${import.meta.env.VITE_API_URL}/admin/stats`,
      {
        headers: {
          Authorization:
            token,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setStats(data)
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/admin/orders`,
      {
        headers: {
          Authorization:
            token,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setOrders(data)
      );
    fetch(
      `${import.meta.env.VITE_API_URL}/products`
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setProducts(data)
      );

  }, []);

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  const updateStatus =
    async (
      orderId,
      status
    ) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${import.meta.env.VITE_API_URL}/admin/orders/${orderId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              token,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );
      fetch(
        `${import.meta.env.VITE_API_URL}/products`
      )
        .then((res) =>
          res.json()
        )
        .then((data) =>
          setProducts(data)
        );

      window.location.reload();
    };

  const saveProduct =
    async (id) => {

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/admin/products/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                token,
            },

            body:
              JSON.stringify({
                price:
                  Number(
                    editPrice
                  ),

                stock:
                  Number(
                    editStock
                  ),
              }),
          }
        );

      const updated =
        await res.json();

      setProducts(
        products.map(
          (p) =>
            p._id === id
              ? updated
              : p
        )
      );

      setEditingProduct(
        null
      );
    };

  const deleteProduct =
    async (id) => {

      const token =
        localStorage.getItem(
          "token"
        );

      await fetch(
        `${import.meta.env.VITE_API_URL}/admin/products/${id}`,
        {
          method:
            "DELETE",

          headers: {
            Authorization:
              token,
          },
        }
      );

      setProducts(
        products.filter(
          (product) =>
            product._id !== id
        )
      );
    };

  const editProduct = (
    product
  ) => {

    setEditingProduct(
      product._id
    );

    setEditPrice(
      product.price
    );

    setEditStock(
      product.stock
    );

  };

  const uploadImage =
    async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      const formData =
        new FormData();

      formData.append(
        "image",
        imageFile
      );

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/upload`,
          {
            method: "POST",

            headers: {
              Authorization:
                token,
            },

            body:
              formData,
          }
        );

      const data =
        await res.json();

      return data.imageUrl;
    };

  const addProduct = async () => {

    try {



      if (!name.trim()) {

        toast.error(
          "Product name required"
        );

        return;
      }

      if (
        !price ||
        Number(price) <= 0
      ) {

        toast.error(
          "Valid price required"
        );

        return;
      }

      if (
        stock < 0
      ) {

        toast.error(
          "Stock cannot be negative"
        );

        return;
      }

      if (!imageFile) {
        toast.error(
          "Please select an image"
        );
        return;
      }

      setIsAdding(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const imageUrl =
        await uploadImage();

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/admin/products`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                token,
            },

            body: JSON.stringify({
              name,
              category,
              price:
                Number(price),
              stock:
                Number(stock),
              description,
              image: imageUrl,
            }),
          }
        );

      const product =
        await res.json();

      setProducts([
        ...products,
        product,
      ]);

      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setDescription("");

      setImageFile(null);


    } finally {

      setIsAdding(false);

    }

  };

  return (
    <div className="page">

      <h1>
        Admin Dashboard
      </h1>

      {stats && (

        <div
          className="stats-grid"
        >

          <div>
            Products:
            {
              stats.totalProducts
            }
          </div>

          <div>
            Orders:
            {
              stats.totalOrders
            }
          </div>

          <div>
            Revenue:
            ₹{
              stats.totalRevenue
            }
          </div>

          <div>
            Pending:
            {
              stats.pendingOrders
            }
          </div>

        </div>

      )}

      <h2>
        Users:
        {stats.totalUsers}
      </h2>

      <h2>
        Orders:
        {stats.totalOrders}
      </h2>

      <h2>
        Revenue:
        ₹{stats.revenue}
      </h2>

      <h2>
        Add Product
      </h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) =>
          setPrice(
            e.target.value
          )
        }
      />

      <input
        placeholder="Stock"
        value={stock}
        onChange={(e) =>
          setStock(
            e.target.value
          )
        }
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <input
        type="file"
        onChange={(e) => {

          const file =
            e.target.files[0];

          setImageFile(file);

          if (file) {

            setImagePreview(
              URL.createObjectURL(
                file
              )
            );

          }

        }}
      />
      {imagePreview && (

        <img
          src={imagePreview}
          alt="Preview"
          width="150"
        />

      )}
      <button
        onClick={addProduct}
        disabled={isAdding}
      >
        {isAdding
          ? "Adding Product..."
          : "Add Product"}
      </button>

      <h2>
        Products
      </h2>

      {products.map(
        (product) => (

          <div
            key={product._id}
            className="product-card"
          >

            <img
              src={product.image}
              alt={product.name}
              width="120"
            />

            <p>
              {product.name}
            </p>

            {editingProduct ===
              product._id ? (

              <>

                <label>
                  Price
                </label>

                <input
                  type="number"
                  placeholder="Enter Price"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(
                      e.target.value
                    )
                  }
                />

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  placeholder="Enter Stock"
                  value={editStock}
                  onChange={(e) =>
                    setEditStock(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={() =>
                    saveProduct(
                      product._id
                    )
                  }
                >
                  Save Changes
                </button>

              </>

            ) : (

              <>

                <p>
                  ₹{product.price}
                </p>

                <p>
                  Stock:
                  {product.stock}
                </p>

              </>

            )}

            <p>
              Stock:
              {product.stock}
            </p>

            <button
              onClick={() =>
                editProduct(product)
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteProduct(
                  product._id
                )
              }
            >
              Delete
            </button>

          </div>

        )
      )}

      <h2>
        Recent Orders
      </h2>

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(
            e.target.value
          )
        }
      >

        <option>
          All
        </option>

        <option>
          Pending
        </option>

        <option>
          Shipped
        </option>

        <option>
          Delivered
        </option>

      </select>

      <input
        type="text"
        placeholder="Search customer email..."
        value={orderSearch}
        onChange={(e) =>
          setOrderSearch(
            e.target.value
          )
        }
      />

      {orders
        .filter(
          (order) => {

            const matchesSearch =
              order.user?.email
                ?.toLowerCase()
                .includes(
                  orderSearch.toLowerCase()
                );

            const matchesStatus =
              statusFilter ===
              "All" ||

              order.status ===
              statusFilter;

            return (
              matchesSearch &&
              matchesStatus
            );

          }
        )
        .map(
          (order) => (

            <div
              key={order._id}
              className="order-card"
            >

              <p>
                User:
                {order.user?.email}
              </p>

              <select
                className={
                  order.status ===
                    "Delivered"

                    ? "status-delivered"

                    : order.status ===
                      "Shipped"

                      ? "status-shipped"

                      : "status-pending"
                }

                value={
                  order.status
                }

                onChange={async (
                  e
                ) => {

                  const token =
                    localStorage.getItem(
                      "token"
                    );

                  const res =
                    await fetch(
                      `${import.meta.env.VITE_API_URL}/admin/orders/${order._id}`,
                      {
                        method:
                          "PUT",

                        headers: {
                          "Content-Type":
                            "application/json",

                          Authorization:
                            token,
                        },

                        body:
                          JSON.stringify({
                            status:
                              e.target.value,
                          }),
                      }
                    );

                  const updated =
                    await res.json();

                  setOrders(
                    orders.map(
                      (o) =>
                        o._id ===
                          updated._id
                          ? updated
                          : o
                    )
                  );

                }}
              >

                <option>
                  Pending
                </option>

                <option>
                  Shipped
                </option>

                <option>
                  Delivered
                </option>

              </select>

              {order.items.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                  >

                    <p>
                      Product:
                      {
                        item.product
                          ?.name
                      }
                    </p>

                    <p>
                      Qty:
                      {
                        item.quantity
                      }
                    </p>

                  </div>

                )
              )}

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Shipped"
                  )
                }
              >
                Ship
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    order._id,
                    "Delivered"
                  )
                }
              >
                Deliver
              </button>



              <p>
                Total:
                ₹{order.total}
              </p>

            </div>
          )
        )}

    </div>
  );
}

export default AdminDashboard;