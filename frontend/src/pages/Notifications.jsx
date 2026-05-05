import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/users/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/users/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <Bell className="text-blue-500" size={32} /> Notifications
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Bell size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">You're all caught up!</p>
            <p>No notifications to display.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map(notification => (
              <li key={notification._id} className={`p-6 transition-colors ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-base mb-2 ${notification.isRead ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{new Date(notification.createdAt).toLocaleString()}</span>
                      {notification.link && (
                        <Link to={notification.link} className="text-blue-600 hover:text-blue-800 font-semibold">
                          View Details &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification._id)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
