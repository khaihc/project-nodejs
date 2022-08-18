const multer = require('multer');
const express = require("express");

const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const User = require("../Models/user");
const {addUserValidation,loginValidation} = require("../validate/user.validate")

//Home
module.exports.home = function (req, res, next) {
    res.render("home");
}

//Login
module.exports.login = function (req, res, next) {
    res.render("login");
}
//Handling Login
module.exports.handlingLogin = async (req, res) => {
    //LETS VALIDATE THE DATA BEFORE WE A USER
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the email exists
    const user = await User.findOne({
        Username: req.body.txtUsername
    });
    if (!user) return res.status(400).send('Username is not found');
    //PASSWORD IS CORRECT
    const validate = await bcrypt.compare(req.body.txtPassword, user.Password);
    if (!validate) return res.status(400).send('Invalid password');

    //Create and assign a token
    const payload = {
        Username: req.body.txtUsername,
        Password: req.body.txtPassword
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    pushToken.push(token);
    return res.redirect("./list");
};

module.exports.logout = function (req, res, next) {
    while (pushToken.length > 0) {
        pushToken.pop();
    }
    res.redirect('./login');
};

//List
module.exports.listUser = function (req, res, next) {
    User.find(function (err, data) {
        if (err) {
            res.json({
                "error": true,
                "errMsg": err
            })
        } else {
            verify(req, res, next);
            res.render("list", {
                result: data
            });
        }
    });
}

//Add
let pushHashPass;
module.exports.addRender = function (req, res, next) {
    res.render("add");
}
module.exports.addUser = function (req, res, next) {
    // res.json({haaa: "add"});
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.json({
                "error": true,
                "errMsg": "A Multer error occurred when uploading."
            })
        } else if (err) {
            res.json({
                "error": true,
                "errMsg": "An unknown error occurred when uploading." + err
            })
        } else {
            console.log("Upload is okay");
            //Hash passwords
            const slat = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.txtPassword, slat);
            console.log("pushHash Pass: ", pushHashPass);
            
            const user = User({
                Username: req.body.txtUsername,
                Email: req.body.txtEmail,
                Password: hashedPassword,
                Image: req.file.filename,
            })
            user.save(function (err) {
                if (err) {
                    console.log('err: ', err)
                    res.json({
                        "error": true,
                        "errMsg": err
                    });
                } else {
                    // res.json({"success": 'Save Successfully '});
                    res.redirect("./list");
                }
            });
        }
    });
}

//Edit
module.exports.editRender = function (req, res, next) {
    User.findById(req.params.id, function (err, char) {
        if (err) {
            res.json({
                "error": true,
                "errMsg": err
            })
        } else {
            console.log(char);
            res.render("edit", {
                result: char
            });
        }
    })
}
module.exports.editUser = function (req, res, next) {
    upload(req, res, function (err) {

        if (!req.file) {
            User.updateOne({
                _id: req.body.IDChar
            }, {
                Username: req.body.txtUsername,
                Email: req.body.txtEmail,
                Password: req.body.txtPassword
            }, function (err, data) {
                if (err) {
                    res.json({
                        "error": true,
                        "errMsg": err
                    })
                } else {
                    res.redirect("./list");
                }
            })
        } else {
            if (err instanceof multer.MulterError) {
                res.json({
                    "error": true,
                    "errMsg": "A Multer error occurred when uploading."
                })
            } else if (err) {
                res.json({
                    "error": true,
                    "errMsg": "An unknown error occurred when uploading." + err
                })
            } else {
                User.updateOne({
                    _id: req.body.IDChar
                }, {
                    Username: req.body.txtUsername,
                    Email: req.body.txtEmail,
                    Password: req.body.txtPassword,
                    Image: req.file.filename
                }, function (err, data) {
                    if (err) {
                        res.json({
                            "error": true,
                            "errMsg": err
                        })
                    } else {
                        res.redirect("./list");
                    }
                })
            }
        }
    });
}

//Deleted
module.exports.deleteUser = function (req, res, next) {
    User.deleteOne({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            res.json({
                "error": true,
                "errMsg": err
            })
        } else {
            res.redirect("../list");
        }
    });
}

//Images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/bmp" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/gif") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("userImage");


let pushToken = [];
function verify(req, res, next){
    const token = pushToken.toString();
    console.log('----token: ', token)
    if(!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}