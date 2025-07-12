import Login from "./component/Login";
import Send from "./component/Send";
import Dashboard from "./component/Dashboard";
import Body from "./component/Body";

import { BrowserRouter, Routes , Route} from "react-router-dom";
import {Provider} from "react-redux";
import appStore from "./utils/appStore";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./component/Profile";
import ForgotPassword from "./component/ForgotPassword";
import Transactions from "./component/Transactions";
import GrafanaDashboard from "./component/GrafanaDashboard";

function App() {
  return (
    <div id="containerdiv">
      <Provider store={appStore}>
      <BrowserRouter basename="/">
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/' element={<Body/>}>
      <Route index element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="send" element={<ProtectedRoute> <Send /> </ProtectedRoute>}/>
      <Route path="profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute> }/>
      <Route path="transactions" element={<ProtectedRoute><Transactions/></ProtectedRoute>}/>
      <Route path="/metrics" element={<ProtectedRoute><GrafanaDashboard /></ProtectedRoute>}/>
        </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
