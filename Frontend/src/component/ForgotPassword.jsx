import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile'

const ForgotPassword=()=>{
  const [step,setStep]=useState(1);
  const [emailId,setEmailId]=useState('');
  const [otp,setOtp]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [error,setError]=useState('');
  const [captchaToken,setCaptchaToken] = useState("");

  const navigate=useNavigate();

  const sendOtp = async () =>
 {
    try
    {
      await axios.post('http://localhost:3000/api/v1/user/send-otp',{emailId,captchaToken},{withCredentials:true});
      setStep(2);
      setError('');
    }
    catch(err)
    {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => 
  {
    try
    {
      await axios.post('http://localhost:3000/api/v1/user/verify-otp',{emailId,otp},{withCredentials:true});
      setStep(3);
      setError('');
    }
    catch(err)
    {
      setError(err?.response?.data?.message || 'OTP verification failed');
    }
  };

  const updatePassword = async () => 
  {
    try
    {
      const res=await axios.post('http://localhost:3000/api/v1/user/update-password',{emailId,newPassword},{withCredentials:true});
      if(res.data.message==='Invalid Password Format')
      {
        setError('Please enter a strong password (min 8 chars, uppercase, lowercase, number & symbol)');
      }
      else
      {
        alert('Password updated successfully!');
        navigate('/login');
      }
    } 
    catch(err)
    {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Can't update password");
    }
  };

  return (
    <div id="formdiv">
      <form id="form" onSubmit={(e) => e.preventDefault()}>
        <h1>Forgot Password</h1>
        {step === 1 && (
          <>
            <input type="email" placeholder="Enter your email" className="inputauth" value={emailId} onChange={(e)=>setEmailId(e.target.value)} required/>
            <button id="authbutton" onClick={sendOtp}>Send OTP</button>
            <div id='captcha'>
            <Turnstile onSuccess={(captchaToken)=>{setCaptchaToken(captchaToken)}} siteKey='0x4AAAAAABfMALJm-GisIUZg' />
            </div>
            <Link to='/login'><p id='Goto'>Go to Login Page</p></Link>
          </>
        )}

        {step===2 && (
          <>
            <input type="text" placeholder="Enter OTP" className="inputauth" value={otp} onChange={(e)=>setOtp(e.target.value)} required/>
            <button id="authbutton" onClick={verifyOtp}>Verify OTP</button>
                <Link to='/login'><p id='Goto'>Go to Login Page</p></Link>
          </>
        )}

        {step===3 && (
          <>
            <input type="password" placeholder="Enter new password" className="inputauth" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required/>
            <button id="authbutton" onClick={updatePassword}>Update Password</button>

            <Link to='/login'><p id='Goto'>Go to Login Page</p></Link>
          </>
        )}
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
