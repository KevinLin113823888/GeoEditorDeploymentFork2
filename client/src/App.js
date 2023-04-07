import './App.css';
import {React} from "react";
import { Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ForgotUsername from './components/ForgotUsername';
import Welcome from './components/Welcome';
import YourMap from './components/YourMap';
import ForgotPassword from "./components/ForgotPassword";
import Community from "./components/Community";
import { GlobalStoreContextProvider } from './store'
import MapViewerScreen from "./components/MapViewer/MapViewerScreen";
import AppBanner from "./components/AppBanner"
import MUIDeleteAccModal from './components/MUIDeleteAccModal'
import ExportModal from "./components/MapViewer/MapViewerModal/ExportModal";
import MapClassificationModal from "./components/MapViewer/MapViewerModal/MapClassificationModal";
import MapColorwheelModal from "./components/MapViewer/MapViewerModal/MapColorwheelModal";
import MapMergeChangeRegionNameModal from "./components/MapViewer/MapViewerModal/MapMergeChangeRegionNameModal";
// import { Button } from '@mui/material';

function App() {
  return (
    <div className="App">
      <GlobalStoreContextProvider> 
      <AppBanner/>
      <ExportModal/>
      <MapClassificationModal/>
      <MapColorwheelModal/>
      <MapMergeChangeRegionNameModal/>

      <MUIDeleteAccModal/>
        <Routes>
          
          <Route path='/' exact element={<Welcome/>} />
          <Route path="/register" exact element={<Register/>} />
          <Route path="/login" exact element={<Login/>} />
          <Route path="/forgotUsername" exact element={<ForgotUsername/>} />
          <Route path="/map" exact element={<YourMap/>} />
          {/*<Route path='/editor' exact element={<MapEditor/>} />*/}
          <Route path="/forgotPassword" exact element={<ForgotPassword/>} />
          <Route path="/editMap" exact element={<MapViewerScreen/>} />
          <Route path="/community" exact element={<Community/>} />
        </Routes>
      </GlobalStoreContextProvider>
    </div>
  );
}

export default App;