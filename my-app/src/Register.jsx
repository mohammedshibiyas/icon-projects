import React, { useEffect, useState } from 'react'
import './Register.css'
import { Modale } from "npm-modale-lib-react"; 
import TextField from '@mui/material/TextField';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';







const Register = () => {

// variable
const yearid=2425;
const branchid=2;
    // depent dropdow
    const [selectPrefix, setSelectedPrefix] = useState('');
  const [selectGender, setSelectedGender] = useState('');

    const genderdata={
        MR:'Male',
        MRS:'Female'
    };

    const handlePrefixChange = (event) => {
        const prefix = event.target.value;
        setSelectedPrefix(prefix);
        
        // Automatically select gender based on prefix
        setSelectedGender(genderdata[prefix] || '');
      };

      const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
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

    // const classes = useStyles();
    const [date, setDate] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
  
    const handleDateChange = (event) => {
      const selectedDate = event.target.value;
      setDate(selectedDate);
  
      // Split the date into components
      const [yyyy, mm, dd] = selectedDate.split('-');
      setDay(dd);
      setMonth(mm);
      setYear(yyyy);
    };

    // show data
    const[val,setval]=useState({
      YearId:yearid,
      BranchId:branchid,
      SrchItem:"",
      SrchVal:""
    })

    const Takedata=async(e)=>{
      setval((pre)=>({...pre,[e.target.name]:e.target.value}))
      console.log(e.target.value);
 
       console.log(setval);
    }
    // console.log(setval);
    




    const [Getdata,setData]=useState([])
    const getAlldata=async()=>{
      
     
        try {
          const res=await axios.post("http://172.16.16.10:8082/api/PatientMstr/PatientSearchMaster",{...val})
          setData(res.data)
          console.log(Getdata);
        } catch (error) {
          console.log(error);
        }
    }
    useEffect(()=>{
     
    },[])



  
    
  
    
    
  return (
    <div>
          <button onClick={openPopup}>Open Registration</button>
          {isOpen &&
        <div className="card">
            <div className="close">
            <i class="fa fa-times" aria-hidden="true" onClick={closePopup}></i>
            </div>
      <div className="all">
        <h1>Registration Form</h1>
      </div>
      <div className="search">
      <FormControl>
        <InputLabel id="prefix-label">Prefix</InputLabel>
        <Select
          labelId="prefix-label"
          id="prefix-select"
          value={selectPrefix}
          name=' SrchItem'
          style={{ height: '40px',width: '120px' }}
          onChange={handlePrefixChange}
        >
         <MenuItem value="patname">Name</MenuItem>
          <MenuItem value="patid">Patient ID</MenuItem>
          <MenuItem value="phone">Phone No</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
      
      <TextField id="outlined-basic searchinp" onChange={Takedata} label="Search patient" variant="outlined" name='SrchVal' InputProps={{ style: { height: '40px' ,width:'300px',marginLeft:'10px' } }}
             InputLabelProps={{ style: { fontSize: '14px', marginTop: '-4px' } }} className='searchs' />
        <button onClick= {getAlldata}>Search</button>
      </div>
      <div className="id">

        <TextField id="outlined-basic" onChange={Takedata} label="yearid" name='' variant="outlined" InputProps={{ style: { height: '40px' ,width:'100px' } }}
             InputLabelProps={{ style: { fontSize: '14px', marginTop: '-4px' } }}  className='uhid' />
             
      </div>
      <div className="heading">
        <h3>Patient Details:</h3>
      </div>
     <div className="maping">
     <div className="show" >
             <form action="" onSubmit={handleRegister} onChange={handlePrefixChange}>
      <div className="name">
      <FormControl>
        <InputLabel id="prefix-label">Prefix</InputLabel>
        <Select
          labelId="prefix-label"
          id="prefix-select"
          value={selectPrefix}
          style={{ height: '40px',width: '85px' }}
          onChange={handlePrefixChange}
        >
          <MenuItem value="p">prefix</MenuItem>
          <MenuItem value="MR">MR</MenuItem>
          <MenuItem value="MRS">MRS</MenuItem>
        </Select>
      </FormControl>
   
        <TextField id="outlined-basic" value={Getdata.Patient_Name} label="Patient Name" variant="outlined" InputProps={{ style: { height: '40px' ,width:'100%' } }}
             InputLabelProps={{ style: { fontSize: '14px', marginTop: '-4px' } }}  className='names' />
      </div>

      <div className="detail">
        <div className="gender">
        <FormControl>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          id="gender-select"
          value={selectGender}
          style={{ height: '40px',width: '85px'  }}
          onChange={handleGenderChange}
        >
          <MenuItem value="">Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
      </FormControl>
            <TextField type='date'  value={date} onChange={handleDateChange} InputLabelProps={{
          shrink: true, }} id="outlined-basic" label="Date of Birth" variant="outlined"  InputProps={{ style: { height: '40px' ,width:'100%' } }}className='dates' />
            <TextField id="outlined-basic" label="DD" variant="outlined" className='dd'   value={day}
        InputLabelProps={{
          shrink: true,
        }} InputProps={{ style: { height: '40px' ,width:'100%' } }} />
            <TextField id="outlined-basic" label="MM" variant="outlined" className='dd'   value={month}
        InputLabelProps={{
          shrink: true,
        }} InputProps={{ style: { height: '40px' ,width:'100%' } }} />
            <TextField id="outlined-basic" label="YY" variant="outlined" className='dd'   value={year}
        InputLabelProps={{
          shrink: true,
        }} InputProps={{ style: { height: '40px' ,width:'100%' } }}/>
        </div>
      </div>
      <div className="sec-detail">
      <TextField id="outlined-basic" label="Phone Number" InputProps={{ style: { height: '40px' ,width:'250px' } }}
             InputLabelProps={{ style: { fontSize: '14px', marginTop: '-5px' } }} variant="outlined" />
      <div className="email">
      <TextField id="outlined-basic" label="Email" InputProps={{ style: { height: '40px' ,width:'250px' } }}
             InputLabelProps={{ style: { fontSize: '14px', marginTop: '-5px' } }} variant="outlined" />
      </div>
      </div>
      <div className="address">
          <TextField id="outlined-multiline-flexible" label="Address"  multiline  maxRows={4}
         className='adresses'/>
      </div>
      <div className="address">
      <TextField id="outlined-multiline-flexible" label="Notes"  multiline  maxRows={4}
         className='adresses'/>
      </div>
      <div className="add-detail">
        <a href="">Additional Detail</a>
      </div>
      
      <div className="buttons">
        <button id='new'>New</button>
        <button id='bill'>Proceed to bill</button>
        <button id='bill'>Save & Proceed to bill</button>

        

      </div>
      </form>
          </div>
     </div>
      </div>
}
    </div>
  )
}

export default Register
