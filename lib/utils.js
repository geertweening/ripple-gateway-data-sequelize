var crypto = require("crypto");

function verifyPassword (password, salt, passwordHash) {
  return (saltPassword(password, salt) == passwordHash);
}

function saltPassword (password, salt) {
	return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function generateSalt () {
	var sha = crypto.createHash('sha256');
	return sha.update(crypto.randomBytes(128)).digest('hex');
} 

function errorResponse (res) {		
	return function (err) {
		console.log('error', err);
		res.send({ error: err }, 400);
		return;
  };
}

module.exports = {
  verifyPassword: verifyPassword,
  saltPassword: saltPassword,
  generateSalt: generateSalt,
  errorResponse: errorResponse
}
