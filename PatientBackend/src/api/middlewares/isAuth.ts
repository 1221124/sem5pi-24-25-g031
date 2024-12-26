import jwtDecode, { Jwt, JwtHeader, JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';

dotenv.config();

const client = jwksClient({
  jwksUri: process.env.JWKS_URI!
});

const getKey = async (header: any) => {
  try {
    console.log('process.env.JWKS_URI:',process.env.JWKS_URI);
    const token = getTokenFromHeader(header);

    if (!token) {
      console.error('Token not provided');
      throw new Error('Token not provided');
    }

    const kid = getKidFromToken(token);

    if (!kid) {
      console.error('Kid not found in token');
      throw new Error('Kid not found in token');
    }

    console.log('Client:', client); 
    const keys = await client.getSigningKeys();
    console.log('Keys obtained from JWKS:', keys);

    const signingKey = keys.find((k: any) => k.kid === kid);
    if (!signingKey) {
      console.error('Key not found for kid:', kid);
      throw new Error('Key not found');
    }
    
    return signingKey.getPublicKey();
  } catch (err) {
    console.error('Error getting public key:', err);
    throw new Error('Error getting public key');
  }
};

const getTokenFromHeader = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return null;
  }

  console.log('Token:', token);
  return token;
};

const getKidFromToken = (token: string) => {
  try {

    if (!token) {
      console.error('Token not provided');
      return null;
    }

    const decodedToken = jwtDecode.decode(token, { complete: true });

    console.log('Decoded JWT:', decodedToken);

    if (decodedToken && decodedToken.header) {
      return decodedToken.header.kid;
    }

    console.error('Kid not found in token header');
    return null;
  } catch (err) {
    console.error('Error getting kid from token', err);
    return null;
  }
};

const getRolesFromToken = (token: string): string[] | null => {
  try {
    const decodedToken: any = jwtDecode.decode(token);

    const rolesKey = process.env.ROLES_KEY;

    if (decodedToken && decodedToken[rolesKey]) {
      return decodedToken[rolesKey];
    }

    return null;
  } catch (err) {
    console.error('Error getting roles from token', err);
    return null;
  }
};

const isAuth = (roles: string[]) => {
  return [
    expressjwt({
      getToken: getTokenFromHeader,
      secret: getKey,
      algorithms: ['RS256'],
    }),

    (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Token not provided.' });
      }

      const rolesFromToken = getRolesFromToken(token);

      if (!rolesFromToken || !rolesFromToken.some((role) => roles.includes(role))) {
        return res.status(403).json({ message: 'Access denied. You do not have permission for this action.' });
      }

      next();
    },
  ];
};

export default isAuth;