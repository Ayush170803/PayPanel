import React, { useState } from 'react';
import EditProfileCard from './EditProfilecard';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import {toast,Toaster} from 'react-hot-toast';

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [password,setPassword] = useState();
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);

  const [error,setError] = useState("");
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try
    {
      const res = await axios.patch("http://localhost:3000/api/v1/user/update", { firstName, lastName, password, photoUrl,}, { withCredentials: true });
      dispatch(addUser(res?.data?.data));
      toast('Profile updated successfully!',
        {
          icon: '👏',
          style: {
            borderRadius: '15px',
            background: '#0B0B0E',
            color: 'whitesmoke',
          },
        }
      );
    } 
    catch(er)
    {
      toast('cannot update the profile!',
        {
          icon: '❌',
          style: {
            borderRadius: '15px',
            background: '#0B0B0E',
            color: 'whitesmoke',
          },
        }
      );
      if(er.response && er.response.data && er.response.data.message)
      {
        setError(er?.response?.data);
      }
      else
      {
        setError("Not Able to update");
      }
      console.log(er);
    }
  };

  return (
    <div id='editprofilepage'>
       <Toaster position="top-center" reverseOrder={false} />
      <div className="edit-profile-container">
        <div className="edit-profile-form">
          <form id='editProfileForm' onSubmit={(e) => e.preventDefault()}>
            <h1>Edit Profile</h1>
            <input type='text' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} className='inputauth'/>
            <input type='text' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} className='inputauth'/>
            <input type='text' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} className='inputauth'/>
            <input type='text' placeholder='Photo URL' value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className='inputauth'/>
            <p>{error}</p>
            <button id='editProfileButton' onClick={saveProfile}>Update Profile</button>
          </form>
        </div>
        <div className="edit-profile-card-container">
          <EditProfileCard user={{ firstName, lastName, photoUrl }} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
