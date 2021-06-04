import React, { useState, useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="navbar-brand">
        <img src="logo.png" height="50" alt="iHero" />
      </div>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        {isAuthenticated === true ? (
          <Fragment>
            <div className="navbar-nav">
              {' '}
              <NavLink className="nav-item nav-link" to='/dashboard'>Dashboard</NavLink>
              <NavLink className="nav-item nav-link" to='/heroes/'>Heroes</NavLink>
              <NavLink className="nav-item nav-link" to='/threats/'>Threats History</NavLink>
            </div>
            <div className="navbar-nav mr-auto">
              <NavLink className="nav-item nav-link" to='/logout'>Logout</NavLink>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {' '}
            <div className="navbar-nav">
              {' '}
              <NavLink className="nav-item nav-link" to='/login'>Login</NavLink>
              <NavLink className="nav-item nav-link" to='/signup'>Signup</NavLink>
            </div>
          </Fragment>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
