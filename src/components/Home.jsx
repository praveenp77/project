import React, { useEffect, useRef, useState } from "react";
import { ToastContainer ,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import DataGrid from "./DataGrid";
// const {axios} = require('axios')

//Initial Employee Object
let INITIAL_EMPLOYEE = {
    empName: "",
    deptId: "",
    empDOB: "",
    empEmail: "",
    empAddress: "",
  }

//pagination Array
let buttonList = [1,2]
// let API_URL = "http://localhost:8380";
let API_URL = "https://employee-management-qx4c.onrender.com"


export default function Home() {
  let [nameError,setNameError] = useState("");
  let [deptError,setDeptError] = useState("");
  let [dobError,setDobError] = useState("");
  let [emailError,setEmailError] = useState("");
  let [dept1Error, setDept1Error] = useState(""); 

 
  let [data, setData] = useState([]);
  let [deptData, setDeptData] = useState([{}]);
  let [empVisible, setEmpVisible] = useState(false);
  let [deptVisible, setDeptVisible] = useState(false);
  let [editId, setEditId] = useState(0);
  let [deptName, setDeptName] = useState();
  let [rowColor, setRowColor] = useState(0);
  let [page,setPage] = useState(1);
  let deptShow = "";
  let ref = useRef(null);
  let ref2 = useRef(null);
  let [empObj, setEmpObj] = useState(INITIAL_EMPLOYEE);
  let [checkEditButton, setCheckEditButton] = useState(false);
  let [filteredValue, setFilteredValue] = useState([]);
  let [count, setCount] = useState(200);
  let [disableDynamicallyAdd, setDisableDynamicaalyAdd] = useState(false)

  //validation
  let validate = () => {
    let {empDOB,empEmail,empName,deptId} = empObj;
    let flag = true;
    if(! deptId) {
      flag = false;
      setDeptError("please select deparment")
    } else setDeptError("")

    if(! empDOB) {
      flag = false;
      setDobError("please enter date of birth");
    } else setDobError("");

    if(! empEmail) {
      flag = false;
      setEmailError("please enter email");
    } else setEmailError("")

    if(! empName ) {
      flag = false;
      setNameError("please enter name");
    } else setNameError("");

    return flag;
  }

  let validateDept = () => { 
    let flag = true;
    if ( ! deptName) {
      flag = false;
      setDept1Error("please enter name")
    } else setDept1Error("");

    return flag;

  }

  //get emp data
  const getEmployeeData = (url) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        setData(data);
        setFilteredValue(data.reverse());
      });
  };


  //getDept
  const getDept = () => { 
    fetch(`${API_URL}/department`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log(data);
      setDeptData(data);
    });
  } 

  useEffect(() => {
    console.log(`${API_URL}/employee?page=${page}`);
    getEmployeeData(`${API_URL}/employee?page=${page}`);
  },[page])
  
  useEffect(() => {
  
    getDept()
  }, []);

  //AddButtonHandler
  const addHandler = () => {
    setEmpObj(INITIAL_EMPLOYEE)
    setDisableDynamicaalyAdd(false)
    if (deptVisible === false) {
      setEmpVisible(true);
    }
    setCheckEditButton(false);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  //CancelButtonHandler
  const cancelHandler = () => {
    setEmpVisible(false);
    setRowColor(0)
  };


  //AddDepartmentHandler
  const adddeptHandler = () => {
    
    if (empVisible === false) {
      setDeptVisible(true);
    }
    setTimeout(() => {
      ref2.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  //CancelDepartmentHandler
  const canceldeptHandler = () => {
    setDeptVisible(false);
    
  };


  //Delete Handler
  const deleteHandler = (value) => {
    // window.location.reload();
    fetch(`${API_URL}/employee/${value}`, { method: "DELETE" }).then(() => {
      console.log("Delete succesful");
      toast("Deleted succesful", {
        theme:"light"
      })
      getEmployeeData(`${API_URL}/employee?page=${page}`);
    });
    
  };


  //RowHighlightHandler
 const  highlightRow=(id)=>{
    setRowColor(id)
 }


 //EditAddressHandler
  const editAddressHandler = (id) => {
    setDisableDynamicaalyAdd(true)
    let singleData = data.filter((e) => e._id === id);
    setEditId(id);
    setEmpObj(singleData[0]);
    setEmpVisible(true);
    setCheckEditButton(true);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  //addemp and editAddress
  const empAddHandler = (e) => {
    e.preventDefault();
   if (! validate()) return ;
    let { empAddress } = empObj;
    if (checkEditButton === true) {
      e.preventDefault();
      setRowColor(0)
      console.log(editId);
      fetch(`${API_URL}/employee`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empid: editId,
          empAddress: empAddress,
        }),
      }).then((res) => {
        toast("Edited successfully",  {
          theme:"light"
        })
        getEmployeeData(`${API_URL}/employee?page=${page}`);
        setEmpObj(INITIAL_EMPLOYEE);
      });

    } else {
      let empDetails = empObj;
      fetch(`${API_URL}/employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empDetails),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error("not stored in database");
          }
        })
        .then((emp) => {
            toast("Added successfully", {
              theme:"light"
            })
            getEmployeeData(`${API_URL}/employee?page=${page}`);
            setEmpObj(INITIAL_EMPLOYEE);
            setFilteredValue([...data, emp])
            // console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setEmpVisible(false);
  };


  //departmentAddHandler
  const deptAddHandler = (e) => {  
    e.preventDefault()
    if (! validateDept()) return;
    // console.log("hii");
    setDeptVisible(false)
    let deptDetails = {
      deptName: deptName,
    };
    fetch(`${API_URL}/department`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deptDetails),
    }).then(res => {
      toast("Department added successfully", { 
        theme:"light"
      });
      getDept()
    });
   
  };


  //DisplayingDepartmentNameHandler
  const showDept = (id) => {
    for (let index = 0; index < deptData.length; index++) {
      if (deptData[index]._id === id) {
        deptShow = deptData[index].deptName;
      }
    }
    return deptShow
  };



  //SearchingHandler
  const searchHandler = (e) => {
    const results = data.filter((da) => da.empName.toLowerCase().startsWith(e.target.value.toLowerCase()))
    // console.log(results);
    setFilteredValue(results)
  }

  //TextareaCountHandler
  const countingChar = () => { 
    setCount((prevValue) =>{ 
      return prevValue - 1
    })
  }


  return (
    <>
    <ToastContainer>
      theme = "light"
    </ToastContainer>
      <nav className="navbar d-flex justify-content-center bg-dark text-light p-3">
        <div>
          <h3>Employee Management</h3>
        </div>
      </nav>
      <div className="mt-5 ms-5" style={{marginleft:"10px"}}>
       <div className="ms-5">
         <div className="ms-3">
            <span className="p-2">
              <button className="btn btn-primary" onClick={addHandler}>
                + Add Employee
              </button>
            </span>
            <span>
              <button className="btn btn-primary" onClick={adddeptHandler}>
                + Add Department
              </button>
            </span>
         </div>
       </div>
        <div className="mt-5 d-flex flex-row-reverse">
          <div className="col-md-4">
            <input
              type="text"
              placeholder="Search by employeename"
              id="searchId"
              className="form-control"
              onChange={searchHandler}
              style={{width:"315px"}}
            />
          </div>
        </div>
      </div>

      <div className="container">
      <table className="table table-hover mt-5">
        <thead>
          <tr className="bg-dark text-light">
            <th scope="col">Employee Name</th>
            <th scope="col">Dept Name</th>
            <th scope="col">Email Id</th>
            <th scope="col">DOB</th>
            <th scope="col">Address</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredValue &&
            filteredValue.map((e) => {
              return (
                <tr key={e._id} 
                className={ rowColor === e._id ? "yellow" : "" }
                >
                  <td>{e.empName}</td>
                  <td>{showDept(e.deptId)}</td>
                  <td>{e.empEmail}</td>
                  <td>{e.empDOB}</td>
                  <td>{e.empAddress}</td>
                  <td>
                    <span className="p-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          editAddressHandler(e._id);
                          
                          (e._id)
                        }}
                      >
                        Edit
                      </button>
                    </span>
                    <span>
                      <input
                        className="btn btn-danger"
                        type="submit"
                        value={"Delete"}
                        onClick={() => {
                          deleteHandler(e._id);
                        }}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      </div>
      <div className="d-flex justify-content-center align-items-center">
  <ul className="pagination gap-2" style={{position:"fixed",bottom:"0px"}}>
    
    {
     buttonList.map((num, index)=>{
       return (
         <li 
         className={page === num ? "page-item active" : "page-item"} 
         key={index}
         >
           <a className="page-link" href="#" onClick={() => {
           setPage(num);
         }}>{num}</a>
         </li>
       )
     })
    }
    </ul>
  </div>
      {empVisible && (
        <div className="d-flex ms-0 mt-3 justify-content-center">
          <div className="card" style={{ width: "700px" }} ref={ref}>
            <div className="card-header text-center bg-dark text-light p-3">
              <h4> Employee Data Registration</h4>
            </div>
            <div className="card-body bg-light">
              <form
                action="POST"
                onSubmit={(e) => {
                  empAddHandler(e);
                }}
              >
                <table className="table" >
                 <tr className="m-3">
                    <td>
                      <label htmlFor="empName">Employee Name <span style={{color:"red"}}>*</span> : </label>
                      &nbsp;&nbsp;
                    </td>
                    <td>
                      <input
                      {...(disableDynamicallyAdd ? {disabled : 'disabled'} : {})}
                        className="form-control"
                        type="text"
                        style={{ width: "300px" }}
                        placeholder="Employee Name"
                        onChange={({ target : { value }}) => {
                            // setEmpObj({ ...empObj, empName: value });
                              if (/\d/.test(value)) {
                                toast('enter only string')
                              }
                              else { 
                                setEmpObj({ ...empObj, empName: value });
                              }
                        }}
                        value={`${empObj.empName}`}
                      />
                      {nameError && <p className="text-danger">{nameError}</p>}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="deptName">Department Name <span style={{color:"red"}}>*</span> : </label>
                      &nbsp;&nbsp;
                    </td>
                    <td>
                      <select
                       {...(disableDynamicallyAdd ? {disabled : 'disabled'} : {})}
                      className="form-select col-3"
                        onChange={(e) => {
                          setEmpObj({ ...empObj, deptId: e.target.value });
                          // console.log(e.target.value);
                        }}
                        value={`${empObj.deptId }`}
                      >
                        <option>Select department</option>
                        {deptData.map((d) => {
                          return (
                            <option value={`${d._id}`} key={d._id}>
                              {d.deptName}
                            </option>
                          );
                        })}
                      </select>
                      {deptError && <p className="text-danger">{deptError}</p>}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="empEmail">Email <span style={{color:"red"}}>*</span> : </label>&nbsp;&nbsp;
                    </td>
                    <td>
                      <input
                       {...(disableDynamicallyAdd ? {disabled : 'disabled'} : {})}
                        type="email"
                        className="form-control"
                        style={{ width: "300px" }}
                        placeholder="Email"
                        onChange={(e) => {
                          setEmpObj({ ...empObj, empEmail: e.target.value });
                        }}
                        value={`${empObj.empEmail}`}
                      />
                      {emailError && <p className="text-danger">{emailError}</p>}

                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="empDOB">D.O.B <span style={{color:"red"}}>*</span> : </label>&nbsp;&nbsp;
                    </td>
                    <td>
                      <input
                      {...(disableDynamicallyAdd ? {disabled : 'disabled'} : {})}
                      max={`${new Date().getFullYear()}-0${(new Date().getMonth()+1)}-0${new Date().getDate()}`}
                    
                      className="form-control"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                        type="date"
                        style={{ width: "300px" }}
                        onChange={(e) => {
                          if (e.target.value !== undefined) {
                            setEmpObj({ ...empObj, empDOB: e.target.value });
                          }
                        }}
                        value={`${empObj.empDOB}`}
                      />
                      {dobError && <p className="text-danger">{dobError}</p>}

                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="empAddress">Address : </label>&nbsp;&nbsp;
                    </td>
                    <td>
                      <div className="mt-1 d-flex justify-content-end">{count}/200</div>
                      <textarea
                      className="form-control"
                        name=""
                        id=""
                        cols="38"
                        rows="3"
                        placeholder="Address"
                        onChange={(e) => {
                          setEmpObj({
                            ...empObj,
                            empAddress: e.target.value,
                          });
                          countingChar(e.target.value.length)
                        }}
                        value={`${empObj.empAddress}`}
                        maxLength="200"
                      />

                    </td>
                  </tr>
                </table>
                <tr className="d-flex justify-content-center">
                  <span className="m-3 p-3">
                    <input
                      className="btn btn-success"
                      value={"Save"}
                      type="submit"
                    />
                  </span>
                  <span className="m-3 p-3">
                    <button 
                    className="btn btn-danger" 
                    onClick={cancelHandler}
                    type="reset"
                    >
                      Cancel
                    </button>
                  </span>
                </tr>
              </form>
            </div>
          </div>
        </div>
      )}
      {deptVisible && (
        <div className="ms-3 d-flex justify-content-center">
          <div className="card mt-5 " style={{ width: "700px" }} ref={ref2}>
            <div className="card-header text-center bg-dark text-light">
              <h4> Department Registration</h4>
            </div>
            <div className="card-body bg-light">
              <form action="" onSubmit={deptAddHandler}>
                <div className="row">
                    <div className="col-4 text-center">
                        <label htmlFor="" className="form-label">DepartName: </label>
                    </div>
                    <div className="col">
                    <input
                  type="text"
                  placeholder="department Name"
                  style={{ width: "300px" }}
                  onChange={(e) => {
                    setDeptName(e.target.value);
                  }}
                  className="bg-light form-control"
                />
                 {dept1Error && <p className="text-danger">{dept1Error}</p>}
                    </div>
                </div>
                
                <div className="mt-5 text-center d-flex justify-content-center">
                  <span className="m-3">
                    <input
                      type="submit"
                      className="btn btn-success"
                      value="Save"
                    />
                  </span>
                  <span className="m-3">
                    <button
                      className="btn btn-danger"
                      onClick={canceldeptHandler}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
