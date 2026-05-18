import api from './api.js';

// CREATE BOOKING WITH PREMIUM FIELDS
export const createBooking = async (serviceId, address, bookingDate, urgency = "standard", notes = "", paymentMethod = "cash", discountCode = "") => {
  const response = await api.post('/bookings', {
    service: serviceId,
    address,
    bookingDate,
    urgency,
    notes,
    paymentMethod,
    discountCode,
  });
  return response.data;
};

// USER BOOKINGS
export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

// WORKER BOOKINGS
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

// DELETE/CANCEL PENDING BOOKING
export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// GET SINGLE BOOKING DETAILS
export const getBookingDetails = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};