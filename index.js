const express = require('express');
const dataService = require('./services/data.service');
const session = require('express-session');
const cors=require('cors');

const app = express();

app.use(cors({
    // origin:'http://localhost:4200',
    origin:'http://localhost:3000', // react port 3000
    credentials:true
}))

app.use(session({
    secret:'randomsecurestring',
    resave:false,  // to save only if modified
    saveUninitialized: false  
}));

app.use(express.json());

// Application wide Middle ware

const logMiddleware= (req, res, next)=>{
    console.log(req.body),
    next();
};
app.use(logMiddleware);

// Route wise Middleware

const authMiddleware = (req, res, next) => {
    if (!req.session.currentUser){
        return res.json({
            status:false,
            statusCode: 401,
            message:'Please Login'
        });
    }
    else{
        next();
    }
}

app.get('/', (req,res)=> {
    res.send("Hello World!!")
})

app.post('/', (req,res)=> {
    res.send("Post method!!");
})

app.post('/register', (req,res)=> {
    // const result = dataService.register(req.body.name, req.body.acno, req.body.acpin, req.body.pwd);
    dataService.register(req.body.name, req.body.acno, req.body.acpin, req.body.pwd)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    // res.send(result.message);
    // convert the response into a json format
    // res.json(result);
    // with status code

})

app.post('/login', (req,res)=> {
    dataService.login(req, req.body.acno, req.body.pwd)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
    // res.send(result.message);
    // res.json(result);
    // with status code
})


app.post('/deposit', authMiddleware, (req,res)=> {
    dataService.deposit(req, req.body.dpacno, req.body.dppin, req.body.dpamt1)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.post('/withdraw', authMiddleware, (req,res)=> {
    dataService.withdraw(req, req.body.wacno, req.body.wpin, req.body.wamt1)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})

app.get('/transactions', authMiddleware, (req,res)=> {
    dataService.getTransactions(req)
    .then(result=>{
        res.status(result.statusCode).json(result);
    });
});

app.delete('/transactions/:id', authMiddleware, (req,res)=> {
    dataService.delTransactions(req, req.params.id)
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
});

app.put('/', (req,res)=> {
    res.send("Put method!!")
})

app.patch('/', (req,res)=> {
    res.send("Patch method!!")
})

app.delete('/', (req,res)=> {
    res.send("Delete Method!!")
})


app.listen(3001, ()=> {
    console.log("Server started at port 3001")
})
