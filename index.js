const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { response } = require('express');
const { ObjectID } = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r5dyr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(process.env.PORT||5000);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("volunteer-network").collection("volunteers");
    const taskCollection = client.db("volunteer-network").collection("tasks");
    console.log('Database connected')

    app.get('/getTasks', (req, res) => {
        taskCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addVolunteer', (req, res) => {
        volunteerCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.get('/getUserTasks', (req, res) => { 
        const userEmail = req.query.email;
        volunteerCollection.find({ email: userEmail })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.delete('/taskDelete/:id', (req, res) => {
        volunteerCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    app.get('/getVolunteers/', (req, res) => {
        volunteerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addEvent', (req, res) => {
        taskCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
            res.send(result.insertedCount > 0);
        })
    })
    
});