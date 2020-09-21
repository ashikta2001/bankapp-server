const express = require('express');
const dataService = require('./services/data.service');
const session = require('express-session');

const app = express();

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
        return res.status(401).json({
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
    const result = dataService.register(req.body.name, req.body.acno, req.body.acpin, req.body.pwd);
    // res.send(result.message);
    // convert the response into a json format
    // res.json(result);
    // with status code
    res.status(result.statusCode).json(result);
})

app.post('/login', (req,res)=> {
    const result = dataService.login(req, req.body.acno, req.body.pwd);
    // res.send(result.message);
    // res.json(result);
    // with status code
    res.status(result.statusCode).json(result);
})


app.post('/deposit', authMiddleware, (req,res)=> {
    const result = dataService.deposit(req.body.dpacno, req.body.dppin, req.body.dpamt1);
    res.status(result.statusCode).json(result);
})

app.post('/withdraw', authMiddleware, (req,res)=> {
    const result = dataService.withdraw(req.body.wacno, req.body.wpin, req.body.wamt1);
    res.status(result.statusCode).json(result);
})

app.get('/transactions', authMiddleware, (req,res)=> {
    const result = dataService.getTransactions(req);
    res.status(200).json(result);
});

app.delete('/transactions/:id', authMiddleware, (req,res)=> {
    const result=dataService.delTransactions(req, req.params.id)
    res.status(200).json(result);
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

const port=3001
app.listen(port, ()=> {
    console.log("Server started at port "+ port)
})
