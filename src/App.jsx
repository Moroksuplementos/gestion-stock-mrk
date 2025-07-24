import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, doc, setDoc, deleteDoc, updateDoc, query, writeBatch } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';

// --- Iconos SVG ---
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>;
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-red-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M12 20V10M18 20V4M6 20V16"></path></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ArrowDownTrayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 14V3"></path></svg>;
const ArrowPathIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>;
const BuildingStorefrontIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4h-3M3 21V7m18 14V7M12 21v-3"></path></svg>;

const getFutureDate = (months) => { const date = new Date(); date.setMonth(date.getMonth() + months); return date; };

// --- Componente principal de la aplicación ---
export default function App() {
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl, setLogoUrl] = useState(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const fileInputRef = useRef(null);

  // --- Inicialización de Firebase ---
  useEffect(() => {
    async function initializeFirebase() {
        try {
            const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const firestoreDb = getFirestore(app);
            setDb(firestoreDb);

            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    setUserId(null);
                }
            });
        } catch (error) {
            console.error("Error inicializando Firebase:", error);
            setIsLoading(false);
        }
    }
    initializeFirebase();
  }, []);

  // --- Carga de datos desde Firestore ---
  useEffect(() => {
    if (db && userId) {
        setIsLoading(true);
        const collections = ['products', 'combos', 'suppliers', 'sales', 'movements'];
        const setters = {
            products: setProducts,
            combos: setCombos,
            suppliers: setSuppliers,
            sales: setSales,
            movements: setMovements,
        };

        const unsubscribes = collections.map(colName => {
            const q = query(collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default'}/users/${userId}/${colName}`));
            return onSnapshot(q, (querySnapshot) => {
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (colName === 'movements' || colName === 'sales') {
                    items.sort((a, b) => new Date(b.date) - new Date(a.date));
                }
                setters[colName](items);
            }, (error) => console.error(`Error cargando ${colName}:`, error));
        });

        setIsLoading(false);
        return () => unsubscribes.forEach(unsub => unsub());
    }
  }, [db, userId]);
  
  const handleLogoChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => { setLogoUrl(reader.result); };
          reader.readAsDataURL(file);
      }
  };

  const openModal = (type, item = null) => {
    setSelectedItem({item: item, type: type});
    if (type === 'product') setIsProductModalOpen(true);
    if (type === 'combo') setIsComboModalOpen(true);
    if (type === 'delete') setIsDeleteModalOpen(true);
    if (type === 'sale_combo' || type === 'sale_product') setIsSaleModalOpen(true);
    if (type === 'supplier') setIsSupplierModalOpen(true);
    if (type === 'purchase') setIsPurchaseModalOpen(true);
  };

  const closeModal = () => {
    setIsProductModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsComboModalOpen(false);
    setIsSaleModalOpen(false);
    setIsSupplierModalOpen(false);
    setIsPurchaseModalOpen(false);
    setSelectedItem(null);
  };

  const getCollectionRef = (collectionName) => collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default'}/users/${userId}/${collectionName}`);

  const handleSaveProduct = async (productData) => {
    if (selectedItem.item) {
      await updateDoc(doc(db, getCollectionRef('products').path, selectedItem.item.id), productData);
    } else {
      await addDoc(getCollectionRef('products'), { ...productData, salesCount: 0 });
    }
    closeModal();
  };
  
  const handleSaveCombo = async (comboData) => {
    if (selectedItem.item) {
      await updateDoc(doc(db, getCollectionRef('combos').path, selectedItem.item.id), comboData);
    } else {
      await addDoc(getCollectionRef('combos'), comboData);
    }
    closeModal();
  };

  const handleSaveSupplier = async (supplierData) => {
    if (selectedItem.item) {
        await updateDoc(doc(db, getCollectionRef('suppliers').path, selectedItem.item.id), supplierData);
    } else {
        await addDoc(getCollectionRef('suppliers'), supplierData);
    }
    closeModal();
  }

  const handleDelete = async () => {
    if (!selectedItem || !selectedItem.item) return;
    const { type, item } = selectedItem;
    let collectionName = '';
    if (type === 'product') collectionName = 'products';
    else if (type === 'combo') collectionName = 'combos';
    else if (type === 'supplier') collectionName = 'suppliers';
    
    if (collectionName) {
        await deleteDoc(doc(db, getCollectionRef(collectionName).path, item.id));
    }
    closeModal();
  };
  
  const handleConfirmSale = async (saleDetails, itemsToSell) => {
    const batch = writeBatch(db);
    let totalAmount = 0;
    const itemDescriptions = [];

    for (const item of itemsToSell) {
      const productRef = doc(db, getCollectionRef('products').path, item.productId);
      const product = products.find(p => p.id === item.productId);
      if (!product || product.current_stock < item.quantity) {
        alert(`Stock insuficiente para "${product.baseName} - ${product.variantName}".`);
        return;
      }
      totalAmount += (product.weighted_average_cost) * item.quantity;
      const newStock = product.current_stock - item.quantity;
      const newSalesCount = (product.salesCount || 0) + item.quantity;
      batch.update(productRef, { current_stock: newStock, salesCount: newSalesCount });
      itemDescriptions.push(`-${item.quantity} ${product.sku}`);
    }

    const newSale = { date: new Date().toISOString(), totalAmount, ...saleDetails };
    const saleRef = doc(collection(getCollectionRef('sales')));
    batch.set(saleRef, newSale);

    const movementDescription = `Venta (${saleDetails.origin} - ${saleDetails.type}). Items: ${itemDescriptions.join(', ')}`;
    const newMovement = { date: newSale.date, type: 'Venta', description: movementDescription, details: `Costo envío: ${saleDetails.shippingCost}` };
    const movementRef = doc(collection(getCollectionRef('movements')));
    batch.set(movementRef, newMovement);

    await batch.commit();
    console.log("Venta Registrada:", { items: itemDescriptions, ...newSale });
    closeModal();
  };

  const handleRegisterPurchase = async (purchaseData) => {
    const batch = writeBatch(db);
    const supplier = suppliers.find(s => s.id === purchaseData.supplierId);
    
    for (const item of purchaseData.items) {
        const productRef = doc(db, getCollectionRef('products').path, item.productId);
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const oldStock = product.current_stock;
            const oldCost = product.weighted_average_cost;
            const newStock = oldStock + item.quantity;
            const newCost = newStock > 0 ? ((oldStock * oldCost) + (item.quantity * item.unitCost)) / newStock : 0;
            batch.update(productRef, { current_stock: newStock, weighted_average_cost: newCost });
        }
    }
    
    const itemDescriptions = purchaseData.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `+${item.quantity} ${product?.sku || 'N/A'}`;
    }).join(', ');

    const purchaseDescription = `Compra a ${supplier?.name || 'Proveedor Desconocido'}. Items: ${itemDescriptions}`;
    const newMovement = { date: new Date().toISOString(), type: 'Compra', description: purchaseDescription, details: `Factura: ${purchaseData.invoiceNumber}` };
    const movementRef = doc(collection(getCollectionRef('movements')));
    batch.set(movementRef, newMovement);
    
    await batch.commit();
    console.log("Compra Registrada:", purchaseData);
    closeModal();
  };

  const uniqueBrands = useMemo(() => ['all', ...new Set(products.map(p => p.brand))], [products]);
  
  const filteredProducts = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return products.filter(p => {
        const brandMatch = brandFilter === 'all' || p.brand === brandFilter;
        const searchMatch = searchQuery === '' || p.baseName.toLowerCase().includes(lowercasedQuery) || p.variantName.toLowerCase().includes(lowercasedQuery) || p.sku.toLowerCase().includes(lowercasedQuery) || p.brand.toLowerCase().includes(lowercasedQuery);
        return brandMatch && searchMatch;
    });
  }, [products, brandFilter, searchQuery]);


  const TabButton = ({ tabName, label, icon }) => (
    <button onClick={() => setActiveTab(tabName)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-yellow-500 text-black shadow' : 'text-gray-600 hover:bg-gray-800 hover:text-gray-200'}`}>
      {icon} {label}
    </button>
  );

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center gap-4">
          <div className="relative group">
            <input type="file" ref={fileInputRef} onChange={handleLogoChange} className="hidden" accept="image/*"/>
            {logoUrl ? (<img src={logoUrl} alt="Logo de la marca" className="h-16 w-16 rounded-full object-cover bg-black border-2 border-yellow-500 cursor-pointer transition-opacity group-hover:opacity-70" onClick={() => fileInputRef.current.click()}/>
            ) : (<div className="h-16 w-16 rounded-full bg-yellow-500 border-2 border-yellow-500 flex items-center justify-center cursor-pointer transition-colors group-hover:bg-yellow-600" onClick={() => fileInputRef.current.click()}><span className="text-black font-bold text-2xl">MRK</span></div>)}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none"><p className="text-white text-xs text-center font-bold">Cambiar</p></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion de stock MRK</h1>
            <p className="text-gray-400 mt-1">Plataforma interna de gestión de inventario.</p>
          </div>
        </header>
        <div className="mb-6 flex space-x-2 border-b border-gray-700 pb-2 flex-wrap gap-y-2">
            <TabButton tabName="dashboard" label="Dashboard" icon={<ChartBarIcon />} />
            <TabButton tabName="objetivos" label="Objetivos" icon={<TargetIcon />} />
            <TabButton tabName="products" label="Productos" icon={<PackageIcon />} />
            <TabButton tabName="combos" label="Combos" icon={<ShoppingCartIcon />} />
            <TabButton tabName="suppliers" label="Proveedores" icon={<BuildingStorefrontIcon />} />
            <TabButton tabName="movements" label="Movimientos" icon={<ArrowPathIcon />} />
        </div>
        <main>
            {isLoading && <p className="text-center py-10">Conectando a la base de datos...</p>}
            {!isLoading && activeTab === 'dashboard' && <DashboardView products={products} />}
            {!isLoading && activeTab === 'objetivos' && <GoalsView sales={sales} />}
            {!isLoading && activeTab === 'products' && <ProductView products={filteredProducts} isLoading={isLoading} onOpenModal={openModal} brands={uniqueBrands} activeFilter={brandFilter} onFilterChange={setBrandFilter} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
            {!isLoading && activeTab === 'combos' && <ComboView combos={combos} products={products} isLoading={isLoading} onOpenModal={openModal} />}
            {!isLoading && activeTab === 'suppliers' && <SupplierView suppliers={suppliers} isLoading={isLoading} onOpenModal={openModal} />}
            {!isLoading && activeTab === 'movements' && <MovementView movements={movements} isLoading={isLoading} />}
        </main>
      </div>
      {isProductModalOpen && <ProductModal product={selectedItem?.item} onClose={closeModal} onSave={handleSaveProduct} />}
      {isComboModalOpen && <ComboModal combo={selectedItem?.item} products={products} onClose={closeModal} onSave={handleSaveCombo} />}
      {isDeleteModalOpen && <DeleteConfirmationModal item={selectedItem?.item} itemType={selectedItem?.type} onClose={closeModal} onConfirm={handleDelete} />}
      {isSaleModalOpen && <SaleModal saleItem={selectedItem} onClose={closeModal} onConfirm={handleConfirmSale} />}
      {isSupplierModalOpen && <SupplierModal supplier={selectedItem?.item} onClose={closeModal} onSave={handleSaveSupplier} />}
      {isPurchaseModalOpen && <PurchaseModal products={products} suppliers={suppliers} onClose={closeModal} onConfirm={handleRegisterPurchase} />}
    </div>
  );
}

// --- Vistas de Secciones ---
const DonutChart = ({ percentage, color }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120"><circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" /><circle className={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} /></svg>
            <span className="absolute text-2xl font-bold text-white" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{percentage.toFixed(1)}%</span>
        </div>
    );
};

function GoalsView({ sales }) {
    const monthlyGoal = 10000000;
    const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const availableMonths = useMemo(() => {
        const months = new Set(sales.map(s => s.date.substring(0, 7)));
        const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        if (!months.has(currentMonthStr)) { months.add(currentMonthStr); }
        return Array.from(months).sort().reverse();
    }, [sales]);
    const monthData = useMemo(() => {
        const filteredSales = sales.filter(s => s.date.startsWith(selectedMonth));
        const totalSales = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
        const totalShipping = filteredSales.reduce((acc, s) => acc + (s.shippingCost || 0), 0);
        const originBreakdown = filteredSales.reduce((acc, s) => { acc[s.origin] = (acc[s.origin] || 0) + s.totalAmount; return acc; }, {});
        const typeBreakdown = filteredSales.reduce((acc, s) => { acc[s.type] = (acc[s.type] || 0) + s.totalAmount; return acc; }, {});
        return { totalSales, totalShipping, goalProgress: totalSales > 0 ? (totalSales / monthlyGoal) * 100 : 0, origin: { 'Tienda Nube': originBreakdown['Tienda Nube'] || 0, 'WhatsApp': originBreakdown['WhatsApp'] || 0 }, type: { 'Minorista': typeBreakdown['Minorista'] || 0, 'Mayorista': typeBreakdown['Mayorista'] || 0 } };
    }, [sales, selectedMonth]);
    const formatCurrency = (amount) => amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    return (
        <div className="space-y-6">
            <div className="flex justify-end"><select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:w-auto p-2.5">{availableMonths.map(month => (<option key={month} value={month}>{new Date(month + '-02').toLocaleString('es-AR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}</option>))}</select></div>
            <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"><h2 className="text-xl font-semibold mb-2 text-white">Progreso del Objetivo Mensual</h2><p className="text-gray-400 text-sm mb-4">Objetivo: {formatCurrency(monthlyGoal)}</p><div className="w-full bg-gray-700 rounded-full h-8"><div className="bg-yellow-500 h-8 rounded-full flex items-center justify-center text-black font-bold" style={{ width: `${Math.min(monthData.goalProgress, 100)}%` }}>{monthData.goalProgress.toFixed(1)}%</div></div><p className="text-right mt-2 font-semibold text-white">{formatCurrency(monthData.totalSales)}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"><h3 className="text-lg font-semibold mb-4 text-white">Ventas por Origen</h3><div className="flex flex-col sm:flex-row items-center gap-6"><DonutChart percentage={monthData.totalSales > 0 ? (monthData.origin['Tienda Nube'] / monthData.totalSales * 100) : 0} color="text-yellow-500" /><div className="space-y-2 text-sm"><div className="flex items-center"><span className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></span><div><p className="text-gray-400">Tienda Nube</p><p className="font-bold text-white">{formatCurrency(monthData.origin['Tienda Nube'])}</p></div></div><div className="flex items-center"><span className="h-4 w-4 rounded-full bg-gray-700 mr-2"></span><div><p className="text-gray-400">WhatsApp</p><p className="font-bold text-white">{formatCurrency(monthData.origin['WhatsApp'])}</p></div></div></div></div></div>
                 <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"><h3 className="text-lg font-semibold mb-4 text-white">Ventas por Tipo</h3><div className="flex flex-col sm:flex-row items-center gap-6"><DonutChart percentage={monthData.totalSales > 0 ? (monthData.type['Mayorista'] / monthData.totalSales * 100) : 0} color="text-green-500" /><div className="space-y-2 text-sm"><div className="flex items-center"><span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span><div><p className="text-gray-400">Mayorista</p><p className="font-bold text-white">{formatCurrency(monthData.type['Mayorista'])}</p></div></div><div className="flex items-center"><span className="h-4 w-4 rounded-full bg-gray-700 mr-2"></span><div><p className="text-gray-400">Minorista</p><p className="font-bold text-white">{formatCurrency(monthData.type['Minorista'])}</p></div></div></div></div></div>
                <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 flex flex-col items-center justify-center"><h3 className="text-lg font-semibold text-white">Envíos Asumidos</h3><div className="my-4"><TruckIcon /></div><p className="text-3xl font-bold text-yellow-500">{formatCurrency(monthData.totalShipping)}</p><p className="text-gray-400 text-sm">Costo total en envíos gratis</p></div>
            </div>
        </div>
    );
}

function DashboardView({ products }) {
    const [expirationFilter, setExpirationFilter] = useState(2);
    const topSoldProducts = useMemo(() => [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5), [products]);
    const maxSales = topSoldProducts.length > 0 ? topSoldProducts[0].salesCount : 0;
    const expiringProducts = useMemo(() => {
        const limitDate = getFutureDate(expirationFilter);
        return products.filter(p => p.expirationDate && new Date(p.expirationDate) <= limitDate && p.current_stock > 0).sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));
    }, [products, expirationFilter]);
    const inventoryValue = useMemo(() => products.reduce((acc, p) => acc + (p.current_stock * p.weighted_average_cost), 0), [products]);
    const totalItems = useMemo(() => products.reduce((acc, p) => acc + p.current_stock, 0), [products]);
    const lowStockItems = useMemo(() => products.filter(p => p.current_stock > 0 && p.current_stock <= p.reorder_point).length, [products]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center"><p className="text-sm text-gray-400">Valor del Inventario</p><p className="text-2xl font-bold text-white">{inventoryValue.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p></div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center"><p className="text-sm text-gray-400">Items Totales en Stock</p><p className="text-2xl font-bold text-white">{totalItems}</p></div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center"><p className="text-sm text-gray-400">Productos con Bajo Stock</p><p className="text-2xl font-bold text-yellow-500">{lowStockItems}</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"><h2 className="text-xl font-semibold mb-4 text-white">Top 5 Productos Más Vendidos</h2><div className="space-y-4">{topSoldProducts.map(p => (<div key={p.id}><div className="flex justify-between items-center mb-1 text-sm"><span className="font-medium text-gray-200">{p.baseName} ({p.variantName})</span><span className="text-gray-400">{p.salesCount} unidades</span></div><div className="w-full bg-gray-700 rounded-full h-4"><div className="bg-yellow-500 h-4 rounded-full" style={{ width: `${maxSales > 0 ? (p.salesCount / maxSales) * 100 : 0}%` }}></div></div></div>))}</div></div>
                <div className="lg:col-span-1 bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"><h2 className="text-xl font-semibold mb-4 text-white">Alertas de Vencimiento</h2><div className="flex justify-center space-x-2 mb-4">{[2, 4, 8].map(months => (<button key={months} onClick={() => setExpirationFilter(months)} className={`px-3 py-1 text-sm font-medium rounded-full ${expirationFilter === months ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200'}`}>{months} meses</button>))}</div><div className="space-y-3 max-h-64 overflow-y-auto">{expiringProducts.length > 0 ? (expiringProducts.map(p => (<div key={p.id} className="flex items-center text-sm"><CalendarIcon /><div><span className="font-medium text-gray-200">{p.baseName} ({p.variantName})</span><p className="text-red-500">Vence: {new Date(p.expirationDate).toLocaleDateString('es-AR')} - Stock: {p.current_stock}</p></div></div>))) : <p className="text-sm text-gray-500 text-center mt-4">No hay productos por vencer.</p>}</div></div>
            </div>
        </div>
    );
}

function ProductView({ products, isLoading, onOpenModal, brands, activeFilter, onFilterChange, searchQuery, onSearchChange }) {
    const twoMonthsFromNow = getFutureDate(2);
    const handleExport = () => {
        const headers = ["ID", "Nombre Base", "Variante", "Marca", "SKU", "Stock Actual", "Punto de Pedido", "Costo Promedio Ponderado", "Vencimiento"];
        const rows = products.map(p => [p.id, p.baseName, p.variantName, p.brand, p.sku, p.current_stock, p.reorder_point, p.weighted_average_cost, p.expirationDate]);
        let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventario_mrk.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full sm:w-auto flex-grow flex flex-col sm:flex-row items-center gap-4">
                    <h2 className="text-xl font-semibold whitespace-nowrap text-white">Inventario</h2>
                    <div className="relative w-full sm:w-64"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div><input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Buscar o escanear SKU..." className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 p-2.5" /></div>
                    <select value={activeFilter} onChange={e => onFilterChange(e.target.value)} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:w-auto p-2.5">{brands.map(brand => <option key={brand} value={brand}>{brand === 'all' ? 'Todas las marcas' : brand}</option>)}</select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => onOpenModal('purchase')} className="flex items-center justify-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-sm w-full"><TruckIcon />Registrar Compra</button>
                    <button onClick={handleExport} className="flex items-center justify-center bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 shadow-sm w-full"><ArrowDownTrayIcon />Exportar</button>
                    <button onClick={() => onOpenModal('product')} className="flex items-center justify-center bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 shadow-sm w-full"><PlusCircleIcon />Agregar</button>
                </div>
            </div>
            {isLoading ? <p className="text-center py-10">Cargando...</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-900 border-b border-gray-700"><th className="p-4 font-semibold text-gray-300">Producto / Variante</th><th className="p-4 font-semibold text-gray-300 hidden sm:table-cell">Vencimiento</th><th className="p-4 font-semibold text-gray-300 text-center">Stock</th><th className="p-4 font-semibold text-gray-300 hidden lg:table-cell text-right">Costo (ARS)</th><th className="p-4 font-semibold text-gray-300 text-right">Valor Stock (ARS)</th><th className="p-4 font-semibold text-gray-300 text-center">Acciones</th></tr></thead>
                    <tbody className="divide-y divide-gray-700">
                        {products.map(p => {
                            const stockValue = p.current_stock * p.weighted_average_cost;
                            const isLowStock = p.current_stock > 0 && p.current_stock <= p.reorder_point;
                            const isOutOfStock = p.current_stock === 0;
                            const expirationDate = new Date(p.expirationDate);
                            const isExpiringSoon = expirationDate <= twoMonthsFromNow && p.current_stock > 0;
                            return (
                                <tr key={p.id} className="hover:bg-gray-700/50">
                                    <td className="p-4"><div className="font-medium text-white">{p.baseName}</div><div className="text-sm text-gray-400 font-semibold">{p.brand}</div><div className="text-sm text-yellow-400">{p.variantName}</div></td>
                                    <td className={`p-4 text-sm hidden sm:table-cell ${isExpiringSoon ? 'text-red-500 font-bold' : 'text-gray-400'}`}>{expirationDate.toLocaleDateString('es-AR')} {isExpiringSoon && <AlertTriangleIcon/>}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isOutOfStock ? 'bg-red-200 text-red-900' : isLowStock ? 'bg-yellow-200 text-yellow-900' : 'bg-green-200 text-green-900'}`}>{p.current_stock}</span>
                                        {(isLowStock && !isOutOfStock) && <div className="flex items-center justify-center mt-1 text-xs text-yellow-500"><AlertTriangleIcon /><span>P. Pedido: {p.reorder_point}</span></div>}
                                    </td>
                                    <td className="p-4 text-gray-400 hidden lg:table-cell text-right">{p.weighted_average_cost.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                                    <td className="p-4 font-semibold text-white text-right">{stockValue.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
                                    <td className="p-4 text-center"><div className="flex justify-center items-center space-x-2 flex-wrap gap-2"><button onClick={() => onOpenModal('sale_product', p)} className="flex items-center text-sm bg-green-600 text-white font-semibold py-1 px-2 rounded-lg hover:bg-green-700 transition-colors"><ShoppingCartIcon />Vender</button><button onClick={() => onOpenModal('product', p)} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-full"><EditIcon /></button><button onClick={() => onOpenModal('delete', {item: p, type: 'product'})} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button></div></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

function ComboView({ combos, products, isLoading, onOpenModal }) {
    const getProductDetails = (productId) => products.find(p => p.id === productId);
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold mb-3 sm:mb-0 text-white">Gestión de Combos</h2>
                <button onClick={() => onOpenModal('combo')} className="flex items-center justify-center bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 shadow-sm"><PlusCircleIcon />Crear Combo</button>
            </div>
            {isLoading ? <p className="text-center py-10">Cargando...</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-900 border-b border-gray-700"><th className="p-4 font-semibold text-gray-300">Combo</th><th className="p-4 font-semibold text-gray-300 hidden md:table-cell">SKU</th><th className="p-4 font-semibold text-gray-300">Contenido</th><th className="p-4 font-semibold text-gray-300 text-center">Acciones</th></tr></thead>
                    <tbody className="divide-y divide-gray-700">
                        {combos.map(c => (
                            <tr key={c.id} className="hover:bg-gray-700/50">
                                <td className="p-4 font-medium text-white">{c.name}</td>
                                <td className="p-4 text-gray-400 hidden md:table-cell">{c.sku}</td>
                                <td className="p-4 text-sm text-gray-300"><ul className="list-disc list-inside">{c.items.map(item => { const product = getProductDetails(item.productId); return product ? <li key={item.productId}>{item.quantity}x {product.baseName} ({product.variantName})</li> : <li key={item.productId} className="text-red-500">Producto no encontrado</li>; })}</ul></td>
                                <td className="p-4 text-center"><div className="flex justify-center items-center space-x-2 flex-wrap gap-2"><button onClick={() => onOpenModal('sale_combo', c)} className="flex items-center text-sm bg-green-600 text-white font-semibold py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"><ShoppingCartIcon />Vender</button><button onClick={() => onOpenModal('combo', c)} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-full"><EditIcon /></button><button onClick={() => onOpenModal('delete', {item: c, type: 'combo'})} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

function SupplierView({ suppliers, isLoading, onOpenModal }) {
     return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold mb-3 sm:mb-0 text-white">Gestión de Proveedores</h2>
                <button onClick={() => onOpenModal('supplier')} className="flex items-center justify-center bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 shadow-sm"><PlusCircleIcon />Agregar Proveedor</button>
            </div>
            {isLoading ? <p className="text-center py-10">Cargando...</p> : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="bg-gray-900 border-b border-gray-700"><th className="p-4 font-semibold text-gray-300">Nombre</th><th className="p-4 font-semibold text-gray-300">Contacto</th><th className="p-4 font-semibold text-gray-300 text-center">Acciones</th></tr></thead>
                    <tbody className="divide-y divide-gray-700">
                        {suppliers.map(s => (
                            <tr key={s.id} className="hover:bg-gray-700/50">
                                <td className="p-4 font-medium text-white">{s.name}</td>
                                <td className="p-4 text-gray-400">{s.contact}</td>
                                <td className="p-4 text-center"><div className="flex justify-center items-center space-x-2"><button onClick={() => onOpenModal('supplier', s)} className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-full"><EditIcon /></button><button onClick={() => onOpenModal('delete', {item: s, type: 'supplier'})} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

function MovementView({ movements, isLoading }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Historial de Movimientos</h2>
            {isLoading ? <p className="text-center py-10">Cargando...</p> : (
            <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left">
                    <thead className="sticky top-0"><tr className="bg-gray-900 border-b border-gray-700"><th className="p-4 font-semibold text-gray-300">Fecha</th><th className="p-4 font-semibold text-gray-300">Tipo</th><th className="p-4 font-semibold text-gray-300">Descripción</th></tr></thead>
                    <tbody className="divide-y divide-gray-700">
                        {movements.map(m => (
                            <tr key={m.id} className="hover:bg-gray-700/50">
                                <td className="p-4 text-sm text-gray-400 whitespace-nowrap">{new Date(m.date).toLocaleString('es-AR')}</td>
                                <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${m.type === 'Venta' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>{m.type}</span></td>
                                <td className="p-4 text-sm text-white">{m.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}


// --- Modales ---

function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    baseName: product?.baseName || '', variantName: product?.variantName || '', sku: product?.sku || '', brand: product?.brand || '',
    description: product?.description || '', current_stock: product?.current_stock || 0, reorder_point: product?.reorder_point || 5, expirationDate: product?.expirationDate || '',
  });

  useEffect(() => {
      if (!product) { // Solo para productos nuevos
        const brandPart = formData.brand.substring(0, 3).toUpperCase();
        const namePart = formData.baseName.split(' ').map(w => w[0]).join('').substring(0,3).toUpperCase();
        const variantPart = formData.variantName.substring(0, 3).toUpperCase();
        if (brandPart && namePart && variantPart) {
            const newSku = `${brandPart}-${namePart}-${variantPart}-${String(Date.now()).slice(-4)}`;
            setFormData(prev => ({ ...prev, sku: newSku }));
        }
      }
  }, [formData.brand, formData.baseName, formData.variantName, product]);


  const handleChange = (e) => { const { name, value, type } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-gray-600"><form onSubmit={handleSubmit}><div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">{product ? 'Editar Variante' : 'Agregar Nueva Variante'}</h3></div><div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left"><div><label className="block text-sm font-medium text-gray-300 mb-1">Nombre Base</label><input type="text" name="baseName" value={formData.baseName} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Marca</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Nombre Variante (Sabor, etc.)</label><input type="text" name="variantName" value={formData.variantName} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">SKU (Código de Barras)</label><input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 read-only:bg-gray-700 read-only:cursor-not-allowed" required readOnly={!product} /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label><textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"></textarea></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-1">Stock Actual</label><input type="number" name="current_stock" value={formData.current_stock} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">P. Pedido</label><input type="number" name="reorder_point" value={formData.reorder_point} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Vencimiento</label><input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div></div></div><div className="p-4 bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg"><button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600">Cancelar</button><button type="submit" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">{product ? 'Guardar Cambios' : 'Crear Producto'}</button></div></form></div></div>
  );
}

function ComboModal({ combo, products, onClose, onSave }) {
    const [name, setName] = useState(combo?.name || ''); const [sku, setSku] = useState(combo?.sku || ''); const [items, setItems] = useState(combo?.items || [{ productId: '', quantity: 1 }]);
    const handleItemChange = (index, field, value) => { const newItems = [...items]; newItems[index][field] = field === 'productId' ? Number(value) : value; setItems(newItems); };
    const addItem = () => setItems([...items, { productId: '', quantity: 1 }]); const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const handleSubmit = (e) => { e.preventDefault(); onSave({ name, sku, items: items.filter(i => i.productId) }); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-600"><form onSubmit={handleSubmit}><div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">{combo ? 'Editar Combo' : 'Crear Nuevo Combo'}</h3></div><div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left"><div><label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Combo</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">SKU del Combo</label><input type="text" value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><hr className="border-gray-600"/><h4 className="font-semibold pt-2 text-white">Productos en el Combo</h4>{items.map((item, index) => (<div key={index} className="flex items-center space-x-2 p-2 bg-gray-900/50 rounded-lg"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required><option value="">-- Seleccionar producto --</option>{products.map(p => <option key={p.id} value={p.id}>{p.baseName} ({p.variantName})</option>)}</select><input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-24 bg-gray-700 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" /><button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button></div>))}<button type="button" onClick={addItem} className="text-sm text-yellow-500 font-semibold hover:underline mt-2">Agregar otro producto</button></div><div className="p-4 bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg"><button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600">Cancelar</button><button type="submit" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">{combo ? 'Guardar Cambios' : 'Crear Combo'}</button></div></form></div></div>
    );
}

function SupplierModal({ supplier, onClose, onSave }) {
    const [formData, setFormData] = useState({ name: supplier?.name || '', contact: supplier?.contact || '' });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-gray-600"><form onSubmit={handleSubmit}><div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">{supplier ? 'Editar Proveedor' : 'Agregar Proveedor'}</h3></div><div className="p-6 space-y-4 text-left"><div><label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div><div><label className="block text-sm font-medium text-gray-300 mb-1">Contacto (Email, Teléfono, etc.)</label><input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div></div><div className="p-4 bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg"><button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600">Cancelar</button><button type="submit" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">{supplier ? 'Guardar Cambios' : 'Crear Proveedor'}</button></div></form></div></div>
    );
}

function PurchaseModal({ products, suppliers, onClose, onConfirm }) {
    const [purchaseData, setPurchaseData] = useState({ supplierId: suppliers[0]?.id || '', invoiceNumber: '', items: [{ productId: '', quantity: 1, unitCost: 0 }] });
    const handleItemChange = (index, field, value) => { const newItems = [...purchaseData.items]; newItems[index][field] = Number(value); setPurchaseData(prev => ({...prev, items: newItems})) };
    const addItem = () => setPurchaseData(prev => ({ ...prev, items: [...prev.items, { productId: '', quantity: 1, unitCost: 0 }] }));
    const removeItem = (index) => setPurchaseData(prev => ({...prev, items: prev.items.filter((_, i) => i !== index)}));
    const handleSubmit = (e) => { e.preventDefault(); onConfirm({...purchaseData, items: purchaseData.items.filter(i => i.productId && i.quantity > 0 && i.unitCost >= 0)}); };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-600"><form onSubmit={handleSubmit}><div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">Registrar Compra</h3></div><div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-300 mb-1">Proveedor</label><select value={purchaseData.supplierId} onChange={e => setPurchaseData(prev => ({...prev, supplierId: Number(e.target.value)}))} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required><option value="">-- Seleccionar --</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div><label className="block text-sm font-medium text-gray-300 mb-1">N° de Factura/Remito</label><input type="text" value={purchaseData.invoiceNumber} onChange={e => setPurchaseData(prev => ({...prev, invoiceNumber: e.target.value}))} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" /></div></div><hr className="border-gray-600"/><h4 className="font-semibold pt-2 text-white">Productos Comprados</h4>{purchaseData.items.map((item, index) => (<div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2 bg-gray-900/50 rounded-lg items-center"><select value={item.productId} onChange={e => handleItemChange(index, 'productId', e.target.value)} className="sm:col-span-2 w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required><option value="">-- Seleccionar producto --</option>{products.map(p => <option key={p.id} value={p.id}>{p.baseName} ({p.variantName})</option>)}</select><input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} placeholder="Cantidad" className="w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" /><div className="flex items-center"><input type="number" min="0" step="0.01" value={item.unitCost} onChange={e => handleItemChange(index, 'unitCost', e.target.value)} placeholder="Costo Unit." className="w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" /><button type="button" onClick={() => removeItem(index)} className="p-2 ml-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button></div></div>))}<button type="button" onClick={addItem} className="text-sm text-yellow-500 font-semibold hover:underline mt-2">Agregar otro producto</button></div><div className="p-4 bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg"><button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600">Cancelar</button><button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Confirmar Compra</button></div></form></div></div>
    );
}

function DeleteConfirmationModal({ item, itemType, onClose, onConfirm }) {
    const itemName = (itemType === 'product' || itemType === 'combo' || itemType === 'supplier') ? (item?.baseName ? `${item.baseName} (${item.variantName})` : item?.name) : 'elemento';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"><div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-600"><div className="p-6 text-center"><div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50"><AlertTriangleIcon className="h-6 w-6 text-red-500" /></div><h3 className="text-xl font-semibold text-white mt-4">Confirmar Eliminación</h3><p className="mt-2 text-gray-400">¿Estás seguro de que quieres eliminar <span className="font-bold text-yellow-400">"{itemName}"</span>? Esta acción no se puede deshacer.</p></div><div className="p-4 bg-gray-900/50 flex justify-center space-x-3 rounded-b-lg"><button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600 w-full">Cancelar</button><button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 w-full">Sí, eliminar</button></div></div></div>
    );
}

function SaleModal({ saleItem, onClose, onConfirm }) {
    const { item, type } = saleItem;
    const [saleDetails, setSaleDetails] = useState({ origin: 'Tienda Nube', type: 'Minorista', orderNumber: '', paymentMethod: 'PagoNube', shippingCost: 0 });
    const [isFreeShipping, setIsFreeShipping] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleChange = (e) => { const { name, value } = e.target; setSaleDetails(prev => ({ ...prev, [name]: value })); };
    const handleShippingCostChange = (e) => { setSaleDetails(prev => ({...prev, shippingCost: Number(e.target.value) || 0}))};
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let itemsToSell = [];
        if (type === 'sale_product') {
            itemsToSell.push({ productId: item.id, quantity });
        } else if (type === 'sale_combo') {
            itemsToSell = item.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
        }
        onConfirm(saleDetails, itemsToSell);
    };

    useEffect(() => { if (!isFreeShipping) { setSaleDetails(prev => ({...prev, shippingCost: 0})); } }, [isFreeShipping]);

    const renderItemsList = () => {
        if (type === 'sale_product') {
            const newStock = item.current_stock - quantity;
            const stockOk = newStock >= 0;
            return <li className={!stockOk ? 'text-red-500 font-bold' : ''}>{quantity}x {item.baseName} ({item.variantName}) <span className="text-gray-500">(Stock: {item.current_stock} → {newStock})</span></li>;
        }
        if (type === 'sale_combo') {
            return item.items.map(comboItem => {
                const product = products.find(p => p.id === comboItem.productId);
                if (!product) return null;
                const newStock = product.current_stock - comboItem.quantity;
                const stockOk = newStock >= 0;
                return <li key={comboItem.productId} className={!stockOk ? 'text-red-500 font-bold' : ''}>{comboItem.quantity}x {product.baseName} ({product.variantName}) <span className="text-gray-500">(Stock: {product.current_stock} → {newStock})</span></li>;
            });
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg border border-gray-600">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-700"><h3 className="text-xl font-semibold text-white">Registrar Venta</h3><p className="mt-1 text-gray-400">Item: <span className="font-bold text-yellow-400">"{type === 'sale_product' ? `${item.baseName} (${item.variantName})` : item.name}"</span></p></div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left">
                        {type === 'sale_product' && (
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Cantidad</label><input type="number" min="1" max={item.current_stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" required /></div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium text-gray-300 mb-1">Origen</label><select name="origin" value={saleDetails.origin} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"><option>Tienda Nube</option><option>WhatsApp</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label><select name="type" value={saleDetails.type} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"><option>Minorista</option><option>Mayorista</option></select></div>
                        </div>
                        {saleDetails.origin === 'Tienda Nube' && (<div><label className="block text-sm font-medium text-gray-300 mb-1">N° de Orden</label><input type="text" name="orderNumber" value={saleDetails.orderNumber} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" /></div>)}
                        <div><label className="block text-sm font-medium text-gray-300 mb-1">Método de Pago</label><select name="paymentMethod" value={saleDetails.paymentMethod} onChange={handleChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"><option>PagoNube</option><option>Transferencia</option><option>Efectivo</option></select></div>
                        <div className="pt-2 space-y-2">
                            <div className="flex items-center"><input id="freeShipping" type="checkbox" checked={isFreeShipping} onChange={(e) => setIsFreeShipping(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-600" /><label htmlFor="freeShipping" className="ml-2 block text-sm text-gray-300">Envío Gratis (costo asumido)</label></div>
                            {isFreeShipping && (<div><label className="block text-sm font-medium text-gray-300 mb-1">Costo del Envío ($)</label><input type="number" name="shippingCost" value={saleDetails.shippingCost || ''} onChange={handleShippingCostChange} className="w-full bg-gray-900 border-gray-600 text-white rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500" placeholder="0" /></div>)}
                        </div>
                        <div className="pt-2"><p className="text-sm font-medium text-gray-300 mb-2">Se descontará el siguiente stock:</p><ul className="list-disc list-inside bg-gray-900/50 p-3 rounded-lg text-gray-300 text-sm">{renderItemsList()}</ul></div>
                    </div>
                    <div className="p-4 bg-gray-900/50 flex justify-end space-x-3 rounded-b-lg"><button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-600">Cancelar</button><button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Confirmar Venta</button></div>
                </form>
            </div>
        </div>
    );
}
