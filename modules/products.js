
/** @module Items */

import sqlite from 'sqlite-async'
import mime from 'mime-types'
import fs from 'fs-extra'
/**
 * Items
 * ES6 module that manages the items in CRM system.
 */
class Items {
	/**
   * Create an account object
   * @param {string} [dbName=":memory:"] - The name of the database file to use.
   */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts

			const sql = 'CREATE TABLE IF NOT EXISTS items(\
                 item_id INTEGER PRIMARY KEY AUTOINCREMENT,\
                 name TEXT,\
                 description TEXT,\
                 price INTEGER,\
                 filename TEXT,\
                 qty INTEGER\
      );'

			const sql2 = 'CREATE TABLE IF NOT EXISTS cart(\
                 item_id INTEGER,\
                 name TEXT,\
                 price INTEGER,\
                 qty INTEGER\
      );'
			await this.db.run(sql)
			await this.db.run(sql2)
			return this
		})()

	}
	/**
   * retrieves all the items in the system
   * @return {Array} returns an array containing all the items in the database
   */

	async check(info) {
		console.log('YOOOOOO AKII')
		console.log(info)
		try{


			let sql = `SELECT COUNT(item_id) as records FROM items WHERE item_id= ${info.itemID};`
		  const data = await this.db.get(sql)

		 if(data.records === 0) {
				throw new Error(`itemID ${info.itemID} does not exist`)
			}


			console.log(`item id is : ${info.itemID}`)
			sql = `SELECT name, price FROM items WHERE item_id = ${info.itemID};`
			const all = await this.db.get(sql)
			console.log('ALLLLL')
			console.log(all)


			const sql4 = `SELECT COUNT(item_id) as records FROM cart WHERE item_id= ${info.itemID};`
			const data2 = await this.db.get(sql4)

			if(data2.records === 0) {
				const sql2 = `INSERT INTO cart(item_id, name,price,qty) VALUES(${info.itemID},"${all.name}", ${all.price},1)`
		  await this.db.run(sql2)
			} else{
				const sql3 = `SELECT qty FROM cart WHERE item_id = ${info.itemID};`
				const qty = await this.db.get(sql3)
				console.log('QUANITYTY HEREEEEE')
				console.log(qty['qty'])
				const add = qty['qty'] + 1

				const sql5 = `UPDATE cart SET qty = ${add} WHERE item_id = ${info.itemID};`
				await this.db.run(sql5)

				const sql6 = 'SELECT * FROM cart'
				const cart = await this.db.run(sql6)

				console.log('CART QUANITY HERE')
				console.log(cart)
			}


		}catch(err) {
			console.log('check error')
			console.log(err.message)
			throw err
		}


		return true
	}


	async cart() {
		try{
			const sql = 'SELECT item_id,name,price,qty FROM cart;'

			const cart = await this.db.all(sql)
			return cart

		}catch(err) {
			console.log('CART function')
			console.log(err.message)
			throw err
		}

	}

	async total() {
		let total = 0

		try{
			const sql = 'SELECT price, qty FROM cart;'
			const allPrices = await this.db.all(sql)

			for (let i = 0; i < allPrices.length; i++) {
				total = total + allPrices[i]['price'] * allPrices[i]['qty']

			}

			return total


		}catch(err) {
			console.log('CART function')
			console.log(err.message)
			throw err
		}

	}


  	async addItem(data) {
		console.log('ADDitems Function')
		console.log(data)


		try{


			let sql = `SELECT COUNT(item_id) as records FROM items WHERE item_id="${data.itemid}";`
			const data2 = await this.db.get(sql)
			if(data2.records !== 0) throw new Error('item already exists')

			let filename
			if(data.fileName) {
				filename = `${Date.now()}.${mime.extension(data.fileType)}`
				await fs.copy(data.filePath, `public/avatars/${filename}`)
			} else{
				filename = 'null'
			}


			sql = `INSERT INTO items(name, description,price,filename,qty) VALUES("${data.itemName}","${data.description}", ${data.itemPrice},"${filename}",${data.itemQty})`
			await this.db.run(sql)
			return true

		}catch(err) {
			console.log(err.message)
			throw err
		}


	}


	async dropCart() {
		try{
			const sql = 'DROP TABLE cart;'
			await this.db.run(sql)
		}catch(err) {

			console.log(err.message)
			throw err
		}

	}


	async allItems() {
		try{


			const sql = 'SELECT * FROM items;'
			const all = await this.db.all(sql)

			for(const index in all) {
				if(all[index].filename === 'null') {
					all[index].filename = 'avatar.png'
				}
			}


			return all
		}catch(err) {
			console.log(err.message)
			throw err
		}
	}

	async allCart() {
		try{
			const sql = 'SELECT * FROM cart;'
			const all = await this.db.all(sql)

			return all
		}catch(err) {
			console.log(err.message)
			throw err
		}
	}


	async updateStock() {
		try{

			let sql = 'SELECT item_id, qty FROM cart;'
			const all = await this.db.all(sql)

			for(let i = 0; i < all.length; i++) {
				sql = `SELECT qty FROM items WHERE item_id = ${all[i]['item_id']};`

				const item = await this.db.get(sql)
				const qty = item.qty
				console.log(`OLD : ${qty}`)
				const newQty = qty - all[i]['qty']
				console.log(`NEWW : ${newQty}`)
				if(newQty <= 0) throw new Error(`No sufficient stock for item_id ${all[i]['item_id']}`)

				sql = `UPDATE items SET qty = ${newQty} WHERE item_id = ${all[i]['item_id']};`
				await this.db.run(sql)

			}

			return true

		}catch(err) {
			console.log(err.message)
			throw err
		}
	}

	async close() {
		await this.db.close()
	}


}

export default Items
