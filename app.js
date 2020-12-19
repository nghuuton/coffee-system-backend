const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");
require("dotenv").config();

// * Connecton Databse
mongoose
    .connect(
        process.env.ENV === "developer"
            ? process.env.DATABASE_TEST
            : process.env.DATABASE,
        {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    )
    .then(() => {
        console.log("Connection Databse Success");
    })
    .catch(() => {
        console.log("Connection Database False");
    });

// * Create Server
const http = require("http");
const Invoice = require("./models/Invoice");
const DetailInvoice = require("./models/Detail_Invoice");
const Table = require("./models/Table");
const Staff = require("./models/Staff");
const Account = require("./models/Account");
const Comodity = require("./models/Comodity");
const upload = require("./middlewares/uploadFile");
const PORT = process.env.PORT;

// * Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(require("morgan")("dev"));
app.use("/uploads", express.static("uploads"));

// * Route
app.use("/table", require("./routes/table"));
app.use("/product", require("./routes/product"));
app.use("/account", require("./routes/account"));
app.use("/invoice", require("./routes/invoice"));
app.use("/type", require("./routes/type"));
app.use("/comodity", require("./routes/comodity"));
app.use("/supplier", require("./routes/supplier"));
app.use("/invoiceissues", require("./routes/invoiceissues"));
app.use("/user", require("./routes/staff"));

// app.post("/upload", upload.single("xls"), async (req, res, next) => {
//     console.log(req.file);
// });

// * Handler Error
// app.use((req, res, next) => {
//     const error = new Error("Not Found");
//     error.status = 500;
//     next(error);
// });

// app.use((err, req, res, next) => {
//     const error = process.env.ENV === "developer" ? err : {};
//     return res.status(error.status).json(error.message);
// });

// * Start Server
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Sever start on PORT ${PORT}`);
});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

// * Socket IO
let userArray = [];

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await JWT.verify(token, process.env.SECRET);
        socket.userId = payload.sub;
        next();
    } catch (error) {
        next(error);
    }
});

io.on("connection", (socket) => {
    // console.log(`Some one connected: ${socket.id}`);
    userArray[socket.userId] = socket.id;
    console.log(userArray);
    socket.on("JOIN_ROOM", () => {
        socket.join("Bếp");
        console.log("Đã join Room");
        socket.emit("JOIN_ROOM_SUCCESS", "HELLO");
    });

    socket.on("JOIN_ROOM_THUNGAN", () => {
        socket.join("Thungan");
        console.log("Đã join thu ngân");
    });

    socket.on("NOTIFICATION", async (data) => {
        const { userId, products, table, createBy, totalPayment, intoMoney } = data;

        const invoice = await Invoice.findOne({ status: false, ownerTable: table._id });
        const product = products.map((item) => {
            return { quantity: item.quantity, _id: item._id };
        });

        if (invoice) {
            const detailInvoice = await DetailInvoice.findById(invoice.detailInvoice);
            const newProducts = products.map((item, index) => {
                return detailInvoice.product[index] &&
                    detailInvoice.product[index]._id &&
                    detailInvoice.product[index]._id == item._id
                    ? {
                          ...item,
                          quantity: item.quantity - detailInvoice.product[index].quantity,
                      }
                    : { ...item };
            });
            detailInvoice.product = product;
            detailInvoice.totalPayment = totalPayment;
            detailInvoice.intoMoney = intoMoney;
            const newData = {
                userId,
                table,
                createBy,
                totalPayment,
                intoMoney,
                products: newProducts,
            };
            socket.to(`Bếp`).emit("NOTIFICATION_SUCCESS", newData);
            socket.to(`Thungan`).emit("NOTIFICATION_THU_NGAN_HAVE_NEW_TAB");
            return await detailInvoice.save();
        }
        const newDetailInvoice = new DetailInvoice({ product, totalPayment, intoMoney });
        await newDetailInvoice.save();
        await Table.findByIdAndUpdate(table._id, { status: "Đã có người" });
        const newInvoice = new Invoice({
            ownerTable: table._id,
            detailInvoice: newDetailInvoice._id,
            createBy,
        });
        await newInvoice.save();
        socket.to(`Bếp`).emit("NOTIFICATION_SUCCESS", data);
        socket.to(`Thungan`).emit("NOTIFICATION_THU_NGAN_HAVE_NEW_TAB");
    });

    socket.on("SEND_TO_STAFF", (data) => {
        io.sockets
            .to(`${userArray[data.id]}`)
            .emit("LISTEN_NOTIFICATION_FROM_KITCHEN", data.item);
    });

    socket.on("NOTIFICATION_THU_NGAN", (data) => {
        socket.to("Thungan").emit("NOTIFICATION_THU_NGAN_SUCCESS", data);
    });

    socket.on("PAYMENT_SUCCESS", async (data) => {
        const invoice = await Invoice.findOne({
            ownerTable: data.pane.table._id,
            status: false,
        });
        invoice.status = true;
        await invoice.save();
        const detailInvoice = await DetailInvoice.findById(
            invoice.detailInvoice
        ).populate("product._id");
        const { product } = detailInvoice;
        const arrayIdComodity = product.map((item) => item._id.comoditys);
        const quantity = product.map((item) => item.quantity);
        for (let i = 0; i < arrayIdComodity.length; i++) {
            const result = await Comodity.find({
                _id: { $in: arrayIdComodity[i] },
            }).populate("unit");
            for (const item of result) {
                item.quantity = item.quantity - quantity[i] / item.unit.unit;
                await item.save();
            }
        }
        await Table.findByIdAndUpdate(invoice.ownerTable, {
            status: "Trống",
        });
        io.sockets.to(`${userArray[data.userId]}`).emit("LISTEN_FROM_THU_NGAN", data);
    });

    socket.on("disconnect", () => {
        console.log(`Some one disconected ${socket.userId}`);
    });
});

// const newAccount = new Account({
//     email: "admin@gmail.com",
//     password: "123456",
//     type: 0,
// });

// newAccount.save();

// const newStaff = new Staff({
//     firstname: "Rovice",
//     lastname: "Coffee",
//     birthday: new Date("1998-07-25"),
//     sex: true,
//     account: "5fd62853ae6e3102ec100bd2",
// });

// newStaff.save();

// const test = async () => {

// };

// test();
