import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Demo = () => {

  const[data,setData]=useState([])

  const Details=async()=>{
    const res= await axios.get('http://172.16.16.10:8082/api/EditInvoice?LabNo=1&YearId=2425&BranchId=2')
    setData(res.data)
    
  }
  useEffect(()=>{
    Details()
  })



  return (
    <div>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((dt,index)=>{
             return <tr key={index}>
                <td>{dt.id}</td>
                <td>{dt.title}</td>
                <td>{dt.body}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Demo
