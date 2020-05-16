import React from "react";

const Navigation = ({onRouteChange}) => {
    return (
        <nav className = 'tr fs link dim black underline pa3 pointer'>
            <p onClick = {() => onRouteChange('signin')}>Sign Out</p>
        </nav>
    )
}

export default Navigation;