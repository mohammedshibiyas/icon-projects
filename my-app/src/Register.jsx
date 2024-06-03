import React, { useState } from 'react'
import './Register.css'
import { Modale } from "npm-modale-lib-react"; 



const Register = () => {

    // depent dropdow
    const[selectprefix,setSelectedPrefix]=useState('')
    const[selectgender,setSelectedGender]=useState('')

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
      {/* <div className="search">
        <button>Search</button>
        <input type="text" placeholder='Search Patient ' />
      </div> */}
      <div className="form-floating mb-1 p-1 search">
     
                <input 
                    type="email" 
                    className="form-control" 
                    id="floatingInput" 
                    placeholder="name@example.com" 
                />
                <label htmlFor="floatingInput">Search Patient</label>
                 <button>Search</button>
            </div>
      <div className="id">
        <input type="text" name="" id="" placeholder='UHID' />
      </div>
      <div className="heading">
        <h3>Patient Details:</h3>
      </div>
      <form action="" onSubmit={handleRegister} onChange={handlePrefixChange}>
      <div className="name">
        <select name="" id="" value={selectprefix}>
            <option value="MR">MR</option>
            <option value="MRS">MRS</option>
        </select>
        <div className="form-floating mb-1 p-1 search">
     
     <input 
         type="email" 
         className="form-control" 
         id="floatingInput" 
         placeholder="name@example.com" 
     />
     <label htmlFor="floatingInput">Name</label>
      {/* <button>Search</button> */}
 </div>
      </div>

      <div className="detail">
        <div className="gender">
            <select name="" id="" value={selectgender} onChange={handleGenderChange}>
                <option value=""selected>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="date" className='dob' placeholder='DOB'/>
            <input type="text" className='dd' placeholder='DD' />
            <input type="text" className='mm' placeholder='MM' />
            <input type="text" className='yy' placeholder='YY' />
        </div>
      </div>
      <div className="sec-detail">
        <input type="text" className='phone' placeholder='Phone Number'/>
        <input type="text" className='email' placeholder='Email' />
      </div>
      <div className="form-floating address">
  <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
  <label htmlFor="floatingTextarea">Address</label>
</div>
<div className="form-floating address">
  <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
  <label htmlFor="floatingTextarea">Notes</label>
</div>
      <div className="buttons">
        <button id='new'>New</button>
        <button id='bill'>Proceed to bill</button>
        <button id='bill'>Save & Proceed to bill</button>

        

      </div>
      </form>
      </div>
}
    </div>
  )
}

export default Register
