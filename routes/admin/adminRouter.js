const express = require('express')
const router = express.Router()
const { login, protect, updateMe, sendMe, getTime, changeTime,forgotPassword, uploadAdminImage,verify_code_forgotten,checkCode} = require("../../controllers/admin/adminControllers")
const { getStats } = require('../../controllers/admin/ordersControllers')
router.post("/login", login)
router.post("/edit", protect, updateMe)
router.get("/get-me", protect, sendMe)
router.get("/time", getTime)
router.post("/time", changeTime)
router.post("/upload-image",uploadAdminImage)
router.post("/check-code",checkCode)
router.get("/stats",getStats)
router.patch('/forgot-password', verify_code_forgotten, forgotPassword);
router.use("/banners", require("./routes/bannersRouter")) //test edildi
router.use("/blogs",require("./routes/blogsRouter"))
router.use("/colors",protect,require("./routes/colorRouter"))
router.use("/sizes",require("./routes/sizesRouter"))
router.use("/etraps",require("./routes/etrapRouter"))
router.use('/categories', require('./routes/categoriesRouter')); //delete test etmeli
router.use("/products", require("./routes/productsRouter")) //test etmeli
router.use("/orders", require("./routes/ordersRouter"))
router.use("/materials",require("./routes/materialRouter"))
router.use("/users", protect, require("./routes/usersRouter"))
router.use("/seller", require("./routes/sellerRouter")) 
router.use("/mails",require("./routes/mailRouter"))
router.use("/notifications",require("./routes/notificationRouter"))
router.use("/comments",require("./routes/commentsRouter"))
module.exports = router