import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const useFetchCars = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const axios = useAxiosPrivate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/cars/");

        const formattedData = response.data.map((car: any) => ({
          id: car.id,
          name: car.name,
          year: car.year,
          brand: car.brand,
          color: car.color,
          engineType: car.engine_type,
          currentOdometer: car.current_odometer,
          licensePlate: car.license_plate,
          registrationProvince: car.registration_province,
          vin: car.vin,
          user: car.user,
          createAt: dayjs(car.create_at).format("DD/MM/YYYY"),
        }));
        console.log("Formatted Data:", formattedData);
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [axios, reloadTrigger]);

  return { rows, loading };
};
