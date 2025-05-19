import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import dayjs from "dayjs";

import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

export const useFetchAccounts = (reloadTrigger: number) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const axios = useAxiosPrivate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/v1/users/");

        const formattedData = response.data.map((user: any) => ({
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          emailVerified: user.email_verified,
          fullName: user.full_name,
          address: user.address,
          role: user.role,
          accountStatus: user.status,
          phone: user.phone || "N/A",
          createAt: dayjs(user.create_at).format("DD/MM/YYYY"),
        }));
        console.log("Formatted Data:", formattedData); // Debugging line
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [axios, reloadTrigger]);

  return { rows, loading };
};
