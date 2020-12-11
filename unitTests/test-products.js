import test from 'ava'
import Items from '../modules/products.js'


test('PRODUCTS   : check if items exists', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}

	const itemID = {itemID: 1}

	try {
		await items.check(itemID)
		test.fail( 'TEST FAILED')
	} catch(err) {
		test.pass('item has not been added')
	}
})

test('PRODUCTS   : check if the check function works properly', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}

	const itemID = {itemID: 1}

	try {
		await items.addItem(data)
		await items.check(itemID)
		test.pass( 'item has not been added')
	} catch(err) {
		test.fail('TEST FAILED')
	}
})


test('PRODUCTS   : check if items are displayed in cart', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}

	const itemID = {itemID: 1}

	try {
		await items.addItem(data)
		await items.check(itemID)
		await items.cart()
		test.pass( 'item has not been added')
	} catch(err) {
		test.fail('TEST FAILED')
	}
})


test('PRODUCTS   : check if it gets the correct total', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}

	const itemID = {itemID: 1}

	try {
		await items.addItem(data)
		await items.check(itemID)
		await items.cart()
		const total = await items.total()

		test.is(total,1,'total is not correct')
	} catch(err) {
		test.fail('TEST FAILED')
	}
})


test('PRODUCTS   : check the stock gets updated', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}


	const itemID = {itemID: 1}

	try {
		await items.addItem(data)
		await items.check(itemID)
		await items.check(itemID)
		await items.cart()
		await items.updateStock()
		test.pass( 'item has not been updated')
	} catch(err) {
		test.fail('TEST FAILED')
	}
})


test('PRODUCTS   : check if item is added', async test => {
	test.plan(1)
	const items = await new Items()
	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}

	try {
		await items.addItem(data)
		test.pass('item has not been added')
	} catch(err) {
		test.fail('Item cannot be added')
	}
})

test('PRODUCTS   : check if all items are retrieved', async test => {
	test.plan(1)
	const items = await new Items()

	const data = {
		itemName: 'Arduino Micro USB Microcontroller ',
		description: 'fdgfdg',
		itemQty: '21',
		itemPrice: '1'
	}


	try {
		await items.addItem(data)
		await items.allItems()
		test.pass('item has not been added')
	} catch(err) {
		console.log(err.message)
		test.fail('cannot get items')
	}
})

