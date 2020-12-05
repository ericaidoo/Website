 
/** @module Items */

import sqlite from 'sqlite-async'

/**
 * Items
 * ES6 module that manages the items in CRM system.
 */
class Items {
  /**
   * Create an account object
   * @param {string} [dbName=":memory:"] - The name of the database file to use.
   */ 
  constructor(dbName = ':account.sql:') {
    return (async() => {
      this.db = await sqlite.open(dbName)
      // we need this table to store the user accounts
      
           const sql = 'CREATE TABLE IF NOT EXISTS items(\
                 item_id INTEGER PRIMARY KEY AUTOINCREMENT,\
                 name TEXT,\
                 price INTEGER,\
                 qty INTEGER\
      );'
      
          const sql2 = 'CREATE TABLE IF NOT EXISTS cart(\
                 item_id INTEGER,\
                 name TEXT,\
                 price INTEGER\
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
  
//    async list(itemInfo) {

//      let all = ["h"]
//      console.log("bBAY")
//      console.log(itemInfo)
//     while(1){
//       all.push(itemInfo.name)
//       return all
//     }
     
     
//     return list
//   }
  
//   async all() {
//     const sql = 'SELECT item_id, name, price FROM items\
//                 WHERE item_id = ${itemID};'
//     const items = await this.db.all(sql)
 
//   }
  


  async check(info) {
    
    
   
    try{
      for(const item in info){
      if(info[item].length === 0  )throw new Error("Missing Field")
    }
      
      let sql = `SELECT COUNT(item_id) as records FROM items WHERE item_id= ${info.itemID};`
		  const data = await this.db.get(sql)

		 if(data.records === 0) {
      throw new Error(`itemID "${info.itemID}" does not exist`)
     }
       
      

      console.log(`item id is : ${info.itemID}`)
      sql = `SELECT name, price FROM items WHERE item_id = ${info.itemID};`
      const all = await this.db.get(sql)
      console.log("ALLLLL")
      console.log(all)

      
      
    
      
      let sql2 = `INSERT INTO cart(item_id, name,price) VALUES(${info.itemID},"${all.name}", "${all.price}")`
      
		  await this.db.run(sql2)
   
    }catch(err){
      console.log("check error")
      console.log(err.message)
      throw(err)
    }
    
    
 
		return true
	}
    
    
    
    

  
  
  async cart(){
    try{
       const sql = `SELECT item_id,name,price FROM cart;`
    
        const cart = await this.db.all(sql)
        return cart
      
    }catch(err){
         console.log("CART function")
      console.log(err.message)
        throw(err)
    }
   
  }
  
  async total(){
    let total = 0
    
    try{
      
       const sql = `SELECT price FROM cart;`
    
        const allPrices = await this.db.all(sql)
        
        
        
      for (let i = 0; i < allPrices.length; i++) {
            total = total + allPrices[i]
           
}
      console.log(total)
//         for(let price of allPrices){
//           console.log(`PRICES ARE : ${allPrices[price]}`)
// //           total = total + price
//         }
      total = 0
        return total
      
    }catch(err){
         console.log("CART function")
      console.log(err.message)
        throw(err)
    }
    
  }
  
   async dropCart(){
    try{
       const sql = `DROP TABLE cart;`
       await this.db.run(sql)
    }catch(err){
         
      console.log(err.message)
        throw(err)
    }
   
  }
  
  
  async close() {
		await this.db.close()
	}

  
//   async add(data) {
    
//     	for(const item in data){
//         if(data[item].length === 0  )throw new("Missing Field")
//       }
    
// 		let sql = `SELECT COUNT(id) as records FROM items WHERE item_id="${data.item_}";`
// 		const data = await this.db.get(sql)
// 		if(data.records !== 0) throw new Error(`username "${user}" already in use`)
// 		sql = `SELECT COUNT(id) as records FROM users WHERE email="${email}";`
// 		const emails = await this.db.get(sql)
// 		if(emails.records !== 0) throw new Error(`email address "${email}" is already in use`)
// 		pass = await bcrypt.hash(pass, saltRounds)
// 		sql = `INSERT INTO users(user, pass, email) VALUES("${user}", "${pass}", "${email}")`
// 		await this.db.run(sql)
// 		return true
    
    
    
//     consloe.log(data)
//     try { 
//       const sql = `INSERT INTO products(name, price)\`
//                     VALUES(${data.name}, "${data.price}")`
//       console.log(sql)
//       return true
//     } catch(err) {
//       console.log(err)
//       throw(err)
//     }
//   }

//   async close() {
//     await this.db.close()
//   }
}

export default Items