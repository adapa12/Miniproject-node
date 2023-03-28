const router = require('express').Router();
const Joi = require('joi');
const Category= require('../models/category');


router.post("/create",async(req, res)=>{
    try {
        const CategorySchema = Joi.object({
            name : Joi.string().min(3).max(30).required(),
            image : Joi.string().allow("")
        });

       await CategorySchema.validateAsync(req.body);

        let category = await Category.create(req.body);
        return res.status(200).send({
            status : true,
            message : "Category Register Successfully",
            data : category
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
});


router.put('/update/:name', async(req,res) => {
    try {
      let name = req.params.name;
      const UserSchema = Joi.object({
          name : Joi.string().min(3).max(30).required(),
    });
  
    const validData = await UserSchema.validateAsync(req.body);
  
    await Category.findOneAndUpdate({ name }, validData, { new : true })
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
      let user = await Category.find({});
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.delete('/delete/:id', async(req, res) => {
    try {
      await Category.findByIdAndUpdate({_id:req.params.id,is_deleted:false},{is_deleted:true});
      const anvesh = await Category.findOne({_id:req.params.id});
      return res.send(anvesh);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

module.exports = router;