import { useState, FormEvent, ChangeEvent } from "react";
import { register } from "../api/authAPI";
import { Link } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    // In your handleSubmit function:
try {
  // Only send username and password (not confirmPassword)
  const registrationData = { 
    username: userData.username, 
    password: userData.password 
  };
  
  console.log('Sending registration data:', { 
    username: registrationData.username, 
    passwordLength: registrationData.password.length 
  });
  
  const response = await register(registrationData);
  console.log('Registration successful:', response);
  
  setSuccess(true);
} catch (err: unknown) {
  console.error('Failed to register', err);
  let errorMessage = 'Registration failed. Please try again later.';
  
  if (err instanceof Error) {
    // More specific error handling
    errorMessage = err.message;
    
    // You could add more specific error messages here based on common scenarios
    if (err.message.includes('fetch')) {
      errorMessage = 'Cannot connect to the server. Please check your connection.';
    }
  }
  
  setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <div className="form">
          <h1>Registration Successful!</h1>
          <p>You can now <Link to="/login">login</Link> with your credentials.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="button">
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <div className="register-prompt">
          <p className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;