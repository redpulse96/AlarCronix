const bcrypt = require('bcrypt');
const DEFAULT_SALT = 10;

async function generateSalt() {
  try {
    const salt = await bcrypt.genSalt(DEFAULT_SALT);
    return salt;
  } catch (error) {
    console.log('---generateHash.ERROR_CAUGHT---');
    console.error(error);
    throw error;
  }
}

async function generateHash(password, salt) {
  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.log('---generateHash.ERROR_CAUGHT---');
    console.error(error);
    throw error;
  }
}

async function validatePassword(inputPassword, encryptedPassword) {
  try {
    //Match password
    const isMatched = await bcrypt.compare(inputPassword, encryptedPassword);
    return isMatched;
  } catch (error) {
    console.log('---ERROR_CAUGHT---');
    console.error(error);
    throw error;
  }
}

module.exports = {
  generateHash,
  generateSalt,
  validatePassword,
};
