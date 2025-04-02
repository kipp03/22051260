import fetch from 'node-fetch';
import { 
  NumbersResponse, 
  AuthResponse, 
  Credentials, 
  CalculatorResponse 
} from '../types';

const TEST_SERVER_URL = 'http://20.244.56.144/evaluation-service';
const WINDOW_SIZE = 10;

let storedNumbers: number[] = [];

const credentials: Credentials = {
  email: "your-email@college.edu",
  name: "Your Name",
  rollNo: "your-roll-number", 
  accessCode: "your-access-code",
  clientID: "your-client-id",
  clientSecret: "your-client-secret"
};

let authToken = '';

export const authenticate = async (): Promise<string> => {
  try {
    const response = await fetch(`${TEST_SERVER_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json() as AuthResponse;
    authToken = data.access_token;
    return authToken;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

const getEndpointForNumberType = (numberid: string): string => {
  const endpoints: Record<string, string> = {
    'p': 'primes',
    'f': 'fibo',
    'e': 'even',
    'r': 'rand'
  };
  
  return `${TEST_SERVER_URL}/${endpoints[numberid]}`;
};

const fetchNumbers = async (numberid: string): Promise<number[]> => {
  if (!authToken) await authenticate();
  
  try {
    const url = getEndpointForNumberType(numberid);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 450); // 450ms to leave time for processing
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json() as NumbersResponse;
    return data.numbers || [];
  } catch (error) {
    console.error('Error fetching numbers:', error);
    throw error;
  }
};

export const processNumbers = async (numberid: string): Promise<CalculatorResponse> => {
  const windowPrevState = [...storedNumbers];
  
  const numbers = await fetchNumbers(numberid);
  
  numbers.forEach(num => {
    if (!storedNumbers.includes(num)) {
      
      if (storedNumbers.length >= WINDOW_SIZE) {
        storedNumbers.shift();
      }
      storedNumbers.push(num);
    }
  });
  
  
  const sum = storedNumbers.reduce((acc, num) => acc + num, 0);
  const avg = storedNumbers.length > 0 ? sum / storedNumbers.length : 0;
  
  return {
    windowPrevState,
    windowCurrState: [...storedNumbers],
    numbers,
    avg: avg.toFixed(2)
  };
};