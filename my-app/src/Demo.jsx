import React, { useState } from 'react';
import axios from 'axios';

const PatientSearch = () => {
    const [yearId, setYearId] = useState(2425);
    const [branchId, setBranchId] = useState(2);
    const [searchItem, setSearchItem] = useState('Patient ID');
    const [searchValue, setSearchValue] = useState('');
    const [patientData, setPatientData] = useState(null);

    const fetchPatientData = async () => {
        try {
            const response = await axios.post('http://172.16.16.10:8082/api/PatientMstr/PatientSearchMaster', {
                YearId: yearId,
                BranchId: branchId,
                SrchItem: searchItem,
                SrchVal: searchValue.trim(),
            });

            if (response.data && response.data.patientList && response.data.patientList.length > 0) {
                setPatientData(response.data.patientList[0]);
            } else {
                alert("No patient data found.");
                setPatientData(null);
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
            alert("Failed to fetch patient data.");
        }
    };

    return (
        <div>
            <h1>Search Patient</h1>
            <input
                type="text"
                placeholder="Enter Patient ID"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={fetchPatientData}>Search</button>

            {patientData && (
                <div>
                    <h2>Patient Details for ID: {patientData.Patient_Code}</h2>
                    <p><strong>Name:</strong> {patientData.Patient_Name}</p>
                    <p><strong>Gender:</strong> {patientData.Patient_Ismale}</p>
                    <p><strong>Email:</strong> {patientData.Patient_Email}</p>
                    <p><strong>Phone:</strong> {patientData.Patient_Phno}</p>
                    <p><strong>Address:</strong> {patientData.Patient_Address}</p>
                    <p><strong>Age (Years):</strong> {patientData.Patient_Ageyy}</p>
                    <p><strong>Note:</strong> {patientData.Patient_Note}</p>
                    {/* Add other patient details as necessary */}
                </div>
            )}
        </div>
    );
};

export default PatientSearch;
