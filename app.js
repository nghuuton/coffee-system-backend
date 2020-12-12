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
const PORT = process.env.PORT;

// * Middleware
app.use(bodyParser.json());
app.use(cors());

// * Route
app.use("/table", require("./routes/table"));
app.use("/product", require("./routes/product"));
app.use("/account", require("./routes/account"));
app.use("/invoice", require("./routes/invoice"));

// * Handler Error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 500;
    next(error);
});

app.use((err, req, res, next) => {
    const error = process.env.ENV === "developer" ? err : {};
    return res.status(error.status).json(error.message);
});

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

    socket.on("NOTIFICATION", async (data) => {
        const { id, products, table, createBy, totalPayment, intoMoney } = data;
        io.sockets.in(`Bếp`).emit("NOTIFICATION_SUCCESS", data);

        const product = products.map((item) => {
            return { quantity: item.quantity, _id: item._id };
        });
        const invoice = await Invoice.findOne({ status: false, ownerTable: table._id });
        if (invoice) {
            const detailInvoice = await DetailInvoice.findById(invoice.detailInvoice);
            (detailInvoice.product = product),
                (detailInvoice.totalPayment = totalPayment);
            detailInvoice.intoMoney = intoMoney;
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
    });

    socket.on("SEND_TO_STAFF", (data) => {
        io.sockets
            .to(`${userArray[data.id]}`)
            .emit("LISTEN_NOTIFICATION_FROM_KITCHEN", data.item);
    });

    socket.on("disconnect", () => {
        console.log(`Some one disconected ${socket.userId}`);
    });
});
