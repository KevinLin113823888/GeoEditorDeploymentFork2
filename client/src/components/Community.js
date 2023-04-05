import {React, useState} from "react";
import { Link } from 'react-router-dom';

function Community() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        fetch("http://localhost:9000/" + 'community/getCommunity', {
            method: "GET",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username);
            if (data.ownedMapCards === undefined) {
                setMapCards([]);
            }
        })
        .catch(err => console.log(err));
    }, []);

    return (
        <div className="Community">
            <h1>Community</h1>
        </div>
    );
}

export default ForgotUsername;