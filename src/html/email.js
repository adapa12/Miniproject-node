var nodemailer = require('nodemailer');
const otp = require('../models/otp');

var transporter = nodemailer.createTransport({
  service: 'outlook',
  secure:false,
  auth: {
    user: 'adapaanvesh.a@gmail.com',
    pass: 'Anvesh@1999'
  }
});

		
	module.exports = email = async(email,ot) =>{
    try {
      //  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  
      var mailOptions = {
        from: 'adapaanvesh.a@gmail.com',
        to: email,
        subject: 'Sending Email for Verification',
        html : `<p>Enter <b>${ot}</b> in your app and verify your email and complete the process</P>
                <p>OTP Expires in <b>10 Minutes</b></p> 
                <p>Please Verify whether You or not</p>`
	  }
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent');
		}
	});
	}
	catch{
		console.log(error)
	}
}


      
