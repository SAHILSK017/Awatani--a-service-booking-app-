import api from './api.js';

// CREATE BOOKING
export const createBooking = async (serviceId, address, bookingDate) => {
  const response = await api.post('/bookings', {
    service: serviceId,
    address,
    bookingDate,
  });
  return response.data;
};

// USER BOOKINGS
export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

// 🔥 WORKER BOOKINGS (IMPORTANT)
export const getWorkerBookings = async () => {
  const response = await api.get('/bookings/worker');
  return response.data;
};

// ACCEPT BOOKING
export const acceptBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/accept`);
  return response.data;
};

// COMPLETE BOOKING
export const completeBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/complete`);
  return response.data;
};