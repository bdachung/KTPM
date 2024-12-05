import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup, signInWithEmailAndPassword, signInWithCredential, facebookProvider, githubProvider, googleProvider, twitterProvider, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber } from '../../components/firebase'; // Adjust the import path as needed
import './LoginPage.css'; // Import the CSS file

auth.settings.appVerificationDisabledForTesting = true;

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful:', user);

      alert('Login successful');

      const username = user.email; // Use email as username or any other user property

      onLogin(username);
      console.log(username);

      navigate('/chat', { state: { username } });
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleProviderLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Login successful:', user);

      alert('Login successful');

      const username = user.email || user.displayName; // Use email or display name as username

      onLogin(username);
      console.log(username);

      navigate('/chat', { state: { username } });
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      console.log(confirmationResult);
      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error during phone login:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      console.log(credential);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log('Login successful:', user);

      alert('Login successful');

      const username = user.phoneNumber; // Use phone number as username or any other user property

      onLogin(username);
      console.log(username);

      navigate('/chat', { state: { username } });
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleEmailLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit">Login with Email</button>
      </form>
      <div className="social-login">
        <button onClick={() => handleProviderLogin(facebookProvider)} className="facebook">Login with Facebook</button>
        <button onClick={() => handleProviderLogin(githubProvider)} className="github">Login with GitHub</button>
        <button onClick={() => handleProviderLogin(googleProvider)} className="google">Login with Google</button>
        <button onClick={() => handleProviderLogin(twitterProvider)} className="twitter">Login with Twitter</button>
      </div>
      <form onSubmit={handlePhoneLogin} className="phone-login-form">
        <h2>Login with Phone</h2>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          required
        />
        <div id="recaptcha-container"></div>
        <button type="submit">Send OTP</button>
      </form>
      {verificationId && (
        <form onSubmit={handleOtpVerification} className="otp-verification-form">
          <h2>Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;