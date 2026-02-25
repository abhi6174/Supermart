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
  const cfg = {
    in: { cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500", label: "In Stock" },
    low: { cls: "bg-amber-50  text-amber-700  ring-1 ring-amber-200", dot: "bg-amber-500", label: "Low Stock" },
    out: { cls: "bg-rose-50   text-rose-700   ring-1 ring-rose-200", dot: "bg-rose-500", label: "Out of Stock" },
  };
  const { cls, dot, label } = cfg[status] || cfg.in;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

function ExpiryBadge({ date }) {
  if (isExpired(date)) return <span className="inline-flex items-center gap-1 ml-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white ring-1 ring-rose-700">⏱ Expired</span>;
  if (isNearExpiry(date)) return <span className="inline-flex items-center gap-1 ml-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white ring-1 ring-orange-600">⏱ Near Expiry</span>;
  return null;
}

function Modal({ title, onClose, children, size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
      <div
        className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-modal-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-indigo-600 rounded-full" />
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-150"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      )}
      <input
        className={`px-3 py-2.5 rounded-xl border text-sm bg-white text-slate-900 shadow-input transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 ${error ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 hover:border-slate-300"
          }`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      )}
      <select
        className="px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 shadow-input focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer"
        {...props}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm hover:shadow-md focus-visible:ring-indigo-500",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm focus-visible:ring-slate-400",
    danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm hover:shadow-md focus-visible:ring-rose-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-400",
    warning: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-sm hover:shadow-md focus-visible:ring-amber-400",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-base" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}

function KPICard({ title, value, sub, icon, color }) {
  const cfg = {
    teal: { grad: "from-cyan-500 to-teal-600", border: "border-l-cyan-400", iconBg: "bg-cyan-50", iconText: "text-cyan-600" },
    amber: { grad: "from-amber-400 to-orange-500", border: "border-l-amber-400", iconBg: "bg-amber-50", iconText: "text-amber-600" },
    red: { grad: "from-rose-500 to-red-600", border: "border-l-rose-400", iconBg: "bg-rose-50", iconText: "text-rose-600" },
    violet: { grad: "from-violet-500 to-purple-600", border: "border-l-violet-400", iconBg: "bg-violet-50", iconText: "text-violet-600" },
    emerald: { grad: "from-emerald-400 to-green-600", border: "border-l-emerald-400", iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  };
  const { iconBg, iconText } = cfg[color] || cfg.teal;
  return (
    <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1.5 leading-none tabular-nums">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1.5 truncate">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center text-xl shrink-0 ml-3`}>
          <span className={iconText}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-xs">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function Toasts({ toasts }) {
  const cfg = {
    success: { bg: "bg-emerald-600", ring: "ring-emerald-700", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    error: { bg: "bg-rose-600", ring: "ring-rose-700", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg> },
    warning: { bg: "bg-amber-500", ring: "ring-amber-600", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 4v4M7 10v.5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg> },
    info: { bg: "bg-indigo-600", ring: "ring-indigo-700", icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 6v5M7 3.5v.5" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg> },
  };
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map(t => {
        const { bg, ring, icon } = cfg[t.type] || cfg.info;
        return (
          <div key={t.id} className={`${bg} ring-1 ${ring} text-white pl-3 pr-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-slide-up max-w-sm`}>
            <span className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">{icon}</span>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// MINI BAR CHART
// ============================================================
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.sales));
  return (
    <div className="relative">
      {/* Grid lines */}
      <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="border-t border-dashed border-slate-100" />
        ))}
      </div>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-violet-400 transition-all duration-200 cursor-pointer group relative"
              style={{ height: `${(d.sales / max) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {formatCurrency(d.sales)}
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">{d.day}</span>
          </div>
        ))}
      </div>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Operations Dashboard</h1>
        <p className="text-sm text-slate-400 mt-0.5">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-semibold text-slate-900">Weekly Sales Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Revenue over the last 7 days</p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">Last 7 days</span>
          </div>
          <div className="flex gap-6 mt-3">
            {SALES_DATA.map(d => (
              <div key={d.day} className="text-center" style={{ flex: 1 }}>
                <div className="text-xs text-slate-400 font-medium">${(d.sales / 1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
          <MiniBarChart data={SALES_DATA} />
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-5 text-sm text-slate-500">
            <span>Peak: <span className="font-semibold text-indigo-600">Saturday</span></span>
            <span>Avg: <span className="font-semibold text-slate-700">{formatCurrency(weeklyRevenue / 7)}/day</span></span>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Urgent Alerts</h2>
            {alertProducts.length > 0 && (
              <span className="bg-rose-50 text-rose-600 ring-1 ring-rose-200 text-xs font-bold px-2.5 py-1 rounded-full">{alertProducts.length} items</span>
            )}
          </div>
          {topAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">✅</div>
              <p className="text-sm font-medium text-slate-500">All stock levels healthy</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topAlerts.map(p => {
                const status = getStockStatus(p.quantity, threshold);
                const expired = isExpired(p.expiryDate);
                const nearExpiry = isNearExpiry(p.expiryDate);
                const isUrgent = status === "out" || expired;
                const isMed = status === "low" || nearExpiry;
                const borderCls = isUrgent ? "border-l-rose-500 bg-rose-50/50" : isMed ? "border-l-amber-400 bg-amber-50/50" : "border-l-slate-200 bg-slate-50";
                return (
                  <div key={p.id} className={`p-3 rounded-xl border border-l-4 text-sm ${borderCls} border-slate-100`}>
                    <div className="font-medium text-slate-900 truncate">{p.productName}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-slate-400 text-xs font-mono">{p.SKU}</span>
                      <div className="flex items-center gap-1">
                        <Badge status={status} />
                        {expired && <ExpiryBadge date={p.expiryDate} />}
                        {!expired && nearExpiry && <ExpiryBadge date={p.expiryDate} />}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Qty: {p.quantity} units</div>
                  </div>
                );
              })}
              {alertProducts.length > 5 && (
                <p className="text-xs text-center text-slate-400 pt-1">+{alertProducts.length - 5} more alerts</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
        <h2 className="font-semibold text-slate-900 mb-4">Stock by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => {
            const catProducts = products.filter(p => p.category === cat);
            const totalQty = catProducts.reduce((a, p) => a + p.quantity, 0);
            const hasIssues = catProducts.some(p => getStockStatus(p.quantity, threshold) !== "in");
            return (
              <div key={cat} className={`p-3.5 rounded-xl border text-center transition-all duration-150 hover:shadow-sm ${hasIssues ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50 hover:bg-white"
                }`}>
                <div className="text-2xl font-bold text-slate-900">{catProducts.length}</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">{cat}</div>
                <div className="text-xs text-slate-400 mt-0.5">{totalQty} units</div>
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
          <p className="text-sm text-slate-400 mt-0.5">{products.length} products in database</p>
        </div>
        <Btn onClick={() => setModal("add")}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Add Product
        </Btn>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card">
        <div className="flex flex-col gap-3">
          {/* Row 1: search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
            <input
              placeholder="Search name or SKU..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
          {/* Row 2: selects + clear */}
          <div className="flex flex-wrap gap-2">
            <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }} className="flex-1 min-w-[130px] px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer">
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="flex-1 min-w-[130px] px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 cursor-pointer">
              <option value="All">All Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="expiring">Expiring</option>
            </select>
            {(search || filterCat !== "All" || filterStatus !== "All") && (
              <Btn variant="ghost" size="sm" onClick={() => { setSearch(""); setFilterCat("All"); setFilterStatus("All"); setPage(1); }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Clear
              </Btn>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        {paged.length === 0 ? (
          <EmptyState icon="🔍" title="No products found" message="Try adjusting your search or filters." />
        ) : (
          <>
            {/* ── MOBILE: card list (hidden on sm+) ── */}
            <div className="sm:hidden divide-y divide-slate-100">
              {paged.map((p, idx) => {
                const status = getStockStatus(p.quantity, threshold);
                return (
                  <div key={p.id} className={`p-4 ${idx % 2 === 1 ? "bg-slate-50/60" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{p.productName}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{p.SKU}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setModal(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 transition-all"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    {/* Key metrics row */}
                    <div className="mt-2.5 grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Price</p>
                        <p className="text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(p.price)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Qty</p>
                        <p className={`text-sm font-bold tabular-nums ${p.quantity === 0 ? "text-rose-600" : p.quantity <= threshold ? "text-amber-600" : "text-slate-900"}`}>{p.quantity}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg px-2.5 py-1.5">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Status</p>
                        <div className="mt-0.5"><Badge status={status} /></div>
                      </div>
                    </div>
                    {/* Footer row */}
                    <div className="mt-2 flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">{p.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs ${isExpired(p.expiryDate) ? "text-rose-600 font-semibold" : isNearExpiry(p.expiryDate) ? "text-orange-500 font-semibold" : "text-slate-400"}`}>
                          {formatDate(p.expiryDate)}
                        </span>
                        <ExpiryBadge date={p.expiryDate} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── DESKTOP: full table (hidden below sm) ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    {[["productName", "Product"], ["SKU", "SKU"], ["category", "Category"], ["price", "Price"], ["quantity", "Qty"], ["supplier", "Supplier"], ["expiryDate", "Expiry"]].map(([col, lbl]) => (
                      <th key={col} onClick={() => toggleSort(col)} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 select-none whitespace-nowrap transition-colors">
                        {lbl}<SortIcon col={col} />
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paged.map((p, idx) => (
                    <tr key={p.id} className={`group hover:bg-indigo-50/30 transition-colors duration-100 ${idx % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap max-w-48 truncate">{p.productName}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.SKU}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{p.category}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-semibold tabular-nums">{formatCurrency(p.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold tabular-nums ${p.quantity === 0 ? "text-rose-600" : p.quantity <= threshold ? "text-amber-600" : "text-slate-700"}`}>{p.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{supplierName(p.supplier)}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={isExpired(p.expiryDate) ? "text-rose-600 font-semibold" : isNearExpiry(p.expiryDate) ? "text-orange-500 font-semibold" : "text-slate-400"}>
                          {formatDate(p.expiryDate)}
                        </span>
                        <ExpiryBadge date={p.expiryDate} />
                      </td>
                      <td className="px-4 py-3"><Badge status={getStockStatus(p.quantity, threshold)} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button
                            onClick={() => setModal(p)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 transition-all"
                            title="Edit"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all"
                            title="Delete"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-400">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Btn variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</Btn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all duration-150 ${n === page ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-200 text-slate-500"
                  }`}>{n}</button>
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
          <p className="text-slate-500 text-sm">Are you sure you want to remove this product? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-5">
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
      red: { header: "bg-rose-50 border-rose-200", strip: "border-l-rose-500", badge: "bg-rose-100 text-rose-700" },
      amber: { header: "bg-amber-50 border-amber-200", strip: "border-l-amber-500", badge: "bg-amber-100 text-amber-700" },
      orange: { header: "bg-orange-50 border-orange-200", strip: "border-l-orange-500", badge: "bg-orange-100 text-orange-700" },
    };
    const cm = colorMap[color] || colorMap.amber;
    return items.length === 0 ? null : (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className={`px-5 py-3 border-b ${cm.header} flex items-center gap-2.5`}>
          <span className="text-lg">{icon}</span>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${cm.badge}`}>{items.length}</span>
        </div>
        <div className="divide-y divide-slate-50">
          {items.map(p => (
            <div key={p.id} className={`px-5 py-4 flex items-center gap-4 border-l-4 ${cm.strip} hover:bg-slate-50 transition-colors`}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">{p.productName}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400 font-mono">{p.SKU}</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{p.category}</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{p.quantity} units</span>
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Stock Alert Center</h1>
          <p className="text-sm text-slate-400 mt-0.5">{alertProducts.length} items requiring attention</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-card">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Low stock threshold:</label>
          <input
            type="number" min="1" max="100" value={threshold}
            onChange={e => dispatch({ type: "SET_THRESHOLD", payload: Number(e.target.value) })}
            className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-sm bg-white text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <span className="text-sm text-slate-400">units</span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Out of Stock", count: outOfStock.length, bg: "bg-rose-600", icon: "🚫" },
          { label: "Low Stock", count: lowStock.length, bg: "bg-amber-500", icon: "⚠️" },
          { label: "Expired", count: expired.length, bg: "bg-rose-900", icon: "💀" },
          { label: "Near Expiry", count: nearExpiry.length, bg: "bg-orange-500", icon: "⏰" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-center gap-4">
            <div className={`${s.bg} w-11 h-11 rounded-xl flex items-center justify-center text-xl text-white shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{s.count}</div>
              <div className="text-xs font-medium text-slate-400">{s.label}</div>
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
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Point of Sale</h1>
        <p className="text-sm text-slate-400 mt-0.5">Scan products and process transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Scanner + Cart */}
        <div className="lg:col-span-2 space-y-4">
          {/* SKU Scanner */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card">
            <h2 className="font-semibold text-slate-900 mb-3">Scan / Enter SKU</h2>
            <form onSubmit={handleScan} className="flex gap-2">
              <input
                ref={skuRef}
                value={skuInput}
                onChange={e => { setSkuInput(e.target.value.toUpperCase()); setSkuError(""); }}
                placeholder="Enter SKU code (e.g. MLK-001)"
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono uppercase tracking-wider transition-all duration-200 placeholder:text-slate-400"
              />
              <Btn type="submit">Scan</Btn>
            </form>
            {skuError && <p className="text-rose-500 text-xs mt-2 font-medium">{skuError}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400">Quick add:</span>
              {products.filter(p => p.quantity > 0).slice(0, 6).map(p => (
                <button key={p.id} onClick={() => { setSkuInput(p.SKU); }} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-mono bg-indigo-50 px-1.5 py-0.5 rounded-md transition-colors">{p.SKU}</button>
              ))}
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Cart Items
                {cart.length > 0 && <span className="ml-2 text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{cart.length}</span>}
              </h2>
              {cart.length > 0 && <Btn variant="ghost" size="sm" onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear All</Btn>}
            </div>
            {cart.length === 0 ? (
              <EmptyState icon="🛒" title="Cart is empty" message="Scan a product SKU to add items to the cart." />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cart.map(item => (
                    <tr key={item.productId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{item.SKU}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleQtyChange(item.productId, item.qty - 1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-sm font-bold transition-colors">−</button>
                          <span className="w-8 text-center font-bold text-slate-900 tabular-nums">{item.qty}</span>
                          <button onClick={() => handleQtyChange(item.productId, item.qty + 1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 text-sm font-bold transition-colors">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 tabular-nums">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 tabular-nums">{formatCurrency(item.price * item.qty)}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.productId })} className="w-6 h-6 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all ml-auto">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Invoice Summary */}
        <div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card sticky top-20">
            <h2 className="font-semibold text-slate-900 mb-4">Invoice Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items ({cartCount})</span>
                <span className="tabular-nums">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8%)</span>
                <span className="tabular-nums">{formatCurrency(cartTotal * 0.08)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span className="tabular-nums text-2xl font-bold">{formatCurrency(cartTotal * 1.08)}</span>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-150 ${paymentMethod === m
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20"
                    : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}>{m}</button>
                ))}
              </div>
            </div>

            <button
              className={`w-full mt-5 h-12 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${cart.length === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
                }`}
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Complete Sale{cart.length > 0 && ` · ${formatCurrency(cartTotal * 1.08)}`}
            </button>

            {state.invoices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Transactions</h3>
                <div className="space-y-2">
                  {state.invoices.slice(0, 3).map(inv => (
                    <div key={inv.id} className="flex justify-between text-xs text-slate-500">
                      <span className="font-mono text-slate-400">{inv.id}</span>
                      <span className="font-semibold text-slate-700 tabular-nums">{formatCurrency(inv.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {invoiceModal && (
        <Modal title="Transaction Complete" onClose={() => setInvoiceModal(null)} size="md">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-slate-500 text-sm">Payment received via <strong className="text-slate-700">{invoiceModal.paymentMethod}</strong></p>
            <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{formatCurrency(invoiceModal.total * 1.08)}</p>
          </div>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Items Sold</div>
            {invoiceModal.items.map(i => (
              <div key={i.productId} className="px-4 py-2.5 flex justify-between text-sm border-t border-slate-50">
                <span className="text-slate-600">{i.name} × {i.qty}</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(i.price * i.qty)}</span>
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Supplier Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">{suppliers.length} active suppliers</p>
        </div>
        <Btn onClick={() => setModal("add")}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Add Supplier
        </Btn>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
        <input
          placeholder="Search suppliers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:max-w-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-400"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🏭" title="No suppliers found" message="Add your first supplier to get started." action={<Btn onClick={() => setModal("add")}>Add Supplier</Btn>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => {
            const sProducts = getSupplierProducts(s.id);
            const hasAlerts = sProducts.some(p => p.quantity === 0 || p.quantity <= state.threshold);
            return (
              <div key={s.id} className={`bg-white rounded-2xl p-5 border shadow-card hover:shadow-card-hover transition-all duration-200 ${hasAlerts ? "border-l-4 border-l-amber-400 border-slate-100" : "border-slate-100"
                }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">{s.name[0]}</div>
                  <div className="flex gap-1">
                    <button onClick={() => setModal(s)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-indigo-100 text-slate-400 hover:text-indigo-700 transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => setDeleteConfirm(s.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{s.contact}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {s.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {s.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {s.address}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{sProducts.length} products</span>
                  {hasAlerts && <span className="text-xs text-amber-600 font-semibold">Reorder needed</span>}
                </div>
                {sProducts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sProducts.slice(0, 3).map(p => (
                      <span key={p.id} className={`text-xs px-2 py-0.5 rounded-md font-medium ${p.quantity === 0 ? "bg-rose-50 text-rose-600" : p.quantity <= state.threshold ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                        }`}>{p.productName.split(" ")[0]}</span>
                    ))}
                    {sProducts.length > 3 && <span className="text-xs text-slate-400">+{sProducts.length - 3}</span>}
                  </div>
                )}
                <button
                  onClick={() => { setReorderModal(s); addToast(`Reorder request sent to ${s.name}`, "info"); }}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all duration-150 flex items-center justify-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  Send Reorder Request
                </button>
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
          <p className="text-slate-500 text-sm">Remove this supplier? Their products will remain in inventory.</p>
          <div className="flex justify-end gap-3 mt-5">
            <Btn variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => handleDelete(deleteConfirm)}>Remove</Btn>
          </div>
        </Modal>
      )}
      {reorderModal && (
        <Modal title="Reorder Request Sent" onClose={() => setReorderModal(null)} size="sm">
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <p className="text-slate-800 font-semibold">{reorderModal.name}</p>
            <p className="text-sm text-slate-400 mt-2">A reorder request has been simulated. In production this would send an email to <strong className="text-slate-600">{reorderModal.email}</strong></p>
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
  const { alertProducts } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const alertCount = alertProducts.length;

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Backdrop (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-40 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md select-none">S</div>
            <div>
              <div className="font-bold text-slate-900 leading-tight tracking-tight">SuperMart</div>
              <div className="text-xs text-slate-400 font-medium">Admin Console</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                <span className={`text-base transition-transform duration-150 ${isActive ? "" : "group-hover:scale-110"
                  }`}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "alerts" && alertCount > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-indigo-200 text-indigo-800" : "bg-rose-100 text-rose-600"
                    }`}>{alertCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom user section */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800 leading-tight truncate">Admin</div>
              <div className="text-xs text-slate-400 truncate">admin@supermart.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 glass border-b border-slate-100 px-4 lg:px-6 py-3 flex items-center gap-4">
          <button
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-medium hidden sm:block">SuperMart / <span className="text-slate-600">{NAV_ITEMS.find(n => n.id === page)?.label}</span></div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight sm:leading-normal">{NAV_ITEMS.find(n => n.id === page)?.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            {alertCount > 0 && (
              <button
                onClick={() => setPage("alerts")}
                className="relative w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-all duration-150 active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{alertCount}</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-screen-2xl w-full mx-auto">
          {children}
        </main>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
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
