import { useDispatch, useSelector } from 'react-redux';
import logotext from '../assets/logotext.png'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';
const Navbar = () => {
  
  const user = useSelector((store)=>store.user);
  const dispatch = useDispatch(); 

    const handlelogout = async () =>
    {
      try
      {
        await axios.post("http://localhost:3000/api/v1/user/signout", {}, { withCredentials: true });
        dispatch(removeUser());
         localStorage.removeItem("user");
        window.location.href = '/login';
      }
      catch(er)
      {
         console.log("Can't able to Logout "+er.message);
      }
    } 

  return (
    <div id="navcontainer">
      {user && <>
        <div id="left">
        <Link to="/"><img src={logotext} alt="Logo" height={50} width={200}/></Link>
        </div>
          <div id="nav-items">
            <Link to="/profile"><p>Profile</p></Link>
            <button onClick={handlelogout} id='signoutbtn'>Logout</button>
            <h4>Welcome, {user.firstName}</h4>
            <img src={user.photoUrl}/>
        </div>
        </>
      }
    </div>
  )
}

export default Navbar
