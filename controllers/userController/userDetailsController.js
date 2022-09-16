require("dotenv").config();
const jwt = require("jsonwebtoken");
var db = require("../../database");
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/data")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+'-'+file.originalname)
  }
})

module.exports.upload = multer({ storage: storage })

module.exports.userDetails = async (req, res) => {
  console.log(req.files);
  const data=req.body;
  console.log(req.user.data)
  const userId=req.user.data;
  const date=req.user.iat;
  var query = `insert into userdetails (userid,profileurl,phoneno,title,dob,texresidence,countryresidence,citizenship,address1,address2,city,zip,createon) value ('${userId}','${data.profileurl}','${data.phoneno}','${data.title}','${data.dob}','${data.texresidence}','${data.countryresidence}','${data.citizenship}','${data.address1}','${data.address2}','${data.city}','${data.zip}','${date}')`;
  var query2=`INSERT INTO userroles (userid, roles, documents, checkinformation, date) value ('${userId}','${data.roles}','${data.documents}','${data.checkinformation}','${date}')`;
  db.pool.query(query, function (err, rows) {
    if (err) {
      res.status(500).send({ err });
    } else { 
        db.pool.query(query2, function (err, rows) {
          if (err) {
            res.status(500).send({ err });
          } else {
            res.status(200).send({ valid: true });
          }
        });
    }
  });
};

module.exports.authenticateToken=(req,res,next)=>{
  const authHeader=req.headers['authorization']
  const token=authHeader && authHeader.split(' ')[1]
  if(token==null) return res.sendStatus(401)
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
    if(err) return res.sendStatus(403)
    req.user=user
    next()
  })
}
module.exports.fileuploader=(req,res)=>{
  console.log(req.files)
}
