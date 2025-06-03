import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import ms, { StringValue } from 'ms'; // Assurez-vous d'importer StringValue
import { JwtPayload } from '@/lib/types';
import { Role } from '@prisma/client';

const JWT_SECRET_ENV = process.env.JWT_SECRET;
// Gardez JWT_EXPIRES_IN_STRING comme une chaîne pour la configuration via .env
const JWT_EXPIRES_IN_STRING = process.env.JWT_EXPIRES_IN || '1d';

if (!JWT_SECRET_ENV) {
  throw new Error('JWT_SECRET is not defined in environment variables. Please check your .env file.');
}
const JWT_SECRET: string = JWT_SECRET_ENV;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

interface TokenSignPayload {
  id: string;
  email: string;
  role: Role;
}

export const generateToken = (payload: TokenSignPayload): string => {
  // On dit à TypeScript de traiter JWT_EXPIRES_IN_STRING comme une StringValue.
  // ms() retournera des millisecondes si la chaîne est valide, sinon undefined.
  let expiresInMilliseconds: number | undefined = ms(JWT_EXPIRES_IN_STRING as StringValue);

  // Vérifier si la conversion a réussi
  if (typeof expiresInMilliseconds === 'undefined') {
    console.warn(
      `Invalid JWT_EXPIRES_IN format: "${JWT_EXPIRES_IN_STRING}". ` +
      `Defaulting to 1 day.`
    );
    // Utiliser une valeur par défaut sûre si la conversion de la variable d'environnement échoue
    expiresInMilliseconds = ms('1d' as StringValue); // '1d' est une StringValue valide

    // Sécurité supplémentaire : vérifier si même la valeur par défaut a échoué (ne devrait jamais arriver)
    if (typeof expiresInMilliseconds === 'undefined') {
      console.error("Critial error: Failed to parse default JWT expiration '1d'.");
      // À ce stade, vous pourriez lancer une erreur plus grave ou utiliser une valeur numérique fixe.
      // Pour la simplicité, nous allons lancer une erreur pour arrêter le processus.
      throw new Error("Failed to parse default JWT expiration '1d'. This should not happen.");
    }
  }

  // jwt.sign attend des secondes si 'expiresIn' est un nombre.
  const expiresInSeconds = Math.floor(expiresInMilliseconds / 1000);

  const options: SignOptions = {
    expiresIn: expiresInSeconds, // Maintenant, c'est un nombre (en secondes)
  };

  try {
    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    console.error("Error signing JWT:", error);
    throw new Error("Failed to sign JWT token.");
  }
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not available for token verification.');
      return null;
    }
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Token expired:', error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
    } else {
      console.error('Token verification error:', error);
    }
    return null;
  }
};
