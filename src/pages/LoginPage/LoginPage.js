import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup, signInWithEmailAndPassword, signInWithCredential, facebookProvider, githubProvider, googleProvider, twitterProvider, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber } from '../../components/firebase'; // Adjust the import path as needed
import './LoginPage.css'; // Import the CSS file
import { useAuth } from '../../AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BASE_URL = "http://54.167.91.115";

// Disable app verification for testing purposes
auth.settings.appVerificationDisabledForTesting = true;

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const navigate = useNavigate();
  const {setAccessToken} = useAuth();

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      // alert('OTP sent to your phone');
      toast.success('OTP sent to your phone');
    } catch (error) {
      // console.error('Error during phone login:', error);
      // alert('Failed to send OTP. Please try again.');
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log(user)
      try {
        const response = await axios.post(`${BASE_URL}:4000/login`, {
            username: user.phoneNumber.replace("+84", "0"),
            authToken: user.accessToken,
            notificationToken: "fcm token",
            deviceId: "default"
        });
        
        setAccessToken(response.data.accessToken);
        
        toast.success('Login successful');

        navigate('/chat');

      } catch (error) {
        // console.error('Login failed:', error);
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      // console.error('Error during OTP verification:', error);
      toast.error('OTP verification failed. Please try again.');
    }
  };

  return (
    <>
    <div className="login-page">
      <h2>Login</h2>
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
        <button type="submit">Login with Phone</button>
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
      <div className="social-login">
        <p>Currently, only phone login is allowed.</p>
        <button className="facebook">Login with Facebook</button>
        <button className="github">Login with GitHub</button>
        <button className="google">Login with Google</button>
        <button className="twitter">Login with Twitter</button>
      </div>
    </div>
    <ToastContainer />
    </>
  );
}

export default LoginPage;