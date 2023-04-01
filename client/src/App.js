import {React} from "react";
import { Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotUsername from './components/ForgotUsername';
import Welcome from './components/Welcome';
import { GlobalStoreContextProvider } from './store'
// import { Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      {/* <GlobalStoreContextProvider>  */}
        <Routes>
          <Route path='/' exact element={<Welcome/>} />
          <Route path="/register" exact element={<Register/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/ForgotUsername" exact element={<ForgotUsername/>} />
        </Routes>
      {/* </GlobalStoreContextProvider> */}
    </div>
  );
}

export default App;