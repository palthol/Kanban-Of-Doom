import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';

const Navbar = () => {
  const [loginCheck, setLoginCheck] = useState(false);

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    } else {
      setLoginCheck(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div className='nav'>
      <div className='nav-title'>
        <Link to='/'>Krazy Kanban Board</Link>
      </div>
      <ul>
      {!loginCheck ? (
  <>
    <li className='nav-item'>
      <Link to='/register' className='nav-link'>Register</Link>
    </li>
    <li className='nav-item'>
      <button type='button'>
        <Link to='/login'>Login</Link>
      </button>
    </li>
  </>
) : (
  <li className='nav-item'>
    <button type='button' onClick={() => {
      auth.logout();
    }}>Logout</button>
  </li>
)}
      </ul>
    </div>
  );
};

export default Navbar;