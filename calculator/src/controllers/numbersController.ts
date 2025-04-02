import { Request, Response } from 'express';
import { processNumbers } from '../services/numbersService';

export const getNumbers = async (req: Request, res: Response): Promise<void> => {
  const { numberid } = req.params;
  
  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    res.status(400).json({ error: 'Invalid number ID. Use p (prime), f (fibonacci), e (even), or r (random)' });
    return;
  }
  
  try {
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 500);
    });
    
    const result = await Promise.race([
      processNumbers(numberid),
      timeoutPromise
    ]);
    
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Request timed out') {
      res.status(500).json({ error: 'Operation timed out' });
      return;
    }
    console.error('Error processing numbers:', error);
    res.status(500).json({ error: 'Error processing numbers' });
  }
};