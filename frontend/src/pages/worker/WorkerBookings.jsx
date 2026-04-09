import { useState, useEffect } from 'react';
import Loader from '../../components/Loader.jsx';
import {
  getWorkerBookings,
  acceptBooking,
  completeBooking,
} from '../../services/bookingService.js';
import {
  formatPrice,
  formatDate,
  getStatusColor,
} from '../../utils/helpers.js';

const WorkerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getWorkerBookings(); // 🔥 FIXED
      setBookings(data);
    } catch (error) {
      console.error('Error fetching worker bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setUpdatingId(id);
    try {
      await acceptBooking(id);
      fetchBookings();
    } catch (error) {
      console.error('Accept error:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleComplete = async (id) => {
    setUpdatingId(id);
    try {
      await completeBooking(id);
      fetchBookings();
    } catch (error) {
      console.error('Complete error:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Worker Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings available</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="border p-5 mb-5 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold">
              {booking.service?.name}
            </h2>

            <p>
              Status:
              <span
                className={`ml-2 px-2 py-1 rounded ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </p>

            <p>Date: {formatDate(booking.createdAt)}</p>
            <p>Price: {formatPrice(booking.service?.price)}</p>
            <p>Address: {booking.address}</p>

            <div className="mt-4 flex gap-3">
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleAccept(booking._id)}
                  disabled={updatingId === booking._id}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {updatingId === booking._id ? '...' : 'Accept'}
                </button>
              )}

              {booking.status === 'accepted' && (
                <button
                  onClick={() => handleComplete(booking._id)}
                  disabled={updatingId === booking._id}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {updatingId === booking._id ? '...' : 'Complete'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkerBookings;