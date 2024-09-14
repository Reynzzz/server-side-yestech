if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const router = require('./routers');
const port = process.env.PORT || 3000;
const path = require('path');


// const corsOptions = {
//     origin: 'http://localhost:5173',
//     optionsSuccessStatus: 200 
// };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", router);
app.use('/assets', express.static('assets'));

app.listen(port, () => {
    console.log(`example listening on port ${port}`);
});
