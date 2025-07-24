// src/App.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc,
  query, writeBatch
} from 'firebase/firestore';
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'firebase/auth';

// --- Iconos SVG ---
// Icono para añadir (general)
const PlusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

// Icono para editar
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

// Icono para eliminar
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4
              a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// Icono de alerta (triángulo)
const AlertTriangleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-500">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14
              A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

// Icono de carrito de compras
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

// Icono de dinero
const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

// Icono de paquete
const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="m7.5 4.274 6.75 3.5m-6.75-3.5a1.5 1.5 0 0 0-1.5 1.5v9.5a1.5 1.5 0 0 0 1.5 1.5h9.5a1.5 1.5 0 0 0 1.5-1.5v-9.5a1.5 1.5 0 0 0-1.5-1.5h-9.5Z"></path>
    <path d="m16.5 7.774-6.75-3.5m6.75 3.5a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-9.5a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5h9.5Z"></path>
  </svg>
);

// Icono de camión (envío)
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
    <path d="M19 18h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-1.44a1 1 0 0 0-.9-.69L14 14v4H5a1 1 0 0 0-1 1 1 1 0 0 0 1 1h14a1 1 0 0 0 1-1 1 1 0 0 0-1-1Z"></path>
    <circle cx="7" cy="18" r="2"></circle>
    <path d="M17 18H9"></path>
    <circle cx="18" cy="18" r="2"></circle>
  </svg>
);

// Icono de usuarios (proveedores)
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

// Icono de calendario
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Icono de gráfico de barras
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

// Icono de flecha derecha
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Icono de flecha izquierda
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

// Icono de cerrar (X)
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Icono de check
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Icono de subir archivo
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

// Icono de búsqueda
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Icono de filtro
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

// Icono de inicio (Dashboard)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// Icono de objetivo/meta
const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

// Icono de lista/movimientos
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

// Icono de caja (productos)
const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

// Icono de usuario (proveedor)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Icono de tendencia (para top ventas)
const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
    <polyline points="16 7 22 7 22 13"></polyline>
  </svg>
);

// --- Funciones Auxiliares ---

// Obtener fecha futura para alertas de vencimiento
const getFutureDate = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
};

// Generar SKU automático
const generateSKU = (name, brand, variant) => {
  const namePart = name ? name.substring(0, 3).toUpperCase() : '';
  const brandPart = brand ? brand.substring(0, 3).toUpperCase() : '';
  const variantPart = variant ? variant.substring(0, 3).toUpperCase() : '';
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatorios
  return `${brandPart}-${namePart}-${variantPart}-${randomPart}`;
};

// Formatear número a moneda ARS
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// --- Componente Principal de la Aplicación ---
export default function App() {
  // Configuración de Firebase obtenida de las variables globales del entorno Canvas
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Pestaña activa
  const [products, setProducts] = useState([]); // Lista de productos
  const [combos, setCombos] = useState([]); // Lista de combos
  const [sales, setSales] = useState([]); // Historial de ventas
  const [suppliers, setSuppliers] = useState([]); // Lista de proveedores
  const [movements, setMovements] = useState([]); // Historial de movimientos
  const [cart, setCart] = useState([]); // Carrito de venta (para la pestaña "Vender")
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [brandFilter, setBrandFilter] = useState('all'); // Filtro por marca
  const [searchQuery, setSearchQuery] = useState(''); // Búsqueda general
  const [logoUrl, setLogoUrl] = useState(null); // URL del logo personalizado

  // Estados para controlar la visibilidad de los modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false); // Modal para finalizar venta
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Item seleccionado para editar/eliminar
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Mes seleccionado para objetivos
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Año seleccionado para objetivos

  const fileInputRef = useRef(null); // Referencia para el input de archivo del logo

  // --- Inicialización de Firebase y Autenticación ---
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const firestoreDb = getFirestore(app);
      setDb(firestoreDb);

      // Autenticación anónima para obtener un userId
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Si no hay token inicial, intenta iniciar sesión anónimamente
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      setIsLoading(false);
    }
  }, [firebaseConfig]); // Dependencia firebaseConfig para re-inicializar si cambia (aunque no debería en este caso)

  // --- Suscripción a Colecciones de Firestore ---
  useEffect(() => {
    if (!db || !userId) return; // Esperar a que db y userId estén disponibles
    setIsLoading(true);

    // Definición de las colecciones y sus setters de estado
    const colNames = ['products', 'combos', 'suppliers', 'sales', 'movements'];
    const setters = {
      products: setProducts,
      combos: setCombos,
      suppliers: setSuppliers,
      sales: setSales,
      movements: setMovements
    };

    // Suscribirse a cada colección y actualizar el estado en tiempo real
    const unsubs = colNames.map(name => {
      // Ruta de la colección basada en el appId y userId
      const q = query(collection(db, `artifacts/${appId}/users/${userId}/${name}`));
      return onSnapshot(q, snap => {
        let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Ordenar movimientos y ventas por fecha descendente
        if (name === 'movements' || name === 'sales') {
          items.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        setters[name](items);
        setIsLoading(false); // Desactivar carga una vez que los datos iniciales están listos
      }, (error) => {
        console.error(`Error fetching ${name}:`, error);
        setIsLoading(false);
      });
    });

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => unsubs.forEach(u => u());
  }, [db, userId, appId]); // Dependencias: db, userId, appId

  // --- Funciones de Ayuda para Firestore y Modales ---

  // Obtener referencia a una colección específica
  const getCol = (name) => collection(db, `artifacts/${appId}/users/${userId}/${name}`);

  // Abrir modal según el tipo de item y pasar datos
  const openModal = (type, item = null) => {
    setSelectedItem({ type, item });
    switch (type) {
      case 'product': setIsProductModalOpen(true); break;
      case 'combo': setIsComboModalOpen(true); break;
      case 'delete': setIsDeleteModalOpen(true); break;
      case 'sale': setIsSaleModalOpen(true); break;
      case 'supplier': setIsSupplierModalOpen(true); break;
      case 'purchase': setIsPurchaseModalOpen(true); break;
      default: break;
    }
  };

  // Cerrar todos los modales
  const closeModal = () => {
    setIsProductModalOpen(false);
    setIsComboModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSaleModalOpen(false);
    setIsSupplierModalOpen(false);
    setIsPurchaseModalOpen(false);
    setSelectedItem(null);
  };

  // --- Handlers CRUD ---

  // Guardar/actualizar un producto
  const handleSaveProduct = async (data) => {
    const productData = { ...data };
    if (!productData.sku || !selectedItem?.item) { // Generar SKU solo si es un producto nuevo o no tiene SKU
      productData.sku = generateSKU(productData.name, productData.brand, productData.variant);
    }

    if (selectedItem?.item) {
      await updateDoc(doc(db, getCol('products').path, selectedItem.item.id), productData);
    } else {
      await addDoc(getCol('products'), productData);
    }
    closeModal();
  };

  // Guardar/actualizar un combo
  const handleSaveCombo = async (data) => {
    if (selectedItem?.item) {
      await updateDoc(doc(db, getCol('combos').path, selectedItem.item.id), data);
    } else {
      await addDoc(getCol('combos'), data);
    }
    closeModal();
  };

  // Guardar/actualizar un proveedor
  const handleSaveSupplier = async (data) => {
    if (selectedItem?.item) {
      await updateDoc(doc(db, getCol('suppliers').path, selectedItem.item.id), data);
    } else {
      await addDoc(getCol('suppliers'), data);
    }
    closeModal();
  };

  // Registrar una compra
  const handleRegisterPurchase = async (purchaseData) => {
    const batch = writeBatch(db);
    const purchaseDate = new Date().toISOString().split('T')[0];

    // 1. Añadir el registro de la compra
    const purchaseRef = doc(getCol('movements')); // Crea una nueva referencia de documento para el movimiento
    batch.set(purchaseRef, {
      type: 'Compra',
      date: purchaseDate,
      supplierId: purchaseData.supplierId,
      supplierName: suppliers.find(s => s.id === purchaseData.supplierId)?.name || 'Desconocido',
      items: purchaseData.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        variant: item.variant,
        quantity: item.quantity,
        cost: item.cost,
        totalCost: item.quantity * item.cost
      })),
      totalAmount: purchaseData.items.reduce((sum, item) => sum + item.quantity * item.cost, 0),
    });

    // 2. Actualizar stock y costo promedio ponderado de los productos
    for (const item of purchaseData.items) {
      const productRef = doc(db, getCol('products').path, item.productId);
      const currentProduct = products.find(p => p.id === item.productId);

      if (currentProduct) {
        const oldStock = currentProduct.stock || 0;
        const oldTotalCost = (currentProduct.cost || 0) * oldStock;
        const newStock = oldStock + item.quantity;
        const newTotalCost = oldTotalCost + (item.quantity * item.cost);
        const newAverageCost = newStock > 0 ? newTotalCost / newStock : 0;

        batch.update(productRef, {
          stock: newStock,
          cost: newAverageCost, // Actualiza el costo promedio ponderado
        });
      }
    }
    await batch.commit();
    closeModal();
    setCart([]); // Limpiar el carrito después de la compra
  };

  // Finalizar una venta (desde el carrito)
  const handleConfirmSale = async (saleDetails) => {
    const batch = writeBatch(db);
    const saleDate = new Date().toISOString().split('T')[0];
    let totalSaleAmount = 0;
    let totalShippingCost = saleDetails.shippingCost || 0;

    // 1. Añadir el registro de la venta
    const saleItems = cart.map(item => {
      const itemPrice = item.type === 'product' ? item.price : item.comboPrice;
      const itemTotal = item.quantity * itemPrice;
      totalSaleAmount += itemTotal;
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal,
        ...(item.type === 'product' && { variant: item.variant, sku: item.sku }),
      };
    });

    const saleRef = doc(getCol('sales')); // Crea una nueva referencia de documento para la venta
    batch.set(saleRef, {
      date: saleDate,
      origin: saleDetails.origin,
      orderNumber: saleDetails.orderNumber || '',
      saleType: saleDetails.saleType,
      paymentMethod: saleDetails.paymentMethod,
      shippingCost: totalShippingCost,
      items: saleItems,
      totalAmount: totalSaleAmount,
      finalAmount: totalSaleAmount - totalShippingCost // Monto final después de restar el envío si lo absorbe la tienda
    });

    // 2. Actualizar stock de productos (para productos individuales y combos)
    for (const cartItem of cart) {
      if (cartItem.type === 'product') {
        const productRef = doc(db, getCol('products').path, cartItem.id);
        batch.update(productRef, {
          stock: products.find(p => p.id === cartItem.id).stock - cartItem.quantity,
          soldCount: (products.find(p => p.id === cartItem.id).soldCount || 0) + cartItem.quantity,
        });
      } else if (cartItem.type === 'combo') {
        const combo = combos.find(c => c.id === cartItem.id);
        if (combo && combo.items) {
          for (const comboItem of combo.items) {
            const productRef = doc(db, getCol('products').path, comboItem.productId);
            const currentProduct = products.find(p => p.id === comboItem.productId);
            if (currentProduct) {
              batch.update(productRef, {
                stock: currentProduct.stock - (comboItem.quantity * cartItem.quantity),
                soldCount: (currentProduct.soldCount || 0) + (comboItem.quantity * cartItem.quantity),
              });
            }
          }
        }
      }
    }

    // 3. Añadir movimiento de salida por venta
    const movementRef = doc(getCol('movements')); // Nueva referencia para el movimiento
    batch.set(movementRef, {
      type: 'Venta',
      date: saleDate,
      items: saleItems,
      totalAmount: totalSaleAmount,
      details: `Venta ${saleDetails.saleType} por ${saleDetails.origin} (${saleDetails.paymentMethod}). Envío: ${formatCurrency(totalShippingCost)}`,
    });

    await batch.commit();
    closeModal();
    setCart([]); // Limpiar el carrito después de la venta
  };

  // Eliminar un item (producto, combo, proveedor)
  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.item) return;

    const { type, item } = selectedItem;
    let collectionName;

    switch (type) {
      case 'product': collectionName = 'products'; break;
      case 'combo': collectionName = 'combos'; break;
      case 'supplier': collectionName = 'suppliers'; break;
      default: return;
    }

    try {
      await deleteDoc(doc(db, getCol(collectionName).path, item.id));
      closeModal();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // --- Lógica del Carrito de Venta ---
  const addToCart = (item, type) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.type === type
    );

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, type, quantity: 1 }]);
    }
    setActiveTab('sell'); // Asegurarse de que la pestaña de venta esté activa
  };

  const updateCartQuantity = (id, type, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => !(item.id === id && item.type === type)));
    } else {
      setCart(cart.map(item =>
        item.id === id && item.type === type ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id, type) => {
    setCart(cart.filter(item => !(item.id === id && item.type === type)));
  };

  // --- Lógica para el Logo ---
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
        localStorage.setItem('mrk_logo', reader.result); // Guardar en localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  // Cargar logo al iniciar
  useEffect(() => {
    const savedLogo = localStorage.getItem('mrk_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  // --- Cálculos y Datos Derivados (Memoized para optimización) ---

  // Productos filtrados por búsqueda y marca
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (brandFilter !== 'all') {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.brand.toLowerCase().includes(lowerCaseQuery) ||
        product.variant.toLowerCase().includes(lowerCaseQuery) ||
        product.sku.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return filtered;
  }, [products, brandFilter, searchQuery]);

  // Marcas únicas para el filtro
  const uniqueBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return ['all', ...Array.from(brands).sort()];
  }, [products]);

  // Valor total del inventario
  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
  }, [products]);

  // Productos con bajo stock (punto de pedido)
  const productsLowStock = useMemo(() => {
    return products.filter(product => product.stock <= product.reorderPoint);
  }, [products]);

  // Productos a punto de vencer
  const productsExpiring = (monthsAhead) => useMemo(() => {
    const now = new Date();
    const futureDate = getFutureDate(monthsAhead);
    return products.filter(product => {
      if (!product.expirationDate) return false;
      const expDate = new Date(product.expirationDate);
      return expDate > now && expDate <= futureDate;
    });
  }, [products, monthsAhead]);

  // Top 5 productos más vendidos
  const topSellingProducts = useMemo(() => {
    const productSales = {};
    products.forEach(p => productSales[p.id] = { name: `${p.name} - ${p.variant}`, soldCount: p.soldCount || 0 });

    const sorted = Object.values(productSales).sort((a, b) => b.soldCount - a.soldCount);
    return sorted.slice(0, 5);
  }, [products]);


  // Resumen de ventas para el mes seleccionado en la pestaña de Objetivos
  const monthlySalesSummary = useMemo(() => {
    const currentMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === selectedMonth && saleDate.getFullYear() === selectedYear;
    });

    const totalSalesAmount = currentMonthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    const salesByOrigin = currentMonthSales.reduce((acc, sale) => {
      acc[sale.origin] = (acc[sale.origin] || 0) + sale.totalAmount;
      return acc;
    }, {});

    const salesByType = currentMonthSales.reduce((acc, sale) => {
      acc[sale.saleType] = (acc[sale.saleType] || 0) + sale.totalAmount;
      return acc;
    }, {});

    const totalShippingCosts = currentMonthSales.reduce((sum, sale) => sum + (sale.shippingCost || 0), 0);

    return {
      totalSalesAmount,
      salesByOrigin,
      salesByType,
      totalShippingCosts,
    };
  }, [sales, selectedMonth, selectedYear]);

  // --- Componentes de Vistas (separados para mayor legibilidad) ---

  // Modal genérico para formularios
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative text-gray-200">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-yellow-500">
            <XIcon />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">{title}</h2>
          {children}
        </div>
      </div>
    );
  };

  // Modal de confirmación de eliminación
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
    if (!isOpen || !item) return null;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Confirmar Eliminación de ${item.type === 'product' ? 'Producto' : item.type === 'combo' ? 'Combo' : 'Proveedor'}`}>
        <p className="mb-4">
          ¿Estás seguro de que quieres eliminar "{item.item.name}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    );
  };

  // Modal para Producto (Crear/Editar)
  const ProductModal = ({ isOpen, onClose, onSave, product = null }) => {
    const [name, setName] = useState(product?.name || '');
    const [brand, setBrand] = useState(product?.brand || '');
    const [variant, setVariant] = useState(product?.variant || '');
    const [sku, setSku] = useState(product?.sku || '');
    const [stock, setStock] = useState(product?.stock || 0);
    const [price, setPrice] = useState(product?.price || 0);
    const [cost, setCost] = useState(product?.cost || 0);
    const [reorderPoint, setReorderPoint] = useState(product?.reorderPoint || 0);
    const [expirationDate, setExpirationDate] = useState(product?.expirationDate || '');

    useEffect(() => {
      if (product) {
        setName(product.name);
        setBrand(product.brand);
        setVariant(product.variant);
        setSku(product.sku);
        setStock(product.stock);
        setPrice(product.price);
        setCost(product.cost);
        setReorderPoint(product.reorderPoint);
        setExpirationDate(product.expirationDate || '');
      } else {
        setName(''); setBrand(''); setVariant(''); setSku('');
        setStock(0); setPrice(0); setCost(0); setReorderPoint(0); setExpirationDate('');
      }
    }, [product]);

    useEffect(() => {
      if (!product) { // Solo generar SKU si es un producto nuevo
        setSku(generateSKU(name, brand, variant));
      }
    }, [name, brand, variant, product]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ name, brand, variant, sku, stock, price, cost, reorderPoint, expirationDate });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Marca</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Variante (Sabor, Tamaño, etc.)</label>
            <input type="text" value={variant} onChange={(e) => setVariant(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">SKU</label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
              readOnly={!product} // Solo lectura si es un producto nuevo
              title={!product ? "El SKU se genera automáticamente para nuevos productos" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Precio de Venta (ARS)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" step="0.01" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Costo Unitario (ARS)</label>
            <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" step="0.01" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Punto de Pedido</label>
            <input type="number" value={reorderPoint} onChange={(e) => setReorderPoint(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Fecha de Vencimiento</label>
            <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Modal para Combo (Crear/Editar)
  const ComboModal = ({ isOpen, onClose, onSave, combo = null, products }) => {
    const [name, setName] = useState(combo?.name || '');
    const [comboPrice, setComboPrice] = useState(combo?.comboPrice || 0);
    const [selectedProducts, setSelectedProducts] = useState(combo?.items || []);

    useEffect(() => {
      if (combo) {
        setName(combo.name);
        setComboPrice(combo.comboPrice);
        setSelectedProducts(combo.items);
      } else {
        setName('');
        setComboPrice(0);
        setSelectedProducts([]);
      }
    }, [combo]);

    const handleProductChange = (productId, quantity) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        const existingIndex = selectedProducts.findIndex(item => item.productId === productId);
        if (existingIndex > -1) {
          const updated = [...selectedProducts];
          updated[existingIndex].quantity = Number(quantity);
          setSelectedProducts(updated);
        } else {
          setSelectedProducts([...selectedProducts, { productId, productName: product.name, variant: product.variant, quantity: Number(quantity) }]);
        }
      }
    };

    const removeProduct = (productId) => {
      setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ name, comboPrice, items: selectedProducts });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={combo ? 'Editar Combo' : 'Nuevo Combo'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Nombre del Combo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Precio del Combo (ARS)</label>
            <input type="number" value={comboPrice} onChange={(e) => setComboPrice(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" step="0.01" required />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Productos en el Combo</h3>
            <div className="space-y-2">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md">
                  <span className="flex-grow">{item.productName} - {item.variant}</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(item.productId, e.target.value)}
                    className="w-20 rounded-md bg-gray-600 border-gray-500 text-gray-200 text-center"
                    min="1"
                    required
                  />
                  <button type="button" onClick={() => removeProduct(item.productId)}
                    className="text-red-400 hover:text-red-500">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
            <select
              onChange={(e) => handleProductChange(e.target.value, 1)}
              className="mt-2 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
              value="" // Resetear selección después de añadir
            >
              <option value="">Añadir Producto...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.variant} (SKU: {p.sku})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Modal para Proveedor (Crear/Editar)
  const SupplierModal = ({ isOpen, onClose, onSave, supplier = null }) => {
    const [name, setName] = useState(supplier?.name || '');
    const [contact, setContact] = useState(supplier?.contact || '');
    const [phone, setPhone] = useState(supplier?.phone || '');
    const [email, setEmail] = useState(supplier?.email || '');

    useEffect(() => {
      if (supplier) {
        setName(supplier.name);
        setContact(supplier.contact);
        setPhone(supplier.phone);
        setEmail(supplier.email);
      } else {
        setName(''); setContact(''); setPhone(''); setEmail('');
      }
    }, [supplier]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ name, contact, phone, email });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Contacto</label>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Teléfono</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Modal para Registrar Compra
  const PurchaseModal = ({ isOpen, onClose, onSave, products, suppliers }) => {
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [purchaseItems, setPurchaseItems] = useState([]);

    useEffect(() => {
      if (isOpen) {
        setSelectedSupplier('');
        setPurchaseItems([]);
      }
    }, [isOpen]);

    const handleAddItem = (productId) => {
      const product = products.find(p => p.id === productId);
      if (product && !purchaseItems.some(item => item.productId === productId)) {
        setPurchaseItems([...purchaseItems, {
          productId: product.id,
          productName: product.name,
          variant: product.variant,
          quantity: 1,
          cost: product.cost // Usar el costo actual como sugerencia
        }]);
      }
    };

    const handleItemChange = (index, field, value) => {
      const updatedItems = [...purchaseItems];
      updatedItems[index][field] = value;
      setPurchaseItems(updatedItems);
    };

    const handleRemoveItem = (index) => {
      setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedSupplier) {
        alert('Por favor, selecciona un proveedor.');
        return;
      }
      if (purchaseItems.length === 0) {
        alert('Por favor, añade al menos un producto a la compra.');
        return;
      }
      onSave({ supplierId: selectedSupplier, items: purchaseItems });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Registrar Compra">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Proveedor</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
              required
            >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <h3 className="text-lg font-medium text-gray-300 mb-2">Productos a Comprar</h3>
          <div className="space-y-3">
            {purchaseItems.map((item, index) => (
              <div key={item.productId} className="flex items-center space-x-2 bg-gray-700 p-3 rounded-md">
                <span className="flex-grow text-gray-300">{item.productName} - {item.variant}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                  className="w-24 rounded-md bg-gray-600 border-gray-500 text-gray-200 text-center"
                  min="1"
                  required
                />
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleItemChange(index, 'cost', Number(e.target.value))}
                  className="w-28 rounded-md bg-gray-600 border-gray-500 text-gray-200 text-center"
                  step="0.01"
                  required
                />
                <button type="button" onClick={() => handleRemoveItem(index)}
                  className="text-red-400 hover:text-red-500">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          <select
            onChange={(e) => handleAddItem(e.target.value)}
            className="mt-2 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            value=""
          >
            <option value="">Añadir producto a la compra...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} - {p.variant} (Stock: {p.stock})</option>
            ))}
          </select>

          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white">
              Registrar Compra
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // Modal para Finalizar Venta
  const SaleModal = ({ isOpen, onClose, onConfirmSale, cart }) => {
    const [origin, setOrigin] = useState('Tienda Nube');
    const [orderNumber, setOrderNumber] = useState('');
    const [saleType, setSaleType] = useState('Minorista');
    const [paymentMethod, setPaymentMethod] = useState('PagoNube');
    const [hasFreeShipping, setHasFreeShipping] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
      if (isOpen) {
        setOrigin('Tienda Nube');
        setOrderNumber('');
        setSaleType('Minorista');
        setPaymentMethod('PagoNube');
        setHasFreeShipping(false);
        setShippingCost(0);
      }
    }, [isOpen]);

    const totalCartAmount = cart.reduce((sum, item) => {
      const price = item.type === 'product' ? item.price : item.comboPrice;
      return sum + (item.quantity * price);
    }, 0);

    const handleSubmit = (e) => {
      e.preventDefault();
      onConfirmSale({ origin, orderNumber, saleType, paymentMethod, shippingCost: hasFreeShipping ? shippingCost : 0 });
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Venta">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Origen de la Venta</label>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
              <option value="Tienda Nube">Tienda Nube</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
          {origin === 'Tienda Nube' && (
            <div>
              <label className="block text-sm font-medium text-gray-400">N° de Orden</label>
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400">Tipo de Venta</label>
            <select value={saleType} onChange={(e) => setSaleType(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
              <option value="Minorista">Minorista</option>
              <option value="Mayorista">Mayorista</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Método de Pago</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50">
              <option value="PagoNube">PagoNube</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked={hasFreeShipping} onChange={(e) => setHasFreeShipping(e.target.checked)}
              className="h-4 w-4 text-yellow-500 rounded border-gray-600 focus:ring-yellow-500" />
            <label className="ml-2 block text-sm text-gray-400">Envío Gratis (costo absorbido por la tienda)</label>
          </div>
          {hasFreeShipping && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Costo de Envío (ARS)</label>
              <input type="number" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50" step="0.01" />
            </div>
          )}
          <div className="text-right text-xl font-bold text-yellow-500">
            Total Carrito: {formatCurrency(totalCartAmount)}
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white">
              Confirmar Venta
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  // --- Vistas de la Aplicación ---

  const DashboardView = ({ totalInventoryValue, productsLowStock, productsExpiring, topSellingProducts }) => {
    const [expirationFilter, setExpirationFilter] = useState(2); // Default 2 meses

    const expiringProducts = productsExpiring(expirationFilter);

    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <DollarSignIcon className="text-yellow-500 text-4xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-300">Valor Total Inventario</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(totalInventoryValue)}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <AlertTriangleIcon className="text-red-500 text-4xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-300">Productos con Bajo Stock</h3>
            <p className="text-3xl font-bold text-white">{productsLowStock.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <PackageIcon className="text-blue-400 text-4xl mb-2" />
            <h3 className="text-lg font-semibold text-gray-300">Items Totales en Stock</h3>
            <p className="text-3xl font-bold text-white">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas de Vencimiento */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center">
              <CalendarIcon className="text-yellow-500" /> Alertas de Vencimiento
            </h3>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setExpirationFilter(2)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${expirationFilter === 2 ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Vencen en 2 meses
              </button>
              <button
                onClick={() => setExpirationFilter(4)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${expirationFilter === 4 ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Vencen en 4 meses
              </button>
              <button
                onClick={() => setExpirationFilter(8)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${expirationFilter === 8 ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Vencen en 8 meses
              </button>
            </div>
            {expiringProducts.length > 0 ? (
              <ul className="space-y-2">
                {expiringProducts.map(product => (
                  <li key={product.id} className="flex justify-between items-center text-gray-300 bg-gray-700 p-3 rounded-md">
                    <span>{product.name} - {product.variant} (Stock: {product.stock})</span>
                    <span className="text-sm text-red-400">Vence: {product.expirationDate}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No hay productos que venzan en los próximos {expirationFilter} meses.</p>
            )}
          </div>

          {/* Ranking de Productos Más Vendidos */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center">
              <TrendingUpIcon className="text-yellow-500" /> Ranking de Productos Más Vendidos
            </h3>
            {topSellingProducts.length > 0 ? (
              <div className="space-y-3">
                {topSellingProducts.map((product, index) => (
                  <div key={index} className="flex items-center bg-gray-700 p-3 rounded-md">
                    <span className="text-lg font-bold text-yellow-400 mr-3">{index + 1}.</span>
                    <span className="flex-grow text-gray-300">{product.name}</span>
                    <span className="text-gray-400">{product.soldCount} unidades</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hay datos de ventas para mostrar el ranking.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GoalsView = ({ monthlySalesSummary, selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 años antes, actual, 2 años después

    const salesGoal = 10000000; // $10,000,000 ARS mensuales
    const progress = salesGoal > 0 ? (monthlySalesSummary.totalSalesAmount / salesGoal) * 100 : 0;
    const clampedProgress = Math.min(100, Math.max(0, progress)); // Asegura que esté entre 0 y 100

    const getChartData = (dataObject) => {
      const total = Object.values(dataObject).reduce((sum, val) => sum + val, 0);
      return Object.keys(dataObject).map(key => ({
        name: key,
        value: dataObject[key],
        percentage: total > 0 ? (dataObject[key] / total) * 100 : 0,
      }));
    };

    const originChartData = getChartData(monthlySalesSummary.salesByOrigin);
    const typeChartData = getChartData(monthlySalesSummary.salesByType);

    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Objetivos de Venta</h2>

        {/* Selector de Mes y Año */}
        <div className="flex items-center space-x-4 mb-8 bg-gray-800 p-4 rounded-lg shadow-md">
          <label className="text-gray-300 font-medium">Seleccionar Mes:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <label className="text-gray-300 font-medium">Año:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-md bg-gray-700 border-gray-600 text-gray-200 focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Progreso del Objetivo Mensual */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-gray-300 mb-4">Progreso del Objetivo Mensual ({months[selectedMonth]} {selectedYear})</h3>
          <div className="text-center mb-4">
            <p className="text-4xl font-extrabold text-yellow-500 mb-2">
              {formatCurrency(monthlySalesSummary.totalSalesAmount)} / {formatCurrency(salesGoal)}
            </p>
            <p className="text-2xl font-semibold text-gray-300">
              {clampedProgress.toFixed(2)}% Completado
            </p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-yellow-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${clampedProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Ventas por Origen */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-300 mb-4">Ventas por Origen</h3>
            {originChartData.length > 0 ? (
              <div className="flex flex-col items-center">
                {originChartData.map((data, index) => (
                  <div key={index} className="flex justify-between w-full p-2 text-gray-300">
                    <span>{data.name}: {formatCurrency(data.value)}</span>
                    <span>{data.percentage.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hay ventas registradas para este mes.</p>
            )}
          </div>

          {/* Gráfico de Ventas por Tipo */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-300 mb-4">Ventas por Tipo</h3>
            {typeChartData.length > 0 ? (
              <div className="flex flex-col items-center">
                {typeChartData.map((data, index) => (
                  <div key={index} className="flex justify-between w-full p-2 text-gray-300">
                    <span>{data.name}: {formatCurrency(data.value)}</span>
                    <span>{data.percentage.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No hay ventas registradas para este mes.</p>
            )}
          </div>
        </div>

        {/* Costos de Envío Absorbidos */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center">
            <TruckIcon className="text-yellow-500" /> Costos de Envío Absorbidos
          </h3>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(monthlySalesSummary.totalShippingCosts)}
          </p>
          <p className="text-gray-400 text-sm">Costo total de envíos gratis absorbidos por la tienda este mes.</p>
        </div>
      </div>
    );
  };

  const ProductView = ({ products, brandFilter, setBrandFilter, searchQuery, setSearchQuery, uniqueBrands, openModal }) => {
    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Gestión de Productos</h2>

        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar por nombre, SKU, marca o variante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full md:w-1/4">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-200 shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50 appearance-none"
            >
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>
                  {brand === 'all' ? 'Todas las marcas' : brand}
                </option>
              ))}
            </select>
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => openModal('product')}
            className="w-full md:w-auto px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white font-semibold flex items-center justify-center shadow-md"
          >
            <PlusCircleIcon /> Nuevo Producto
          </button>
        </div>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Marca</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Variante</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P. Venta</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Costo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">P. Pedido</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vencimiento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-400">No hay productos registrados.</td>
                </tr>
              )}
              {products.map((product) => {
                const isLowStock = product.stock <= product.reorderPoint;
                const expirationDate = product.expirationDate ? new Date(product.expirationDate) : null;
                const now = new Date();
                const twoMonthsFromNow = getFutureDate(2);
                const isExpiringSoon = expirationDate && expirationDate > now && expirationDate <= twoMonthsFromNow;

                let stockClass = 'text-green-400';
                if (isExpiringSoon) stockClass = 'text-red-400';
                else if (isLowStock) stockClass = 'text-yellow-400';

                return (
                  <tr key={product.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.variant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.sku}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${stockClass}`}>{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(product.cost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{product.reorderPoint}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${isExpiringSoon ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>
                      {product.expirationDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => openModal('product', product)}
                          className="text-yellow-500 hover:text-yellow-600">
                          <EditIcon />
                        </button>
                        <button onClick={() => openModal('delete', { type: 'product', item: product })}
                          className="text-red-500 hover:text-red-600">
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              const headers = ["Nombre", "Marca", "Variante", "SKU", "Stock", "Precio Venta", "Costo Unitario", "Punto Pedido", "Fecha Vencimiento"];
              const rows = products.map(p => [
                p.name, p.brand, p.variant, p.sku, p.stock, p.price, p.cost, p.reorderPoint, p.expirationDate || 'N/A'
              ]);
              const csvContent = [
                headers.join(","),
                ...rows.map(row => row.map(field => `"${field}"`).join(","))
              ].join("\n");

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "productos.csv");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-semibold flex items-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportar a CSV
          </button>
        </div>
      </div>
    );
  };

  const ComboView = ({ combos, products, openModal }) => {
    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Gestión de Combos</h2>
        <button
          onClick={() => openModal('combo')}
          className="px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white font-semibold flex items-center justify-center mb-6 shadow-md"
        >
          <PlusCircleIcon /> Nuevo Combo
        </button>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre del Combo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos Incluidos</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {combos.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No hay combos registrados.</td>
                </tr>
              )}
              {combos.map((combo) => (
                <tr key={combo.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{combo.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(combo.comboPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {combo.items.map((item, index) => (
                      <div key={index}>{item.productName} ({item.variant}) x {item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('combo', combo)}
                        className="text-yellow-500 hover:text-yellow-600">
                        <EditIcon />
                      </button>
                      <button onClick={() => openModal('delete', { type: 'combo', item: combo })}
                        className="text-red-500 hover:text-red-600">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SupplierView = ({ suppliers, openModal }) => {
    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Gestión de Proveedores</h2>
        <button
          onClick={() => openModal('supplier')}
          className="px-6 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white font-semibold flex items-center justify-center mb-6 shadow-md"
        >
          <PlusCircleIcon /> Nuevo Proveedor
        </button>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contacto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teléfono</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No hay proveedores registrados.</td>
                </tr>
              )}
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{supplier.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{supplier.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{supplier.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('supplier', supplier)}
                        className="text-yellow-500 hover:text-yellow-600">
                        <EditIcon />
                      </button>
                      <button onClick={() => openModal('delete', { type: 'supplier', item: supplier })}
                        className="text-red-500 hover:text-red-600">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={() => openModal('purchase')}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold flex items-center shadow-md"
          >
            <PlusCircleIcon /> Registrar Compra
          </button>
        </div>
      </div>
    );
  };

  const MovementView = ({ movements }) => {
    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Historial de Movimientos</h2>

        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Detalle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Monto Total</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {movements.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No hay movimientos registrados.</td>
                </tr>
              )}
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{movement.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">{movement.type}</td>
                  <td className="px-6 py-4 text-gray-300">{movement.details || movement.supplierName || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {movement.items && movement.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        {item.name || item.productName} ({item.variant}) x {item.quantity}
                        {item.cost && ` (${formatCurrency(item.cost)} c/u)`}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(movement.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const SaleCreationView = ({ products, combos, cart, updateCartQuantity, removeFromCart, openModal }) => {
    const totalCartAmount = cart.reduce((sum, item) => {
      const price = item.type === 'product' ? item.price : item.comboPrice;
      return sum + (item.quantity * price);
    }, 0);

    return (
      <div className="p-6 bg-gray-900 min-h-full rounded-lg shadow-inner flex flex-col lg:flex-row gap-6">
        {/* Columna de Productos y Combos para añadir al carrito */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-200px)]">
          <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center">
            <BoxIcon className="text-yellow-500" /> Añadir al Carrito
          </h3>
          <div className="space-y-4">
            {/* Productos */}
            <h4 className="text-lg font-semibold text-gray-400">Productos Individuales</h4>
            {products.length === 0 && <p className="text-gray-500">No hay productos disponibles.</p>}
            {products.map(product => (
              <div key={product.id} className="flex items-center bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="flex-grow">
                  <p className="font-medium text-gray-200">{product.name} - {product.variant}</p>
                  <p className="text-sm text-gray-400">SKU: {product.sku} | Stock: {product.stock} | {formatCurrency(product.price)}</p>
                </div>
                <button
                  onClick={() => addToCart(product, 'product')}
                  className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white font-semibold text-sm shadow-md"
                >
                  Añadir
                </button>
              </div>
            ))}

            {/* Combos */}
            <h4 className="text-lg font-semibold text-gray-400 mt-6">Combos</h4>
            {combos.length === 0 && <p className="text-gray-500">No hay combos disponibles.</p>}
            {combos.map(combo => (
              <div key={combo.id} className="flex items-center bg-gray-700 p-3 rounded-md shadow-sm">
                <div className="flex-grow">
                  <p className="font-medium text-gray-200">{combo.name}</p>
                  <p className="text-sm text-gray-400">Precio: {formatCurrency(combo.comboPrice)}</p>
                  <p className="text-xs text-gray-500">
                    Incluye: {combo.items.map(item => `${item.productName} x${item.quantity}`).join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => addToCart(combo, 'combo')}
                  className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors text-white font-semibold text-sm shadow-md"
                >
                  Añadir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Columna del Carrito de Venta */}
        <div className="lg:w-1/3 bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
          <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center">
            <ShoppingCartIcon className="text-yellow-500" /> Carrito de Venta
          </h3>
          <div className="flex-grow overflow-y-auto mb-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">El carrito está vacío.</p>
            ) : (
              cart.map(item => (
                <div key={`${item.id}-${item.type}`} className="flex items-center bg-gray-700 p-3 rounded-md shadow-sm">
                  <div className="flex-grow">
                    <p className="font-medium text-gray-200">{item.name} {item.type === 'product' ? `(${item.variant})` : ''}</p>
                    <p className="text-sm text-gray-400">
                      {formatCurrency(item.type === 'product' ? item.price : item.comboPrice)} c/u
                    </p>
                  </div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.id, item.type, Number(e.target.value))}
                    className="w-20 rounded-md bg-gray-600 border-gray-500 text-gray-200 text-center mr-2"
                    min="1"
                  />
                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="text-red-400 hover:text-red-500"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-gray-200">Total:</span>
              <span className="text-2xl font-extrabold text-yellow-500">{formatCurrency(totalCartAmount)}</span>
            </div>
            <button
              onClick={() => openModal('sale')}
              disabled={cart.length === 0}
              className={`w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-lg transition-colors ${cart.length === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
            >
              <CheckIcon className="mr-2" /> Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    );
  };


  // --- Renderizado Principal de la Aplicación ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-yellow-500 text-2xl">
        Cargando aplicación...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col">
      {/* Encabezado */}
      <header className="bg-gray-800 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo o Iniciales MRK */}
          <div
            className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-xl mr-3 cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current.click()}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo MRK" className="w-full h-full object-cover" />
            ) : (
              'MRK'
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              accept="image/*"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-yellow-500">Gestión de Stock MRK</h1>
        </div>
        <div className="text-sm text-gray-400">ID de Usuario: {userId}</div>
      </header>

      {/* Navegación de Pestañas */}
      <nav className="bg-gray-800 p-3 shadow-md flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <HomeIcon /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'sell' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <ShoppingCartIcon /> Vender
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'products' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <BoxIcon /> Productos
        </button>
        <button
          onClick={() => setActiveTab('combos')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'combos' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <PackageIcon /> Combos
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'suppliers' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <UsersIcon /> Proveedores
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'movements' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <ListIcon /> Movimientos
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center transition-colors ${activeTab === 'goals' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <TargetIcon /> Objetivos
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-grow p-4">
        {activeTab === 'dashboard' && (
          <DashboardView
            totalInventoryValue={totalInventoryValue}
            productsLowStock={productsLowStock}
            productsExpiring={productsExpiring}
            topSellingProducts={topSellingProducts}
          />
        )}
        {activeTab === 'sell' && (
          <SaleCreationView
            products={products}
            combos={combos}
            cart={cart}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            openModal={openModal}
          />
        )}
        {activeTab === 'products' && (
          <ProductView
            products={filteredProducts}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            uniqueBrands={uniqueBrands}
            openModal={openModal}
          />
        )}
        {activeTab === 'combos' && (
          <ComboView
            combos={combos}
            products={products}
            openModal={openModal}
          />
        )}
        {activeTab === 'suppliers' && (
          <SupplierView
            suppliers={suppliers}
            openModal={openModal}
          />
        )}
        {activeTab === 'movements' && (
          <MovementView
            movements={movements}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsView
            monthlySalesSummary={monthlySalesSummary}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        )}
      </main>

      {/* Modales */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeModal}
        onSave={handleSaveProduct}
        product={selectedItem?.item}
      />
      <ComboModal
        isOpen={isComboModalOpen}
        onClose={closeModal}
        onSave={handleSaveCombo}
        combo={selectedItem?.item}
        products={products}
      />
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={closeModal}
        onSave={handleSaveSupplier}
        supplier={selectedItem?.item}
      />
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={closeModal}
        onSave={handleRegisterPurchase}
        products={products}
        suppliers={suppliers}
      />
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={closeModal}
        onConfirmSale={handleConfirmSale}
        cart={cart}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        item={selectedItem}
      />
    </div>
  );
}
