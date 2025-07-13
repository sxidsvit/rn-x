const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Ваш JWT токен
const token = 'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yem45MzZ6WEVEU1pSQlphWkJVZGJXWW1pZTUiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3NTIzODQwMTEsImZ2YSI6WzAsLTFdLCJpYXQiOjE3NTIzODM5NTEsImlzcyI6Imh0dHBzOi8vd2hvbGUtaGVycmluZy05Ny5jbGVyay5hY2NvdW50cy5kZXYiLCJuYmYiOjE3NTIzODM5NDEsInNpZCI6InNlc3NfMnpvNEFreW5LUXZZV0xyUlJQRU9GOVJmeUh2Iiwic3ViIjoidXNlcl8yem80QW51VW05U1U0S3RSaEkwTUdVSXpxNmIiLCJ2IjoyfQ.i-JtzGtybTcH6p-QFc8eiZIgqspRfpnlVAFUv9MuLvbvqE1zY8DfRkoutcgzL__5GBDwWQnGbkySOGBVzwBN4YzXfwO9FbyL5O4_hrp0uMjapIEcVCtQnObikCRl1ckSk6vFlAJ5BJ1bQD5gwhXmzAHCN5tOzefauik_F5HNseaKi2nqwq_QuJZcySkFdRirME8dR-UKsHMG03q_Q5alBiR7ls4kLwt-ZNbGP3irwf2XZPE1mz1KEgpVnnvf0yXSww6p1B19YfnzSG5mVO-molg_79RT_IJupjjkuSnEXZZKrHx2mEhLkez0qsIifbzi0A-wfdfqKhPnQdc_d1RVoA';

// Настройка клиента для получения JWKS
const client = jwksClient({
  jwksUri: 'https://whole-herring-97.clerk.accounts.dev/.well-known/jwks.json'
});

// Функция для получения публичного ключа
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey(); // Возвращает ключ в формате PEM
    console.log('Публичный ключ в формате PEM:');
    console.log(signingKey);
    callback(null, signingKey);
  });
}

// Проверка токена
jwt.verify(token, getKey, {
  algorithms: ['RS256'],
  issuer: 'https://whole-herring-97.clerk.accounts.dev'
}, (err, decoded) => {
  if (err) {
    console.error('Ошибка проверки подписи:', err.message);
    return;
  }
  console.log('Подпись валидна. Данные:', decoded);
});