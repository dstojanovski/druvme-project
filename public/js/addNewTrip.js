import axios from 'axios';

export const addTrip = async (startingPoint, destination, price, passengers, startDate, startTime, description) => {

    console.log(startingPoint, destination, price, passengers, startDate, startTime, description);
    console.log('TEST');
    try {
        const res = await axios({
          method: 'POST',
          url: '/api/v1/trips',
          data: {
            startingPoint,
            destination,
            price,
            passengers,
            startDate,
            startTime,
            description,
          }
        });
        console.log('TEST1');
    
        if (res.data.status === 'success') {
          console.log(res.data.data.trip.id);
          // showAlert('success', 'Logged in successfully!');
          window.setTimeout(() => {
            location.assign(`/trip/${res.data.data.trip._id}`);
          }, 1500);
        }
      } catch (err) {
        // showAlert('error', err.response.data.message);
      console.log(err.message);
      }
    };


export const searchTrip = async (startingCountry, startingCity, DestinationCountry, DestinationCity) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/trip/',
      data: {
        startingPoint,
        destination,
        price,
        passengers,
        startDate,
        startTime,
        description,
      }
    });
    console.log('TEST1');

    if (res.data.status === 'success') {
      console.log(res.data.data.trip.id);
      // showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign(`/trip/${res.data.data.trip._id}`);
      }, 1500);
    }
  } catch (err) {
    // showAlert('error', err.response.data.message);
  console.log(err.message);
  }
};