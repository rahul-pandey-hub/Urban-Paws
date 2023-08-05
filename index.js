const express = require('express');
const b = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");
const session = require('express-session');
const multer = require("multer")
const cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");
const { count } = require('console');
const pdf = require('html-pdf');
const autoIncrement = require("mongoose-auto-increment")
const fs = require('fs');

const ejs = require('ejs');
const server = express();
server.use(express.static('public'));
server.set('view engine', 'ejs');

server.use(b.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 // 1 hour in milliseconds
    }
}));

/*MongoDb database*/
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/loginDB", { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("you got an error")
    }
    else {
        console.log("database connection succesfully")
    }
});

const adminSchema ={
    name:String,
    email:String,
    passwd:String
}
const impSchema = {
    name: String,
    email: String,
    phone: Number,
    passwd: String,
    que:String,
    ans:String


};

const productschema = {

    category: String,
    pname: String,
    price: Number,
    description: String,
    image: String
}

const foodschema = {
    category: String,
    fname: String,
    fprice: Number,
    description: String,
    image: String

}
const bestschema = {
    category: String,
    name: String,
    price: Number,
    description: String,
    image: String

}

const cartschema = {
    user: String,
    pname: String,
    quantity: Number,
    image: String,
    price: Number,
    date: {
        type: Date,
        default: Date.now
    }

}

const cityschema = {
    city: String,
    price: Number
}

const orderschema = {
    orderfname: String,
    orderemail: String,
    orderphone: Number,
    orderdate: {
        type: Date,
        default: null
    },
    cancel_order_date: {
        type: Date,
        default: null

    },
    order_delivery_date: {
        type: Date,
        default: null
    },
    order_delivery_address: String,
    city: String,
    total_amount: Number,
    order_payment_method: String,
    payment_id: String,
    order_status: String,
    message: String,
    tracking_no: String,
    is_cancel_order: Number,
    created_at: {
        type: Date,
        default: Date.now
    }

}
const order_Productschema = {
    order_id: String,
    pname: String,
    quantity: Number,
    image: String,
    price: Number
}
const contactschema = {
    name: String,
    email:String,
    subject: String,
    feedback: String
}
const feedbackschema = {
    
   pname:String,
   name:String,
   message:String


    
    
}


const Admin=mongoose.model("Admin",adminSchema )
const Item = mongoose.model("Item", impSchema);
const Product_item = mongoose.model("Prouct_item", productschema);
const Food_item = mongoose.model("Food_item", foodschema);
const Best_seller = mongoose.model("Best_seller", bestschema);
const Cart = mongoose.model("Cart", cartschema);
const City = mongoose.model("City", cityschema);
const Order = mongoose.model("Order", orderschema);
const Order_product = mongoose.model("Order_product", order_Productschema);
const contact = mongoose.model("Contact", contactschema);
const feedback = mongoose.model("feedback", feedbackschema);

const Storage = multer.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' ||
            file.mimetype == 'image/gif'

        ) {
            cb(null, true)
        }
        else {
            cb(null, false);
            cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
        }
    }

});
const upload = multer({
    storage: Storage
}).single('single_input')

server.get('/', (req, res) => {
    res.sendFile(__dirname + "/index2.html");

});


/*Before Login*/
server.get('/accessories.html', (req, res) => {
    res.sendFile(__dirname + "/accessories.html");
});

server.get('/index2.html', (req, res) => {
    res.sendFile(__dirname + "/index2.html")
});

server.get('/fooditems.html', (req, res) => {
    res.sendFile(__dirname + "/fooditems.html");
});

server.get('/login1.html', (req, res) => {
    res.sendFile(__dirname + "/login1.html");
});

server.get('/admin.html', (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

server.get('/petwalkers.html', (req, res) => {
    res.sendFile(__dirname + "/petwalkers.html");
});

server.get('/registration.html', (req, res) => {
    res.sendFile(__dirname + "/registration.html");


});

server.get('/success.html', (req, res) => {
    res.sendFile(__dirname + "/success.html");
});



/*Registration*/
server.post("/registration.html", (req, res) => {
    const name = req.body.fname;
    const email = req.body.femail;
    const phone1 = req.body.fphone;
    const passwd1 = req.body.fpass;
    const que=req.body.que;
    const ans=req.body.ans;
    const gender=req.body.gender;



    Item.findOne({ email }, (err, user) => {

        if (err) {
            console.log(err)
        }

        if (user) {
            return res.status(404).sendFile(__dirname + "/failure3.html");
        }
        else {
            Item.findOne({ name }, (err, user) => {
                if (err) {
                    console.log(err)
                }
                if (user) {
                    return res.status(404).sendFile(__dirname + "/failure3.html");
                }
                else {
                    var item1 = new Item({
                        name: name,
                        email: email,
                        phone: phone1,
                        gender:gender,
                        passwd: passwd1,
                        que:que,
                        ans:ans


                    });


                    item1.save();
                    res.redirect("/login1.html")
                }
            })

        }

    })

});

/*login and after login ejs templates*/
server.post("/login1.html", (req, res) => {

    const email = req.body.email;
    const passwd = req.body.passwd;

    Item.findOne({ email }, (err, user) => {
        if (err) {
            console.log(err)
        }


        if (!user) {
            return res.status(404).sendFile(__dirname + "/failure2.html");
        }
        if (passwd !== user.passwd) {
            res.sendFile(__dirname + "/failure.html")
        }


        if (passwd === user.passwd) {


            req.session.username = user.name;
            req.session.useremail = user.email;
            req.session.userphone = user.phone;
            res.redirect("/index.ejs")





        }

    });
    server.get("/Logout1.ejs",(req,res)=>{
       if(req.session.usernmae || req.session.useremail || req.session.userphone){
        req.session.username=null
        req.session.useremail=null
        req.session.userphone=null
        res.redirect("/login1.html")
       }

    })


    server.get('/index.ejs', (req, res) => {
        Best_seller.find({}, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {
                var b=item.length
                res.render("index", { a: item,b:b, session: req.session })
            }
        });

    })
    server.post("/bestproduct.ejs", (req, res) => {
        const a = req.body.item;


        Best_seller.findOne({ "name": a }, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {

                res.render("bestproduct", { item: item, session: req.session })

            }
        });
    })
    server.get("/petwalkers.ejs", (req, res) => {
        res.render("petwalkers", { session: req.session });
    })

    server.get("/profile.ejs", (req, res) => {
        res.render("profile", { session: req.session });
    })

    server.get("/accessories.ejs", (req, res) => {
        Product_item.find({}, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {
                var b = item.length
                res.render("accessories", { a: item, session: req.session,b:b })
            }
        });
    });
    server.post("/product.ejs", (req, res) => {
        const a = req.body.item;


        Product_item.findOne({ "pname": a }, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {

                res.render("product", { item: item, session: req.session })

            }
        });


    })



    server.get("/fooditems.ejs", (req, res) => {

        Food_item.find({}, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {
                var a= item.length
                res.render("fooditems", {a:a, b: item, session: req.session })
            }
        });
    })

    server.post("/foodproduct.ejs", (req, res) => {
        const b = req.body.item;



        Food_item.findOne({ "fname": b }, (err, item) => {
            if (err) {
                console.log(err);

            }
            else {

                res.render("foodproduct", { item1: item, session: req.session })

            }
        });
    })
    server.post("/search", (req, res) => {
        const fname = req.body.name;

        Food_item.find({ fname: { $regex: fname, $options: "i" } }, (err, user) => {

            if (err) {
                console.log(err)
            }

            if (user) {
                console.log(user)
                res.render("fooditems", {
                    b: user,
                    session: req.session


                });
            }


        })
    })
    server.post("/search1", (req, res) => {
        const name = req.body.name;

        Product_item.find({ pname: { $regex: name, $options: "i" } }, (err, user) => {

            if (err) {
                console.log(err)
            }

            if (user) {
                console.log(user)
                res.render("accessories", {
                    a: user,
                    session: req.session


                });
            }

        })
    })

    server.post("/search2", (req, res) => {
        const name = req.body.name;

        Best_seller.find({ name: { $regex: name, $options: "i" } }, (err, user) => {

            if (err) {
                console.log(err)
            }

            if (user) {
                console.log(user)
                res.render("index", {
                    a: user,
                    session: req.session


                });
            }
            else {
                console.log(user)
            }
        })
    })

    server.post("/add-to-cart", (req, res) => {
        const pname = req.body.prod_id;
        const prodqty = req.body.prod_qty;
        const session = req.session
        const img = req.body.img
        const name = session.username
        const price = req.body.price
        Cart.findOne({ "pname": pname, "user": name }, (err, user) => {
            if (err) {
                console.log(err)
            }

            if (user) {
                console.log(user)

                res.json({ status: "already in cart" })
            }
            else {
                var cart1 = new Cart({
                    user: session.username,
                    pname: pname,
                    quantity: prodqty,
                    image: img,
                    price: price

                })
                cart1.save()
                res.json({ status: "item added in cart succesfully" })
            }

        });

    })
    server.get("/cart.ejs", (req, res) => {
        const session = req.session
        const user = session.username;

        Cart.find({ user }, (err, name) => {
            if (err) {
                console.log(err)
            }
            else {

                var a = name.length;




                var data = { userCart: name, session: session, a: a }
                res.render("cart", data)

            }

        })
    })
    server.post("/delete-cart-product", (req, res) => {
        var pname = req.body.product_id;

        const session = req.session
        const user = session.username;
        Cart.deleteOne({ user: user, pname: pname }).then(function () {
            res.json({ status: "cart item deleted" })
        }).catch((err) => {
            console.log(err)
        })

    })

    server.get("/checkout.ejs", (req, res) => {
        const session = req.session
        const user = session.username;

        Cart.find({ "user": user }, (err, name) => {

            if (err) {
                console.log(err)
            }
            if (!name) {
                res.json({ status: "you dont have any item in cart" })
            }
            else {
                var total = 0
                var a = name.length
                for (var i = 0; i < a; i++) {
                    var qty = name[i].quantity
                    var price = name[i].price
                    var b = qty * price
                    total = total + b
                    b = 0
                }
                City.find({}, (err, user) => {
                    if (err) {
                        console.log(err)
                    }
                    else {


                        console.log(user)
                        var delcharge = user[0].price

                        const gtotal = total;
                        console.log(total)
                        console.log(name[0].quantity)
                        res.render("checkout.ejs", { cartproducts: name, total_price: total, current_user: req.session, grandTotal: gtotal, delArea: delcharge, area: user })
                    }

                })

                server.post("/change-charges", (req, res) => {
                    var city = req.body.areaname
                    console.log(city)
                    City.find({ city }, (err, user) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log(user)
                            return res.json({ status: user[0].price })
                        }
                    })
                })

            }
        })
    })
    server.post("/placeorder", (req, res) => {
        const fname = req.body.fname;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const city = req.body.area1;
        const address = req.body.address;
        const session = req.session
        const user = session.username;
        const payment_id = req.body.payment_id
        Cart.find({ "user": user }, (err, name) => {

            if (err) {
                console.log(err)
            }
            if (!name) {
                res.json({ status: "you dont have any item in cart" })
            }
            else {
                var total = 0
                var a = name.length
                for (var i = 0; i < a; i++) {
                    var qty = name[i].quantity
                    var price = name[i].price
                    var b = qty * price
                    total = total + b
                    b = 0
                }
            }
            City.findOne({ city }, (err, user1) => {
                var gtotal = total + user1.price
                var min = 111111;
                var max = 999999;
                var randomNum = "UrbanPaws" + Math.floor(Math.random() * (max - min + 1)) + min;
                var method = 'COD'
                if (payment_id) {
                    method = 'Online'
                }
                var order1 = new Order({
                    orderfname: fname,
                    orderemail: email,
                    orderphone: mobile,
                    order_delivery_address: address,
                    city: city,
                    total_amount: gtotal,
                    order_payment_method: method,
                    payment_id: payment_id,
                    is_cancel_order: 0,
                    order_status: '7-day deleivery',
                    message: null,
                    tracking_no: randomNum,
                    orderdate: Date.now()



                })

                order1.save();
                for (const i of name) {
                    const p1 = new Order_product({
                        order_id: randomNum,
                        pname: i.pname,
                        quantity: i.quantity,
                        image: i.image,
                        price: i.price
                    })
                    p1.save();
                }
                Cart.deleteMany({ user: user }).then(function () {
                    if (payment_id) {
                        return res.json({ status: "payment successful" })
                    }
                    else {
                        res.sendFile(__dirname + "/order.html")
                    }


                }).catch((err) => {
                    console.log(err)
                })
            })



        })

    })

    server.get("/orders.ejs", (req, res) => {
        const session = req.session
        const orderemail = session.useremail;
        const user = session.username;
        Order.find({ orderemail }, (err, name) => {
            if (err) {
                console.log(err)
            }
            else {
                var data = {
                    'userOrderData': name,
                    'session': user
                }
                res.render("orders", data)
            }
        })


    })
    server.post("/cancelOrder", (req, res) => {
        var tracking_no = req.body.order_id;

        Order.updateOne({ "tracking_no": tracking_no }, { "is_cancel_order":  1}, function (
            err,
            result
        ) {
            if (err) {
                res.send(err);
            } else {

                return res.json({ status: "order canceled" })
            }
        });



    })
    server.post("/view", (req, res) => {
        var tracking_no = req.body.tracking_no;
        console.log(tracking_no)
        Order.findOne({ tracking_no }, (err, name) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(tracking_no)
                var order_id = tracking_no
                Order_product.find({ "order_id": tracking_no }, (err, user) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        console.log(name)
                        console.log(user)
                        var context = { 'userOrderData': name, 'userOrderDetails': user }
                        res.render("view", context)
                    }

                })
            }
        })
    })
    server.get("/contact.ejs", (req, res) => [
        res.render("contact")
    ])
    server.post("/contact", (req, res) => {
        var name = req.body.name
        var email = req.body.email
        var subject = req.body.subject
        var message = req.body.message

        var contact1 = new contact({
            name: name,
            email:email,
            subject: subject,
            feedback: message
        })
        contact1.save()
        res.render("contact")
    })

    server.post("/feedback", (req, res) => {
        const session = req.session
        const user = session.username;
        var pname = req.body.pname
        var name = req.body.name
        var message = req.body.message

        var feedback1 = new feedback({
            pname: pname,
            name: user,
            message: message

        })
        feedback1.save()
        res.sendFile(__dirname + "/feedback.html")
    })

    server.post("/invoice", (req, res)=>{
        const tracking_no=req.body.tracking_no1
        var total_price=0

        Order.find({tracking_no}, (err, user)=>{
            if(err){
                console.log(err)
            }
            else{
                Order_product.find({"order_id":tracking_no}, (err, name)=>{
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log(user)
                        console.log(name)
                        var a=name.length
                        for(var i=0; i<a; i++){
                            total_price=total_price+name[i].price

                        }
                        console.log(total_price)
                        data = {
                            'order':user,
                            'orderDetails':name,
                            
                            'totalPrice':total_price
                        }
                    res.render("invoice", data)
                    }
                })
            }
        })
    })
});

server.get("/forgot-password.ejs", (req, res)=>{
    res.render("forgot-password")
})

server.post("/forgot-password.ejs", (req, res)=>{
    const email = req.body.femail;
    const que=req.body.que;
    const ans=req.body.ans;
    const passwd = req.body.fcpass;

    Item.findOne({ email }, (err, user) => {
        if (err) {
            console.log(err)
        }

       if(email === user.email){
            if(que === user.que){
                if(ans === user.ans){
                    Item.updateOne({ "email": email }, { "passwd": passwd }, function (
                        err,
                        result
                    ) {
                        if (err) {
                            res.send(err);
                        } else {
            
                            res.redirect("/login1.html")
                        }
                    });
                }
                if(ans != user.ans){
                    res.sendFile(__dirname + "/failure.html")
                }
            }
       }

    });

})

server.get("/changepasswd.ejs", (req, res)=>{
    res.render("changepasswd")
})

server.post("/changepasswd.ejs", (req, res)=>{
    const email = req.body.femail;
    const passwd=req.body.fpass;
    
    const npasswd = req.body.fcpass;

    Item.findOne({ email }, (err, user) => {
        if (err) {
            console.log(err)
        }


       if(email === user.email){
            if(passwd === user.passwd){
                
                    Item.updateOne({ "email": email }, { "passwd": npasswd }, function (
                        err,
                        result
                    ) {
                        if (err) {
                            res.send(err);
                        } else {
            
                           res.sendFile(__dirname + "/success1.html")
                        }
                    });
                
            }
            if(passwd != user.passwd){
                res.sendFile(__dirname + "/failure.html")
            }
       }

    });
})
/*admin route*/
server.post("/admin.html", (req, res) => {

    const email = req.body.email;
    const passwd = req.body.passwd;

    Admin.findOne({ email }, (err, user) => {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.status(404).sendFile(__dirname + "/failure2.html");
        }
        if (passwd !== user.passwd) {
            res.sendFile(__dirname + "/failure.html")
        }


        if (passwd === user.passwd) {


           
            req.session.useremail = user.email;
            
            res.redirect("/admin.ejs")





        }

    });
server.get("/logout.ejs",(req,res)=>{
    if(req.session.useremail){
        req.session.useremail=null
        res.redirect("/admin.ejs")
    }
    
})
server.get("/admin.ejs", (req, res) => {
    // session=req.session.useremail
    console.log(req.session.useremail)
    if(req.session.useremail){
        Item.find({}, (err, users) => {
            if (err) {
                console.log(err);
    
            }
            else {
                res.render("admin", { users: users })
            }
        });
    }
    else{
        res.sendFile(__dirname + "/login1.html");
    }
    


});

server.post("/update", (req, res)=>{
    var a=req.body.select
    var b= req.body.tracker
    console.log(a)
    console.log(b)
    Order.updateOne({ "tracking_no": b }, { "order_status": a }, function (
        err,
        result
    ) {
        if (err) {
            res.send(err);
        } else {

           c
        }
    });
})
/*Accessories add route*/
server.get("/productAdd.ejs", (req, res) => {
    Product_item.find({}, (err, product) => {
        if (err) {
            console.log(err);

        }
        else {

            res.render("productAdd", { product: product })
        }
    });


});
server.post("/add", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
       
        else {
            var category = req.body.category;
            var pname = req.body.pname;
            var price = req.body.price;
            var desc = req.body.desc;
            var image = req.file.filename;
           


           

            Product_item.findOne({"pname":pname}, (err,user)=>{
                console.log(user)
                if(user){
                    res.sendFile(__dirname + "/failure5.html")
                }
                
                else{
                    var product1 = new Product_item({
                        category: category,
                        pname: pname,
                        price: price,
                        description: desc,
                        image: image
                    })
                    
                    if (price < 0) {
                        return res.status(404).sendFile(__dirname + "/failure4.html");
                    }
                    else {
                        product1.save();
                        
                      
                        
                    }
                }
            })
            // const food = Food_item.findOne({ fprice })
         



        
        

        }
    })
})
server.get("/foodAdd.ejs", (req, res) => {
    Food_item.find({}, (err, food) => {
        if (err) {
            console.log(err);

        }
        else {

            res.render("foodAdd", { food: food })
        }
    });

})
server.post("/add1", (req, res) => {
    // var fprice = req.body.fprice;
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            var category = req.body.category;
            var fname = req.body.fname;
            var fprice = req.body.fprice;
            var fdesc = req.body.fdesc;
            var fimage = req.file.filename;

           

            Food_item.findOne({"fname":fname}, (err,user)=>{
                console.log(user)
                if(user){
                    res.sendFile(__dirname + "/failure5.html")
                }
                
                else{
                    var food1 = new Food_item({
                        category: category,
                        fname: fname,
                        fprice: fprice,
                        description: fdesc,
                        image: fimage
                    })

                    if (fprice < 0) {
                        return res.status(404).sendFile(__dirname + "/failure4.html");
                    }
                    else {
                        food1.save();
                        res.redirect("/foodAdd.ejs")
                    }
                }
            })
            // const food = Food_item.findOne({ fprice })
         



        }
    })
})
server.post("/delete", (req, res) => {
    const name = req.body.checkbox;
    Food_item.findByIdAndRemove(name, (err) => {
        if (!err) {
            console.log("item deleted successfully")
            res.redirect("/foodAdd.ejs")
        }
    })
})
server.post("/delete1", (req, res) => {
    const name = req.body.checkbox;
    Product_item.findByIdAndRemove(name, (err) => {
        if (!err) {
            console.log("item deleted successfully")
            res.redirect("/productAdd.ejs")
        }
    })
})


server.get("/fooddetails.ejs", (req, res) => {
    Food_item.find({}, (err, users) => {
        if (err) {
            console.log(err);

        }
        else {
            res.render("fooddetails", { users: users })
        }
    });

})
server.get("/productdetails.ejs", (req, res) => {
    Product_item.find({}, (err, users) => {
        if (err) {
            console.log(err);

        }
        else {
            res.render("productdetails", { users: users })
        }
    });

})

server.get("/orderDetails.ejs", (req, res) => {
    Order.find({}, (err, user) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render("orderdetails", { users: user })
        }
    })
})

server.get("/feedbackdetails.ejs", (req, res) => {
    feedback.find({}, (err, user) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render("feedbackdetails", { users: user })
        }
    })
})
server.get("/blogdetails.ejs", (req, res) => {
    contact.find({}, (err, users) => {
        if (err) {
            console.log(err);

        }
        else {
            res.render("blogdetails", { users: users })
        }
    });

})
})
server.get("/feeding.ejs", (req, res) => {
    res.render("feeding")
})
server.get("/blog2.ejs", (req, res)=>{
    res.render("blog2")
})
server.get("/blog3.ejs", (req, res)=>{
    res.render("blog3")
})
server.get("/blog4.ejs", (req, res)=>{
    res.render("blog4")
})
server.get("/blog5.ejs", (req, res)=>{
    res.render("blog5")
})
server.get("/blog6.ejs", (req, res)=>{
    res.render("blog6")
})
server.get("/blog7.ejs", (req, res)=>{
    res.render("blog7")
})
server.get("/user-pdf-details.ejs", (req, res) => {

    try {
        var data
        Item.find({}, (err, user) => {
            data = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/user-pdf-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data);
            pdf.create(ejsData, options).toFile('userdetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'userdetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="userdetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})

server.get("/product-details.ejs", (req, res) => {

    try {
        var data1
        Product_item.find({}, (err, user) => {
            data1 = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/product-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data1);
            pdf.create(ejsData, options).toFile('productdetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'productdetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="productdetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})

server.get("/food-details.ejs", (req, res) => {

    try {
        var data2
        Food_item.find({}, (err, user) => {
            data2 = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/food-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data2);
            pdf.create(ejsData, options).toFile('fooddetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'fooddetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="fooddetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})
server.get("/order-details.ejs", (req, res) => {

    try {
        var data3
        Order.find({}, (err, user) => {
            data3 = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/order-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data3);
            pdf.create(ejsData, options).toFile('orderdetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'orderdetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="orderdetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})

server.get("/feedback-details.ejs", (req, res) => {

    try {
        var data
        feedback.find({}, (err, user) => {
            data = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/feedback-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data);
            pdf.create(ejsData, options).toFile('feedbackdetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'feedbackdetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="feedbackdetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})
server.get("/blog-details.ejs", (req, res) => {

    try {
        var data
        contact.find({}, (err, user) => {
            data = {
                users: user
            }

            console.log(user)

            const filePathName = path.resolve(__dirname + '/views/blog-details.ejs')
            const htmlString = fs.readFileSync(filePathName).toString();
            let options = {
                format: 'letter'
            }
            const ejsData = ejs.render(htmlString, data);
            pdf.create(ejsData, options).toFile('blogdetails.pdf', (err, response) => {
                if (err) console.log(err)

                const filePath = path.resolve(__dirname, 'blogdetails.pdf')
                fs.readFile(filePath, (err, file) => {
                    if (err) {
                        console.log(err)
                    }

                    res.setHeader('Content-Type', 'application/pdf')
                    res.setHeader('Content-Disposition', 'attachment;filename="blogdetails.pdf"')
                    res.send(file)
                })
            })
        })
    }
    catch (error) {
        console.log(error)
    }

})


/*port listen*/
server.listen(3001, () => {
    console.log("server is created")
});