const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Must be before const app to load that configuration to the application.
dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB,
    {
useNewUrlParser: true,
// useCreateIndex: true,
// useFindAndModify: false
}
)
.then(() => console.log('DB IS CONNECTED'));

var port = process.env.PORT;
app.listen(port, () =>{
    console.log('Listening on port ' + port + ' ...');
})