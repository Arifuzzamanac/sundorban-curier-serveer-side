const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

// mddlewere
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6yc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('curierService');
        const myserviceCollection = database.collection('myservice');
        const servicesCollection = database.collection('services');

        // get all service data
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        app.get('/myservice', async (req, res) => {
            const cursor = servicesCollection.find({});
            const myservice = await cursor.toArray();
            res.send(myservice);
        });

        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        });

        // post api data
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service)

            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result)
        });

        app.post('/myservice', async (req, res) => {
            const service = req.body;
            console.log('hit the myservice', service)

            const result = await myserviceCollection.insertOne(service);
            console.log(result)
            res.send(result);
        });

        // delete api

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
};

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('assignment 11')
});

app.listen(port, () => {
    console.log('colse gari sisimpure', port)
})