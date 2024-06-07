import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import './Register.css'
const PatientSearch = () => {
    const [yearId, setYearId] = useState(2425);
    const [branchId, setBranchId] = useState(2);
    const [searchItem, setSearchItem] = useState('Patient ID');
    const [searchValue, setSearchValue] = useState('');
    const [patientData, setPatientData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchItems = ['Patient ID', 'Name', 'Email', 'Phone'];

    const fetchPatientData = async () => {
        try {
            const response = await axios.post('http://172.16.16.10:8082/api/PatientMstr/PatientSearchMaster', {
                YearId: yearId,
                BranchId: branchId,
                SrchItem: searchItem,
                SrchVal: searchValue.trim().toLowerCase(), // Convert to lowercase
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

    const fetchSuggestions = async (value) => {
        try {
            const response = await axios.post('http://172.16.16.10:8082/api/PatientMstr/PatientSearchMaster', {
                YearId: yearId,
                BranchId: branchId,
                SrchItem: searchItem,
                SrchVal: value.trim().toLowerCase(), // Convert to lowercase
            });

            if (response.data && response.data.patientList) {
                const filteredSuggestions = response.data.patientList.map(patient => {
                    return {
                        value: patient.Patient_Code,
                        display: `${patient.Patient_Code} - ${patient.Patient_Name}`
                    };
                });
                setSuggestions(filteredSuggestions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

      // close and open
      const [isOpen, setIsOpen] = useState(false);

      const openPopup = () => {
          setIsOpen(true);
      }
  
      const closePopup = () => {
          setIsOpen(false);
      }
  
      const handleRegister = (e) => {
          e.preventDefault();
          // Implement your registration logic here
          console.log("Registration logic goes here");
          closePopup(); // Close the popup after registration
      }

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value.length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (value) => {
        setSearchValue(value);
        setShowSuggestions(false);
    };

    return (
        <div>
            <h1>Search Patient</h1>
            <select
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
            >
                {searchItems.map(item => (
                    <option key={item} value={item}>{item}</option>
                ))}
            </select>
            <input
                type="text"
                placeholder={`Enter ${searchItem}`}
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                   
                    setTimeout(() => setShowSuggestions(false), 100);
                }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion.value)}>
                            {suggestion.display}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={fetchPatientData}>Search</button>

            {patientData && (
                <div>
                    <h2>Patient Details for {searchItem}: {searchValue}</h2>
                    <p><strong>Name:</strong> {patientData.Patient_Name}</p>
                    <p><strong>Gender:</strong> {patientData.Patient_Ismale}</p>
                    <p><strong>Email:</strong> {patientData.Patient_Email}</p>
                    <p><strong>Phone:</strong> {patientData.Patient_Phno}</p>
                    <p><strong>Address:</strong> {patientData.Patient_Address}</p>
                    <p><strong>Age (Years):</strong> {patientData.Patient_Ageyy}</p>
                    <p><strong>Note:</strong> {patientData.Patient_Note}</p>
                </div>
            )}



        </div>
    );
};

export default PatientSearch;
