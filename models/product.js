const dbConnect = require('../util/database')
const mongoDB = require('mongodb')

class Product {
    constructor(title, description, price, imageUrl) {
        this.title = title
        this.description = description
        this.price = price
        this.imageUrl = imageUrl
    }

    save() {
        const db = dbConnect.getDb();
        db.collection('products').insertOne(this)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = dbConnect.getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products)
                return products
            })
            .catch(err => {
                console.log(err)
            })
    }

    static findById(prodId) {
        const db = dbConnect.getDb();
        return db.collection('products')
            .find({_id: new mongoDB.ObjectId(prodId)})
            .next()
            .then(product => {
                console.log(product)
                return product
            })
            .catch(error => {
                console.log(error)
            })
    }

    static update(prodId, product) {
        const db = dbConnect.getDb()
        return db.collection('products').updateOne({_id: new mongoDB.ObjectId(prodId)}, {$set: product})
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    static delete(prodId) {
        const db = dbConnect.getDb();
        return db.collection('products')
            .deleteOne({_id: new mongoDB.ObjectId(prodId)})
            .then(result => {
                console.log(result)
                return
            })
            .catch(error => {
                console.log(error)
            })
    }
}

module.exports = Product;
