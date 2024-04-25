import { Link,useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import './BusOperatorNavbar.css';
import busbookingImage from "./busbooking.png"

function BusOperatorNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token')); // Initialize login state based on token presence
    const navigate = useNavigate();

    const handleLogout = () => {
        
        sessionStorage.removeItem('token');
        setIsLoggedIn(false); 
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
        <img src={busbookingImage} alt="Logo" width="50" height="50" className="d-inline-block align-text-middle"/>
        FastXBooking
      </a>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">Add Bus</a>
        </li>
        <li className="nav-item">
            <button className="nav-link active logout-btn" onClick={handleLogout}>Logout</button>
                        
            </li>
      </ul>
    </div>
  </div>
</nav>
    );
}

export default BusOperatorNavbar;