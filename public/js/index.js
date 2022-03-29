// Add all features to all browsers
import '@babel/polyfill';
import { login, logout } from './login';
import { addTrip, searchTrip } from './addNewTrip';
import { updateSettings }  from './updateSettings';
import { getCities }  from './cities';


// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const addNewTrip = document.querySelector('.formNewTrip');
const userData = document.querySelector('.form-user-data');
const userPassword = document.querySelector('.form-user-password');
const selectFormStart = document.querySelector('.selectFormStarting');
const selectFormDestination = document.querySelector('.selectFormDestination');
const searchFormTrips = document.querySelector('.searchFormTrips');

if(loginForm) {
    document.querySelector('.form').addEventListener('submit', e => {
        // Preventing from reloading page
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log("CHECK");
        login(email, password);
});
}

if(logOutBtn) {
    logOutBtn.addEventListener('click', logout);
}

if(addNewTrip) {
    console.log('test');
    document.querySelector('.formNewTrip').addEventListener('submit', e =>{
        e.preventDefault();
        const startingPoint = document.getElementById('startingPoint').value;
        const destination = document.getElementById('destination').value;
        const price = document.getElementById('price').value;
        const passengers = document.getElementById('passengers').value;
        const startDate = document.getElementById('startDate').value;
        const startTime = document.getElementById('startTime').value;
        const description = document.getElementById('description').value;
        addTrip(startingPoint, destination, price, passengers, startDate, startTime, description);
    });
}

if (userData) {
    document.querySelector('.form-user-data').addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        // const file = document.getElementById('fileUpload').value;
        await updateSettings({name, email}, 'data');
        document.querySelector('#userNameValue').textContent = name;

    })
}

if (userPassword) {
    document.querySelector('.form-user-password').addEventListener('submit',  async e => {
        e.preventDefault();
        heading-secondary.ma-bt-md
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        document.querySelector('.heading-secondary.ma-bt-md').textContent = 'Updating...';
        const oldPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const newPasswordConfirm = document.getElementById('password-confirm').value;
        
        await updateSettings({oldPassword, newPassword, newPasswordConfirm}, 'password');

        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    })
}

if(selectFormStart){
    console.log('test');
    document.querySelector('#hierarchical-country').addEventListener('change', async e=>{
        e.preventDefault();
        const country = document.getElementById('hierarchical-country').value;
        document.getElementById('hierarchical-city').value = '';
        var select = document.getElementById('hierarchical-city');

        while (select.options.length > 0){
            select.remove(0);
        }

        document.getElementById('hierarchical-city').disabled = false;
        var city = await getCities(country);
        var opt = document.createElement('option');
        opt.value = 'empty';
        opt.innerHTML = 'Please select any city';
        select.appendChild(opt);

        city.forEach ((el, index) => {
            var opt = document.createElement('option');
            opt.id = el.id;
            opt.value = el.value;
            opt.innerHTML = el.text;
            select.appendChild(opt);
        });
            
    });
}

if(selectFormDestination){
    console.log('test');
    document.querySelector('#hierarchical-country-destination').addEventListener('change', async e=>{
        e.preventDefault();
        const country = document.getElementById('hierarchical-country-destination').value;
        document.getElementById('hierarchical-city-destination').value = '';
        var select = document.getElementById('hierarchical-city-destination');
        
        while (select.options.length > 0){
            select.remove(0);
        }

        document.getElementById('hierarchical-city-destination').disabled = false;
        var city = await getCities(country);
        var opt = document.createElement('option');
        opt.value = 'empty';
        opt.innerHTML = 'Please select any city';
        select.appendChild(opt);

        city.forEach ((el, index) => {
            var opt = document.createElement('option');
            opt.id = el.id;
            opt.value = el.value;
            opt.innerHTML = el.text;
            select.appendChild(opt);
        });
            
    });
}

if (searchFormTrips){
    document.querySelector('.searchFormTrips').addEventListener('submit',  async e => {
        e.preventDefault();
        const startingCountry = document.getElementById('hierarchical-country').value;
        const startingCity = document.getElementById('hierarchical-city').value;
        const DestinationCountry = document.getElementById('hierarchical-country-destination').value;
        const DestinationCity = document.getElementById('hierarchical-city-destination').value;
        console.log(startingCountry, startingCity, DestinationCountry, DestinationCity);
        await searchTrip(startingCountry, startingCity, DestinationCountry, DestinationCity);
    })
}