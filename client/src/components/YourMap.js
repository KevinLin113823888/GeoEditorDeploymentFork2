import {React, useState, useEffect} from "react";

function YourMap(){
    const [username, setUsername] = useState("");

    useEffect(() => {
        fetch('http://localhost:9000/' + 'user/loggedIn', {
            method: "GET",
            credentials: 'include',
            headers: {
            "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
        .then((data) => setUsername(data.username))
        .catch(err => console.log(err));
    });

    return(
        <div className="YourMap">
            <h1>{username} Maps</h1>
        </div>
    )
}

export default YourMap;