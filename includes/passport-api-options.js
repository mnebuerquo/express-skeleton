// api auth options
//
module.exports = { 
	failureFlash : false, 
	session: false,
	failWithError: true, // passport normally wants to send its own 401, but it's not json
};

