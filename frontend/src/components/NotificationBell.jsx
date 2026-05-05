import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/users/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await API.put('/users/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/users/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Bell size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm">You have no notifications.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.slice(0, 10).map(notification => (
                  <li key={notification._id} className={`p-4 transition-colors ${notification.isRead ? 'bg-white' : 'bg-blue-50/50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className={`text-sm mb-1 ${notification.isRead ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                          {notification.message}
                        </p>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-400">
                            {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                          </span>
                          {notification.link && (
                            <Link 
                              to={notification.link} 
                              onClick={() => {
                                setIsOpen(false);
                                if(!notification.isRead) markAsRead(notification._id);
                              }}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 w-max"
                            >
                              View details &rarr;
                            </Link>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification._id)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-1.5 rounded-full transition-colors flex-shrink-0"
                          title="Mark as read"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {notifications.length > 10 && (
            <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
              <Link 
                to="/notifications" 
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
