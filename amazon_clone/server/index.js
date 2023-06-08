//IMPORTS FROM PACKAGES
const express = require('express');
const mongoose = require('mongoose');

//IMPORTS FROM OTHER FILES
const authRouter = require('./routes/auth')

//INIT
const app = express();
const PORT = 3000;
const DB = "mongodb+srv://cipher:password22@cluster0.1okosds.mongodb.net/?retryWrites=true&w=majority";

//middleware
app.use(express.json());
app.use(authRouter);


//Connections
mongoose.connect(DB).then(() => {
  console.log('Connection Successful');
}).catch(e => {
  console.log(e);
});

app.listen(PORT, "192.168.1.102",  () => {
  console.log(`Connected at port ${PORT}`);
});


