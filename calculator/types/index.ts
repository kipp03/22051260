// API response types
export interface NumbersResponse {
    numbers: number[];
  }
  
  export interface AuthResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
  }
  
  export interface Credentials {
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
    clientID: string;
    clientSecret: string;
  }
  
  // Response type for the calculator API
  export interface CalculatorResponse {
    windowPrevState: number[];
    windowCurrState: number[];
    numbers: number[];
    avg: string;
  }