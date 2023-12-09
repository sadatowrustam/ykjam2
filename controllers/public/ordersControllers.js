const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Products, Orders, Orderproducts, Stock, GiftCards, Userswithgift } = require('../../models');

exports.addMyOrders = catchAsync(async(req, res, next) => {
    var {
        address,
        order_products,
        delivery_time,
        payment_type,
        user_phone,
        i_take,
        note,
        name
    } = req.body;
    let giftProduct
    let status = "garashylyar"
    let checkedProducts = [];
    let total_price = 0;
    let total_quantity = 0;
    if (order_products)
        for (var i = 0; i < order_products.length; i++) {
            const product = await Products.findOne({
                where: { product_id: order_products[i].product_id }
            });
            const stock = await Stock.findOne({ where: { productId: product.id } })
            if (!product)
                return next(
                    new AppError(
                        `Product did not found with your ID index: ${i + 1}`,
                        404
                    )
                );
            if (order_products[i].quantity > stock.quantity) {
                order_products[i].quantity = stock.quantity
                stock.quantity = 0
                await stock.save()
                await product.update({ isActive: false })
            } else {
                stock.quantity = stock.quantity - order_products[i].quantity
                await stock.save()
            }
            total_quantity = total_quantity + Number(order_products[i].quantity);
            checkedProducts.push(product);
            total_price =
                total_price + product.price * Number(order_products[i].quantity);
        }
    const order = await Orders.create({
        total_price,
        address,
        user_phone,
        payment_type,
        i_take,
        note,
        status,
        delivery_time,
        total_quantity,
        status,
        name
    });
    for (var i = 0; i < checkedProducts.length; i++) {
        await Orderproducts.create({
            orderId: order.id,
            productId: order_products[i].product_id,
            quantity: order_products[i].quantity,
            price: checkedProducts[i].price,
            total_price: Number(
                checkedProducts[i].price * order_products[i].quantity
            ),
        });
    }
    let user = await Userswithgift.findOne({ where: { phone_number: user_phone } })
    const d = new Date()
    if (user) {
        let giftTake = false
        let time = user.expire_date.split(".")
        let month = time[0]
        let day = time[1]
        let hour = time[2]
        let minute = time[3]
        if (month != d.getMonth() - 1) {
            giftProduct = await returnGift(total_price)
            giftTake = true
        } else if (month != d.getMonth() && hour > d.getHours() || hour == d.getHours() && minute > d.getMinutes()) {
            giftProduct = await returnGift(total_price)
            giftTake = true
        } else if (day != d.getDay() - 1) {
            giftProduct = await returnGift(total_price)
            giftTake = true
        } else if (day != d.getDay() && hour == d.getHours() && minute > d.getMinutes()) {
            giftProduct = await returnGift(total_price)
            giftTake = true
        } else giftProduct = undefined
        if (giftTake) {
            let exprire_time = takeDate()
            await user.update({ exprire_time })
        }
    } else {
        giftProduct = await returnGift()
        let expire_time = takeDate()
        if (giftProduct) await Userswithgift.create({ expire_time, phone_number: user_phone })
    }
    if (giftProduct) {
        await order.update({ giftId: giftProduct.id })
    }
    return res.status(200).json({
        status: 'Your orders accepted and will be delivered as soon as possible',
        data: {
            order,
            giftProduct
        },
    });
});
async function returnGift(total_price) {
    let maximum = 0
    let giftProduct
    const giftcards = await GiftCards.findAll({
        where: { isActive: true },
        order: [
            ["price", "ASC"]
        ]
    })
    for (const giftcard of giftcards) {
        if (giftcard.price > maximum && giftcard.price < total_price || giftcard.price == total_price) {
            maximum = giftcard.price
            giftProduct = giftcard
        }

    }
    return giftProduct
}

function takeDate() {
    const date = new Date()
    let time = date.getMonth() + "." + date.getDay() + "." + date.getHours() + "." + date.getMinutes()
    return time
}