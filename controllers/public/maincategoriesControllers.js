const {
    Maincategory,
    Seller,
    Images,
    Products
} = require('../../models');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

exports.getAllCategories = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    const categories = await Maincategory.findAll({
        limit,
        offset,
        order: [
            ['createdAt', 'ASC'],
        ],
    });
    const count=await Maincategory.count()
    return res.status(200).send({categories,count});
});

exports.getCategorySeller = catchAsync(async(req, res, next) => {
    const id=req.params.id
    const limit = req.query.limit || 20;
    const offset = req.query.offset;
    const sort = req.query.sort;

    var order;
     order = [
        ['updatedAt', 'DESC']
    ];
    const sellers = await Seller.findAll({
        where: { maincategoryId: id }, //isActive goy sonundan
        order,
        limit,
        offset,
    });
    const count = await Seller.count({ where: { maincategoryId: id } })
    return res.status(200).send({ sellers, count });
});