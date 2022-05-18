const MongoClient = require('mongodb').MongoClient;

const dbName = "my_db";

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    if (err){
        return console.log(err);
    }
    const db = client.db(dbName);

    db.collection('manufacturer').insertMany(
        [{name: "manufacturer_1"},
            {name: "manufacturer_2"},
            {name: "manufacturer_3"}]
    ).then(r => client.close());

    db.collection('category').insertMany(
        [{name: "food"},
            {name: "electronics"},
            {name: "tool"},
            {name: "furniture"}]
    ).then(r => client.close());

    db.collection('products').insertMany([
        {name: "apple", id_manufacturer: 1, id_category: 1},
        {name: "banana", id_manufacturer: 1, id_category: 1},
        {name: "hammer", id_manufacturer: 2, id_category: 3},
        {name: "hammer", id_manufacturer: 2, id_category: 3},
        {name: "iPhone", id_manufacturer: 3, id_category: 2},
        {name: "nokia 3310", id_manufacturer: 3, id_category: 2},
        {name: "table", id_manufacturer: 4, id_category: 4},
        {name: "bed", id_manufacturer: 4, id_category: 4}
    ]).then(r => client.close());
})