const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.buzh4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db("test").collection("devices");
        const reviewCollection = client.db("test").collection("reviews");

        // get product from db
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviews = await reviewCollection.find(query).toArray();
            res.send(reviews)
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query)
            res.send(product)
        })
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

    }

    // const run = async () => {

    //     try {
    //         await client.connect();
    //         const productCollenction = client.db("digitaz").collection("products");
    //         const userCollenction = client.db("digitaz").collection("users");
    //         const reviewCollenction = client.db("digitaz").collection("reviews");
    //         const orderCollenction = client.db("digitaz").collection("orders");
    //         const paymentCollenction = client.db("digitaz").collection("payments");

    //         const verifyAdmin = async (req, res, next) => {
    //             const requester = req.decoded.email;
    //             const requesterAccount = await userCollenction.findOne({ email: requester });
    //             if (requesterAccount.role === 'admin') {
    //                 next();
    //             }
    //             else {
    //                 res.status(403).send({ message: 'forbidden' });
    //             }
    //         }

    //         app.post('/create-payment-intent', verifyJWT, async (req, res) => {
    //             const order = req.body;
    //             const price = order.price;
    //             const amount = price * 100;
    //             const paymentIntent = await stripe.paymentIntents.create({
    //                 amount: amount,
    //                 currency: 'usd',
    //                 payment_method_types: ['card']
    //             });
    //             res.send({ clientSecret: paymentIntent.client_secret })
    //         });

    //         app.get('/products', async (req, res) => {
    //             const query = {};
    //             const products = await productCollenction.find(query).toArray();
    //             res.send(products)
    //         })



    //         app.put('/user/:email', async (req, res) => {
    //             const email = req.params.email;
    //             const user = req.body;
    //             const filter = { email: email };
    //             const options = { upsert: true };
    //             const updateDoc = {
    //                 $set: user,
    //             };
    //             const result = await userCollenction.updateOne(filter, updateDoc, options);
    //             const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' })
    //             res.send({ result, token });
    //         });

    //         app.get('/user/:email', async (req, res) => {
    //             const email = req.params.email;
    //             const filter = { email: email };
    //             const user = await userCollenction.findOne(filter);
    //             res.send(user);
    //         });

    //         app.put('/user/:email', async (req, res) => {
    //             const email = req.params.email;
    //             const profile = req.body;
    //             const filter = { email: email };
    //             const options = { upsert: true };
    //             const updateDoc = {
    //                 $set: profile,
    //             };
    //             const result = await userCollenction.updateOne(filter, updateDoc, options);
    //             res.send(result);
    //         });

    //         app.get('/users', async (req, res) => {
    //             const query = {};
    //             const users = await userCollenction.find(query).toArray();
    //             res.send(users)
    //         })

    //         app.put('/users/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const role = req.body;
    //             const filter = { _id: ObjectId(id) };
    //             const options = { upsert: true };
    //             const updatedDoc = {
    //                 $set: role
    //             }
    //             const updatedUser = await userCollenction.updateOne(filter, updatedDoc, options);
    //             res.send(updatedUser);
    //         })


    //         app.post('/order', verifyJWT, async (req, res) => {
    //             const order = req.body;
    //             const result = await orderCollenction.insertOne(order);
    //             res.send(result);
    //         });

    //         app.get('/orders', verifyJWT, async (req, res) => {
    //             const email = req.query.email;
    //             const decodedEmail = req.decoded.email;
    //             if (email === decodedEmail) {
    //                 const query = { email: email };
    //                 const orders = await orderCollenction.find(query).toArray();
    //                 return res.send(orders);
    //             }
    //             else {
    //                 return res.status(403).send({ message: 'forbidden access' });
    //             }
    //         });

    //         app.get('/allorders', async (req, res) => {
    //             const query = {};
    //             const orders = await orderCollenction.find(query).toArray();
    //             console.log(orders);
    //             res.send(orders)
    //         })

    //         app.patch('/paidorders/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const filter = { _id: ObjectId(id) };
    //             const updatedDoc = {
    //                 $set: {
    //                     deleverd: true,
    //                 }
    //             }
    //             const updatedOrder = await orderCollenction.updateOne(filter, updatedDoc);
    //             res.send(updatedOrder);
    //         })

    //         app.get('/orders/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const query = { _id: ObjectId(id) };
    //             const order = await orderCollenction.findOne(query)
    //             res.send(order)
    //         })

    //         app.patch('/orders/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const payment = req.body;
    //             const filter = { _id: ObjectId(id) };
    //             const updatedDoc = {
    //                 $set: {
    //                     paid: true,
    //                     transactionId: payment.transactionId
    //                 }
    //             }

    //             const result = await paymentCollenction.insertOne(payment);
    //             const updatedOrder = await orderCollenction.updateOne(filter, updatedDoc);
    //             res.send(updatedOrder);
    //         })

    //         app.delete('/orders/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const filter = { _id: ObjectId(id) };
    //             const result = await orderCollenction.deleteOne(filter);
    //             res.send(result);
    //         })



    //         app.put('/product/:id', async (req, res) => {
    //             const id = req.params.id;
    //             const stock = req.body;
    //             const filter = { _id: id };
    //             const options = { upsert: true };
    //             const updateDoc = {
    //                 $set: stock,
    //             };
    //             const result = await productCollenction.updateOne(filter, updateDoc, options);
    //             res.send(result);
    //         });

    //         app.delete('/product/:id', verifyJWT, async (req, res) => {
    //             const id = req.params.id;
    //             const filter = { _id: ObjectId(id) };
    //             const result = await productCollenction.deleteOne(filter);
    //             res.send(result);
    //         })

    //         app.get('/admin/:email', async (req, res) => {
    //             const email = req.params.email;
    //             const user = await userCollenction.findOne({ email: email });
    //             const isAdmin = user?.role === 'admin';
    //             res.send({ admin: isAdmin })
    //         })





    //     }



    finally {
        //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Manufacturer Server Site !')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



