import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = require('./router');

router(app);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
