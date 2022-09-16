require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var db = require("../../database");

module.exports.signUp = async (req, res) => {
  const data = req.body;
  if (
    data.name == "" ||
    data.email == "" ||
    data.password == "" ||
    data.name == undefined ||
    data.email == undefined ||
    data.password == undefined
  ) {
    res.status(200).send({ error: "Data is not properFormate" });
  } else {
    var checkemailexist = `select * from usersignup where email = '${data.email}'`;
    const hash = bcrypt.hashSync(data.password, 10);
    var datetime = new Date().toISOString().slice(0, 19).replace("T", " ");
    var query = `insert into usersignup (name,email,password,createdate) value ('${data.name}','${data.email}','${hash}','${datetime}')`;

    db.pool.query(checkemailexist, function (err, rows) {
      if (err) {
        res.status(500).send({ err });
      } else {
        if (rows.length > 0) {
          res.status(200).send({ valid: "Email already Exist!" });
        } else {
          db.pool.query(query, function (err, rowss) {
            if (err) {
              res.status(500).send({ err });
            } else {
              res.status(200).send({ valid: true });
            }
          });
        }
      }
    });
  }
};

module.exports.login = (req, res) => {
  var data = req.body;
  var query = "select * from usersignup where email = '" + data.email + "'";
  db.pool.query(query, function (err, rows) {
    console.log(rows);
    if (err) {
      console.log(err);
      res.status(500).send({ err });
    } else {
      if (rows.length > 0) {
        const result = bcrypt.compareSync(data.password, rows[0].password);
        if (result == true) {
          var resp = {};
          var token = jwt.sign(
            { data: rows[0].id },
            process.env.ACCESS_TOKEN_SECRET
          );

          resp.token = token;
          resp.id = rows[0].id;
          resp.emailId = rows[0].email;

          res.status(200).send({ valid: true, data: resp });
        } else {
          res.status(200).send({ valid: "Wrong UserName Or Password!!" });
        }
      } else {
        res.status(200).send({ valid: "Wrong UserName Or Password!!" });
      }
    }
  });
};
