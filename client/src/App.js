import {React} from "react";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
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
        </Routes>
      {/* </GlobalStoreContextProvider> */}
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;