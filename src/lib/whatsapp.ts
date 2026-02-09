import { CartItem, CheckoutFormData } from '@/types/database';

export const formatOrderMessage = (
  items: CartItem[],
  subtotal: number,
  discount: number,
  formData: CheckoutFormData
): string => {
  const lines = [
    '🍗 *NEW ORDER - MFC Makyo Fried Chicken* 🍗',
    '',
    '*Customer Details:*',
    `👤 Name: ${formData.name}`,
    `📱 Phone: ${formData.phone}`,
    `📍 Address: ${formData.address}`,
  ];

  if (formData.instructions) {
    lines.push(`📝 Special Instructions: ${formData.instructions}`);
  }

  lines.push('', '*Order Items:*');

  items.forEach(item => {
    lines.push(`• ${item.product.name} x${item.quantity} - ₹${(item.product.price * item.quantity).toFixed(2)}`);
  });

  lines.push('', '─────────────────');
  lines.push(`Subtotal: ₹${subtotal.toFixed(2)}`);

  if (discount > 0) {
    lines.push(`Discount: -₹${discount.toFixed(2)}`);
  }
  
  lines.push(`*Total: ₹${(subtotal - discount).toFixed(2)}*`);
  lines.push('');
  lines.push('🚚 *Delivery: ₹50/km (Hashtag Dropee)*');

  lines.push('');
  lines.push(`💳 Payment Method: ${formData.paymentMethod === 'gpay' ? 'GPay (UPI)' : 'Cash on Delivery'}`);

  if (formData.paymentMethod === 'gpay') {
    lines.push('', '📸 *Payment screenshot will follow*');
  }

  lines.push('', 'Thank you for ordering! 🙏');

  return encodeURIComponent(lines.join('\n'));
};

export const generateWhatsAppLink = (
  phoneNumber: string,
  items: CartItem[],
  subtotal: number,
  discount: number,
  formData: CheckoutFormData
): string => {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const message = formatOrderMessage(items, subtotal, discount, formData);
  return `https://wa.me/${cleanPhone}?text=${message}`;
};
