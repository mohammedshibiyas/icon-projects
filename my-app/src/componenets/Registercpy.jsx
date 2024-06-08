import React, { useState } from 'react';
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
  const searchItems = ['Patient ID', 'Name', 'Email', 'Phone'];

  const [selectPrefix, setSelectedPrefix] = useState('');
  const [selectGender, setSelectedGender] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState({ years: '', months: '', days: '' });
  const [isOpen, setIsOpen] = useState(false);

  const genderdata = {
    MR: 'Male',
    MRS: 'Female'
  };

  const handlePrefixChange = (event) => {
    const prefix = event.target.value;
    setSelectedPrefix(prefix);
    setSelectedGender(genderdata[prefix] || '');
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDob(selectedDate);
    calculateAge(selectedDate);
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


  // const handleDateChange = (event) => {
  //   const selectedDate = event.target.value;
  //   setDate(selectedDate);

  //   const [yyyy, mm, dd] = selectedDate.split('-');
  //   setDay(dd);
  //   setMonth(mm);
  //   setYear(yyyy);
  // };

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
          Patient_Ismale: patient.Patient_Ismale,
          Patient_Email: patient.Patient_Email,
          Patient_Phno: patient.Patient_Phno,
          Patient_Address: patient.Patient_Address,
          Patient_Note: patient.Patient_Note,
        });
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
          display: `${patient.Patient_Code} - ${patient.Patient_Name}`
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
    setSelectedPrefix('');
    setSelectedGender('');
   setDob('');
    setAge('');
    setPatientData(null);
    setSearchValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registration logic goes here");
    closePopup();
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <button onClick={openPopup}>Open Registration</button>
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
                          value={selectPrefix}
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
                        onChange={(e) => setPatientData({ ...patientData, Patient_Name: e.target.value })}
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
                          value={selectGender}
                          label="Gender"
                          sx={{ width: 150, height: 40 }}
                          onChange={handleGenderChange}
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
                      value={dob} onChange={handleDateChange}
                      InputProps={{ style: { height: '40px', width: '250px' } }}
                    />

                    <div className="dates">
                    <TextField
                        id="yy"
                        value={age.years}
                        disabled
                        label="YY"
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '60px' } }}
                      />
                      
                      <TextField
                        id="mm"
                        value={age.months}
                        disabled
                        label="MM"
                        variant="outlined"
                        InputProps={{ style: { height: '40px', width: '60px' } }}
                      />
                      <TextField
                        id="dd"
                        value={age.days}
                        disabled
                        label="DD"
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
                      onChange={(e) => setPatientData({ ...patientData, Patient_Phno: e.target.value })}

                      variant="outlined"
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                    <TextField
                      id="email"
                      type='email'
                      label="Email"
                      value={patientData.Patient_Email}
                      onChange={(e)=>setPatientData({...patientData, Patient_Email:e.target.value})}
                      variant="outlined"
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                  </div>

                  <div className="address">
                    <TextField
                      id="address"
                      value={patientData.Patient_Address}
                      onChange={(e)=>setPatientData({...patientData, Patient_Address:e.target.value})}
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
                      onChange={(e)=>setPatientData({...patientData, Patient_Note:e.target.value})}
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
                <button id='bill'>Proceed to bill</button>
                <button id='bill'>Save & Proceed to bill</button>
              </div>
            </form>
          </div>
        </div>  
      }
    </div>
  )
}

export default Registercpy;
