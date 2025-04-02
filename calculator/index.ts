import express, { Application } from 'express';
import { getNumbers } from './controllers/numbersController';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '9876', 10);

app.use(express.json());

app.get('/numbers/:numberid', getNumbers);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});