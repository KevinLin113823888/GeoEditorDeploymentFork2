import {React} from "react";
import { Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotUsername from './components/ForgotUsername';
import { GlobalStoreContextProvider } from './store'
// import { Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      <h1>Welcome to GeoEditor</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
      {/* <BrowserRouter> */}
      {/* <GlobalStoreContextProvider>  */}
        <Routes>
          <Route path="/register" exact element={<Register/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/ForgotUsername" exact element={<ForgotUsername/>} />
        </Routes>
      {/* </GlobalStoreContextProvider> */}
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;