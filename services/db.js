const mongoose= require('mongoose')

mongoose.connect('mongodb://localhost:27017/bank_server',{
    useNewUrlParser:true
})

const User=mongoose.model('User',
{
    name :String,
    acno : Number,
    pin: Number, 
    password:String, 
    balance:Number, 
    transactions:[{
        amount:Number,
        txnType:String,
        balance:Number
    }]
});

module.exports={
    User
}