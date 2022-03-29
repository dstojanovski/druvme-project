import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    console.log('test');
    try {
      const res = await axios({
        method: 'POST',
        url: '/api/v1/users/login',
        data: {
          email,
          password
        }
      });
      console.log(res.data.status);
      if (res.data.status === 'success') {
        console.log("CHECK1");
        // showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
        // showAlert('success', 'Logged in successfully!');
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    console.log(err);
    }
  };


  export const logout = async () => {
  try {
      const res = await axios ({
          method: 'GET',
          url: '/api/v1/users/logout',
      });
      if (res.data.status === 'success') {
         location.assign('/');
          showAlert('success', 'You are loggot!');
    }
  }catch(err) {
      showAlert('error', 'Error logging out! Try again');

  }
  }