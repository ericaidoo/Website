
import Router from 'koa-router'

const router = new Router({ prefix: '/sv' })

import Items from '../modules/products.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	const items = await new Items(dbName)
	try {
		const total = await items.total()
		const cart = await items.cart()
		console.log(cart)
		ctx.hbs.total = total
		ctx.hbs.all = cart
		await ctx.render('sv', ctx.hbs)
	} catch(err) {
		console.log(err.message)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('sv', ctx.hbs)
	}finally{

		items.close()
	}
})


router.get('/clear', async ctx => {
	const items = await new Items(dbName)
	try{
		await items.dropCart()
		ctx.redirect('/')
	}catch(err) {
		console.log(err.message)
		console.log('DROP CART ERROR')
		throw err
	}

//    await ctx.render('sv', ctx.hbs)
})

router.get('/add', async ctx => {
	await ctx.render('add', ctx.hbs)
})


router.get('/itemadd', async ctx => {
	const items = await new Items(dbName)

	const all = await items.allItems()
	console.log('ALL ITEMSSSSS')
	console.log(all)
	ctx.hbs.all = all


	await ctx.render('itemadd', ctx.hbs)
})


router.post('/', async ctx => {

	const items = await new Items(dbName)


	try {

		console.log('GETTING:')
		console.log(ctx.request.body)


		await items.check(ctx.request.body)
		return ctx.redirect('/sv?msg = "item ADDED" ')
	} catch(err) {
		console.log(err.message)
		return ctx.redirect('/sv?msg = item does not exist')
	} finally {
		items.close()
	}
})

router.post('/add', async ctx => {
	const items = await new Items(dbName)


	try {
		// if user uploaded a file then get additional file info
		//and check if the format is valid.
		if(ctx.request.files.avatar.name) {
			ctx.request.body.filePath = ctx.request.files.avatar.path
			ctx.request.body.fileName = ctx.request.files.avatar.name
			ctx.request.body.fileType = ctx.request.files.avatar.type
		}


		// call the functions in the module
		console.log('ITEM DETAILS')
		console.log(ctx.request.body)

		await items.addItem(ctx.request.body)
		ctx.redirect('/sv/itemadd?msg=new item added')
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		console.log('ERROR IN /ADD POST')
		console.log(err.message)
		await ctx.render('/', ctx.hbs)
	} finally {
		items.close()
	}
})


router.get('/checkout', async ctx => {
	const items = await new Items(dbName)

	const all = await items.allCart()
	const total = await items.total()
	console.log('ALL ITEMSSSSS')
	console.log(all)
	ctx.hbs.total = total
	ctx.hbs.all = all

	await ctx.render('checkout', ctx.hbs)
})

router.get('/buy', async ctx => {
	const items = await new Items(dbName)
	try{
		await items.updateStock()

  	ctx.redirect('/sv/clear?msg=Thanks for shopping')
	}catch(err) {
		console.log('error in BUY')
		console.log(err.message)
		ctx.hbs.msg = err.message
		await ctx.render('checkout',ctx.hbs)
	} finally{
		items.close()
	}

})


// router.post('/add', async ctx => {
//   console.log('adding a customer')
//   return ctx.redirect('/sv?=new item added')
// })

// router.post('/add', async ctx => {
//   const items = await new Items(dbName)
//   try {
//     // call the function in the module

//     await items.check(ctx.request.body.item)


//     await ctx.render('sv', ctx.hbs)
//   } catch(err) {
//     console.log("HERE 002")
//     ctx.hbs.msg = err.message
//     ctx.hbs.body = ctx.request.body
//     console.log(ctx.hbs)
//     await ctx.render('sv', ctx.hbs)
//   }
// })


export default router
