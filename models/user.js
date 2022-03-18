const dbConnect = require('../util/database')
const mongoDB = require('mongodb')
const {log} = require("nodemon/lib/utils");

class User {
    constructor(username, email, id, cart) {
        this.email = email
        this.username = username
        this._id = id
        this.cart = cart
    }

    save() {
        const db = dbConnect.getDb()
        db.collection('users')
            .insertOne(this)
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return product._id.toString() === cp.productId.toString()
        })

        let newQuantity = 1
        let cartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            cartItems[cartProductIndex].quantity += 1
        } else {
            cartItems.push({productId: product._id, quantity: newQuantity})
        }
        const addedProduct = {items: cartItems}

        const db = dbConnect.getDb()
        return db.collection('users')
            .updateOne({_id: new mongoDB.ObjectId(this._id)}, {$set: {cart: addedProduct}})
    }

    static findById(userId) {
        const db = dbConnect.getDb();
        return db.collection('users')
            .findOne({_id: new mongoDB.ObjectId(userId)})
            // .next()
            .then(user => {
                console.log(user)
                return user
            })
            .catch(error => {
                console.log(error)
            })
    }

    getCart() {
        const db = dbConnect.getDb()
        const productIds = this.cart.items.map(i => {
            return i.productId
        })
        return db.collection('products')
            .find({_id: {$in: productIds}})
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity
                    }
                })
            })
    }

    deleteCartItem(prodId) {
        const updatedCartItems = this.cart.items.filter(p => {
            return p.productId.toString() !== prodId.toString()
        })
        const db = dbConnect.getDb()
        return db.collection('users')
            .updateOne({_id: new mongoDB.ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}})
    }

    createOrder() {
        const db = dbConnect.getDb()
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongoDB.ObjectId(this._id),
                        name: this.username
                    }
                }
                return db.collection('orders').insertOne(order)
            }).then(result => {
                this.cart = {items: []}
                return db.collection('users')
                    .updateOne({_id: new mongoDB.ObjectId(this._id)}, {$set: {cart: {items: []}}})
            }).catch(err => {
                console.log(err)
            })
    }

    getOrders() {
        const db = dbConnect.getDb()
        return db.collection('orders')
            .find({'user._id': new mongoDB.ObjectId(this._id)})
            .toArray()

    }
}


module.exports = User

