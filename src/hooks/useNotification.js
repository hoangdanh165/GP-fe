import { useEffect, useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import axios from "axios";
import { useRecoilState } from "recoil";
import { notificationsAtom } from "./../atoms/notificationsAtom";

const NOTIFICATION_API = "api/v1/notifications/";

const useNotification = () => {
  const axiosPrivate = useAxiosPrivate();
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosPrivate.get(NOTIFICATION_API, {
        params: { page: 1 },
      });

      setNotifications(res.data.results);
      setHasMore(!!res.data.next);
      setPage(2);

      return res.data.results;
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoreNotifications = useCallback(async () => {
    if (!hasMore) return;
    setError(null);
    setLoadingMore(true);
    try {
      const res = await axiosPrivate.get(NOTIFICATION_API, {
        params: { page },
      });

      setNotifications((prev) => [...prev, ...res.data.results]);
      setHasMore(!!res.data.next);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more notifications:", err);
      setError("Failed to load more notifications.");
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore]);

  return {
    notifications,
    setNotifications,
    fetchNotifications,
    fetchMoreNotifications,
    hasMore,
    loading,
    loadingMore,
    error,
  };
};

export default useNotification;
