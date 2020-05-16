import React from "react";

const Navigation = ({onRouteChange, isSignedIn}) => {
        if (isSignedIn) {
            return(
                <nav className = 'tr fs link dim black underline pa3 pointer'>
                    <p onClick = {() => onRouteChange('signout')}>Sign Out</p>
                </nav>
            )
        }else{
            return(
                <nav className = 'tr fs link dim black underline pa3 pointer'>
                    <p onClick = {() => onRouteChange('signin')}>Sign In</p>
                    <p onClick = {() => onRouteChange('register')}>Register</p>
                </nav>
            )
        }
}

export default Navigation;