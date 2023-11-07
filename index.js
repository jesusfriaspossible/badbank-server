require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
var dal = require('./dal.js');
const Users = require('./models/Users');

const app = express(); 
const PORT = process.env.PORT || 8000;

//Add middleware
connectDB();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Get All Users
app.get("/api/users", async (req, res) => {
    try {
        const data = await Users.find({});
        if(!data) {
            throw new Error('An error ocurred white fetching users.')
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error ocurred white fetching users...'})
    }
});

//Get User by Id
app.get("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        const data = await Users.findById(userId);
        if(!data) {
            throw new Error('An error ocurred white fetching users.')
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error ocurred white fetching users...'})
    }
});


//Create an User
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password, balance } = req.body;


        const data = await Users.create({name, email, password, balance });
        if(!data) {
            throw new Error('An error ocurred white creating an user.')
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error ocurred white creating an user...'})
    }
});

//Update an User
app.put("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const {name,  email, password, balance} = req.body;
        const data = await Users.findByIdAndUpdate(userId, {name, email, password, balance });
        if(!data) {
            throw new Error('An error ocurred white updating an user.')
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error ocurred white updating an user...'})
    }
});


//Delete an User
app.delete("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await Users.findByIdAndDelete(userId);
        if(!data) {
            throw new Error('An error ocurred white deleting an user.')
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'An error ocurred white deleting an user...'})
    }
});






app.get("/", (req, res) => {
    res.json("Hello mate! ");
});

app.get("*", (req, res) => {
    res.sendStatus("404");
});

// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }

        });
});


// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// all accounts
app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

app.listen(PORT, ()=> {
    console.log(`Server is runnig on Port: ${PORT}`);
});