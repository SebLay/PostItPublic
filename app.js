const Router = require('./route');
const express = require('express');
const cors = require('cors');
const app= express();
const port = 3001;

app.use(cors({
    origin: "http://localhost:5000",
    optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(Router);

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
});