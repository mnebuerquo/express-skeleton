module.exports = function(currentVersion){

	return function(req, res, next){
		if(currentVersion){
			res.header('X-API-Current-Version', currentVersion);
		}
		next();
	}
}
