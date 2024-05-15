const router = require('express').Router();
const Joi = require('joi');
const Product= require('../models/product');


router.post("/create",async(req, res)=>{
    try {
        const ProductSchema = Joi.object({
            name : Joi.string().min(3).max(30).required(),
            image : Joi.string().allow(""),
            price : Joi.number().required(),
            discount : Joi.number().required(),
            discription : Joi.string().required(),
            quantity : Joi.number().required(),
            
        });
        var a=req.body.name; 

        let validData = await ProductSchema.validateAsync(req.body);
        let product = await Product.create(validData);
        return res.status(200).send({
            status : true,
            message : "product details",
            data : product
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
});
router.get('/productdetails', async(req,res)=>{
    try {
      let user = await Product.find({is_deleted:false});
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

  router.put('/update/:name', async(req,res) => {
    try {
      let name = req.params.name;
      const ProductSchema = Joi.object({
          name : Joi.string().min(3).max(30).required(),
          image : Joi.string().allow(""),
          price : Joi.number().required(),
          discount : Joi.number().required(),
          discription : Joi.string().required(),
          quantity : Joi.string().required(),
    });
    var a=req.body.name; 
    const slugify = a.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)+/g, '');

    var validData = await ProductSchema.validateAsync(req.body);
    validData.slug=slugify;
  
  
    await Product.findOneAndUpdate({ uuid : name }, validData, { new : true });
    const items = await Product.findOne({ uuid : name});
     return res.send(items);
   } catch (error) {
    return res.status(500).send(error.message);
   }
  });

  router.delete('/delete/:name', async(req, res) => {
    try {
      await Product.findOneAndUpdate({uuid:req.params.name},{is_deleted:true},{new : true} );
      const anvesh = await Product.findOne({uuid:req.params.name});
      return res.send(anvesh);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  });

module.exports=router
