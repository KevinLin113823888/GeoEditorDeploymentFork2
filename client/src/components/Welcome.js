import {React} from "react";
import { Link } from 'react-router-dom';

function Welcome() {
    return (
        <div className="Welcome">
            <h1>Welcome to GeoEditor</h1>
            <h1>Test things</h1>

            <nav>
                <Link data-cy="home-link" to="/">Home</Link>
                <Link data-cy="register-link" to="/register">Register</Link>
                <Link data-cy="login-link" to="/login">Login</Link>
            </nav>
        </div>
    );
}

export default Welcome;