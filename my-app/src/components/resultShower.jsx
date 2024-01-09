import React from "react";
import './resultShower.css';


function ResultShower(props) {

    return(
        // you wrap these div from another div and apply useState
         <div className="passwordChecker">       
        <p className="error">{props.message}</p>
       </div>
    )
}

export default ResultShower