import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import DashboardStats from "../components/admin/DashboardStats";
import AddProductForm from "../components/admin/AddProductForm";
import ProductManager from "../components/admin/ProductManager";
import OrderManager from "../components/admin/OrderManager";
import ContactRequestsManager from "../components/admin/ContactRequestsManager";
import "../styles/AdminDashboard.css";
import logoFull from "../assets/branding/logo-full.png";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sun,
  Moon,
  Home,
  LogOut,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";

function AdminDashboard() {

  const navigate = useNavigate();

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

  const [productSearch,
    setProductSearch] =
    useState("");

  const [stockFilter,
    setStockFilter] =
    useState("All");

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

  const [imageFiles,
    setImageFiles] =
    useState([]);

  const [imagePreviews,
    setImagePreviews] =
    useState([]);

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

  const [
    bestSelling,
    setBestSelling,
  ] = useState([]);

  const [contactRequests, setContactRequests] = useState([]);
  const [contactCategoryFilter, setContactCategoryFilter] = useState("All");
  const [contactStatusFilter, setContactStatusFilter] = useState("All");
  const [contactSearch, setContactSearch] = useState("");

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNavReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
    fetch(
      `${import.meta.env.VITE_API_URL}/admin/best-selling`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setBestSelling(data)
      );

    fetch(
      `${import.meta.env.VITE_API_URL}/admin/contact-requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) =>
        res.json()
      )
      .then((data) =>
        setContactRequests(data)
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

            Authorization: `Bearer ${token}`,
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

              Authorization: `Bearer ${token}`,
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

  const updateRequestStatus = async (id, status) => {

    const token = localStorage.getItem("token");

    const res = await fetch(

      `${import.meta.env.VITE_API_URL}/admin/contact-requests/${id}`,

      {

        method: "PUT",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },

        body: JSON.stringify({ status }),

      }

    );

    const updated = await res.json();

    setContactRequests(

      contactRequests.map((r) =>

        r._id === id ? updated : r

      )

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
            Authorization: `Bearer ${token}`,
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

  const uploadImages = async () => {

    const token = localStorage.getItem("token");
    const urls = [];

    for (const file of imageFiles) {

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      urls.push(data.imageUrl);
    }

    return urls;
  };

  const addProduct = async (e) => {

    e.preventDefault();

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

      if (imageFiles.length === 0) {
        toast.error(
          "Please select at least one image"
        );
        return;
      }

      setIsAdding(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const imageUrls =
        await uploadImages();

      const res =
        await fetch(
          `${import.meta.env.VITE_API_URL}/admin/products`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              name,
              category,
              price:
                Number(price),
              stock:
                Number(stock),
              description,
              image: imageUrls[0],
              images: imageUrls,
            }),
          }
        );

      const product = await res.json();

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

      setImageFiles([]);
      setImagePreviews([]);

    } catch (err) {

      console.error(err);

      toast.error("Failed to add product");


    } finally {

      setIsAdding(false);

    }

  };

  const tabMeta = {
    dashboard: { label: "Dashboard", sub: "Welcome back. Here's what's happening today." },
    products: { label: "Products", sub: "Manage your crochet collection." },
    orders: { label: "Orders", sub: "Manage customer orders." },
    requests: { label: "Contact Requests", sub: "Review customer inquiries and requests." },
  };

  return (
    <div className="admin-page" data-theme={theme}>

      <aside className="admin-sidebar">

        <div className="admin-sidebar-inner">

          <div className="admin-logo">

            <img
              src={logoFull}
              alt="Knot & Bloom"
              className="admin-logo-image"
            />

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

            <button

              className={
                activeTab === "requests"
                  ? "sidebar-active"
                  : ""
              }

              onClick={() =>
                setActiveTab("requests")
              }

            >

              <Mail size={20} />

              Contact Requests

            </button>

          </nav>

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
              className="home-btn"
              onClick={goHome}
            >

              <Home size={18} />

              Back to Site

            </button>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>

      </aside>

      <main className="admin-content">

        <div className="admin-header">

          <div>

            <h1>

              {tabMeta[activeTab].label}

            </h1>

            <p>

              {tabMeta[activeTab].sub}

            </p>

          </div>

          <div className="admin-header-actions">

            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="mobile-logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

        {activeTab === "dashboard" && (

          <>

            <DashboardStats
              stats={stats}
            />

            <section className="quick-actions">

              <h2>

                Quick Actions

              </h2>

              <section className="low-stock-section">

                <h2>

                  ⚠ Low Stock Products

                </h2>

                <div className="low-stock-list">

                  {

                    products

                      .filter(product => product.stock <= 5)

                      .slice(0, 5)

                      .map(product => (

                        <div

                          key={product._id}

                          className="low-stock-item"

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

                              {product.stock} remaining

                            </p>

                          </div>

                        </div>

                      ))

                  }

                </div>

              </section>

              <section className="recent-orders-widget">

                <h2>

                  Recent Orders

                </h2>

                <div className="recent-orders-table">

                  {

                    orders

                      .slice(0, 5)

                      .map(order => (

                        <div

                          key={order._id}

                          className="recent-order-row"

                        >

                          <span>

                            #

                            {order._id.slice(-6).toUpperCase()}

                          </span>

                          <span>

                            {order.user?.email}

                          </span>

                          <span>

                            ₹{order.total}

                          </span>

                          <span>

                            {order.status}

                          </span>

                        </div>

                      ))

                  }

                </div>

              </section>

              <section className="best-selling-widget">

                <h2>

                  🏆 Best Sellers

                </h2>

                <div className="best-selling-list">

                  {

                    bestSelling.map(item => (

                      <div

                        key={item._id}

                        className="best-selling-row"

                      >

                        <img

                          src={item.product.image}

                          alt={item.product.name}

                        />

                        <div>

                          <strong>

                            {item.product.name}

                          </strong>

                          <p>

                            Sold: {item.sold}

                          </p>

                        </div>

                      </div>

                    ))

                  }

                </div>

              </section>

              <div className="quick-actions-grid">

                <button
                  onClick={() =>
                    setActiveTab("products")
                  }
                >

                  ➕ Add Product

                </button>

                <button
                  onClick={() =>
                    setActiveTab("orders")
                  }
                >

                  📦 Manage Orders

                </button>

                <button
                  onClick={() =>
                    setActiveTab("products")
                  }
                >

                  🛍 Manage Products

                </button>

              </div>

            </section>

          </>

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
                imageFiles={imageFiles}
                setImageFiles={setImageFiles}
                imagePreviews={imagePreviews}
                setImagePreviews={setImagePreviews}
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
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
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
        {activeTab === "requests" && (
          <section id="requests">
            <ContactRequestsManager
              requests={contactRequests}
              categoryFilter={contactCategoryFilter}
              setCategoryFilter={setContactCategoryFilter}
              statusFilter={contactStatusFilter}
              setStatusFilter={setContactStatusFilter}
              requestSearch={contactSearch}
              setRequestSearch={setContactSearch}
              updateRequestStatus={updateRequestStatus}
            />
          </section>
        )}
      </main>

      <nav className={`admin-mobile-navbar${navReady ? " is-in" : ""}`}>

        <button
          className={activeTab === "dashboard" ? "mobile-nav-active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={22} />
          <span>Dashboard</span>
        </button>

        <button
          className={activeTab === "products" ? "mobile-nav-active" : ""}
          onClick={() => setActiveTab("products")}
        >
          <Package size={22} />
          <span>Products</span>
        </button>

        <button
          className={activeTab === "orders" ? "mobile-nav-active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingCart size={22} />
          <span>Orders</span>
        </button>

        <button
          className={activeTab === "requests" ? "mobile-nav-active" : ""}
          onClick={() => setActiveTab("requests")}
        >
          <Mail size={22} />
          <span>Requests</span>
        </button>

        <button onClick={goHome}>
          <Home size={22} />
          <span>Home</span>
        </button>

      </nav>

    </div>
  );
}

export default AdminDashboard;