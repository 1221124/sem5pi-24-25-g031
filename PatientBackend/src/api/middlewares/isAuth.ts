import { expressjwt as jwt } from 'express-jwt';
import jwtDecode, { Jwt, JwtHeader, JwtPayload } from 'jsonwebtoken'; // Usando o pacote jsonwebtoken para decodificar o token
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

// Configuração do JWKS (JSON Web Key Set)
const client = jwksClient({
  jwksUri: 'https://dev-sagir8s22k2ehmk0.us.auth0.com/.well-known/jwks.json', // Substitua com a URL do seu JWKS
});

// Função para recuperar a chave pública do JWKS
const getKey = async (header: any) => {
  try {
    const token = getTokenFromHeader(header); // Pegando o token do cabeçalho de autorização

    if (!token) {
      console.error('Token não fornecido'); // Log para depurar
      throw new Error('Token not provided');
    }

    const kid = getKidFromToken(token); // Pegando o kid do token

    if (!kid) {
      console.error('Kid não encontrado no token'); // Log para depurar
      throw new Error('Kid not found in token');
    }

    const keys = await client.getSigningKeys();
    console.log('Chaves obtidas do JWKS:', keys); // Log para depurar

    const signingKey = keys.find((k: any) => k.kid === kid);
    if (!signingKey) {
      console.error('Chave não encontrada para o kid:', kid); // Log para depurar
      throw new Error('Key not found');
    }
    
    return signingKey.getPublicKey();
  } catch (err) {
    console.error('Erro ao obter a chave pública:', err); // Log de erro
    throw new Error('Error getting public key');
  }
};

// Função para pegar o token do cabeçalho Authorization
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

  return token;
};

const getKidFromToken = (token: string) => {
  try {
    // Decodificar o token com complete: true para incluir tanto o header quanto o payload
    const decodedToken = jwtDecode.decode(token, { complete: true });

    console.log('Decoded JWT:', decodedToken);  // Log para verificar o cabeçalho e o payload

    // Verificar se o header contém o 'kid'
    if (decodedToken && decodedToken.header) {
      return decodedToken.header.kid;
    }

    console.error('Kid não encontrado no cabeçalho do token');
    return null;
  } catch (err) {
    console.error('Erro ao obter o kid do token', err);
    return null;
  }
};


// Função para extrair roles do payload do token
const getRolesFromToken = (token: string): string[] | null => {
  try {
    // Usando jsonwebtoken.decode() para decodificar o token e acessar o payload
    const decodedToken: any = jwtDecode.decode(token);

    if (decodedToken && decodedToken["https://api.sarmg031.com/roles"]) {
      return decodedToken["https://api.sarmg031.com/roles"];
    }

    return null;
  } catch (err) {
    console.error('Error getting roles from token', err);
    return null;
  }
};

// Middleware de autenticação e verificação de roles
const isAuth = (roles: string[]) => {
  return [
    // 1. Validação do token JWT
    jwt({
      getToken: getTokenFromHeader,
      secret: getKey, // Aqui, pegamos o token do cabeçalho de autorização
      algorithms: ['RS256'], // Algoritmo RS256 para validação do token
    }),

    // 2. Verificação de roles
    (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(' ')[1]; // Pegando o token do cabeçalho

      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
      }

      const rolesFromToken = getRolesFromToken(token); // Pegando os roles do payload do token

      if (!rolesFromToken || !rolesFromToken.some((role) => roles.includes(role))) {
        return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para esta ação.' });
      }

      next(); // Se o usuário tiver os roles necessários, continuar com a requisição
    },
  ];
};

export default isAuth;