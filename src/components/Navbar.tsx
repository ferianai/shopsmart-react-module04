import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('user_email'); // Get the user name from localStorage
  const name = localStorage.getItem('user_name'); // Get the user name from localStorage
    
  const handleLogout = () => {
    // Clear the local storage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');  
    localStorage.removeItem('user_name'); // Clear user name as well
    
    // Redirect to the login page after logging out
    navigate('/login'); 
  }

  return (
    <nav className="flex p-4 bg-blue-500 text-white">
        <ul className='flex space-x-4'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
        </ul>
        <ul className='flex space-x-4 ml-auto'>
            <li>{email ? (
               <button onClick={handleLogout}>Logout</button>
              ) : (
              <Link to="/login">Login</Link>
              )}</li>
            <li><Link to="/register">Register</Link></li>
            <li><span className='font-bold'> {name}</span></li>
        </ul>
    </nav>
  )
}

export default Navbar
