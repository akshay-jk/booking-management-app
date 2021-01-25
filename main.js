import express from "express";
import BodyParser from "body-parser";
import cors from "cors";
import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();

const app = express();
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

import router from "./components/routes.js";

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(cors());

mongoose.connection.on('connected', () => console.log('MongoDB connected Succesfully'));
mongoose.connection.on('error', (err) => console.log('MongoDB connection Failed'));

app.use('/api', router);

app.listen(process.env.PORT || 3000, (err) => {
    if (err) console.log(`Server On ${process.env.PORT || 3000} crashed`);
    else console.log(`Server is live on ${process.env.PORT || 3000}`)
});