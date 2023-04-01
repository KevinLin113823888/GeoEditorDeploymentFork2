import {React} from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import { GlobalStoreContextProvider } from './store'
// import { Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      <h1>Welcome to GeoEditor</h1>
      <a href="/">Home</a>
      <a href="/register">Register</a>
      <a href="/login">Login</a>
      <BrowserRouter>
      <GlobalStoreContextProvider> 
        <Routes>
          <Route path="/register" exact element={<Register/>} />
          <Route path="/login" exact element={<Login/>} />
        </Routes>
      </GlobalStoreContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;