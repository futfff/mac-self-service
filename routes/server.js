import {Router} from 'express'
import {get_food  , get_foods , create_order , get_orders , del , ready , get_orders_for_table} from '../control/server.js'

const router = Router()

router.get('/api/food/:type' , get_foods)

router.get('/api/get_food/:id' , get_food)

router.post('/api/order' , create_order)

router.get('/api/orders/' , get_orders)

router.delete('/api/deleteorder/:id' , del)

router.get('/api/readyorder/:id' , ready)

router.get('/api/orders_for_table/' , get_orders_for_table)

export default router

