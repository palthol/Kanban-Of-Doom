import { JwtPayload, jwtDecode } from 'jwt-decode';

interface AuthToken extends JwtPayload {
  username: string;
  id: number;
  exp: number;
}

class AuthService {
  getProfile() {
    // Return the decoded token
    const token = this.getToken();
    return token ? jwtDecode<AuthToken>(token) : null;
  }

  loggedIn() {
    // Check if user is logged in by verifying token exists and is not expired
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<AuthToken>(token);
      // Check if expiration time is past current time
      return decoded.exp * 1000 < Date.now();
    } catch (err) {
      return true;
    }
  }

  getToken(): string {
    // Return the token from localStorage
    return localStorage.getItem('id_token') ?? '';
  }

  login(idToken: string) {
    // Save token to localStorage
    localStorage.setItem('id_token', idToken);
    
    // Redirect to home page
    window.location.assign('/');
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('id_token');
    
    // Redirect to login page
    window.location.assign('/login');
  }
}

export default new AuthService();