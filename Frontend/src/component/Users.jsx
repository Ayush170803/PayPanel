import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Users = () => {
      const navigate = useNavigate();
      const [filter,setFilter] = useState("");
      const [error,setError] = useState("");
      const [users,setUsers] = useState([]);
    
     const getAllUsers = async (filtervalue)=>
     {
        try
        {
            const res = await axios.get(`http://localhost:3000/api/v1/user/find?filter=${encodeURIComponent(filtervalue)}`,{ withCredentials: true });
            setUsers(res.data.user || []);
        }
        catch(er)
        {
            setError("Can't ablt to get the users");
        }
     }
    useEffect(() => {
    const delayDebounce = setTimeout(() =>
      {
      getAllUsers(filter);
      }, 300);

return() => clearTimeout(delayDebounce);
}, [filter]);

  if(!users) return;

  return (
   <div style={{ padding: '2rem' }}>
      <input
        id="searchuser"
        className="inputauth"
        placeholder="Search user..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="user-container">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div className="user-card" key={index}>
              <img
                src={user.photoUrl || '/default-avatar.png'}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">{user.firstName} {user.lastName}</p>
                <p className="user-email">{user.emailId}</p>
              </div>
              <button className="send-btn" onClick={(e)=>{
                navigate("/send?id="+user._id+"&name="+user.firstName)
              }}>Send</button>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Users
