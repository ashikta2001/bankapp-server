const express = require('express');
const dataService = require('./services/data.service');
const app = express();

app.use(express.json())

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

app.post('/deposit', (req,res)=> {
    const result = dataService.deposit(req.body.dpacno, req.body.dppin, req.body.dpamt1);
    res.status(result.statusCode).json(result);
})

app.post('/withdraw', (req,res)=> {
    const result = dataService.withdraw(req.body.wacno, req.body.wpin, req.body.wamt1);
    res.status(result.statusCode).json(result);
})

app.get('/transactions', (req,res)=> {
    const result = dataService.getTransactions();
    res.status(200).json(result);
})

app.post('/login', (req,res)=> {
    const result = dataService.login(req.body.acno, req.body.pwd);
    // res.send(result.message);
    // res.json(result);
    // with status code
    res.status(result.statusCode).json(result);
})

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
