const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://kenanismail:kenan2015@cluster0.y1f23.mongodb.net/test?retryWrites=true&w=majority"

let _db;

module.exports = {

    connectToServer: function( callback ) {
        MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
            _db  = client.db('test');
            return callback( err );
        } );
    },

    getDb: function() {
        return _db;
    }
};

//
// let _db;
//
// const {MongoClient, ServerApiVersion} = require('mongodb');
// const uri = "mongodb+srv://kenanismail:kenan2015@cluster0.y1f23.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
//
//
// module.exports = {
//     connect: function (callback) {
//         client.connect(err => {
//             _db = client.db("test");
//             // perform actions on the collection object
//             return callback(err);
//             // client.close();
//         });
//     },
//
//     getDb: function () {
//         console.log(_db)
//         return _db;
//     }
// }
