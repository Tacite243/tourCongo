// src/lib/utils/auth.utils.ts
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import ms, { StringValue } from 'ms';
// Les types devraient maintenant être correctement importés et définis
import { JwtPayload, TokenSignPayload } from '@/lib/types';

const JWT_SECRET_ENV = process.env.JWT_SECRET;
const JWT_EXPIRES_IN_STRING = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET_ENV) {
  throw new Error('JWT_SECRET is not defined in environment variables. Please check your .env file.');
}
const JWT_SECRET_UINT8ARRAY = new TextEncoder().encode(JWT_SECRET_ENV);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = async (payloadToSign: TokenSignPayload): Promise<string> => {
  const expiresInMs = ms(JWT_EXPIRES_IN_STRING as StringValue);
  if (typeof expiresInMs === 'undefined') {
    console.warn(`Invalid JWT_EXPIRES_IN format: "${JWT_EXPIRES_IN_STRING}". Defaulting to 1 day.`);
    // Vous pourriez choisir de lever une erreur ou d'utiliser une valeur par défaut plus explicitement
    throw new Error("Invalid JWT_EXPIRES_IN format.");
  }

  try {
    // Le payload que vous passez à SignJWT est celui qui sera encodé.
    // Il n'est pas nécessaire de le caster en jose.JWTPayload ici si TokenSignPayload
    // contient les claims que vous voulez. jose s'attend à un objet simple.
    return await new jose.SignJWT({ ...payloadToSign }) // Passer directement votre payload
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      // setExpirationTime attend une chaîne de temps (comme "2h") ou un nombre de secondes (depuis l'époque)
      .setExpirationTime(JWT_EXPIRES_IN_STRING) // Ou calculez les secondes si vous préférez
      .sign(JWT_SECRET_UINT8ARRAY);
  } catch (error) {
    console.error("Error signing JWT with jose:", error);
    throw new Error("Failed to sign JWT token.");
  }
};

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  if (!token) return null;
  try {
    if (!JWT_SECRET_UINT8ARRAY) {
        console.error('JWT_SECRET is not available for token verification.');
        return null;
    }
    // jwtVerify retourne un objet avec une propriété 'payload' de type JWTPayload (de jose)
    const { payload: verifiedPayload } = await jose.jwtVerify(token, JWT_SECRET_UINT8ARRAY, {
      algorithms: ['HS256'],
    });

    // Puisque notre JwtPayload étend JoseJWTPayload ET TokenSignPayload,
    // nous pouvons maintenant caster verifiedPayload (qui est JoseJWTPayload) en JwtPayload.
    // TypeScript comprendra que les champs de TokenSignPayload (id, email, role)
    // sont attendus en plus des champs standards.
    // C'est à vous de vous assurer que generateToken les a bien inclus.
    return verifiedPayload as JwtPayload;

  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
        console.warn('Token expired (jose):', error.message);
    } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' || error.code === 'ERR_JWS_INVALID') {
        console.error('Invalid token signature or format (jose):', error.message);
    } else {
        // Pour d'autres erreurs de jose.jwtVerify, comme JWTClaimValidationFailed si vous utilisez des claims spécifiques
        console.error('Token verification error (jose):', error.name, error.message, error.code);
    }
    return null;
  }
};