const router = require('express').Router();
const Joi = require('joi');
const moment = require('moment');
// const slot= require('../models/otp');

router.post('/slot',async(req,res)=>{
    try {
     console.log("slotbooked")
        const slotSchema  = Joiobject({
            emp_uuid : Joi.string().required()
        });

        const validData = await slotSchema.validateAsync(req.body);
         var x = {
            nextslot:30,
            breakTime : [
                ['12:31','12:59']
            ],
            startTime : '09:00',
            endTime : '10:00',
         }
         var slotTime = startTime('HH:mm');
         var endTime = startTime('HH:mm');
         function isInBreak(slotTime, breakTimes) {
            return breakTimes.some((br) => {
              return slotTime >= moment(br[0], "HH:mm") && slotTime < moment(br[1], "HH:mm");
          });
        }
        let times = [];
        while (slotTime < endTime)
        {
          if (!isInBreak(slotTime, x.breakTime)) {
             times.push(slotTime.format());
          }
          slotTime = slotTime.add(x.nextslot, 'minutes');
        }
        
        for(let i=0;i<times.length-1;i++){
            let a = [
                {
                    emp_uuid : validData.emp_uuid,
                    date : times[i],
                    start_time : times[i],
                    end_time : times[i+1]
                }
            ];
            await slot.insertMany(a);
        }

        return res.status(200).send({
            status : true,
            message : "Today Slots Added"
        });


    } catch (error) {
        res.send(404).send(error.message)
        
    }
 
})
module.exports=router