import type { CartItem } from '../context/CartContext';
import { config } from '../data/config';

export const generateWhatsAppOrderUrl = (items: CartItem[], total: number, notes: string): string => {
  let message = `Hi BITE UP! 👋\n\nI'd like to place an order:\n\n`;
  
  items.forEach(item => {
    message += `• ${item.product.name} × ${item.quantity}\n`;
  });
  
  message += `\nTotal: ${total.toFixed(2)} JD\n`;
  
  if (notes.trim()) {
    message += `\nNotes:\n${notes.trim()}\n`;
  }
  
  const encodedMessage = encodeURIComponent(message);
  // Using the wa.me format
  const number = config.whatsappNumber.replace(/\+/g, '');
  
  return `https://wa.me/${number}?text=${encodedMessage}`;
};
