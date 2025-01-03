import { app } from '../../src/app'; // your Express app
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { closeDB, connectDB } from '../setup';
import request from 'supertest';
import jwt from 'jsonwebtoken';

let accessToken;
describe('medical condition', () => {

    beforeAll(async () => {
        await connectDB();  // Setup in-memory DB
        accessToken = await generateAccessToken();
      });
    
    afterAll(async () => {
        await closeDB();  // Close DB after tests
      });

    it('should return all medical conditions', async () => {

      const response = await request(app)
        .get('/api/medical-condition') 
        .set('Authorization', `Bearer ${accessToken}`);
      
      console.log('Response Status:', response.status);
      console.log('Response Body:', response.body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
  });
});

export function generateAccessToken() {
  // Replace with actual user credentials or mock user for the test
  const user = { role: 'admin' }; 
  if(!process.env.JWT_SECRET) throw new Error('JWT_SECRET not found');
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(user, secret, { expiresIn: '1h' });
  return token;
}