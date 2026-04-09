import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';

  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const STATUS_MAP = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const getStatusColor = (status) => {
  return STATUS_MAP[status] || 'bg-gray-100 text-gray-800';
};

export const cn = (...inputs) => twMerge(clsx(inputs));