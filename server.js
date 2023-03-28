const express = require('express');
const mongoose = require('mongoose')
mongoose.set("strictQuery", false); 
const bodyParser=require('body-parser');
const post = require('../MINIPROJECT/src/routes/user');
const category = require('../miniproject/src/routes/category') 
const upload = require('../miniproject/src/routes/upload')
const product = require('../miniproject/src/routes/product') 
const slot = require('../miniproject/src/routes/Slot'); 


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({limit: '6mb'}));


app.use("/api",post);
app.use("/api/upload",upload);
 app.use("/category",category)
 app.use("/product",product)
 app.use("/slotbook",slot)

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});

// mongoose.connect('mongodb://127.0.0.1:27017', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//       console.log("Connected to the database");
//   })
//   .catch(err => {
//       console.log("Cannot connected to database",err);
//       process.exit();
//   });
  