import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
    try {
      if (type === 'data'){
        var url = '/api/v1/users/update-me';   
      }
      else if (type === 'password'){
        var url = '/api/v1/users/update-password';
      }

        const res = await axios({
          method: 'PATCH',
          url: url,
          data: data,
        });
        if (res.data.status === 'success') {
          showAlert('success', `${type.toUpperCase()} has been updated!`);
        //   window.setTimeout(() => {
        //     location.reload(true);
        //   }, 1500);
          // showAlert('success', 'Logged in successfully!');
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        console.log(err);
      }
    };