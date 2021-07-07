const express = require('express')
const app = express();
const port = 5000;
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
// const dburl = "mongodb://127.0.0.1:27017";
const dburl = "mongodb+srv://nirmitha:nirmitha@test.1yoih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.use(express.json())

app.get("/students", async (req, res) => {
    let client = await mongoClient.connect(dburl)
    try {
        let db = client.db("StudentInfo")
        const data = await db.collection("users").find().toArray();
        res.json({ message: "Record fetched", data })
        // res.status(200).send(data)
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {
        client.close();
    }
});

app.post("/students", async (req, res) => {
   // let client = await mongoClient.connect(dburl)
    let client = await mongoClient.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    try {
        let db = client.db("StudentInfo")
        const data = await db.collection("users").insertOne(req.body);
        res.json({ message: "Record created" })
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {
        client.close();
    }
});

app.put("/updatestudents/:id", async (req, res) => {
    let client = await mongoClient.connect(dburl);
    const objid = mongodb.ObjectID(req.params.id);
    try {
        //select the db
        let db = client.db("StudentInfo")
        // select the collection and perform db operation
        const data = await db.collection("users").findOne({ _id: objid });
        if (data) {
            const updated = await db.collection("users").findOneAndUpdate({ _id: objid }, { $set: { name: req.body.name, phone: req.body.phone, email: req.body.email } });
            res.json({ message: "Record Updated" })
        } else res.json({ message: "No user with this ID" })
        // res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {
        //close connection
        client.close();
    }
});

app.delete("/delete-students/:id", async (req, res) => {
    let client = await mongoClient.connect(dburl);
    const objid = mongodb.ObjectID(req.params.id);
    try {
        let db = client.db("StudentInfo")
        const data = await db.collection("users").findOne({ _id: objid });
        if (data) {
            const updated = await db.collection("users").findOneAndDelete({ _id: objid })
            res.json({ message: "Deleted" })
        } else res.json({ message: "No user wth this ID exists" })
        // res.status(200).json(data)
    } catch (error) {
        console.log(error);
        res.json({ message: "something went Wrong" })
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log("server is listening....")
})
