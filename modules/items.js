 
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
  constructor(dbName = ':memory:') {
    return (async() => {
      this.db = await sqlite.open(dbName)
      // we need this table to store the user accounts
      const sql = 'CREATE TABLE IF NOT EXISTS items(\
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,\
        userid INTEGER,\
        itemName TEXT NOT NULL,\
        itemPrice INTEGER,\
        FOREIGN KEY(userid) REFERENCES users(id)\
      );'
      await this.db.run(sql)
      return this
    })()
    
  }
  /**
   * retrieves all the items in the system
   * @return {Array} returns an array containing all the items in the database
   */
  async all() {
    const sql = 'SELECT users.user, items.* FROM items, users\
                  WHERE items.userid = users.id;'
    const items = await this.db.all(sql)
    return items
  }
}

export default Items