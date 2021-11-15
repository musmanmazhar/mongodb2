import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";



mongoose.connect('mongodb+srv://usmanmazhar:usmanmazhar@cluster0.sekeu.mongodb.net/mongodb1?retryWrites=true&w=majority') 
    .then(() => console.log("Connected to the Database"))
    .catch(err => console.log(err));         
 

const Users = mongoose.model('Users', {
    name: String,
    email: String,
    address: String,
});


const app = express();

const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json()) 
app.use(morgan('short')) 



app.use((req, res, next) => {
    console.log('a request came', req.body);
    next()
})


app.get('/users', (req,res) => {
    Users.find({},(error, userS) => { 
        if (!error) {                 
            res.send(userS)
        } else {
            console.log(err);
            res.status(404).send("error happened")
        }
    })
})


app.get('/user/:id', (req,res) => {
    console.log(req.params.id)
    Users.findOne({_id: req.params.id}, (err,user) => { 
        if(!err) {                                  
            res.send(user)                            
            console.log(user);
        } else {
            console.log(err);
            res.status(500).send('Error Happened')
        }
    })
})


app.post('/user', (req,res) => {
    if (!req.body.name || !req.body.email || !req.body.address){
        res.status(400).send('invalid data');
    } else {
        const newUser = new Users({  
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        });

        newUser.save()    
            .then((result) => {
                res.send(result);
                console.log(result);
                console.log(req.params.id);
            })
            .catch(err => console.log(err));
    }
})



app.put ('/user/:id', (req, res) => {
    let updateUser = {}  
    if (req.body.name) {
        updateUser.name = req.body.name
    } 
    if (req.body.email) {
        updateUser.email = req.body.email
    }
    if (req.body.address) {
        updateUser.address = req.body.address
    }
    //    findByIdAndUpdate(id, update, options, callback)
    Users.findByIdAndUpdate(req.params.id, updateUser, {new:true}, (err, update) => {   
        if (!err) {                                            
            res.send(update)
            console.log(update);
        } else {
            console.log(err);
            res.status(404).send("User doesn't exist")
        }                                                      
    })

   
    /* if (users[req.params.id]) {
        if (req.body.name) {
            users[req.params.id].name = req.body.name
        }
        if (req.body.email) {
            users[req.params.id].email = req.body.email
        }
        if (req.body.address) {
            users[req.params.id].address = req.body.address
        }

        res.send(users[req.params.id])

    } else {
        res.status(404).send('user not found');
    } */
})


app.delete('/user/:id', (req,res) => {
    Users.findOneAndDelete({_id: req.params.id}, (err,del) => {
        if (!err) {
            res.send('USER deleted')
            console.log(del);
        } else {
            console.log(err);
            res.status(500).send("User not found/Error Happened")
        }
    })
})

app.delete('/userdelall', (req,res) => {
    Users.remove()
        .then(() => {
            res.send("All Users Deleted")
        })
        .catch(() => {
            res.status(404).send("No Users Exist")
        })
        //below code is  applicable in non database
    /* if (users) {
        users = []
        res.send('All user deleted')
    } else {
        res.status(404).send('users doesn"t exists');
    } */
})

app.get('/home', (req, res) => {
    res.send('here is your home')
})

app.get('/', (req, res) => {
    res.send('Hi this is a nice little hello server')
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})







