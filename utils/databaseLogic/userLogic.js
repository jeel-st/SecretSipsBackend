//Imports
const bcrypt = require('bcrypt')

/**
 * Überprüft, ob eine E-Mail-Adresse gültig ist.
 * 
 * @param email: String -> Die zu überprüfende E-Mail-Adresse.
 * @returns Boolean -> True, wenn die E-Mail-Adresse gültig ist, andernfalls false.
 */

function isValidEmail(email) {

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email);
}

/**
 * Überprüft, ob ein Passwort den festgelegten Sicherheitsanforderungen entspricht.
 * 
 * @param password: String -> Das zu überprüfende Passwort.
 * @returns {boolean} True, wenn das Passwort den Anforderungen entspricht, andernfalls false.
 */

function isValidPassword(password) {

    var passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()+_\-=[\]{}|\\;:'",.<>?])[a-zA-Z\d!@#$%^&*()+_\-=[\]{}|\\;:'",.<>?]{8,20}$/;

    return passwordPattern.test(password);
}

/**
 * Verschlüsselt ein Passwort mit einem generierten Salt.
 * 
 * @param password: String -> Das zu verschlüsselnde Passwort.
 * @returns Promise<Array> -> Ein Array, das das verschlüsselte Passwort und das verwendete Salt enthält.
 */

async function encryptPassword(password) {
    let encryptedPassword = 'fail';
    let salt = 'fail';
    let saltRounds = 10;
    await bcrypt
        .genSalt(saltRounds)
        .then(generatedSalt => {
            salt = generatedSalt;
            return bcrypt.hash(password, generatedSalt)
        })
        .then(hash => {
            encryptedPassword = hash;
        })
        .catch(err => console.error(err.message))
    return [encryptedPassword, salt]
}

/**
 * Verschlüsselt ein Passwort mit einem angegebenen Salt.
 * 
 * @param salt: String -> Das zu verwendende Salt.
 * @param password: String -> Das zu verschlüsselnde Passwort.
 * @returns Promise<string> -> Das verschlüsselte Passwort.
 */

async function encryptPasswordWithSalt(salt, password){
    let encryptedPassword = 'fail'
    let saltRounds = 10;
    await bcrypt
        .hash(password, salt)
        .then(hash => {
            encryptedPassword = hash;
        })
        .catch(err => console.error(err.message))
    return encryptedPassword

}

module.exports = {
    isValidEmail, isValidPassword, encryptPassword, encryptPasswordWithSalt
}