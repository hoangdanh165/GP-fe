import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export const useFetchServices = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const axios = useAxiosPrivate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/services/");

        const formattedData = response.data.map((service: any) => ({
          id: service.id,
          name: service.name,
          category: service.category.id,
          category_name: service.category.name,
          description: service.description,
          price: service.price,
          discount: service.discount,
          discount_from: service.discount_from,
          discount_to: service.discount_to,
          estimated_duration: service.estimated_duration,
          createAt: dayjs(service.create_at).format("DD/MM/YYYY"),
        }));
        console.log("Formatted Data:", formattedData); // Debugging line
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [axios, reloadTrigger]);

  return { rows, loading };
};
