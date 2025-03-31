import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (Auth.loggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Trim username to prevent whitespace issues
    const submissionData = {
      username: loginData.username.trim(),
      password: loginData.password // Don't modify password
    };
    
    console.log('Attempting login with:', { 
      username: submissionData.username, 
      passwordLength: submissionData.password.length 
    });
    
    try {
      const data = await login(submissionData);
      console.log('Login successful, token received');
      Auth.login(data.token);
      navigate('/'); // Redirect to home after login
    } catch (err) {
      console.error('Failed to login', err);
      setError('Login failed. Please check your credentials or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type='text'
            name='username'
            value={loginData.username || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type='password'
            name='password'
            value={loginData.password || ''}
            onChange={handleChange}
            required
            minLength={6} // Add minimum length validation matching registration
          />
          {loginData.password && loginData.password.length < 6 && (
            <small className="form-hint">Password must be at least 6 characters</small>
          )}
        </div>
        
        <button 
          type='submit' 
          disabled={loading || (loginData.password.length > 0 && loginData.password.length < 6)}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        
        <div className="register-prompt text-center mt-4">
          <p>Don't have an account? <Link to="/register">Register now</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;