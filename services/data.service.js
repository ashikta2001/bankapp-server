const { User } = require('./db');
const db = require('./db')

let accountDetails={
    1001:{name:"user1", acno:1001, pin:1234, password:'userone', balance:3000, transactions:[]},
    1002:{name:"user2", acno:1002, pin:2345, password:'usertwo', balance:2500, transactions:[]},
    1003:{name:"user3", acno:1003, pin:3456, password:'userthree', balance:3500, transactions:[]},
    1004:{name:"user4", acno:1004, pin:4567, password:'userfour', balance:4000, transactions:[]},
    1005:{name:"user5", acno:1005, pin:5678, password:'userfive', balance:5000, transactions:[]},
  }

let currentUser;

  const register=(name, acno, acpin, pwd)=>{
    return db.User.findOne({
      acno
    })
    .then(user=>{
      if(user){
        return{
          status:false,
          statusCode: 422,
          message: 'Account already exists. Please login'
        }
      }
      const newUser = new db.User(
        {
          name, 
          acno, 
          pin:acpin, 
          password:pwd,
          balance:0,
          transactions:[]
        });
        newUser.save();
        return {
          status:true,
          statusCode: 200,
          message:'Account Created successfully, Please login'
        }
    })
 
  }

  const login = (req, acno1, pwd) => {
    var acno = parseInt(acno1)
    return db.User.findOne({
      acno:acno,
      password:pwd
    })
    .then (user=>{
      if(user){
        req.session.currentUser=acno;
        return {
          status:true,
          statusCode: 200,
          message:'Logged In successfully'
        }
      }
      return {
        status:false,
        statusCode: 422,
        message:'Invalid Credentials'
      }
    })
  }

  const deposit=(dpacno, dppin, dpamt1)=>{
    var dpamt=parseInt(dpamt1)
    return db.User.findOne({
      acno: dpacno,
      pin: dppin
    })    
    .then(user=>{
      if(!user){
        return{
          status:false,
          statusCode: 422,
          message:'Incorrect Account Details',
          balance:user.balance
        }
      }
      user.balance+= dpamt
      user.transactions.push({
        amount:dpamt,
        txnType:"Credit",
        balance:user.balance
      });
      user.save()
      return{
        status:true,
        statusCode: 200,
        message:'Account has been credited and Current balance is ',
        balance:user.balance
      }
    })
  }

  const withdraw = (wacno, wpin, wamt1) => {
    var wamt= parseInt(wamt1)
    return db.User.findOne({
      acno:wacno,
      pin:wpin
    })
    .then(user=>{
      if(!user){
        return{
          status:false,
          statusCode: 422,
          message:'Incorrect Account Details',
          balance:user.balance
        }
      }
      if (user.balance < wamt){
        return {
          status :false,
          statusCode: 422,
          message : "Insufficient Balance, available balance is ",
          balance : user.balance
        }
      }
      else {
        user.balance-= wamt
        user.transactions.push({
          amount:wamt,
          txnType:"Debit",
          balance:user.balance
        });
        user.save()
        return{
          status:true,
          statusCode: 200,
          message:'Account has been Debited and Current balance is ',
          balance:user.balance
        }
      }
    })
  }

  const getTransactions = (req)=> {
    return db.User.findOne({
      acno:req.session.currentUser
    })
    .then(user=>{
      return{
        status:true,
        statusCode:200,
        transactions:user.transactions
      }
    })
  }

  const delTransactions = (req,id)=> {
    return db.User.findOne({
      acno:req.session.currentUser
    })
    .then(user=>{
      user.transactions = user.transactions.filter(t=>{
        if(t._id==id){
          return false;
        }
        return true;
    })
    user.save();
    return {
      status:true,
      statusCode:200,
      message:"Transactions deleted successfully!!!"
    }
    })
  }

  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransactions,
      delTransactions
  }