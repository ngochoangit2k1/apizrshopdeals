const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const unless = require("express-unless");
const bodyParser = require("body-parser");
const path = require("path");
const config = require("./config/config");
const cookieSession = require("cookie-session");
const auth = require("./middlewares/auth");
const accessCors = require("./middlewares/constant");
// const swaggerUi = require('swagger-ui-express');
// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// const { Cors } = require('./middlewares/cors');
const corsOptions = {
  // origin: [
  //   config.CLIENT_URL,
  //   "http://127.0.0.1:3000",
  //   "http://localhost:3000",
  //   "http://localhost:8080"
  //   ,
  // ],
  origin:"*",
  credentials: true,
};
// const swaggerDocument = require('./api/swagger.json')
// app.use("/test-api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
// AUTH VERIFICATION AND UNLESS
auth.verifyToken.unless = unless;

app.use(
  session({
    secret: config.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/user", require("./routes/user.routes"));

app.use("/api/v1/contact", require("./routes/contact.routes"));
app.use("/api/v1/message", require("./routes/message.routes"));
app.use("/api/v1/category", require("./routes/category.routes"));
app.use("/api/v1/brand", require("./routes/brand.routes"));
app.use("/api/v1/order", require("./routes/order.routes"));
app.use("/api/v1/payment", require("./routes/payment.routes"));
app.use("/api/v1/wallet", require("./routes/wallet.routes"));
app.use("/api/v1/random", require("./routes/randomOrder.routes"));
app.use("/api/v1/payment-admin", require("./routes/paymentAdmin.routes"));

app.use(
  "/api/v1/config-transition",
  require("./routes/configTransition.routes")
);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my API shopping" });
});

module.exports = app;
