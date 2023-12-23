const { Etraps } = require("../../models")
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
exports.addEtrap = catchAsync(async(req, res, next) => {
    const size = await Etraps.create(req.body)
    return res.status(201).send(size)
})
exports.editEtrap = catchAsync(async(req, res, next) => {
    const size = await Etraps.findOne({ where: { id: [req.params.id] } });

    if (!size)
        return next(new AppError('Size did not found with that ID', 404));
    await size.update(req.body);

    return res.status(200).send(size);
});
exports.deleteEtrap = catchAsync(async(req, res, next) => {
    const size = await Etraps.findOne({ where: { id: req.params.id } })
    if (!size) return next(new AppError("Size not found", 404))
    await size.destroy()
    return res.status(200).send({ msg: "Sucess" })
})