const mongoose              = require('mongoose')
const User                  = require('./modules/usermodule')
const express               = require('express')
const cors                  = require('cors')
const bodyParser            = require('body-parser')
const dotenv                = require('dotenv')
const jwt                   = require('jsonwebtoken')
const Product               = require('./modules/productmodule')
const Order                 = require('./modules/ordermodule')
const app                   = express()
const bson                  = require('bson')



dotenv.config()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))




/*  _-_   '       _-_   '   _-_   '   _-_        '   _-_   */
/*          *           '         '            *           */
/*    ><  -   -   ´  MONGODB CONNECTION  `  -    -   ><    */
/*   '      _-_   _ ' _ ' _ ' _ ' _ ' _ ' _     _-_     '  */

mongoose
.connect(process.env.DATABASE_ACCESS, () => console.log('database connected'))
.catch((error) => console.log("Error reason: " + error));




/* _______________________________________________________________________________________*/
/*                                                                                        */
/*                  -- REGISTER -------->>   [ "http://localhost:4001/register" */
/*                                                                                        */
/*                                             "content-type: "application/json",         */
/*                                              Method: "POST"  ]                         */
/* _______________________________________________________________________________________*/


app.post('/register', async (req,res, next) =>{                                         
    try {                                                                                
        const { firstname, lastname, email, password, username } = req.body;                                                                // hämta alla värden från inputfälten från client
        console.log(req.body)                                                           

        if (!(email && password && firstname && lastname && username)) {                                                                    // Om det finns tomma fält, skickas ett error till webbläsaren 
            res.status(400).send({ message: "All inputs are required" });        
            return 
        }
        console.log(email)

        const oldUserEmail = await User.findOne({ email });                                                                                         // Letar efter existerande email, måste vara unique
        const oldUserName = await User.findOne({ username });                                                                                    // Letar efter existerande username, måste vara unique
       
        if (oldUserEmail || oldUserName ) {                                                                                                         // om dem finns skickas error till webbläsaren 
            res.status(409).send({ message: "User Already Exist. Please Login" });                                                           // att användaren finns Användaren registreras ICKE!
            return 
        }
        const user = await User.create({                                                                                                                 /* Här skapas en användare, id skapas i mongoDB automatiskts*/
            firstname,                                                                                                                               /*med datan från clienten: { firstname, lastname, username, email, password, }*/
            lastname,
            username,
            email: email.toLowerCase(),
            password,
            isLoggedIn: false,
                                                                                                                                    // Sätter isLoggedIn false,
                                                                                                                                                        //  Användaren måste logga in för att komma åt profile sidan
        })
        
        res.json({ status: 200, user: user, message: 'User was registered successfully!' })                                          // användaren Registreras, meddelande till webbläsaren
        return 
        
    } catch (err){                                                                                                                          // något gick snett vettu MEN DU E MASKIN SÅ DET KLARAR DU
        console.log('Error Register: ' + err)
        res.json({ status: 500, message: err })
        return 
        
    }
})



/* __________________________________________________________________________________*/
/*                                                                                   */
/*                  -- LOGIN -------->>  [  "http://localhost:4001/login"            */
/*                                                                                   */
/*                                         "content-type: "application/json",        */
/*                                          Method: "POST"   ]                       */
/* __________________________________________________________________________________*/


app.post('/login', async (req,res) =>{                                                                                            
    try {
        const { email, password } = req.body                                                                                           //Väntar på inputfälten { email och password }
        
        if(!(email && password)) {                                                                                                               // Om fälten inte är ifyllda === ERROR
            console.log('All inputs are required')                                                                                              // syns i terminalen på VSC
            res.status(400).send({ message: "All inputs are required" })                                                             // status 400 och meddelande kan läsas på webbläsaren
            return 
        }
        
        const user = await User.findOne({ email })                                                                                          // letar efter en användare som är registrerad med denna mail
        if (!user) {                                                                                                                        // om den inte finns
            console.log('User not found')                                                                                                       // error meddelande
            res.status(404).send({ message: "User Not found." });                                                                    
            return 
        }
        const passwordValidation = await password === user.password
                                                                                                                                            // kontrollerar om lösenordet matchar med användarens lösenord
        if (!passwordValidation) {                                                                                                          // om den inte matchar
            res.status(401).send({                                                                                                                                                                                                                   // sätter ingen token
                message: "Invalid Password!"                                        
            });
            return 
        }
        
        if(user && passwordValidation) { 
            // const id = user.id
            let id = new bson.ObjectID();
            let token = jwt.sign(id.toString(),process.env.JWT_SECRET );
            console.log(token)
            console.log(id)

            const result = await User.findOneAndUpdate(                                
                { _id: user._id },                                                                                                          
                { new: true }                                                                                         
                ).exec();                                               	            
                
                console.log(result)                                                   
                res.json({                                                       
                    status: 200,
                    result: { token,                                  
                        user: {
                            _id: result._id,
                           },
                    },
                    message: "Welcome",                                                
                }); 
                return                                                 
            }
            
        } catch (err) {                                                               
            console.log('Error reason: ' + err)
            res.json({message: err})
            return 
            
        }
        
    })


/* _______________________________________________________________________________________*/
/*                                                                                        */
/*                  -- LOGOUT -------->>    "http://localhost:4001/logout"        */
/* _______________________________________________________________________________________*/


/* _______________________________________________________________________________________*/
/*                                                                                        */
/*                  -- PRODUCTER -------->>    "http://localhost:4001/productitem"        */
/* _______________________________________________________________________________________*/

    
    app.post('/productitem', async (req,res) => {
        try {
            const { id, img } = req.body
            const product = await Product.create({
                id,
                img,
                brand,
                price
        })
            res.json({ status: 200, product: product, message: 'Product was registered successfully!' })
            return 

        } catch (error) {
            res.json({ message: error.message })
            return  
        }
    })


   
    app.post('/cart', async (req,res) => {
            try {
                
            const { paidOrder, token, key} = req.body
            
            
            console.log(key)
            console.log(paidOrder)
            console.log(product)
            
            if(paidOrder.length === 1 ){
                res.status(400).json({ message: 'Cart is empty', status: 400, token: token})
                return 
            }else
            if(!token){
                res.status(403).json({ message:'You need to log in', status: 403, token: token })
                return
            }else{
                res.status(200).json({ message : 'Thank you for your purchase', status: 200, token: token})
            }
            const product = paidOrder
            const total = paidOrder.totalPrice
            const qty = paidOrder.count
            
            const order = []
            order.push(paidOrder)
            console.log(key)
            console.log(paidOrder)
            console.log(product)
            
            // if(token){
            //     const newOrder = await Order.create({
            //         user: key, 
            //         orderItems: {order} 
                    
            //     })
            //     console.log('NewOrder created')
                
            //     res.status(200).json({message: "order done"})
            //     return
                
            // }
            
        } catch (error) {
            res.send({error})
            
        }    
        
        
        
        
    })
    
    /*  -        ><         '        -      */
/*   ><   ´  -  API SIDOR  - `  _ ><    */
/*   _         ' -    ´  _  _           */
/* _____________________________________________________________________________________*/
/*                                                                                      */
/*    ---  ALLA PRODUCTER -->>  "http://localhost:4001/api/products"                    */
/* _____________________________________________________________________________________*/
        
app.get('/api/products', async (req,res) => {
    try{
        const data = await Product.find();
        res.json(data)
            }
    catch(error){
        res.status(500).json( {message: error.message} )
    }
})

//---  EN PRODUCT -->> "http://localhost:4001/api/products/:id"

app.get('/api/products/:id', async (req,res) => {
    try{
        const data = await Product.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json( {message: error.message} )
    }
})


//---  ALLA ANVÄNDARE -->>   "http://localhost:4001/users"

app.get('/users', async (req, res) => {
    try{
        const data = await User.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json( {message: error.message} )
    }
})

//---  EN ANVÄNDARE -->>   "http:localhost:4001/users/:id"

app.get('/users/:id', async (req, res) => {
    try{
        const data = await User.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.listen(process.env.PORT, () => console.log('app listening to port 4001'))

