import { UserLogin } from "../interfaces/UserLogin";

// Add interface for registration
export interface UserRegistration {
  username: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const login = async (userInfo: UserLogin) => {
  try {
    console.log('Attempting login to:', `${API_URL}/auth/login`);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Improved register function with better error handling
const register = async (userInfo: UserRegistration) => {
  try {
    console.log('Attempting registration at:', `${API_URL}/auth/register`);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
      // Remove credentials if causing issues
      // credentials: 'include',
    });

    console.log('Registration response status:', response.status);
    
    // Get response body regardless of status code
    const data = await response.json().catch(() => ({}));
    console.log('Registration response data:', data);

    // Handle different HTTP error statuses
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.message || 'Username already exists or invalid data');
      } else if (response.status === 500) {
        throw new Error(data.message || 'Server error during registration');
      } else {
        throw new Error(data.message || `Registration failed with status: ${response.status}`);
      }
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export { login, register };