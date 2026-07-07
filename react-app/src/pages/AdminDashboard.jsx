import {
  useEffect,
  useState,
} from "react";
import DashboardStats from "../components/admin/DashboardStats";
import AddProductForm from "../components/admin/AddProductForm";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import "../styles/AdminDashboard.css";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";

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

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const fetchProducts = async () => {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products`
    );

    const data = await res.json();

    setProducts(data);

  };

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
      toast.success("Product updated");

      fetchProducts();

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
      toast.success("Product deleted");
      fetchProducts();
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

  const uploadImage = async () => {

    console.log("1 - uploadImage started");

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("image", imageFile);

    console.log("2 - sending upload request");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    console.log("3 - upload response", res.status);

    const data = await res.json();

    console.log("4 - upload data", data);

    return data.imageUrl;
  };

  const addProduct = async (e) => {

    e.preventDefault();

    console.log("🔥 addProduct called");

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

      console.log("Status:", res.status);

      const product = await res.json();

      console.log(product);

      if (!res.ok) {

        toast.error(
          product.message
        );

        return;

      }

      toast.success(
        "Product Added"
      );
      fetchProducts();

      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setDescription("");

      setImageFile(null);
      setImagePreview("");

    } catch (err) {

      console.error(err);

      toast.error("Failed to add product");


    } finally {

      setIsAdding(false);

    }

  };

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-logo">

          <div className="admin-logo-icon">

            🧶

          </div>

          <div>

            <h2>

              Knot & Bloom

            </h2>

            <span>

              Admin Panel

            </span>

          </div>

        </div>

        <nav>

          <div className="admin-sidebar-footer">

            <div className="admin-user">

              <div className="admin-avatar">

                A

              </div>

              <div>

                <strong>

                  Admin

                </strong>

                <p>

                  Administrator

                </p>

              </div>

            </div>

            <button
              className="logout-btn"
            >

              Logout

            </button>

          </div>

          <button

            className={
              activeTab === "dashboard"
                ? "sidebar-active"
                : ""
            }

            onClick={() =>
              setActiveTab("dashboard")
            }

          >

            <LayoutDashboard size={20} />

            Dashboard

          </button>

          <button

            className={
              activeTab === "products"
                ? "sidebar-active"
                : ""
            }

            onClick={() =>
              setActiveTab("products")
            }

          >

            <Package size={20} />

            Products

          </button>

          <button

            className={
              activeTab === "orders"
                ? "sidebar-active"
                : ""
            }

            onClick={() =>
              setActiveTab("orders")
            }

          >

            <ShoppingCart size={20} />

            Orders

          </button>

        </nav>

      </aside>

      <main className="admin-content">

        <div className="admin-header">

          <div>

            <h1>

              {
                activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "products"
                    ? "Products"
                    : "Orders"
              }

            </h1>

            <p>

              {
                activeTab === "dashboard"
                  ? "Welcome back. Here's what's happening today."

                  : activeTab === "products"
                    ? "Manage your crochet collection."

                    : "Manage customer orders."
              }

            </p>

          </div>

        </div>

        {activeTab === "dashboard" && (

          <DashboardStats
            stats={stats}
          />

        )}

        {activeTab === "products" && (

          <>
            <section id="add-product">
              <AddProductForm
                name={name}
                setName={setName}
                category={category}
                setCategory={setCategory}
                price={price}
                setPrice={setPrice}
                stock={stock}
                setStock={setStock}
                description={description}
                setDescription={setDescription}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                addProduct={addProduct}
                isAdding={isAdding}
              />
            </section>

            <section id="products">
              <ProductManager
                products={products}
                editingProduct={editingProduct}
                editPrice={editPrice}
                setEditPrice={setEditPrice}
                editStock={editStock}
                setEditStock={setEditStock}
                editProduct={editProduct}
                saveProduct={saveProduct}
                deleteProduct={deleteProduct}
              />
            </section>
          </>
        )}

        {activeTab === "orders" && (
          <section id="orders">
            <OrderManager
              orders={orders}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              orderSearch={orderSearch}
              setOrderSearch={setOrderSearch}
              updateStatus={updateStatus}
              setOrders={setOrders}
            />
          </section>
        )}
      </main>

    </div>
  );
}

export default AdminDashboard;