import {React, useState, useEffect} from "react";

function YourMap(){
    const [username, setUsername] = useState("");
    const [mapCards, setMapCards] = useState([])

    useEffect(() => {
        fetch('http://localhost:9000/' + 'user/loggedIn', {
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
    });

    return(
        <div className="YourMap">
            <h1>{username} Maps</h1>
            {mapCards 
            ?
            <div>You currently have no maps</div>
            :
            <div>Here are your maps</div>
            }
        </div>
    )
}

export default YourMap;