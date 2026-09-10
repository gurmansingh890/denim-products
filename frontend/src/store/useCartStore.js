import { create } from 'zustand';

const getInitialCartItems = () => {
  try {
    const item = localStorage.getItem('indigo_cart');
    const parsed = item ? JSON.parse(item) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse indigo_cart from localStorage', e);
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCartItems(),
  
  addItem: (product, selections = [], quantity = 1) => {
    const currentItems = get().items;
    const customizationPrice = selections.reduce((acc, s) => acc + (s.price_delta || 0), 0);

    const newItem = {
      cart_item_id: `${product._id}_${Date.now()}`,
      product_id: product._id || product.id,
      product_title: product.title,
      product_image: product.images?.[0] || '',
      business_id: product.business_id || 'b1',
      unit_price: product.base_price,
      customization_price: customizationPrice,
      customization_selections: selections,
      quantity,
    };

    const updated = [...currentItems, newItem];
    localStorage.setItem('indigo_cart', JSON.stringify(updated));
    set({ items: updated });
  },

  removeItem: (cartItemId) => {
    const updated = get().items.filter(item => item.cart_item_id !== cartItemId);
    localStorage.setItem('indigo_cart', JSON.stringify(updated));
    set({ items: updated });
  },

  clearCart: () => {
    localStorage.removeItem('indigo_cart');
    set({ items: [] });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  },

  getCustomizationTotal: () => {
    return get().items.reduce((sum, item) => sum + (item.customization_price * item.quantity), 0);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const custom = get().getCustomizationTotal();
    const delivery = 15.0;
    const tax = (subtotal + custom) * 0.08;
    return subtotal + custom + delivery + tax;
  }
}));
