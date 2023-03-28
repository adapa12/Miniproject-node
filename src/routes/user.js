const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const client = require('../models/user');
const email = require('../html/email');
const otp = require('../models/otp');


router.post("/user", async(req, res)=>{
  console.log(req)
  try {
      const UserSchema = Joi.object({
          name : Joi.string().min(3).max(30).required(),
          email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
          mobile : Joi.string().required(),//pattern(new RegExp('^[6-9][0-9]{9}$')).required(),
          password : Joi.string(),//pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(),
          address : Joi.object({
            city : Joi.string(),
            state : Joi.string(),
            pincode : Joi.number(),
            line1 : Joi.string(),
            line2 : Joi.string(),
          })
      });

      let validData = await UserSchema.validateAsync(req.body);

      validData.password = await bcrypt.hash(req.body.password,10);
      validData.group = 'admin';

       const ot = `${Math.floor(1000 + Math.random() * 9000)}`;

      let user = await client.create(validData);

      let validateOtp = {
        email : validData.email,
        otp : ot,
      }

      await otp.create(validateOtp);
       email(validData.email,ot);

      return res.status(200).send({
          status : true,
          message : "user created Successfully",
           data : user
      })
  } catch (error) {
      return res.status(400).send(error.message);
  }
});

     router.get('/details',async(req,res)=>{
    const post = await client.find({})
    res.send(post)
  });
 
router.post("/verify", async(req, res)=>{
  try {
      const UserSchema = Joi.object({
          email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
          otp : Joi.string(),
          });
          let validData = await UserSchema.validateAsync(req.body);
  
      let data = await otp.findOne({email:req.body.email});
        console.log(data.otp);
    
    if (req.body.otp == data.otp){
       console.log(data.otp)
        res.send("You has been successfully registered");
    }
    else {
        res.send( 'otp is incorrect');
    }
} catch (error) {

  return res.status(400).send(error.message);
      
}
});

router.put('/update/:name', async(req,res) => {
  try {
    let name = req.params.name;
    const UserSchema = Joi.object({
        name : Joi.string().min(3).max(30).required(),
         email : Joi.string().email().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  });

  const validData = await UserSchema.validateAsync(req.body);

  await client.findOneAndUpdate({ name }, validData, { new : true })
  .then(data => {
    if(!data)
        res.status(404).send("Cannot Update with id");
    else
    res.status(200).send({
      message : "User Details Updated Successfully",
      data : data
      });
  })
  .catch(err => {
      res.status(500).send(err.message);
  });
  
  }
  catch(error) {
    return res.status(400).send(error.message);
}
});

router.get('/details', async(req,res)=>{
  try {
    let user = await client.find({});
    return res.status(200).send(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
// router.get('/lists',async(req,res)=>{
//   try {
//     // let users = await client.find({})
//     // let lists = users.find({Limit : 10})
//     var query = client.find().sort('items', 1).skip(2).limit(5)
//     return res.status(200).send(query);
    
//   } catch (error) {
//     return res.status(500).send(err.message)
    
//   }
// })
router.delete('/delete/:id', (req, res) => {
  client.findByIdAndDelete(req.params.id).then((data) => {
      if (!data) {
          return res.status(404).send();
      }
      res.send(data);
  }).catch((error) => {
      res.status(500).send(error);
  })
})
router.get('/lists',async (req,res)=>{
  try {
    const { page,limit,search,type }=req.query
    if(page == "" || page == undefined) page = 0;
    if(limit == ""|| limit == undefined)limit = 15;
    if(type == "" || type == undefined) type = "all";

    let skip = Number(limit) * Number(page);

    let match;

    if(type == "all"){
      match = {
          is_deleted : false,
          $or : [
              {"full_name" : {$regex : `${search}`, $options : 'si'}},
              {"email" : {$regex : `${search}`, $options : 'si'}},
              {"mobile" : {$regex : `${search}`, $options : 'si'}}
          ]
      }
  }
  else{
      match = {
          group : type,
          is_deleted : false,
          $or : [
              {"full_name" : {$regex : `${search}`, $options : 'si'}},
              {"email" : {$regex : `${search}`, $options : 'si'}},
              {"mobile" : {$regex : `${search}`, $options : 'si'}}
          ]
      }
  }
  const users = await client.aggregate([
    { 
      $match : match 
    },
    { 
      $sort : {createdAt : -1} 
    },
    { 
      $skip : skip 
    },
    { 
      $limit : Number(limit) 
    },
]);

const result = await client.aggregate([
    { 
      $match : match 
    }
]);

return res.status(200).send({
    status : true,
    message : "Data Fecth Successfully",
    count : result.length, 
    data : users
});
  } catch (error) {
    res.status(400).send(error.message)
    
  }
})
     module.exports = router;
