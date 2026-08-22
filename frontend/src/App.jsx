import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Storefront from './components/Storefront';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CustomerDashboard from './components/CustomerDashboard';
import StaffDashboard from './components/StaffDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { api, getToken, removeToken, setToken } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('storefront'); // storefront | customer | staff | admin
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    initAppData();
  }, []);

  useEffect(() => {
    fetchProducts();
    if (searchQuery && searchQuery.trim() !== '' && activeView !== 'storefront') {
      setActiveView('storefront');
    }
  }, [selectedCategory, searchQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const initAppData = async () => {
    try {
      // Fetch Stores & Categories
      const [storeList, catList] = await Promise.all([
        api.getStores(),
        api.getCategories()
      ]);
      setStores(storeList);
      if (storeList.length > 0) setSelectedStore(storeList[0]);
      setCategories(catList);

      // Check current user if token exists
      if (getToken()) {
        const currentUser = await api.getMe();
        setUser(currentUser);
        fetchCart();
      }
    } catch (err) {
      console.error(err);
      removeToken();
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts(selectedCategory, searchQuery);
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCart = async () => {
    if (!getToken()) return;
    try {
      const items = await api.getCart();
      setCartItems(items);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!getToken()) {
      setIsAuthOpen(true);
      return;
    }
    try {
      await api.addToCart(productId, quantity);
      await fetchCart();
      showToast('Item added to cart!');
    } catch (err) {
      alert(err.message || 'Failed to add item');
    }
  };

  const handleUpdateCartQty = async (cartItemId, qty) => {
    try {
      await api.updateCartItem(cartItemId, qty);
      fetchCart();
    } catch (err) {
      alert(err.message || 'Failed to update quantity');
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      await api.removeCartItem(cartItemId);
      fetchCart();
    } catch (err) {
      alert(err.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await api.clearCart();
      fetchCart();
    } catch (err) {
      alert(err.message || 'Failed to clear cart');
    }
  };

  const handlePlaceOrder = async (orderPayload) => {
    const order = await api.placeOrder(orderPayload);
    fetchCart();
    fetchProducts();
    return order;
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setCartItems([]);
    setActiveView('storefront');
    showToast('Logged out');
  };

  return (
    <div className="app-container">
      <Navbar 
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stores={stores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
      />

      <main className="main-content">
        {activeView === 'storefront' && (
          <Storefront 
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {activeView === 'customer' && <CustomerDashboard user={user} />}
        {activeView === 'staff' && <StaffDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        stores={stores}
        selectedStore={selectedStore}
        onPlaceOrder={handlePlaceOrder}
        onTrackOrder={(order) => {
          setIsCartOpen(false);
          setActiveView('customer');
        }}
      />


      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          fetchCart();
          if (userData.role === 'ROLE_ADMIN') setActiveView('admin');
          else if (userData.role === 'ROLE_STAFF') setActiveView('staff');
          else setActiveView('storefront'); // Customers go directly to product storefront page
          showToast(`Welcome ${userData.fullName}`);
        }}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
