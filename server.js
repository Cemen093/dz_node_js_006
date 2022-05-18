/*К прошлой CRUD архитектуре реализовать контроллеры для взаимодействия через Express (post / get ).*/

const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

const hostname = '127.0.0.1';
const port = 3000;

var ObjectID = require('mongodb').ObjectId;
var db;
var _client;

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err){
        return console.log(err);
    }
    db = client.db('my_bd');
    _client = client;
    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
})

app.get('/stop', function (req, res) {
    _client.close();
})

app.get('/', function (req, res) {
    if (req.query.func === 'create'){
        if (!req.query.collection){
            console.log("collection none");
            return res.sendStatus(500);
        }

        let obj;
        if (req.query.collection === "category" || req.query.collection === "manufacturer"){
            if (!req.query.name){
                return res.sendStatus(500);
            }
            obj = {
                name: req.query.name
            }
        } else if (req.query.collection === "products"){
            if (!req.query.name || !req.query.id_manufacturer || !req.query.id_category){
                return res.sendStatus(500);
            }
            obj = {
                name: req.query.name,
                id_manufacturer: req.query.id_manufacturer,
                id_category: req.query.id_category
            }
        }

        db.collection(req.query.collection).insert(obj, function (err, result) {
            if (err){
                console.log(err);
                return res.sendStatus(500);
            }
            return res.send(obj);
        })
    } else if (req.query.func === 'read'){
        if (!req.query.collection){
            console.log("collection none");
            return res.sendStatus(500);
        }

        if (req.query.id){
            db.collection(req.query.collection).findOne({ _id: ObjectID(req.query.id)}, function (err, doc) {
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.send(doc);
            });
        } else {
            db.collection(req.query.collection).find().toArray(function (err, docs) {
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.send(docs);
            });
        }

    } else if (req.query.func === 'update'){
        if (!req.query.collection || !req.query.id){
            console.log("collection none");
            return res.sendStatus(500);
        }


        let obj;
        if (req.query.collection === "category" || req.query.collection === "manufacturer"){
            if (!req.query.name){
                return res.sendStatus(500);
            }
            obj = {
                name: req.query.name
            }
        } else if (req.query.collection === "products"){
            if (!req.query.name || !req.query.id_manufacturer || !req.query.id_category){
                return res.sendStatus(500);
            }
            obj = {
                name: req.query.name,
                id_manufacturer: req.query.id_manufacturer,
                id_category: req.query.id_category
            }
        }

        db.collection(req.query.collection).updateOne(
            {_id: ObjectID(req.query.id)},
            {$set: {obj}},
            function (err, result) {
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            }
        )

    } else if (req.query.func === 'delete'){
        if (!req.query.collection || !req.query.id){
            console.log("collection none");
            return res.sendStatus(500);
        }

        db.collection(req.query.collection).deleteOne(
            { _id: ObjectID(req.query.id) },
            function (err, result) {
                if (err){
                    console.log(err);
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            }
        )
    } else {
        res.send(`
    <p>Hello API</p>
    <p>Examples</p>
    <p></p>
    <p>Create</p>
    <p>/?func=crete&collection=category&name=my_category</p>
    <p>/?func=crete&collection=product&name=my_product&id_manufacturer=1&id_category=1</p>
    <p></p>
    <p>Read</p>
    <p>/?func=read&collection=category</p>
    <p>/?func=read&collection=category&id=6281eeb9f689ea33aee006d6</p>
    <p></p>
    <p>Update</p>
    <p>/?func=update&collection=category&id=6281eeb9f689ea33aee006d6&name=my_category</p>
    <p>/?func=update&collection=product&id=6281eeb9f689ea33aee006d6&name=my_product&id_manufacturer=1&id_category=1</p>
    <p></p>
    <p>Delete</p>
    <p>/?func=delete&collection=category&id=6281eeb9f689ea33aee006d6</p>
    `);
    }
})