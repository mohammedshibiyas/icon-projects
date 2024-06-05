import React, { useState, useEffect } from "react";
import axios from "axios";

const Apps = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("http://172.16.16.10:8082/api/PatientMstr/PatientSearchMaster", {
        YearId:2425,
    BranchId:2,
    SrchItem:"Patient ID",
    SrchVal:" 2242517094"
      });

      setData(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data from API</h1>
      <ul>
        {data.map((item) => (
          <li key={item.Patient_Name}>{item.Patient_Code}</li>
        ))}
      </ul>
    </div>
  );
};

export default Apps;