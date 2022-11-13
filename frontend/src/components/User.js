import React, { useEffect, useState } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // import Css
import axios from 'axios'

import './user.css';
export default function User() {

  const [ArrayOfName, setArrayOfName] = useState([]);
  const [ArrayOfWork, setArrayOfWork] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    task: []
  });
  const [realList, setRealList] = useState([])
  const [assignTask, setAssignTask] = useState([]);
  const [removeAssignTask, setRemoveAssignTask] = useState([])
  const [edit, setEdit] = useState(false);
  const [enableDelete, setEnableDelete] = useState(false);
  const[enableAdd,setEnableAdd]=useState(false)
  useEffect(() => {
    getData()
    getData1()
  }, [])
  const getData= async()=>{
      let res = await axios.get('http://localhost:3100/get-data');
      if(res){
          setArrayOfName(res.data);
      }

    }
    const getData1= async()=>{
      let res = await axios.get('http://localhost:3100/get-datawork');
      if(res){
          setArrayOfWork(res.data);
          setRealList(res.data);
    
      }
    }

  const alldata = async (name) => {
    let res = await axios.get(`http://localhost:3100/user-data/${name}`);
    if (res.data.length !== 0) {
      let array1 = realList;
      setUserData({...userData,name:res?.data[0].name,task:res?.data[0]?.task});
      let array2 = res?.data[0]?.task ?? [];
      array1 = array1?.filter(e => !array2?.some(e1 => e1?.work1 === e?.work1))
      console.log(array1)
      setArrayOfWork(array1);
      setRemoveAssignTask(array1)
      setEdit(true);
    } else {
      setEdit(false)
      setUserData({...userData,name:name})
    }
  }

  const handleDD = (e) => {
    alldata(e.target.value)
    setUserData({ ...userData, name: e.target.value })
  }
  const handleButton = (value) => {
    //Add
    if (value === 0) {
      if (assignTask.length && enableAdd) {
        setUserData({ ...userData, task: assignTask });
        setArrayOfWork(removeAssignTask);
        setEnableAdd(false)
      }
    }
    // some condition while running 
    if(!userData.name.length  ){
      alert("Select your Name ")
      return;
    }
    //Add All
    if (value === 1) {
      if(ArrayOfWork.length>0){
        confirmAlert({
          message: 'Are you sure Add all works',
          buttons: [
                       {
                          label: 'Yes',
                          onClick:() => { 
                            setUserData({ ...userData, task: [...realList] });
                            setArrayOfWork([]);
                            setEnableAdd(false);
                            setEnableDelete(false)
                            setRemoveAssignTask([])
                            setAssignTask([])
                                        }      
                       },
                               {  label: 'No', }
                   ]
                    }   );
      } else{
        alert("all value already added");
      }  
    }
    //Remove
    if (value === 2) {
      if (enableDelete) {
        setUserData({ ...userData, task: assignTask });
        setArrayOfWork(removeAssignTask);
        setEnableDelete(false)
      }
    }
    //Remove All
    if (value === 3) {
     if (userData.task.length>0){
      confirmAlert({
        message: 'Are you sure to remove all works',
        buttons: [
                     {
                        label: 'Yes',
                        onClick:() => { 
                          setUserData({ ...userData, task: [] });
                          setArrayOfWork([...realList]);
                          setEnableAdd(false);
                          setEnableDelete(false)
                                      }      
                     },
                             {  label: 'No', }
                 ]
                  }   ); 
     }else{
       alert("All value already removed");
     }
    }
  }
  const handleAdd = (item, index) => {
    let assign;
    if(assignTask.length!==0){
      assign = [...assignTask]
    }else if(userData.task.length!==0){
      assign=[...userData.task]
    }else{
      assign = [...assignTask]
    }
    console.log(assign)
    let remove = removeAssignTask.length !== 0 ? [...removeAssignTask] : [...realList];
    let findData = assign.find(v => v.work1 === item.work1);
    let findIndex = remove.findIndex(v => v.work1 === item.work1);
    if (!findData) {
      assign.push(item)
    }
    if (findIndex >= 0) {
      remove.splice(findIndex, 1);
    }
    setAssignTask(assign)
    setRemoveAssignTask(remove);
    setEnableDelete(false)
    setEnableAdd(true)
  }
  const handleRemove = (item, index) => {
    let assign;
    if(assignTask.length!==0){
      assign = [...assignTask]
    }else if(userData.task.length!==0){
      assign=[...userData.task]
    }else{
      assign = [...assignTask]
    }
    let remove;
    if (removeAssignTask.length !== 0) {
      remove = [...removeAssignTask]
    } else if (ArrayOfWork.length === 0) {
      remove = [...removeAssignTask]
    } else {
      remove = [...realList]
    }
    let findData = remove.find(v => v.work1 === item.work1);
    let findIndex = assign.findIndex(v => v.work1 === item.work1);
    if (!findData) {
      remove.push(item)
    }
    if (findIndex >= 0) {
      assign.splice(findIndex, 1);
    }
    // console.log(remove)
    setAssignTask(assign);
    setRemoveAssignTask(remove)
    setEnableDelete(true)
    setEnableAdd(false)
  }
  const saveInToDatabase = async () => {
    
      confirmAlert({
        message: 'Are you sure to remove all works',
        buttons: [
                     {
                        label: 'Yes',
                        onClick:() => { 
                          if (!edit) {
                          let res =  axios.post('http://localhost:3100/post-data', userData);
                        } else {
                          let res =  axios.put('http://localhost:3100/update-data', userData);
                         setEdit(false);
                         }
                                      }      
                     },
                             {  label: 'No', }
                 ]
                  }   ); 
    
    
    
    
    
    
       
    // alert("Edit Successfull once again click on for save!")
  }
  
  return <>
    <div>
      <div className='mainDiv'><h3> User Report</h3></div><br />
      <div className='col'>
        <select onChange={handleDD} name="name" value={userData.name} >
          <option > Select Name</option>
          { ArrayOfName && ArrayOfName.map((userName, index) => {
            return (
              <>
                <option value={userName.name} key={index}>{userName.name}</option>
              </>
            )
          })
          }
        </select>
      </div>
      <div className="container">
        <div className="row">
          {/*///////////---------------------------- Unassign department---------------///////////////////// */}
          <div className="col-sm">

            <div className='unassign'>

              {
                ArrayOfWork.map((item, index) => {
                  return (
                    <ul className='list-group'>

                      <li className='list-group-item'
                        id="worklist"
                        key={index}
                        style={{ backgroundColor: assignTask.includes(item) ? "grey":"", caretColor: "rgba(0,0,0,0)" }}
                        onClick={() => handleAdd(item, index)}>{item.work1}
                      </li>
                    </ul>
                  )
                })
              }
            </div>
          </div>
          {/* //////////////-------------------------button department ----------------////////////////////*/}
          <div className="col-sm">
            <div className="btn fixed" >
              <div>
                <button type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleButton(0)} >  Single Add </button>
              </div>
              <div>
                <button type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => handleButton(1)} >All Add </button>
              </div>
              <div>
                <button type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleButton(2)}> Remove </button>
              </div>
              <div>
                <button type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleButton(3)} > All remove </button>
              </div>
            </div>
          </div>
          {/* /////////////////////////---------------ASSIGN DEPARTMENT ----------------////////////////////// */}
          <div className="col-sm">
            <div className='assign' >
              {userData && userData.task.map((item, index) => {
                return (
                  <ul className='list-group'>
                    <li className='list-group-item'
                      style={{backgroundColor: removeAssignTask.includes(item) ? "grey":"", caretColor: "rgba(0,0,0,0)" }}
                      key={index}
                      onClick={() => handleRemove(item, index)} > {item.work1}</li>
                  </ul>)
              })
              }
            </div></div>
        </div>
      </div>
      <div className='save'>
        <button type="button"
          className="btn btn-success "
          onClick={saveInToDatabase}>{edit ? 'Edit' : 'Save'}
        </button>
      </div>
    </div>
  </>
}