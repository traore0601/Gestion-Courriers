import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationRequest,
} from '../api/apiClient.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 30000; // 30s

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error('Erreur chargement notifications :', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const count = await fetchUnreadNotificationsCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur comptage notifications :', err);
    }
  }, [user]);

  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error('Erreur marquage lu :', err);
      loadNotifications();
    }
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error('Erreur marquage global :', err);
      loadNotifications();
    }
  }, [loadNotifications]);

  const deleteNotification = useCallback(async (id) => {
    const wasUnread = notifications.find((n) => n.id === id)?.is_read === false;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotificationRequest(id);
    } catch (err) {
      console.error('Erreur suppression notification :', err);
      loadNotifications();
    }
  }, [notifications, loadNotifications]);

  // Chargement initial + polling tant qu'un utilisateur est connecté
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    loadNotifications();
    pollRef.current = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [user, loadNotifications, refreshUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return ctx;
}
