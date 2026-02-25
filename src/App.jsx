import { useState, useEffect, useContext, createContext, useReducer, useCallback, useRef } from "react";

// ============================================================
// CONSTANTS
// ============================================================
const LOW_STOCK_THRESHOLD = 20;
const CATEGORIES = ["Dairy", "Bakery", "Produce", "Meat", "Frozen", "Beverages", "Snacks", "Cleaning", "Personal Care", "Pharmacy"];
const PAYMENT_METHODS = ["Cash", "Credit Card", "Debit Card", "UPI", "Store Credit"];

// ============================================================
// DUMMY DATA
// ============================================================
const INITIAL_PRODUCTS = [
  { id: "P001", productName: "Whole Milk 1L", SKU: "MLK-001", category: "Dairy", price: 2.49, quantity: 85, supplier: "S001", expiryDate: "2026-03-10" },
  { id: "P002", productName: "Sourdough Bread", SKU: "BRD-002", category: "Bakery", price: 3.99, quantity: 12, supplier: "S002", expiryDate: "2026-02-27" },
  { id: "P003", productName: "Organic Bananas 1kg", SKU: "BAN-003", category: "Produce", price: 1.79, quantity: 0, supplier: "S003", expiryDate: "2026-02-28" },
  { id: "P004", productName: "Chicken Breast 500g", SKU: "CHK-004", category: "Meat", price: 6.99, quantity: 34, supplier: "S004", expiryDate: "2026-02-26" },
  { id: "P005", productName: "Frozen Pizza Margherita", SKU: "FRZ-005", category: "Frozen", price: 5.49, quantity: 7, supplier: "S005", expiryDate: "2026-12-15" },
  { id: "P006", productName: "Sparkling Water 6-Pack", SKU: "BEV-006", category: "Beverages", price: 4.29, quantity: 62, supplier: "S006", expiryDate: "2027-06-01" },
  { id: "P007", productName: "Cheddar Cheese 200g", SKU: "CHE-007", category: "Dairy", price: 3.79, quantity: 18, supplier: "S001", expiryDate: "2026-04-20" },
  { id: "P008", productName: "Greek Yogurt 500g", SKU: "YOG-008", category: "Dairy", price: 2.99, quantity: 0, supplier: "S001", expiryDate: "2026-03-05" },
  { id: "P009", productName: "Granola Bars 8pk", SKU: "SNK-009", category: "Snacks", price: 4.99, quantity: 43, supplier: "S007", expiryDate: "2026-08-30" },
  { id: "P010", productName: "Laundry Detergent 2L", SKU: "CLN-010", category: "Cleaning", price: 8.99, quantity: 22, supplier: "S008", expiryDate: "2028-01-01" },
  { id: "P011", productName: "Shampoo 400ml", SKU: "PRC-011", category: "Personal Care", price: 5.29, quantity: 9, supplier: "S009", expiryDate: "2027-09-15" },
  { id: "P012", productName: "Ibuprofen 200mg 24ct", SKU: "PHR-012", category: "Pharmacy", price: 6.49, quantity: 15, supplier: "S010", expiryDate: "2025-11-01" },
  { id: "P013", productName: "Orange Juice 1L", SKU: "BEV-013", category: "Beverages", price: 3.49, quantity: 38, supplier: "S006", expiryDate: "2026-03-20" },
  { id: "P014", productName: "Pasta Penne 500g", SKU: "SNK-014", category: "Snacks", price: 1.99, quantity: 74, supplier: "S007", expiryDate: "2027-05-10" },
  { id: "P015", productName: "Salted Butter 250g", SKU: "DAI-015", category: "Dairy", price: 2.89, quantity: 5, supplier: "S001", expiryDate: "2026-05-01" },
  { id: "P016", productName: "Tomato Sauce 500ml", SKU: "PRD-016", category: "Produce", price: 2.19, quantity: 55, supplier: "S003", expiryDate: "2027-11-20" },
  { id: "P017", productName: "Beef Mince 400g", SKU: "MEA-017", category: "Meat", price: 7.49, quantity: 0, supplier: "S004", expiryDate: "2026-02-25" },
  { id: "P018", productName: "Ice Cream Vanilla 1L", SKU: "FRZ-018", category: "Frozen", price: 4.79, quantity: 19, supplier: "S005", expiryDate: "2026-10-01" },
  { id: "P019", productName: "Green Tea 20 bags", SKU: "BEV-019", category: "Beverages", price: 3.29, quantity: 67, supplier: "S006", expiryDate: "2027-02-14" },
  { id: "P020", productName: "Dishwasher Pods 30ct", SKU: "CLN-020", category: "Cleaning", price: 9.49, quantity: 11, supplier: "S008", expiryDate: "2028-03-01" },
];

const INITIAL_SUPPLIERS = [
  { id: "S001", name: "DairyFresh Co.", contact: "John Miller", email: "john@dairyfresh.com", phone: "+1-555-0101", address: "123 Farm Rd, Wisconsin", products: ["P001", "P007", "P008", "P015"] },
  { id: "S002", name: "Artisan Bakers Ltd.", contact: "Sarah Chen", email: "sarah@artisanbakers.com", phone: "+1-555-0102", address: "45 Grain St, Portland", products: ["P002"] },
  { id: "S003", name: "GreenLeaf Produce", contact: "Mike Torres", email: "mike@greenleaf.com", phone: "+1-555-0103", address: "789 Valley Rd, California", products: ["P003", "P016"] },
  { id: "S004", name: "Prime Meats Inc.", contact: "Lisa Park", email: "lisa@primemeats.com", phone: "+1-555-0104", address: "22 Stockyard Ave, Texas", products: ["P004", "P017"] },
  { id: "S005", name: "FrostLine Foods", contact: "Tom Brown", email: "tom@frostline.com", phone: "+1-555-0105", address: "5 Cold Chain Blvd, Minnesota", products: ["P005", "P018"] },
  { id: "S006", name: "BevWorld Distributors", contact: "Anna White", email: "anna@bevworld.com", phone: "+1-555-0106", address: "300 Harbor Dr, Florida", products: ["P006", "P013", "P019"] },
  { id: "S007", name: "Snack Nation LLC", contact: "Chris Lee", email: "chris@snacknation.com", phone: "+1-555-0107", address: "88 Crunch St, Chicago", products: ["P009", "P014"] },
  { id: "S008", name: "CleanHome Supply", contact: "Rachel Kim", email: "rachel@cleanhome.com", phone: "+1-555-0108", address: "12 Sparkling Ave, Ohio", products: ["P010", "P020"] },
  { id: "S009", name: "BeautyEssentials Inc.", contact: "David Patel", email: "david@beautyessentials.com", phone: "+1-555-0109", address: "55 Glow St, NYC", products: ["P011"] },
  { id: "S010", name: "MediSupply Corp.", contact: "Emma Clark", email: "emma@medisupply.com", phone: "+1-555-0110", address: "900 Health Blvd, Boston", products: ["P012"] },
];

const SALES_DATA = [
  { day: "Mon", sales: 4200, transactions: 143 },
  { day: "Tue", sales: 3800, transactions: 127 },
  { day: "Wed", sales: 5100, transactions: 168 },
  { day: "Thu", sales: 4600, transactions: 152 },
  { day: "Fri", sales: 6800, transactions: 221 },
  { day: "Sat", sales: 8200, transactions: 274 },
  { day: "Sun", sales: 7400, transactions: 247 },
];

// ============================================================
// UTILS
// ============================================================
const getStockStatus = (qty, threshold = LOW_STOCK_THRESHOLD) => {
  if (qty === 0) return "out";
  if (qty <= threshold) return "low";
  return "in";
};

const isExpired = (dateStr) => new Date(dateStr) < new Date();
const isNearExpiry = (dateStr, days = 7) => {
  const expiry = new Date(dateStr);
  const now = new Date();
  const diff = (expiry - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
};

const formatCurrency = (v) => `$${Number(v).toFixed(2)}`;
const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const generateId = (prefix) => `${prefix}${Date.now().toString(36).toUpperCase()}`;

// ============================================================
// CONTEXT + REDUCER
// ============================================================
const AppContext = createContext(null);

const initialState = {
  products: INITIAL_PRODUCTS,
  suppliers: INITIAL_SUPPLIERS,
  cart: [],
  invoices: [],
  threshold: LOW_STOCK_THRESHOLD,
  darkMode: false,
  toasts: [],
  activeAlerts: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, { ...action.payload, id: generateId("P") }] };
    case "UPDATE_PRODUCT":
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };
    case "ADD_TO_CART": {
      const existing = state.cart.find(i => i.productId === action.payload.productId);
      if (existing) {
        return { ...state, cart: state.cart.map(i => i.productId === action.payload.productId ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };
    case "UPDATE_CART_QTY":
      return { ...state, cart: state.cart.map(i => i.productId === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "CHECKOUT": {
      const updatedProducts = state.products.map(p => {
        const item = state.cart.find(c => c.productId === p.id);
        if (item) return { ...p, quantity: Math.max(0, p.quantity - item.qty) };
        return p;
      });
      const invoice = {
        id: generateId("INV"),
        items: state.cart,
        total: action.payload.total,
        paymentMethod: action.payload.paymentMethod,
        date: new Date().toISOString(),
      };
      return { ...state, products: updatedProducts, cart: [], invoices: [invoice, ...state.invoices] };
    }
    case "ADD_SUPPLIER":
      return { ...state, suppliers: [...state.suppliers, { ...action.payload, id: generateId("S"), products: [] }] };
    case "UPDATE_SUPPLIER":
      return { ...state, suppliers: state.suppliers.map(s => s.id === action.payload.id ? action.payload : s) };
    case "DELETE_SUPPLIER":
      return { ...state, suppliers: state.suppliers.filter(s => s.id !== action.payload) };
    case "SET_THRESHOLD":
      return { ...state, threshold: action.payload };
    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: id }), 3500);
  }, []);

  const alertProducts = state.products.filter(p => getStockStatus(p.quantity, state.threshold) !== "in" || isExpired(p.expiryDate) || isNearExpiry(p.expiryDate));

  return (
    <AppContext.Provider value={{ state, dispatch, addToast, alertProducts }}>
      {children}
    </AppContext.Provider>
  );
}

const useApp = () => useContext(AppContext);

// ============================================================
// REUSABLE UI COMPONENTS
// ============================================================

function Badge({ status }) {
  const styles = {
    in: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    low: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    out: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  const labels = { in: "In Stock", low: "Low Stock", out: "Out of Stock" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ExpiryBadge({ date }) {
  if (isExpired(date)) return <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">Expired</span>;
  if (isNearExpiry(date)) return <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white">Near Expiry</span>;
  return null;
}

function Modal({ title, onClose, children, size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        className={`px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <select className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", ...props }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500",
    secondary: "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 focus:ring-gray-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 focus:ring-gray-400",
    warning: "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-base" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]}`} {...props}>{children}</button>;
}

function KPICard({ title, value, sub, icon, color }) {
  const colors = {
    teal: "from-teal-500 to-cyan-600",
    amber: "from-amber-500 to-orange-500",
    red: "from-red-500 to-rose-600",
    violet: "from-violet-500 to-purple-600",
    emerald: "from-emerald-500 to-green-600",
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1 font-display">{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-xl shadow-lg`}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 max-w-xs">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function Toasts({ toasts }) {
  const colors = { success: "bg-emerald-600", error: "bg-red-600", warning: "bg-amber-500", info: "bg-teal-600" };
  const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`${colors[t.type]} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-slide-up max-w-xs`}>
          <span className="text-base">{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MINI BAR CHART
// ============================================================
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.sales));
  return (
    <div className="flex items-end gap-2 h-32 mt-4">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-teal-600 to-cyan-400 transition-all hover:from-teal-500 hover:to-cyan-300 cursor-pointer group relative"
            style={{ height: `${(d.sales / max) * 100}%` }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {formatCurrency(d.sales)}
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// PRODUCT FORM
// ============================================================
function ProductForm({ initial, onSave, onClose, suppliers }) {
  const empty = { productName: "", SKU: "", category: CATEGORIES[0], price: "", quantity: "", supplier: suppliers[0]?.id || "", expiryDate: "" };
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = "Required";
    if (!form.SKU.trim()) e.SKU = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = "Valid price required";
    if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = "Valid quantity required";
    if (!form.expiryDate) e.expiryDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, price: Number(form.price), quantity: Number(form.quantity) });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Product Name" value={form.productName} onChange={e => set("productName", e.target.value)} error={errors.productName} />
      <Input label="SKU" value={form.SKU} onChange={e => set("SKU", e.target.value)} error={errors.SKU} />
      <Select label="Category" value={form.category} onChange={e => set("category", e.target.value)} options={CATEGORIES.map(c => ({ value: c, label: c }))} />
      <Input label="Price ($)" type="number" min="0" step="0.01" value={form.price} onChange={e => set("price", e.target.value)} error={errors.price} />
      <Input label="Quantity" type="number" min="0" value={form.quantity} onChange={e => set("quantity", e.target.value)} error={errors.quantity} />
      <Select label="Supplier" value={form.supplier} onChange={e => set("supplier", e.target.value)} options={suppliers.map(s => ({ value: s.id, label: s.name }))} />
      <Input label="Expiry Date" type="date" value={form.expiryDate} onChange={e => set("expiryDate", e.target.value)} error={errors.expiryDate} className="col-span-2" />
      <div className="col-span-2 flex justify-end gap-3 pt-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={handleSave}>{initial ? "Update Product" : "Add Product"}</Btn>
      </div>
    </div>
  );
}

// ============================================================
// SUPPLIER FORM
// ============================================================
function SupplierForm({ initial, onSave, onClose }) {
  const empty = { name: "", contact: "", email: "", phone: "", address: "" };
  const [form, setForm] = useState(initial || empty);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Company Name" value={form.name} onChange={e => set("name", e.target.value)} />
      <Input label="Contact Person" value={form.contact} onChange={e => set("contact", e.target.value)} />
      <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
      <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
      <div className="col-span-2">
        <Input label="Address" value={form.address} onChange={e => set("address", e.target.value)} />
      </div>
      <div className="col-span-2 flex justify-end gap-3 pt-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave(form)}>{initial ? "Update Supplier" : "Add Supplier"}</Btn>
      </div>
    </div>
  );
}

// ============================================================
// PAGES
// ============================================================

// --- DASHBOARD ---
function Dashboard() {
  const { state, alertProducts } = useApp();
  const { products, threshold } = state;

  const totalProducts = products.length;
  const lowStock = products.filter(p => getStockStatus(p.quantity, threshold) === "low").length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const dailySales = SALES_DATA[SALES_DATA.length - 1].sales;
  const weeklyRevenue = SALES_DATA.reduce((a, d) => a + d.sales, 0);

  const topAlerts = alertProducts.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display">Operations Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Products" value={totalProducts} sub="SKUs managed" icon="📦" color="teal" />
        <KPICard title="Low Stock" value={lowStock} sub={`Below ${threshold} units`} icon="⚠️" color="amber" />
        <KPICard title="Out of Stock" value={outOfStock} sub="Needs immediate action" icon="🚫" color="red" />
        <KPICard title="Today's Sales" value={formatCurrency(dailySales)} sub={`${SALES_DATA[SALES_DATA.length - 1].transactions} transactions`} icon="💰" color="emerald" />
        <KPICard title="Weekly Revenue" value={formatCurrency(weeklyRevenue)} sub="Last 7 days" icon="📈" color="violet" />
      </div>

      {/* Charts & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-900 dark:text-white font-display">Weekly Sales Trend</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">Last 7 days</span>
          </div>
          <div className="flex gap-6 mb-2">
            {SALES_DATA.map(d => (
              <div key={d.day} className="text-center" style={{ flex: 1 }}>
                <div className="text-xs text-gray-400">${(d.sales / 1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
          <MiniBarChart data={SALES_DATA} />
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Peak: <span className="font-semibold text-teal-600">Saturday</span></span>
            <span>Avg: <span className="font-semibold">{formatCurrency(weeklyRevenue / 7)}/day</span></span>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white font-display">Urgent Alerts</h2>
            {alertProducts.length > 0 && (
              <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">{alertProducts.length} items</span>
            )}
          </div>
          {topAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm">All stock levels healthy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topAlerts.map(p => {
                const status = getStockStatus(p.quantity, threshold);
                const expired = isExpired(p.expiryDate);
                const nearExpiry = isNearExpiry(p.expiryDate);
                const urgency = (status === "out" || expired) ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" : (status === "low" || nearExpiry) ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
                return (
                  <div key={p.id} className={`p-3 rounded-xl border text-sm ${urgency}`}>
                    <div className="font-semibold text-gray-900 dark:text-white truncate">{p.productName}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{p.SKU}</span>
                      <div className="flex items-center gap-1">
                        <Badge status={status} />
                        {expired && <ExpiryBadge date={p.expiryDate} />}
                        {!expired && nearExpiry && <ExpiryBadge date={p.expiryDate} />}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qty: {p.quantity} units</div>
                  </div>
                );
              })}
              {alertProducts.length > 5 && (
                <p className="text-xs text-center text-gray-400">+{alertProducts.length - 5} more alerts</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="font-bold text-gray-900 dark:text-white font-display mb-4">Stock by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            const totalQty = catProducts.reduce((a, p) => a + p.quantity, 0);
            const hasIssues = catProducts.some(p => getStockStatus(p.quantity, threshold) !== "in");
            return (
              <div key={cat} className={`p-3 rounded-xl border text-center ${hasIssues ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800/50" : "border-gray-200 dark:border-gray-700"}`}>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{catProducts.length}</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat}</div>
                <div className="text-xs text-gray-400 mt-0.5">{totalQty} units</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- INVENTORY ---
function Inventory() {
  const { state, dispatch, addToast, alertProducts } = useApp();
  const { products, suppliers, threshold } = state;
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("productName");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | "add" | {product}
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const PER_PAGE = 8;

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      if (q && !p.productName.toLowerCase().includes(q) && !p.SKU.toLowerCase().includes(q)) return false;
      if (filterCat !== "All" && p.category !== filterCat) return false;
      if (filterStatus === "low" && getStockStatus(p.quantity, threshold) !== "low") return false;
      if (filterStatus === "out" && p.quantity !== 0) return false;
      if (filterStatus === "in" && getStockStatus(p.quantity, threshold) !== "in") return false;
      if (filterStatus === "expiring" && !isNearExpiry(p.expiryDate) && !isExpired(p.expiryDate)) return false;
      return true;
    })
    .sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (typeof va === "string") va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-teal-600 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const handleAdd = (data) => {
    dispatch({ type: "ADD_PRODUCT", payload: data });
    addToast(`${data.productName} added to inventory`, "success");
    setModal(null);
  };

  const handleEdit = (data) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: data });
    addToast(`${data.productName} updated`, "success");
    setModal(null);
  };

  const handleDelete = (id) => {
    const p = products.find(x => x.id === id);
    dispatch({ type: "DELETE_PRODUCT", payload: id });
    addToast(`${p.productName} removed`, "warning");
    setDeleteConfirm(null);
  };

  const supplierName = (id) => suppliers.find(s => s.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display">Inventory Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} products in database</p>
        </div>
        <Btn onClick={() => setModal("add")}>+ Add Product</Btn>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search name or SKU..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 min-w-48 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option value="All">All Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="expiring">Expiring</option>
          </select>
          {(search || filterCat !== "All" || filterStatus !== "All") && (
            <Btn variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("All"); setPage(1); }}>✕ Clear</Btn>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {paged.length === 0 ? (
          <EmptyState icon="🔍" title="No products found" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  {[["productName", "Product"], ["SKU", "SKU"], ["category", "Category"], ["price", "Price"], ["quantity", "Qty"], ["supplier", "Supplier"], ["expiryDate", "Expiry"]].map(([col, lbl]) => (
                    <th key={col} onClick={() => toggleSort(col)} className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-teal-600 select-none whitespace-nowrap">
                      {lbl}<SortIcon col={col} />
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paged.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap max-w-48 truncate">{p.productName}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{p.SKU}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-semibold">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${p.quantity === 0 ? "text-red-600" : p.quantity <= threshold ? "text-amber-600" : "text-gray-700 dark:text-gray-300"}`}>{p.quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{supplierName(p.supplier)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={isExpired(p.expiryDate) ? "text-red-600 font-semibold" : isNearExpiry(p.expiryDate) ? "text-orange-500 font-semibold" : "text-gray-500 dark:text-gray-400"}>
                        {formatDate(p.expiryDate)}
                      </span>
                      <ExpiryBadge date={p.expiryDate} />
                    </td>
                    <td className="px-4 py-3"><Badge status={getStockStatus(p.quantity, threshold)} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Btn variant="ghost" size="sm" onClick={() => setModal(p)}>✏️</Btn>
                        <Btn variant="ghost" size="sm" onClick={() => setDeleteConfirm(p.id)}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Btn variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</Btn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-teal-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>{n}</button>
              ))}
              <Btn variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</Btn>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === "add" && (
        <Modal title="Add New Product" onClose={() => setModal(null)} size="lg">
          <ProductForm suppliers={suppliers} onSave={handleAdd} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal && modal !== "add" && (
        <Modal title="Edit Product" onClose={() => setModal(null)} size="lg">
          <ProductForm initial={modal} suppliers={suppliers} onSave={handleEdit} onClose={() => setModal(null)} />
        </Modal>
      )}
      {deleteConfirm && (
        <Modal title="Delete Product" onClose={() => setDeleteConfirm(null)} size="sm">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Are you sure you want to remove this product? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Btn variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm)}>Delete</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- ALERTS ---
function Alerts() {
  const { state, dispatch, addToast, alertProducts } = useApp();
  const { threshold } = state;

  const outOfStock = alertProducts.filter(p => p.quantity === 0);
  const lowStock = alertProducts.filter(p => p.quantity > 0 && getStockStatus(p.quantity, threshold) === "low");
  const expired = alertProducts.filter(p => isExpired(p.expiryDate));
  const nearExpiry = alertProducts.filter(p => !isExpired(p.expiryDate) && isNearExpiry(p.expiryDate));

  const handleRestock = (product, amount = 50) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: { ...product, quantity: product.quantity + amount } });
    addToast(`${product.productName} restocked (+${amount} units)`, "success");
  };

  const AlertGroup = ({ title, items, color, icon }) => {
    const colorMap = {
      red: "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800",
      amber: "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800",
      orange: "border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800",
    };
    return items.length === 0 ? null : (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className={`px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2`}>
          <span className="text-lg">{icon}</span>
          <h2 className="font-bold text-gray-900 dark:text-white font-display">{title}</h2>
          <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map(p => (
            <div key={p.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">{p.productName}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500 font-mono">{p.SKU}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{p.category}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{p.quantity} units</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge status={getStockStatus(p.quantity, threshold)} />
                <Btn variant="warning" size="sm" onClick={() => handleRestock(p)}>Restock +50</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display">Stock Alert Center</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{alertProducts.length} items requiring attention</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 shadow-sm">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Low stock threshold:</label>
          <input
            type="number" min="1" max="100" value={threshold}
            onChange={e => dispatch({ type: "SET_THRESHOLD", payload: Number(e.target.value) })}
            className="w-16 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-center text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-500">units</span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Out of Stock", count: outOfStock.length, color: "bg-red-600", icon: "🚫" },
          { label: "Low Stock", count: lowStock.length, color: "bg-amber-500", icon: "⚠️" },
          { label: "Expired", count: expired.length, color: "bg-red-800", icon: "💀" },
          { label: "Near Expiry", count: nearExpiry.length, color: "bg-orange-500", icon: "⏰" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-black text-gray-900 dark:text-white font-display">{s.count}</div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {alertProducts.length === 0 ? (
        <EmptyState icon="✅" title="All Clear!" message="No stock alerts at this time. All products are well-stocked and within expiry dates." />
      ) : (
        <div className="space-y-4">
          <AlertGroup title="Out of Stock" items={outOfStock} color="red" icon="🚫" />
          <AlertGroup title="Low Stock Items" items={lowStock} color="amber" icon="⚠️" />
          <AlertGroup title="Expired Products" items={expired} color="red" icon="💀" />
          <AlertGroup title="Near Expiry (within 7 days)" items={nearExpiry} color="orange" icon="⏰" />
        </div>
      )}
    </div>
  );
}

// --- SALES/BILLING ---
function Sales() {
  const { state, dispatch, addToast } = useApp();
  const { products, cart } = state;
  const [skuInput, setSkuInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [invoiceModal, setInvoiceModal] = useState(null);
  const [skuError, setSkuError] = useState("");
  const skuRef = useRef();

  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const handleScan = (e) => {
    if (e) e.preventDefault();
    setSkuError("");
    const sku = skuInput.trim().toUpperCase();
    if (!sku) return;
    const product = products.find(p => p.SKU.toUpperCase() === sku);
    if (!product) { setSkuError(`SKU "${sku}" not found`); return; }
    if (product.quantity === 0) { setSkuError(`${product.productName} is out of stock`); return; }
    const existing = cart.find(i => i.productId === product.id);
    if (existing && existing.qty >= product.quantity) { setSkuError(`Only ${product.quantity} units available`); return; }
    dispatch({ type: "ADD_TO_CART", payload: { productId: product.id, name: product.productName, SKU: product.SKU, price: product.price } });
    addToast(`${product.productName} added to cart`, "success");
    setSkuInput("");
    skuRef.current?.focus();
  };

  const handleQtyChange = (id, qty) => {
    if (qty < 1) { dispatch({ type: "REMOVE_FROM_CART", payload: id }); return; }
    const product = products.find(p => p.id === id);
    if (qty > product.quantity) { addToast(`Only ${product.quantity} units available`, "warning"); return; }
    dispatch({ type: "UPDATE_CART_QTY", payload: { id, qty } });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const invoice = { total: cartTotal, paymentMethod };
    dispatch({ type: "CHECKOUT", payload: invoice });
    const inv = state.invoices[0];
    addToast(`Sale completed! ${formatCurrency(cartTotal)} via ${paymentMethod}`, "success");
    setInvoiceModal({ items: cart, total: cartTotal, paymentMethod, date: new Date().toLocaleString() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display">Point of Sale</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Scan products and process transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scanner + Products */}
        <div className="lg:col-span-2 space-y-4">
          {/* SKU Scanner */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="font-bold text-gray-900 dark:text-white font-display mb-3">Scan / Enter SKU</h2>
            <form onSubmit={handleScan} className="flex gap-2">
              <input
                ref={skuRef}
                value={skuInput}
                onChange={e => { setSkuInput(e.target.value.toUpperCase()); setSkuError(""); }}
                placeholder="Enter SKU code (e.g. MLK-001)"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono uppercase"
              />
              <Btn type="submit">Scan</Btn>
            </form>
            {skuError && <p className="text-red-500 text-xs mt-2">{skuError}</p>}
            <div className="mt-3 flex flex-wrap gap-1">
              <span className="text-xs text-gray-400">Quick add:</span>
              {products.filter(p => p.quantity > 0).slice(0, 6).map(p => (
                <button key={p.id} onClick={() => { setSkuInput(p.SKU); }} className="text-xs text-teal-600 hover:underline font-mono">{p.SKU}</button>
              ))}
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 dark:text-white font-display">Cart Items</h2>
              {cart.length > 0 && <Btn variant="ghost" size="sm" onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear All</Btn>}
            </div>
            {cart.length === 0 ? (
              <EmptyState icon="🛒" title="Cart is empty" message="Scan a product SKU to add items to the cart." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {cart.map(item => (
                    <tr key={item.productId} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{item.SKU}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleQtyChange(item.productId, item.qty - 1)} className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-bold">−</button>
                          <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{item.qty}</span>
                          <button onClick={() => handleQtyChange(item.productId, item.qty + 1)} className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-sm font-bold">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * item.qty)}</td>
                      <td className="px-4 py-3 text-right"><Btn variant="ghost" size="sm" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.productId })}>✕</Btn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Invoice Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm sticky top-20">
            <h2 className="font-bold text-gray-900 dark:text-white font-display mb-4">Invoice Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Items ({cartCount})</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>{formatCurrency(cartTotal * 0.08)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-black text-gray-900 dark:text-white text-base">
                <span>Total</span>
                <span>{formatCurrency(cartTotal * 1.08)}</span>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${paymentMethod === m ? "bg-teal-600 border-teal-600 text-white" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-teal-400"}`}>{m}</button>
                ))}
              </div>
            </div>

            <Btn className="w-full mt-5 justify-center" onClick={handleCheckout} disabled={cart.length === 0}>
              Complete Sale {cart.length > 0 && `· ${formatCurrency(cartTotal * 1.08)}`}
            </Btn>

            {state.invoices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Recent Transactions</h3>
                <div className="space-y-2">
                  {state.invoices.slice(0, 3).map(inv => (
                    <div key={inv.id} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-mono">{inv.id}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {invoiceModal && (
        <Modal title="✅ Transaction Complete" onClose={() => setInvoiceModal(null)} size="md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Payment received via <strong>{invoiceModal.paymentMethod}</strong></p>
            <p className="text-3xl font-black text-gray-900 dark:text-white font-display mt-1">{formatCurrency(invoiceModal.total * 1.08)}</p>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs font-bold text-gray-500 uppercase">Items Sold</div>
            {invoiceModal.items.map(i => (
              <div key={i.productId} className="px-4 py-2 flex justify-between text-sm border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-700 dark:text-gray-300">{i.name} × {i.qty}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <Btn className="w-full mt-4 justify-center" variant="secondary" onClick={() => setInvoiceModal(null)}>Close</Btn>
        </Modal>
      )}
    </div>
  );
}

// --- SUPPLIERS ---
function Suppliers() {
  const { state, dispatch, addToast } = useApp();
  const { suppliers, products } = state;
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [reorderModal, setReorderModal] = useState(null);

  const filtered = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (data) => {
    dispatch({ type: "ADD_SUPPLIER", payload: data });
    addToast(`${data.name} added`, "success");
    setModal(null);
  };

  const handleEdit = (data) => {
    dispatch({ type: "UPDATE_SUPPLIER", payload: data });
    addToast(`${data.name} updated`, "success");
    setModal(null);
  };

  const handleDelete = (id) => {
    const s = suppliers.find(x => x.id === id);
    dispatch({ type: "DELETE_SUPPLIER", payload: id });
    addToast(`${s.name} removed`, "warning");
    setDeleteConfirm(null);
  };

  const getSupplierProducts = (supplierId) => products.filter(p => p.supplier === supplierId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white font-display">Supplier Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{suppliers.length} active suppliers</p>
        </div>
        <Btn onClick={() => setModal("add")}>+ Add Supplier</Btn>
      </div>

      <input
        placeholder="Search suppliers..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:max-w-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {filtered.length === 0 ? (
        <EmptyState icon="🏭" title="No suppliers found" message="Add your first supplier to get started." action={<Btn onClick={() => setModal("add")}>Add Supplier</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => {
            const sProducts = getSupplierProducts(s.id);
            const hasAlerts = sProducts.some(p => p.quantity === 0 || p.quantity <= state.threshold);
            return (
              <div key={s.id} className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow ${hasAlerts ? "border-amber-300 dark:border-amber-800" : "border-gray-200 dark:border-gray-700"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center text-teal-700 dark:text-teal-400 font-black text-sm">{s.name[0]}</div>
                  <div className="flex gap-1">
                    <Btn variant="ghost" size="sm" onClick={() => setModal(s)}>✏️</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setDeleteConfirm(s.id)}>🗑️</Btn>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{s.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.contact}</p>
                <div className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div>📧 {s.email}</div>
                  <div>📞 {s.phone}</div>
                  <div>📍 {s.address}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{sProducts.length} products</span>
                  {hasAlerts && <span className="text-xs text-amber-600 font-semibold">⚠ Reorder needed</span>}
                </div>
                {sProducts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sProducts.slice(0, 3).map(p => (
                      <span key={p.id} className={`text-xs px-2 py-0.5 rounded-md ${p.quantity === 0 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : p.quantity <= state.threshold ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>{p.productName.split(" ")[0]}</span>
                    ))}
                    {sProducts.length > 3 && <span className="text-xs text-gray-400">+{sProducts.length - 3}</span>}
                  </div>
                )}
                <Btn variant="warning" size="sm" className="w-full mt-3 justify-center" onClick={() => { setReorderModal(s); addToast(`Reorder request sent to ${s.name}`, "info"); }}>
                  📦 Send Reorder Request
                </Btn>
              </div>
            );
          })}
        </div>
      )}

      {modal === "add" && (
        <Modal title="Add New Supplier" onClose={() => setModal(null)} size="lg">
          <SupplierForm onSave={handleAdd} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal && modal !== "add" && (
        <Modal title="Edit Supplier" onClose={() => setModal(null)} size="lg">
          <SupplierForm initial={modal} onSave={(d) => handleEdit({ ...modal, ...d })} onClose={() => setModal(null)} />
        </Modal>
      )}
      {deleteConfirm && (
        <Modal title="Remove Supplier" onClose={() => setDeleteConfirm(null)} size="sm">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Remove this supplier? Their products will remain in inventory.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Btn variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm)}>Remove</Btn>
          </div>
        </Modal>
      )}
      {reorderModal && (
        <Modal title="Reorder Request Sent" onClose={() => setReorderModal(null)} size="sm">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📨</div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">{reorderModal.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">A reorder request has been simulated. In production this would send an email to <strong>{reorderModal.email}</strong></p>
          </div>
          <Btn variant="secondary" className="w-full justify-center mt-2" onClick={() => setReorderModal(null)}>Close</Btn>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// LAYOUT
// ============================================================
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "inventory", label: "Inventory", icon: "📦" },
  { id: "alerts", label: "Alerts", icon: "🚨" },
  { id: "sales", label: "Point of Sale", icon: "🛒" },
  { id: "suppliers", label: "Suppliers", icon: "🏭" },
];

function Layout({ children, page, setPage }) {
  const { state, dispatch, alertProducts } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const alertCount = alertProducts.length;

  // Ensure dark class is never applied (light mode only)
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        {/* Sidebar Backdrop (mobile) */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          {/* Logo */}
          <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">S</div>
              <div>
                <div className="font-black text-gray-900 dark:text-white font-display leading-none">SuperMart</div>
                <div className="text-xs text-gray-400 mt-0.5">Admin Console</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page === item.id ? "bg-teal-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {item.id === "alerts" && alertCount > 0 && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${page === "alerts" ? "bg-white/20 text-white" : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"}`}>{alertCount}</span>
                )}
              </button>
            ))}
          </nav>


        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 py-3 flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white" onClick={() => setSidebarOpen(true)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h1 className="font-bold text-gray-900 dark:text-white capitalize flex-1">{NAV_ITEMS.find(n => n.id === page)?.label}</h1>
            <div className="flex items-center gap-3">
              {alertCount > 0 && (
                <button onClick={() => setPage("alerts")} className="relative w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors">
                  🔔
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-black rounded-full flex items-center justify-center">{alertCount}</span>
                </button>
              )}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">A</div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 max-w-screen-2xl w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
function AppContent() {
  const [page, setPage] = useState("dashboard");
  const { state } = useApp();

  const pages = {
    dashboard: <Dashboard />,
    inventory: <Inventory />,
    alerts: <Alerts />,
    sales: <Sales />,
    suppliers: <Suppliers />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { transition: background-color 0.3s ease, color 0.3s ease; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; background-color: inherit; }
        .font-display { font-family: 'Syne', sans-serif; }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
        .dark ::-webkit-scrollbar-thumb { background: #374151; }
      `}</style>
      <Layout page={page} setPage={setPage}>
        {pages[page] || <Dashboard />}
      </Layout>
      <Toasts toasts={state.toasts} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
