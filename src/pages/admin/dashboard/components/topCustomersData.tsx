import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export const useFetchTopCustomers = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const axios = useAxiosPrivate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/users/stats/top-customers");

        setRows(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios]);

  return { rows, loading };
};
