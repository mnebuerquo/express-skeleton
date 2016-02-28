function notImplemented(req,res,next){
	// upload file to parse
	var err = {
		status: 501, 
		message: 'Not Implemented',
	};
	return next(err);
}

module.exports = notImplemented;
