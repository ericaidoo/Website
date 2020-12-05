
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

router.get('/add', async ctx => {
   await ctx.render('add', ctx.hbs)
  
})

router.post('/', async ctx => {
  
  const items = await new Items(dbName)
  
  
  try { 

    console.log("GETTING:")
    console.log(ctx.request.body)
    
    
    await items.check(ctx.request.body)
    return ctx.redirect('/?msg = "item ADDED" ')
  } catch(err) {
    console.log(err.message)
    await ctx.render('sv', ctx.hbs)
  } finally {
    items.close()
  }
})


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
