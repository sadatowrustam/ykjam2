const fs = require('fs');
const sharp = require('sharp');
const { v4 } = require("uuid")
const Op = require('sequelize').Op;
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const { getDate } = require("../../utils/date")
const uuid = require("uuid")
const AdmZip=require("adm-zip")
const reader=require("xlsx")
const {
    Products,
    Categories,
    Material,
    Images,
    Productsizes,
    Seller,
    Sizes,
    Users,
    Colors,
    Comments,
    Instock,
    Etraps
} = require('../../models');
const { default: axios } = require('axios');
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
exports.getAllActiveProducts = catchAsync(async(req, res) => {
    const limit = req.query.limit || 20;
    const offset = req.query.offset || 0;
    let { keyword, categoryId,materialId,welayat} = req.query;
    var where = {};
    where=getWhere(req.query)
    const filter=JSON.parse(req.query.filter)
    const endDate=new Date(filter.endDate)
    const startDate=new Date(filter.startDate)
    if(filter.startDate!=undefined){
        where.push({createdAt:{
            [Op.gte]: startDate,
            [Op.lte]: endDate 
            }
        })
    }
    const data = await Products.findAll({
        where,
        limit,
        offset,
        include: [{
                model: Images,
                as: "images",
                limit: 4,
                order:[["createdAt","ASC"]]
            },
            {
                model: Material,
                as: "material",
            },
            {
                model: Productsizes,
                as: "product_sizes"
            },
            {
                model:Seller,
                as:"seller"
            }
        ],
        order: [
            ['createdAt', 'DESC'],
            // ["images", "createdAt", "ASC"]
        ],
    });
    const count = await Products.count({where})
    return res.status(200).send({ data, count });
});
exports.getOneProduct = catchAsync(async(req, res, next) => {
    const { id } = req.params
    const oneProduct = await Products.findOne({
        where: { id },
        order:[["images","createdAt","ASC"]],
        include: [
            {
                model: Productsizes,
                as: "product_sizes",
                include:{
                    model:Sizes,
                    as:"size"
                }
            },
            {
              model:Etraps,
              as:"etrap"  
            },
            {
                model: Images,
                as: "images"
            },
            {
                model: Seller,
                as: "seller"
            },
            {
                model:Material,
                as:"material"
            },
            {
                model:Colors,
                as:"color"
            },
            {
                model:Comments,
                as:"comments",
                include:[{
                    model:Images,
                    as:"images"
                },
                {
                    model:Users,
                    as:"user"
                }
                ]
            }
        ]
    })
    return res.send(oneProduct)
})
exports.addSize = catchAsync(async(req, res, next) => {
    var sizes = []
    var sizeIds=[]
    const product = await Products.findOne({ where: { id: req.params.id } })
    // await Productsizes.destroy({ where: { productId: product.id } })
    if (!product) return next(new AppError("Product with that id not found", 404))
    for (let i = 0; i < req.body.sizes.length; i++) {
        let data = {}
        data.price_old = null;
        data.sizeId = req.body.sizes[i].sizeId
        data.discount=req.body.sizes[i].discount
        data.productId = product.id
        data.stock = req.body.sizes[i].stock
        const instock=await Instock.findAll({where:{productId:product.id,sizeId:req.body.sizes[i].sizeId}})
        let mails=[]
        for(let i=0;i<instock.length;i++){
            mails.push(instock[i].email)
        }
        if(instock.length>0){
            let mail_data={
                text:"Siziň soran "+product.name_tm+" atly harydyňyz ýenede elimizde bar",
                mails,
                subject:"Instock reminder"
            }
            try {
                const response=await axios.post("http://localhost:5012/send-mail",mail_data)
                await Instock.destroy({where:{productId:product.id,sizeId:req.body.sizes[i].sizeId}})
                console.log(154)
            } catch (error) {
                console.log(error)
            }
        }
        let existingRecord = await Productsizes.findOne({
            where: {
              sizeId: req.body.sizes[i].sizeId,
              productId: req.params.id,
            },
          });
        
          if (existingRecord) {
            // Update the existing record
            await existingRecord.update(data );
          } else {
            existingRecord=await Productsizes.create(data);
          }
        sizeIds.push(data.sizeId)
        sizes.push(existingRecord)
    }
    await product.update({sizeIds})

    return res.status(201).send(sizes)
})
exports.addProduct = catchAsync(async(req, res, next) => {
    const category = await Categories.findOne({
        where: { id: req.body.categoryId },
    });
    if (!category)
        return next(new AppError('Category did not found with that ID', 404));
    const date = new Date()
    req.body.is_new_expire = date.getTime()
    req.body.categoryId = category.id;
    req.body.price_old=null
    if (Number(req.body.discount) > 0) {
        req.body.price_old = req.body.price;
        req.body.price =(req.body.price / 100) *(100 - req.body.discount);
    }
    req.body.isActive=true
    req.body.etrapId=req.body.welayat
    console.log(req.body)
    const newProduct = await Products.create(req.body);
    return res.status(201).send(newProduct)
})
exports.editProduct = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({
        where: { id: req.params.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));
    req.body.price_old=null
    if (req.body.discount > 0) {
        req.body.price_old = req.body.price;
        req.body.price =(req.body.price_old / 100) *(100 - req.body.discount);
    }
    await product.update(req.body);
    return res.status(200).send(product);
});
exports.editProductStatus = catchAsync(async(req, res, next) => {
    const product = await Products.findOne({
        where: { id: req.body.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    await product.update({
        isActive: req.body.isActive,
    });

    return res.status(200).send(product);
});
exports.editProductRecommendation = catchAsync(async(req, res, next) => {
    console.log(216,req.body)
    const product = await Products.findOne({
        where: { id: req.body.id },
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));

    await product.update({
        recommended: req.body.recommended,
    });

    return res.status(200).send(product);
});
exports.deleteProduct = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const product = await Products.findOne({
        where: { id },
        include: [

            {
                model: Productsizes,
                as: "product_sizes"
            },
        ]
    });
    if (!product)
        return next(new AppError('Product did not found with that ID', 404));
    if (!product) return next(new AppError("Product with that id not found", 404))
    if (product.product_sizes) await Productsizes.destroy({where:{productId:product.id}})

    const images = await Images.findAll({ where: { productId: product.id } })
    for (const image of images) {
        fs.unlink(`static/${image.image}`, function(err) {
            if (err) console.log(err)
            
        })
    }
    await Images.destroy({ where: { productId: product.id } })
    await product.destroy();
    return res.status(200).send('Successfully Deleted');
});
exports.uploadProductImage = catchAsync(async(req, res, next) => {
    req.files = Object.values(req.files)
    req.files = intoArray(req.files)
    for (const images of req.files) {
        const image_id = v4()
        const image = `${image_id}_product.webp`;
        const photo = images.data
        let buffer = await sharp(photo).webp().resize(454,510).toBuffer()
        await sharp(buffer).toFile(`static/${image}`);
        let newImage = await Images.create({ image, id:image_id, productId: req.params.id })
    }
    return res.status(201).send("Sucesss");
});
exports.deleteProductImage = catchAsync(async(req, res, next) => {
    const image = await Images.findOne({ where: { id: req.params.id } })

    fs.unlink(`static/${image.image}`, function(err) {
        if (err) throw err;
    })
    await image.destroy()
    return res.status(200).send({ msg: "Sucess" })

})
exports.uploadExcel=catchAsync(async(req,res,next)=>{
    req.files = Object.values(req.files)
    const image = `products.xlsx`;
    const photo = req.files[0]
    photo.mv(`./static/${image}`,(err)=>{
        if(err) return next(new AppError("Somethin went wrong",500))
    })
    return res.status(201).send("Sucess");
})
exports.uploadZip=catchAsync(async(req,res,next)=>{
    req.files = Object.values(req.files)
    const image = `images.zip`;
    const photo = req.files[0].data
    fs.writeFileSync(`./zip-images/images.zip`, photo);
    var zip = new AdmZip(`./zip-images/`+`images.zip`);
    zip.extractAllTo(/*target path*/ `./zip-images`, /*overwrite*/ true);

    return res.status(201).send("Sucess");
})
exports.addFromExcel=catchAsync(async(req,res,next)=>{
    const filename="./static/"+"products.xlsx"
    const file = reader.readFile(filename)
    let data = []
    const sheets = file.SheetNames
    for(let i = 0; i < sheets.length; i++)
    {
       const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
       temp.forEach((res) => {
          data.push(res)
       })
    }
    const date=new Date()
    for(let oneData of data){
        const obj={
            name_tm:oneData.name_tm,
            name_ru:oneData.name_ru,
            name_en:oneData.name_en,
            body_en:oneData.body_en,
            body_ru:oneData.body_ru,
            body_tm:oneData.body_tm,
            product_code:oneData.product_code,
            price:oneData.price,
            discount:oneData.discount,
            categoryId:oneData.categoryId,
            subcategoryId:oneData.subcategoryId,
            price_old:null,
            sellerId:oneData.sellerId,
            isActive:true,
            is_new_expire :date.getTime()

        }
        if (Number(oneData.discount) > 0 && Number(oneData)!=NaN) {
            obj.price_old = oneData.price;
            obj.price =(oneData.price / 100) *(100 - oneData.discount);
        }
        const newProduct = await Products.create(obj);
        if(oneData.sizes){
            var sizes = []
            oneData.sizes=oneData.sizes.split(" ")
            if(oneData.sizes_discount) oneData.sizes_discount=oneData.sizes_discount.split(" ")
            if(oneData.sizes_quantity) oneData.sizes_quantity=oneData.sizes_quantity.split(" ")
            oneData.sizes_price=oneData.sizes_price.split(" ")

                for (let i = 0; i < oneData.sizes.length; i++) {
                    let data = {}
                    data.price_old = null;
                    if (oneData.sizes_discount!=undefined && oneData.sizes_discount != []) {
                        data.discount = oneData.sizes_discount[i]
                        data.price_old = oneData.sizes_price[i]
                        data.price = (data.price_old / 100) * (100 - oneData.sizes_discount[i])
                    }
                    data.price = oneData.sizes_price[i]
                    data.size = oneData.sizes[i]
                    data.productId = newProduct.id
                    data.stock = oneData.sizes_quantity[i]
                    let product_size = await Productsizes.create(data)
                    sizes.push(product_size)
                }            
                }
        const imagesArray=oneData.images.split(",")
        for (const images of imagesArray) {
            console.log(images,256)
            const id = v4()
            const image = `${id}_product.webp`;
            const photo = `zip-images/${images}`
            let buffer = await sharp(photo).resize(1080,720).webp().toBuffer()
            await sharp(buffer).toFile(`static/${image}`);
            let newImage = await Images.create({ image, id, productId: newProduct.id })
        }
    }
    const today=new Date()
    await Seller.update({updatedAt:today},{where:{id:req.body.sellerId}})
    
    return res.send(data)
})
const intoArray = (file) => {
    if (file[0].length == undefined) return file
    else return file[0]
}
function getWhere({ categoryId,sizeId,materialId,keyword,welayat}) { 
    let where = []
    if (keyword && keyword != "undefined") {
        let keywordsArray = [];
        keyword = keyword.toLowerCase();
        keywordsArray.push('%' + keyword + '%');
        keyword = '%' + capitalize(keyword) + '%';
        keywordsArray.push(keyword);
        where.push({
            [Op.or]: [{
                    name_tm: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    name_ru: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
                {
                    name_en: {
                        [Op.like]: {
                            [Op.any]: keywordsArray,
                        },
                    },
                },
            ],
        });
    }
    if(sizeId && sizeId!="undefined"){
        where.push({sizeIds:{[Op.contains]:[sizeId]}})
    }
    if(categoryId &&categoryId!="undefined"){
        where.push({categoryId})
    }
    if(materialId && materialId!="undefined"){
        where.push({materialId})
    }
    if(welayat&&welayat!="undefined"){
        where.push({welayat})
    }
    return where
}