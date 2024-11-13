import cors from 'cors';
import corsOptions from './middlware/cors';
import cookieJwtAuth from './middlware/auth';
import express, { Request, Response } from 'express';
import { error } from 'console';

import database from './service/database';


const app = express();
app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/protected", cookieJwtAuth, (req: Request, res: Response) => {
  res.send("This is a protected route");
});



app.listen(3000, () => {
  console.log(database.getDatabaseName());
});