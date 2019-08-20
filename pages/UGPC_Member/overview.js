import React from 'react';
import {signout} from "../../auth";
const Overview = () => {
    return (
        <div>
            <button onClick={()=>signout()}>SignOut</button>
        </div>
    );
};

export default Overview;