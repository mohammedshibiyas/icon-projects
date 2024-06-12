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
  // const [gender, setGender] = useState(''); // State for gender
  const [gender, setGender] = useState(patientData?.Patient_Ismale ? 'Male' : 'Female'); // Set initial gender based on fetched data (if available)

  const [dob, setDob] = useState('');
  const [age, setAge] = useState({ years: '', months: '', days: '' });
  const [isOpen, setIsOpen] = useState(false);

    // State for validation errors
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [errors, setErrors] = useState({
      Patient_Name: '',
      Patient_Email: '',
    });

    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
  
    const validatePhone = (phone) => {
      // Regular expression for a 10-digit number
      const regex = /^\d{10}$/;
      return regex.test(phone);
    };
 
    // INPUT CHANGES HANDLE
    const handletextfieldchange=(e)=>{
      setPatientData((pre)=>({...pre,[e.target.name]:e.target.value}))
      setPhone(e.target.value)
      if (e.target.validity.valid) {
        setErrors({ ...errors, [e.target.name]: '' });
      } else {
        const newError = e.target.validationMessage || 'This field is invalid.';
        setErrors({ ...errors, [e.target.name]: newError });
      }
      if (e.target.value && !validatePhone(e.target.value)) {
        setError('Phone number must be exactly 10 digits.');
      } else {
        setError('');
      }
     
      setEditFlag(1)
    }

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
        console.log(patient.Patient_Ismale,"hello");
        // Gender selection   
        if (patient.Patient_Ismale==="Male") {
         
          setGender('Male')
          
        } else {
          setGender('Female')
          
        }
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
    setErrors({
      Patient_Name: '',
      Patient_Email: '',
      Patient_Phno: '',
      Patient_Address: '',
      Patient_Dob: '',
    });
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
    const {  Patient_Email } = errors;
    // if (!Patient_Name && !Patient_Email && !Patient_Phno) {
    //   alert('Please fill at least one required field.');
    //   return;
    // }
    if (Patient_Email && !EMAIL_REGEX.test(Patient_Email)) {
      setErrors({ ...errors, Patient_Email: 'Invalid email format.' });
      return;
    }
    if (!validatePhone(phone)) {
      alert('Please enter a valid 10-digit phone number.');
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
        Patient_Ismale: gender ,
        
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
// PREFIX CHANGE
const handlePrefixChange = (event) => {
  const selectedPrefix = event.target.value;
  setPrefix(selectedPrefix);

  // Automatically set gender based on the prefix
  if (selectedPrefix === 'MR') {
    setGender('Male');
  } else if (selectedPrefix === 'MRS') {
    setGender('Female');
  }

  setPatientData((prevData) => ({
    ...prevData,
    Patient_Title: selectedPrefix,
    Patient_Ismale: selectedPrefix === 'MR',
  }));
  setEditFlag(1);
};
// GENDER CHANGE
const handleGenderChange = (event) => {
  const selectedGender = event.target.value;
  setGender(selectedGender);

  // Set prefix based on gender selection
  if (selectedGender === 'Male') {
    setPrefix('MR');
  } else if (selectedGender === 'Female') {
    setPrefix('MRS');
  }

  setPatientData((prevData) => ({
    ...prevData,
    Patient_Ismale: selectedGender === 'Male',
  }));
  setEditFlag(1);
};
 // Function to highlight the search term in the suggestions
 const highlightSearchTerm = (text, term) => {
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
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
                         <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(suggestion.display, searchValue) }} />
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
                        required
                        name='Patient_Name'
                        label="Patient Name"
                        value={patientData.Patient_Name}
                        onChange={handletextfieldchange}
                        error={!!errors.Patient_Name}
                        helperText={errors.Patient_Name}
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
                      type='number'
                      name='Patient_Phno'
                      label="Phone"
                      value={patientData.Patient_Phno}
                      onChange={handletextfieldchange}
                      error={!!error}
                      helperText={error}
                      variant="outlined"
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                    <TextField
                      id="email"
                      type='email'
                      name='Patient_Email'
                      label="Email"
                      value={patientData.Patient_Email}
                      onChange={handletextfieldchange}
                      variant="outlined"
                      error={!!errors.Patient_Email}
                      helperText={errors.Patient_Email}
                      InputProps={{ style: { height: '40px', width: '300px' } }}
                    />
                  </div>

                  <div className="address">
                    <TextField
                      id="address"
                      name='Patient_Address'
                      value={patientData.Patient_Address}
                      onChange={handletextfieldchange}
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
                      name='Patient_Note'
                      value={patientData.Patient_Note}
                      onChange={handletextfieldchange}
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
