
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { Maincategory } = require('../../models');
const sharp=require("sharp")
const {Op}=require("sequelize")
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.addMainCategory = catchAsync(async(req, res, next) => {
    let maincategory = await Maincategory.create(req.body)
    return res.send(maincategory)
})
exports.allMainCategories = catchAsync(async(req, res, next) => {
    const filter=JSON.parse(req.query.filter)
    let {keyword}=req.query
    const {endDate,startDate}=filter
    var where = {};
    if (keyword && keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where = {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    email: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                }
            ],
        };
    }
    if(filter.startDate!=undefined){
        where.createdAt = {
            [Op.gte]: new Date(startDate),
            [Op.lte]: new Date(endDate) 
        }
    }
    const limit=req.query.limit || 20
    const offset=req.query.offset || 0
    let data = await Maincategory.findAll({
        limit,
        offset,
        order: [
            ["createdAt", "DESC"]
        ],
        where
    })
    let count = await Maincategory.count({where})
    return res.send({ data, count })
})
exports.updateMainCategory = catchAsync(async(req, res, next) => {
    const { name_tm,name_ru,name_en} = req.body;
    const maincategory = await Maincategory.findOne({ where: { id: [req.params.id] } });
    await maincategory.update({
        name_tm,name_ru,name_en,
    });
    return res.send(maincategory)
});
exports.deleteMainCategory = catchAsync(async(req, res, next) => {
    const maincategory = await Maincategory.findOne({ where: { id: req.params.id }})
    if (!maincategory) return next(new AppError("maincategory with that id not found", 404))
    await maincategory.destroy()
    return res.send("Success")

})
exports.uploadCategoryImage = catchAsync(async(req, res, next) => {
    req.files = Object.values(req.files)
    const maincategory = await Maincategory.findOne({ where: { id: req.params.id }})
    if (!maincategory) return next(new AppError("maincategory with that id not found", 404))
    const image = `${req.params.id}_maincategory.webp`;
    const photo = req.files[0].data
    let buffer = await sharp(photo).webp().toBuffer()
    await sharp(buffer).toFile(`static/${image}`);
    await maincategory.update({image})
    return res.status(201).send(maincategory);
});
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}