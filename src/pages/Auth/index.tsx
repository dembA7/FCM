import Button from '@mui/joy/Button';
import { signInWithPopup } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import googleImage from '../../assets/images/google-logo.webp';
import loginImage from '../../assets/images/login_image.png';
import { auth, provider } from '../../config/firebase.config';
import { RoutesPath } from '../../utils/constants';
import { requestPermission } from '../../config/firebase-messaging-sw';

const Auth: React.FC = () => {

  requestPermission();

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      sessionStorage.setItem('idToken', idToken);

      // TODO: Had trouble using the useHttp hook

      const response = await fetch('http://localhost:4000/api/v1/employee/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          imageUrl: result.user.photoURL,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      navigate(RoutesPath.HOME);
    } catch (error) {
      console.error('Firebase Sign-in error:', error);
      throw error;
    }
  };

  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${loginImage})` }}>
      <div className='flex justify-end pr-16 pt-10'>
        <Button
          onClick={handleGoogleSignIn}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '9999px',
            ':hover': {
              backgroundColor: '#f0f0f0',
            },
            paddingX: '40px',
            paddingY: '16px',
          }}
          startDecorator={<img src={googleImage} alt='Google' style={{ width: 24, height: 24 }} />}
          size='lg'
        >
          Sign in to LinkBridge with Google
        </Button>
      </div>
    </div>
  );
};

export default Auth;
