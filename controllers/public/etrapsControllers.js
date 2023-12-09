const { Etraps } = require("../../models")
const catchAsync = require('../../utils/catchAsync');

exports.getAllEtraps = catchAsync(async(req, res, next) => {
    const limit=req.query.limit || 20
    const offset=req.query.offset ||0
    let data={
        ashgabat:{},
        ahal:{},
        mary:{},
        lebap:{},
        dashoguz:{},
        balkan:{},
    }
    data.ashgabat = await Etraps.findAll({
        where:{welayat:"ashgabat"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    data.ahal = await Etraps.findAll({
        where:{welayat:"ahal"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    data.mary = await Etraps.findAll({
        where:{welayat:"mary"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    data.lebap = await Etraps.findAll({
        where:{welayat:"lebap"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    data.dashoguz = await Etraps.findAll({
        where:{welayat:"dashoguz"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    data.balkan = await Etraps.findAll({
        where:{welayat:"balkan"},
        order: [
            ["createdAt", "DESC"]
        ]
    })
    const count=await Etraps.count()
    return res.status(201).send({data,count})
})