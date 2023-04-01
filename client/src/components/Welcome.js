import {React, useState} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Welcome() {
    return (
        <div className="Welcome">
            <h1>Welcome to GeoEditor</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </nav>
        </div>
    );
}

export default Welcome;