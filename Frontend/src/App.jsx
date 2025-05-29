import Login from "./Component/Login";
import Send from "./Component/Send";
import Dashboard from "./Component/Dashboard";
import Body from "./Component/Body";

import { BrowserRouter, Routes , Route} from "react-router-dom";
import {Provider} from "react-redux";
import appStore from "./utils/appStore";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./component/Profile";
import ForgotPassword from "./component/ForgotPassword";

function App() {
  return (
    <div id="containerdiv">
      <Provider store={appStore}>
      <BrowserRouter basename="/">
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/' element={<Body/>}>
      <Route index element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
      <Route path="send" element={<ProtectedRoute> <Send /> </ProtectedRoute> }/>
      <Route path="profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute> }/>
        </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
