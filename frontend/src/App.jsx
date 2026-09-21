import { useEffect, useMemo, useState } from "react";
import api from "./services/api";
import React from "react";

const empty = { companyName:"", jobRole:"", location:"", status:"Applied", appliedDate:"", notes:"" };

function App() {
  const [jobs,setJobs]=useState([]), [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null), [search,setSearch]=useState(""), [filter,setFilter]=useState("All");
  const [loading,setLoading]=useState(true), [error,setError]=useState("");

  const load=async()=>{try{setLoading(true); const r=await api.get("/jobs");setJobs(r.data)}catch(e){setError("Backend/MongoDB connection check karo.")}finally{setLoading(false)}};
  useEffect(()=>{load()},[]);

  const stats = ["Applied","Interview","Selected","Rejected"].map(s=>[s,jobs.filter(j=>j.status===s).length]);
  const visible=useMemo(()=>jobs.filter(j=>(filter==="All"||j.status===filter)&&
    (`${j.companyName} ${j.jobRole}`).toLowerCase().includes(search.toLowerCase())),[jobs,search,filter]);

  const submit=async(e)=>{e.preventDefault(); if(!form.companyName||!form.jobRole)return;
    try{if(editing) await api.put(`/jobs/${editing}`,form); else await api.post("/jobs",form);
      setForm(empty);setEditing(null);load()}catch(e){setError("Unable to save application.")}};
  const edit=j=>{setForm(j);setEditing(j._id);window.scrollTo({top:0,behavior:"smooth"})};
  const remove=async(id)=>{if(confirm("Delete this application?")){await api.delete(`/jobs/${id}`);load()}};

  return <div className="app">
    <header><div><h1>JobTrack</h1><p>Job Application Tracker</p></div><span className="badge">MERN Stack</span></header>
    {error&&<div className="error">{error}</div>}
    <section className="stats"><div className="card total"><b>Total</b><strong>{jobs.length}</strong></div>{stats.map(([s,n])=><div className="card" key={s}><b>{s}</b><strong>{n}</strong></div>)}</section>
    <section className="panel"><h2>{editing?"Edit Application":"Add Application"}</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Company name *" value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})}/>
        <input placeholder="Job role *" value={form.jobRole} onChange={e=>setForm({...form,jobRole:e.target.value})}/>
        <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{["Applied","Interview","Selected","Rejected"].map(x=><option key={x}>{x}</option>)}</select>
        <input type="date" value={form.appliedDate} onChange={e=>setForm({...form,appliedDate:e.target.value})}/>
        <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
        <button>{editing?"Update":"Add Application"}</button>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(empty)}}>Cancel</button>}
      </form>
    </section>
    <section className="panel"><div className="toolbar"><h2>Applications</h2><input placeholder="Search company or role..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{["Applied","Interview","Selected","Rejected"].map(x=><option key={x}>{x}</option>)}</select></div>
      {loading?<p>Loading...</p>:visible.length===0?<p className="empty">No applications found.</p>:
      <div className="tableWrap"><table><thead><tr><th>Company</th><th>Role</th><th>Location</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody>
      {visible.map(j=><tr key={j._id}><td><b>{j.companyName}</b><small>{j.notes}</small></td><td>{j.jobRole}</td><td>{j.location||"-"}</td><td><span className={`status ${j.status.toLowerCase()}`}>{j.status}</span></td><td>{j.appliedDate||"-"}</td><td><button className="edit" onClick={()=>edit(j)}>Edit</button><button className="delete" onClick={()=>remove(j._id)}>Delete</button></td></tr>)}</tbody></table></div>}
    </section>
    <footer>JobTrack • Built with React, Node.js, Express & MongoDB</footer>
  </div>
}
export default App;
