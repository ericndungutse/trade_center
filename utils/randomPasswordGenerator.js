import crypto from 'crypto';

function randomPasswordGenerator(length = 8) {
  // Use crypto.randomBytes() for cryptographically strong randomness:
  const buffer = crypto.randomBytes(Math.ceil(length / 2));
  const characters = buffer.toString('hex').slice(0, length);

  return characters;
}

export default randomPasswordGenerator;
