var express = require("express"); //call express
const app = express();
const port = process.env.PORT || 3005;
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var cors = require("cors");
app.use(cors());

var userAuth = require("./routers/usersRoutes/authRoutes");
var userDetails=require("./routers/usersRoutes/userDetailsRoutes");
app.use("/api/user", userAuth);
app.use("/api/user",userDetails);

app.get("/", (req, res) => {
  res.send(`<h3 >welcome to Backend of GreenFin :${port}</h3>`);
});

app.listen(port, () => {
  console.log(`server is running at port No : ${port}`);
});
