import React, { useEffect, useState } from 'react';
import './Regcpy.scss';
import { Modale } from "npm-modale-lib-react";
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';

const Registercpy = () => {
  const [yearId] = useState(2425);
  const [branchId] = useState(2);
  const [searchItem, setSearchItem] = useState('Patient ID');
  const [searchValue, setSearchValue] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editFlag, setEditFlag] = useState(0); // 0 for Save, 1 for Edit
  const searchItems = ['Patient ID', 'Name', 'Email', 'Phone'];

  const [prefix, setPrefix] = useState(''); // State for prefix
  const [gender, setGender] = useState(''); // State for gender
  const [dob, setDob] = useState('');
  const [age, setAge] = useState({ years: '', months: '', days: '' });
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDob(selectedDate);
    calculateAge(selectedDate);
    setEditFlag(1);
  };

  const calculateAge = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - dobDate.getFullYear();
    let months = today.getMonth() - dobDate.getMonth();
    let days = today.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  const fetchPatientData = async () => {
    try {
      const response = await axios.post('http://172.16.16.10:8082/api/PatientMstr/PatientDetailsMaster', {
        YearId: yearId,
        BranchId: branchId,
        PatCode: searchValue.trim()
      });
  
      if (response.data && response.data.patDetails) {
        const patient = response.data.patDetails;
        setPatientData({
          Patient_Code: patient.Patient_Code,
          Patient_Name: patient.Patient_Name,
          Patient_Title: patient.Patient_Title,
          Patient_Ismale: patient.Patient_Ismale,
          Patient_Email: patient.Patient_Email,
          Patient_Phno: patient.Patient_Phno,
          Patient_Address: patient.Patient_Address,
          Patient_Note: patient.Patient_Note,
        });
        setPrefix(patient.Patient_Title);
        setGender(patient.Patient_Ismale ? 'Male' : 'Female'); // Set gender based on database value
        setDob(patient.Patient_Dob);
        calculateAge(patient.Patient_Dob);
        setEditFlag(0);
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
        SrchVal: value.trim().toLowerCase(),
      });

      if (response.data && response.data.patientList) {
        const filteredSuggestions = response.data.patientList.map(patient => ({
          value: patient.Patient_Code,
          display: `${patient.Patient_Code} - ${patient.Patient_Name}-${patient.Patient_Phno}`
        }));
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

  const clearForm = () => {
    setPrefix('');
    setGender('');
    setDob('');
    setAge({ years: '', months: '', days: '' });
    setPatientData(null);
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setEditFlag(0);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (editFlag === 0) {
      console.log("Registration logic goes here");
      alert("Saved Successfully");
      setTimeout(closePopup(), 5000);
      setTimeout(clearForm(), 5000);
    } else {
      await updatePatientData();
    }
    setEditFlag(0);
  };

  const updatePatientData = async () => {
    try {
      const response = await axios.post('http://172.16.16.10:8082/api/PatientSaveUpdate', {
        Patient_Address: patientData.Patient_Address,
        Patient_Agedd: age.days,
        Patient_Agemm: age.months,
        Patient_Ageyy: age.years,
        Patient_Code: patientData.Patient_Code,
        Patient_Dob: dob,
        Patient_Email: patientData.Patient_Email,
        Patient_Ismale: gender==='Male' ,
        Patient_mobile: patientData.Patient_Phno,
        Patient_Name: patientData.Patient_Name,
        Patient_Title: prefix,
        Patient_Note: patientData.Patient_Note,
        Patient_Phno: patientData.Patient_Phno,
        Patient_CpyId: branchId,
        Patient_YrId: yearId,
        EditFlag: editFlag,
      });
      if (response.data) {
        alert("Patient data updated successfully.");
      }
    } catch (error) {
      console.error("Error updating patient data:", error);
      alert("Failed to update patient data.");
    }
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const openPopup = () => {
    setIsOpen(true);
  };
// handlePrefixChange
  const handlePrefixChange = (event) => {
    const selectedPrefix = event.target.value;
    setPrefix(selectedPrefix);

    // Automatically set gender based on the prefix
    if (selectedPrefix === 'MR') {
      setGender('Male');
    } else if (selectedPrefix === 'MRS') {
      setGender('Female');
    }

    setEditFlag(1); // Mark the form as edited
  };

  return (
    <div>
      <div className="open-btn">
        <button id='open-btn' onClick={openPopup}>Open Registration</button>
      </div>
      {isOpen &&
        <div className="main">
          <div className="card">
            <div className="close">
              <i className="fa fa-times" aria-hidden="true" onClick={closePopup}></i>
            </div>
            <div className="main-head">
              <h3>Registration Form</h3>
            </div>

            <div className="first-row">
              <div className="prefix">
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    label="Type"
                    sx={{ width: 150, height: 40 }}
                  >
                    {searchItems.map(item => (
                      <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="search-panel">
                <TextField id="outlined-basic" label={`Enter ${searchItem}`}
                  value={searchValue}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 100);
                  }} variant="outlined"
                  InputProps={{ style: { height: '40px', width: '300px' } }}
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
              </div>

              <div className="search-button">
                <button onClick={fetchPatientData}>Search</button>
              </div>
            </div>

            <form action="" onSubmit={handleRegister}>
              {patientData && (
                <div>
                  <div className="sec-row">
                    <div className="Prefix">
                      <FormControl>
                        <InputLabel id="prefix-label">Prefix</InputLabel>
                        <Select
                          labelId="prefix-label"
                          id="prefix-select"
                          value={prefix}
                          label="Prefix"
                          sx={{ width: 150, height: 40 }}
                          onChange={handlePrefixChange}
                        >
                          <MenuItem value='MR'>MR</MenuItem>
                          <MenuItem value='MRS'>MRS</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="pat-name">
                      <TextField
                        id="patient-name"
                        label="Patient Name"
                        value={patientData.Patient_Name}
                        onChange={(e) => {
                          setPatientData({ ...patientData, Patient_Name: e.target.value });
                          setEditFlag(1);
                        }}
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '410px' } }}
                      />
                    </div>
                  </div>

                  <div className="thd-row">
                    <div className="gender">
                      <FormControl>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          id="gender-select"
                          value={gender}
                          label="Gender"
                          sx={{ width: 150, height: 40 }}
                          onChange={(e) => {
                            setGender(e.target.value);
                            setEditFlag(1);
                          }}
                        >
                          <MenuItem value='Male'>Male</MenuItem>
                          <MenuItem value='Female'>Female</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <TextField
                      id="date"
                      label=""
                      variant="outlined"
                      type="date"
                      value={dob}
                      onChange={handleDateChange}
                      InputProps={{ style: { height: '40px', width: '250px' } }}
                    />

                    <div className="dates">
                      <TextField
                        id="yy"
                        value={age.years}
                        disabled
                        label="YY"
                        onChange={(e) => {
                          setPatientData({ ...age, years: e.target.value });
                          setEditFlag(1);
                        }}
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '60px' } }}
                      />

                      <TextField
                        id="mm"
                        value={age.months}
                        disabled
                        label="MM"
                        onChange={(e) => {
                          setPatientData({ ...age, months: e.target.value });
                          setEditFlag(1);
                        }}
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '60px' } }}
                      />
                      <TextField
                        id="dd"
                        value={age.days}
                        disabled
                        label="DD"
                        onChange={(e) => {
                          setPatientData({ ...age, days: e.target.value });
                          setEditFlag(1);
                        }}
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '60px' } }}
                      />
                    </div>
                  </div>

                  <div className="forth-row">
                    <TextField
                      id="phone"
                      label="Phone"
                      value={patientData.Patient_Phno}
                      onChange={(e) => {
                        setPatientData({ ...patientData, Patient_Phno: e.target.value });
                        setEditFlag(1);
                      }}
                      variant="outlined"
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                    <TextField
                      id="email"
                      type='email'
                      label="Email"
                      value={patientData.Patient_Email}
                      onChange={(e) => {
                        setPatientData({ ...patientData, Patient_Email: e.target.value });
                        setEditFlag(1);
                      }}
                      variant="outlined"
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                  </div>

                  <div className="address">
                    <TextField
                      id="address"
                      value={patientData.Patient_Address}
                      onChange={(e) => {
                        setPatientData({ ...patientData, Patient_Address: e.target.value });
                        setEditFlag(1);
                      }}
                      label="Address"
                      multiline
                      maxRows={3}
                      InputProps={{ style: { height: '120px', width: 500 } }}
                    />
                  </div>
                  <div className="NOTE">
                    <TextField
                      id="notes"
                      label="Notes"
                      value={patientData.Patient_Note}
                      onChange={(e) => {
                        setPatientData({ ...patientData, Patient_Note: e.target.value });
                        setEditFlag(1);
                      }}
                      multiline
                      maxRows={4}
                      InputProps={{ style: { height: '120px', width: 500 } }}
                    />
                  </div>
                </div>
              )}
              <div className="add-detail">
                <a href="#">Additional Detail</a>
              </div>

              <div className="buttons">
                <button type="button" id='new' onClick={clearForm}>New</button>
                <button type="submit" id='bill' >{editFlag === 0 ? 'Save' : 'Edit'}</button>
                <button id='bill'>Proceed to bill</button>
                <button id='bill'>Save & Proceed to bill</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  );
};

export default Registercpy;
