const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require('multer');
const path = require('path');
const config = require("../../config");
var midway = require('./midway');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const { equal } = require("assert");
const { Console } = require("console");
const { json } = require("body-parser");
const nodemailer = require('nodemailer');
var handlebars = require("handlebars");
const fs = require('fs');
// const today = new Date();
// const utcMonth = today.getUTCMonth();


router.post("/SaveServicesList", (req, res, next) => {
    db.executeSql("INSERT INTO `serviceslist`(`name`, `price`, `time`, `point`, `isactive`, `createdate`,`epoint`)VALUES('" + req.body.name + "'," + req.body.price + "," + req.body.time + "," + req.body.point + ",true,CURRENT_TIMESTAMP," + req.body.epoint + ");", function(data, err) {
        if (err) {
            res.json("error");
        } else {

            return res.json(data);
        }
    });
});
router.post("/SaveSalaryList", (req, res, next) => {
    db.executeSql("INSERT INTO `salary`(`salary`, `desc`, `paiddate`, `empid`)VALUES(" + req.body.salary + " , '" + req.body.desc + "' , '" + req.body.paiddate + "' ," + req.body.empid + ");", function(data, err) {
        if (err) {
            res.json("error");
        } else {

            return res.json(data);
        }
    });
});

router.get("/GetAllServices", (req, res, next) => {
    db.executeSql("select * from serviceslist", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/UpdateServicesList", (req, res, next) => {
    db.executeSql("UPDATE  `serviceslist` SET name='" + req.body.name + "',price=" + req.body.price + ",time=" + req.body.time + ",point=" + req.body.point + ",epoint=" + req.body.epoint + ",updateddate=CURRENT_TIMESTAMP WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.post("/UpdateSalaryList", (req, res, next) => {
    db.executeSql("UPDATE `salary` SET `salary`= " + req.body.salary + " ,`desc`='" + req.body.desc + "',`paiddate`='" + req.body.paiddate + "' WHERE id= " + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.post("/RemoveSalaryList", (req, res, next) => {

    console.log(req.body);
    db.executeSql("Delete from salary where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/SaveEmployeeList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `employee`(`fname`,`lname`,`contact`,`whatsapp`,`address`,`city`,`pincode`,`gender`,`isactive`,`createddate`)VALUES('" + req.body.fname + "','" + req.body.lname + "','" + req.body.contact + "','" + req.body.whatsapp + "','" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + ",'" + req.body.gender + "'," + req.body.isactive + ",CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            console.log(req.body.service.length)
            for (let i = 0; i < req.body.service.length; i++) {
                console.log(req.body.service[i]);
                db.executeSql("INSERT INTO `empservices`(`servicesid`,`servicesname`,`empid`) VALUES(" + req.body.service[i].servicesId + ",'" + req.body.service[i].servicesName + "'," + data.insertId + ");", function(data1, err) {
                    if (err) {
                        console.log(err);

                    } else {

                    }
                });

            }
            return res.json('success');
        }
    });
});

// router.get("/GetAllEmployee", (req, res, next) => {
//     db.executeSql("select e.id,e.fname,e.lname,e.contact,e.whatsapp,e.address,e.city,e.pincode,e.gender,e.isactive,e.createddate,e.updateddate,s.servicesid,s.servicesname from employee e join empservices s on e.id=s.empid", function (data, err) {
//         if (err) {
//             console.log(err);
//         } else {
//             return res.json(data);
//         }
//     })
// });
router.get("/GetAllEmployee", (req, res, next) => {
    db.executeSql("select * from employee where isactive=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/GetEmployeeService", (req, res, next) => {
    db.executeSql("select * from empservices", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/RemoveEmployeeList", (req, res, next) => {

    console.log(req.body);
    db.executeSql("update `employee` set isactive='0' where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetAllSalaryList", (req, res, next) => {
    console.log(req.body);
    db.executeSql("select s.id,s.salary,s.desc,s.paiddate,s.empid,e.id as eId,e.fname,e.lname,e.contact,e.whatsapp,e.address,e.city,e.pincode,e.gender from salary s join employee e on s.empid=e.id where s.empid=" + req.body.id, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/UpdateEmployeeList", (req, res, next) => {
    db.executeSql("UPDATE `employee` SET fname='" + req.body.fname + "',lname='" + req.body.lname + "',contact='" + req.body.contact + "',whatsapp='" + req.body.whatsapp + "',address='" + req.body.address + "',city='" + req.body.city + "',gender='" + req.body.gender + "',updateddate=CURRENT_TIMESTAMP WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/SaveCustomerList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `customer`(`fname`,`lname`,`email`,`contact`,`whatsapp`,`gender`,`createddate`,`address`,`vip`)VALUES('" + req.body.fname + "','" + req.body.lname + "','" + req.body.email + "','" + req.body.contact + "','" + req.body.whatsapp + "','" + req.body.gender + "',CURRENT_TIMESTAMP,'" + req.body.address + "'," + req.body.vip + ");", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            return res.json('success');
        }
    });
});


router.get("/GetAllCustomer", (req, res, next) => {
    db.executeSql("select * from customer", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/GetAllOffer", (req, res, next) => {
    db.executeSql("select * from offer", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/SaveOfferList", (req, res, next) => {
    console.log(req.body)

    db.executeSql("INSERT INTO `offer`(`offername`,`totalprice`,`offerprice`,`percentage`)VALUES('" + req.body.offername + "'," + req.body.totalprice + "," + req.body.offerprice + "," + req.body.percentage + ");", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < req.body.services.length; i++) {
                db.executeSql("INSERT INTO `offerservices`(`offerid`,`servicesname`,`totalprice`,`offername`,`offerprice`) VALUES(" + data.insertId + ",'" + req.body.services[i].selectedServ + "'," + req.body.totalprice + ",'" + req.body.offername + "'," + req.body.offerprice + ");", function(data1, err) {
                    if (err) {
                        console.log(err);
                    } else {}
                });
            }
        }
        return res.json('success');
    });

});
// router.post("/GetUsedServicesByOffer", (req, res, next) => {

//     db.executeSql("select s.offerid,s.servicesname,s.offername,s.,s.offerprice,sl.id as slId,sl.totalprice,sl.time,sl.point from offerservices s join serviceslist sl on s.servicesid=sl.id where s.appointmentid = " + req.body.id + "", function (data, err) {
//         if (err) {
//             console.log("Error in store.js", err);
//         } else {
//             return res.json(data);
//         }
//     });
// })
router.post("/GetUsedServicesByOffer", (req, res, next) => {

    db.executeSql("select s.offerid,s.servicesname,s.offername,s.offerprice,sl.id as slId,sl.offerid,sl.servicesname,sl.offername,sl.offerprice from offerservices s join serviceslist sl on s.servicesid=sl.id where s.offerappointmentid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.get("/removeOfferDetails/:id", (req, res, next) => {

    db.executeSql("Delete from offer where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/getAllOfferDataList", (req, res, next) => {

    db.executeSql("select * from offerappointment where offerid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.post("/getAllMembershipDataList", (req, res, next) => {

    db.executeSql("select * from membershipappointment where membershipid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.post("/SaveMembershipList", (req, res, next) => {
    console.log(req.body)

    db.executeSql("INSERT INTO `membership`(`membershipname`,`membershipprice`,`totalprice`,`quantity`,`finalprice`)VALUES('" + req.body.membershipname + "'," + req.body.membershipprice + "," + req.body.totalprice + "," + req.body.quantity + "," + req.body.finalprice + ");", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < req.body.services.length; i++) {
                db.executeSql("INSERT INTO `membershipservices`(`membershipid`,`servicesname`,`totalprice`,`membershipname`,`membershipprice`,`finalprice`) VALUES(" + data.insertId + ",'" + req.body.services[i].selectedServ + "'," + req.body.totalprice + ",'" + req.body.membershipname + "'," + req.body.membershipprice + "," + req.body.finalprice + ");", function(data1, err) {
                    if (err) {
                        console.log(err);
                    } else {}
                });
            }
        }
        return res.json('success');
    });
});
router.post("/GetUsedServicesByMembership", (req, res, next) => {

    db.executeSql("select s.membershipid,s.servicesname,s.totalprice,s.membershipname,s.membershipprice,finalprice,sl.id as slId,sl.membershipid,sl.servicesname,sl.totalprice,sl.membershipname,sl.membershipprice,sl.finalprice from membershipservices s join serviceslist sl on s.servicesid=sl.id where s.membershipappointmentid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.get("/removeMembershipDetails/:id", (req, res, next) => {

    db.executeSql("Delete from membership where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})
router.get("/GetAllMembership", (req, res, next) => {
    db.executeSql("select * from membership", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/SaveAppointmentList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `appointment`(`custid`, `empname`, `totalprice`, `totalpoint`, `totaltime`, `isactive`, `createddate`,`ispayment`)VALUES(" + req.body.custid + ",'" + req.body.emp + "','" + req.body.totalprice + "','" + req.body.totalpoint + "','" + req.body.totaltime + "'," + req.body.isactive + ",CURRENT_TIMESTAMP,false);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < req.body.selectedService.length; i++) {
                db.executeSql("INSERT INTO `custservices`(`servicesid`,`servicesname`,`custid`,`appointmentid`,`employeename`,`empid`) VALUES(" + req.body.selectedService[i].selectedServid + ",'" + req.body.selectedService[i].selectedServ + "'," + req.body.custid + "," + data.insertId + ",'" + req.body.selectedService[i].selectedEmp + "'," + req.body.selectedService[i].selectedEmpid + ");", function(data1, err) {
                    if (err) {
                        console.log(err);
                    } else {}
                });
            }
            if (req.body.tCustPoint == 0) {
                console.log('undefined');

                db.executeSql("INSERT INTO `point`( `custid`, `totalcustpoint`)VALUES(" + req.body.custid + "," + req.body.lessPoints + ");", function(data, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            } else {
                console.log('defined')
                console.log(req.body)
                db.executeSql("UPDATE `point` SET totalcustpoint=" + req.body.lessPoints + " WHERE custid=" + req.body.custid + ";", function(data, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            }

        }
        return res.json('success');
    });
});


router.get("/GetAllAppointment", (req, res, next) => {
    db.executeSql("select a.id,a.custid,a.empname,a.totalprice,a.totalpoint,a.totaltime,a.isactive,a.createddate,a.updatedate,c.id as cId,c.fname,c.lname,c.email,c.contact,c.whatsapp,c.gender from appointment a join customer c on a.custid=c.id where isactive=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/ChackForPassword", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.pass;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from users where userid=" + req.body.id + " and password='" + encPassword + "'", function(data, err) {
        if (err) {

            console.log(err);
        } else {
            console.log(data);
            return res.json(data)
        }
    })
})

// router.post("/updatePasswordAccordingRole", (req, res, next) => {
//     console.log(req.body)
//     var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
//     var repass = salt + '' + req.body.password;
//     var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
//     if (req.body.role == 'Admin') {
//         db.executeSql("UPDATE  `admin` SET password='" + encPassword + "' WHERE id=" + req.body.id + ";", function(data, err) {
//             if (err) {
//                 console.log("Error in store.js", err);
//             } else {
//                 return res.json(data);
//             }
//         });
//     }
// });


router.get("/GetAllEnquiryList", (req, res, next) => {
    db.executeSql("select * from enquiry", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/UpdateSalaryStatus", (req, res, next) => {
    db.executeSql("UPDATE  `salary` SET status=" + req.body.status + " WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

var nowDate = new Date();
date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
router.get("/GetDailyTotal", (req, res, next) => {
    db.executeSql("select * from appointment where createddate='" + date + "' and ispayment=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {

            return res.json(data);
        }
    })
});

router.get("/GetMonthlyTotal", (req, res, next) => {
    db.executeSql("select * from appointment where  DATE_FORMAT(createddate, '%m') = DATE_FORMAT(CURRENT_TIMESTAMP, '%m') and ispayment=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});


router.post("/UpdateCustomerList", (req, res, next) => {
    db.executeSql("UPDATE  `customer` SET fname='" + req.body.fname + "',lname='" + req.body.lname + "',email='" + req.body.email + "',contact='" + req.body.contact + "',whatsapp='" + req.body.whatsapp + "',gender='" + req.body.gender + "',vip=" + req.body.vip + ",updateddate=CURRENT_TIMESTAMP,address='" + req.body.address + "' WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})



router.get("/removeCustomerDetails/:id", (req, res, next) => {

    db.executeSql("Delete from customer where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/RemoveServicesList/:id", (req, res, next) => {

    db.executeSql("Delete from serviceslist where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

function mail(filename, data, toemail, subj, mailname) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        auth: {
            user: 'parthmangukiya1208@gmail.com',
            pass: 'agdxstnosmksfiky'
        },
    });
    const filePath = 'src/assets/emailtemplets/' + filename;
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = data;
    const htmlToSend = template(replacements);

    const mailOptions = {
        from: `"parthmangukiya1208@gmail.com"`,
        subject: subj,
        to: toemail,
        Name: mailname,
        html: htmlToSend,
        attachments: [{
            filename: '8ef701a9-e74c-41f7-a851-2fe09139a836.png',
            path: 'src/assets/img/8ef701a9-e74c-41f7-a851-2fe09139a836.png',
            cid: 'web-logo'
        }, {
            filename: 'boucher-img.jpg',
            path: 'src/assets/img/boucher-img.jpg',
            cid: 'boucher-img'
        }, {
            filename: 'check-icon.png',
            path: 'src/assets/img/check-icon.png',
            cid: 'check-icon'
        }, {
            filename: 'facebook2x.png',
            path: 'src/assets/img/facebook2x.png',
            cid: 'facebook'
        }, {
            filename: 'instagram2x.png',
            path: 'src/assets/img/instagram2x.png',
            cid: 'instagram'
        }, {
            filename: 'pinterest2x.png',
            path: 'src/assets/img/pinterest2x.png',
            cid: 'pinterest'
        }, {
            filename: 'whatsapp2x.png',
            path: 'src/assets/img/whatsapp2x.png',
            cid: 'whatsapp'
        }, {
            filename: 'youtube2x.png',
            path: 'src/assets/img/youtube2x.png',
            cid: 'youtube'
        }, {
            filename: 'sad-icon.png',
            path: 'src/assets/img/sad-icon.png',
            cid: 'sad-icon'
        }, {
            filename: 'bell-icon.png',
            path: 'src/assets/img/bell-icon.png',
            cid: 'bell-icon'
        }, {
            filename: 'reminder-img.png',
            path: 'src/assets/img/reminder-img.png',
            cid: 'reminder-img'
        }, {
            filename: 'cover-img-0.png',
            path: 'src/assets/img/cover-img-0.png',
            cid: 'cover-img'
        }, {
            filename: 'cover-img-002.png',
            path: 'src/assets/img/cover-img-002.png',
            cid: 'cover-img2'
        }]

    };
    transporter.sendMail(mailOptions, function(error, info) {
        console.log('fgfjfj')
        if (error) {
            console.log(error);
            res.json("Errror");
        } else {
            console.log('Email sent: ' + info.response);
            res.json(data);
        }
    });
}


router.post("/ForgotPassword", (req, res, next) => {
    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log(req.body);
    db.executeSql("select * from users where email='" + req.body.email + "';", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
            return res.json('err');
        } else {
            console.log(data[0]);
            db.executeSql("INSERT INTO `otp`(`userid`, `otp`, `createddate`, `createdtime`,`role`,`isactive`) VALUES (" + data[0].userid + "," + otp + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'" + data[0].role + "',true)", function(data1, err) {
                if (err) {
                    console.log(err);
                } else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: 'ptlshubham@gmail.com', // generated ethereal user
                            pass: 'qrrimzmxjcpabunj', // generated ethereal password
                        },
                    });
                    const output = `
                    <h3>One Time Password</h3>
                    <p>To authenticate, please use the following One Time Password(OTP):<h3>` + otp + `</h3></p>
                    <p>OTP valid for only 2 Minutes.</P>
                    <p>Don't share this OTP with anyone.</p>
                    <a href="http://localhost:4200/password">Change Password</a>
`;
                    const mailOptions = {
                        from: '"KerYar" <ptlshubham@gmail.com>',
                        subject: "Password resetting",
                        to: req.body.email,
                        Name: '',
                        html: output

                    };
                    mail('verification.html', replacements, req.body.email, "Password resetting", " ")
                }
            })

        }
    });
});

router.post("/GetOneTimePassword", (req, res, next) => {
    console.log(req.body)
    db.executeSql("select * from otp where userid = '" + req.body.id + "' " + " and otp =' " + req.body.otp + "' ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});
// router.post("/ChackForPassword", midway.checkToken, (req, res, next) => {
//     var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
//     var repass = salt + '' + req.body.pass;
//     var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
//     db.executeSql("select * from users where userid=" + req.body.id + " and password='" + encPassword + "'", function(data, err) {
//         if (err) {
//             console.log(err);
//         } else {
//             return res.json(data)
//         }
//     })
// })

router.post("/UpdatePassword", (req, res, next) => {
    console.log(req.body);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("UPDATE users SET password='" + encPassword + "' WHERE userid=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            console.log("shsyuhgsuygdyusgdyus", data);
            return res.json(data);
        }
    });
});


router.post("/UpdateActiveStatus", (req, res, next) => {
    db.executeSql("UPDATE  `appointment` SET isactive=" + req.body.isactive + ", updatedate=CURRENT_TIMESTAMP,ispayment=true WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetViewAppointment", (req, res, next) => {
    db.executeSql("select * from appointment where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateEnquiryStatus", (req, res, next) => {
    db.executeSql("UPDATE  `enquiry` SET isactive=" + req.body.isactive + " WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})


router.post("/GetCustomerTotalPoints", (req, res, next) => {
    db.executeSql("select * from point where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetAllCustomerDataList", (req, res, next) => {

    db.executeSql("select * from appointment where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetUsedServicesByCustomer", (req, res, next) => {

    db.executeSql("select s.servicesid,s.servicesname,s.custid,s.appointmentid,s.employeename,s.empid,sl.id as slId,sl.price,sl.time,sl.point from custservices s join serviceslist sl on s.servicesid=sl.id where s.appointmentid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

router.get("/GetAllCompletedServices", (req, res, next) => {
    db.executeSql("select a.id,a.custid,a.empname,a.totalprice,a.totalpoint,a.totaltime,a.isactive,a.createddate,a.updatedate,c.id as cId,c.fname,c.lname,c.email,c.contact,c.whatsapp,c.gender from appointment a join customer c on a.custid=c.id where a.isactive=false and a.createddate='" + today + "'", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/SaveModeOfPayment", (req, res, next) => {
    db.executeSql("INSERT INTO `payment`(`cid`, `appointmentid`, `cname`, `modeofpayment`, `tprice`, `tpoint`, `pdate`,`createddate`) VALUES (" + req.body.cid + "," + req.body.appointmentid + ",'" + req.body.cname + "','" + req.body.modeofpayment + "'," + req.body.tprice + "," + req.body.tpoint + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            res.json("error");
        } else {

            return res.json("success");
        }
    });
});

router.get("/GetAllModeOfPayment", (req, res, next) => {
    db.executeSql("select * from payment where pdate ='" + today + "' ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/GetMonthlyPayment", (req, res, next) => {
    db.executeSql("select * from payment ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})


router.post("/SaveExpensesList", (req, res, next) => {
    db.executeSql("INSERT INTO expenses (expensesdate, expensesname, expensesprices, employeename, paymenttype) VALUES ('" + req.body.expensesdate + "','" + req.body.expensesname + "','" + req.body.expensesprices + "','" + req.body.employeename + "','" + req.body.paymenttype + "');", function(data, err) {
        console.log(req.body.expensesdate, " , ", req.body.expensesdate);
        if (err) {
            res.json("error");
        } else {

            return res.json(data);
        }
    });
});

router.get("/GetAllExpenses", (req, res, next) => {
    db.executeSql("select * from expenses", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/RemoveExpensesDetails", (req, res, next) => {
    db.executeSql("Delete from expenses where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateExpensesDetails", (req, res, next) => {
    var newdate = new Date(req.body.expensesdate).getDate() + 1;
    var newMonth = new Date(req.body.expensesdate).getMonth();
    var newyear = new Date(req.body.expensesdate).getFullYear();
    var querydate = new Date(newyear, newMonth, newdate)
    db.executeSql("UPDATE expenses SET expensesdate='" + querydate.toISOString() + "',expensesname='" + req.body.expensesname + "',expensesprices='" + req.body.expensesprices + "',employeename='" + req.body.employeename + "',paymenttype='" + req.body.paymenttype + "' WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/getMonthlyExpensesList", (req, res, next) => {
    db.executeSql("select * from expenses where  DATE_FORMAT(expensesdate, '%m') = DATE_FORMAT(CURRENT_TIMESTAMP, '%m')", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/UpdateCategoryList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("UPDATE `category` SET name='" + req.body.name + "' where id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.post("/SaveCategoryList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `category`( `name`, `isactive`, `createddate`) VALUES ('" + req.body.name + "',true,CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            return res.json('success');
        }
    });
});
router.get("/RemoveCategoryDetails/:id", (req, res, next) => {
    console.log(req.params.id)
    db.executeSql("Delete from category where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.get("/GetAllCategoryList", (req, res, next) => {
    db.executeSql("select * from category", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/SaveProductsListURL", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `products`(`name`, `image`, `category`, `price`, `quantity`, `purchasedate`, `vendorname`, `vendorcontact`, `descripition`, `isactive`, `createddate`, `updateddate`,`display`) VALUES ('" + req.body.name + "','" + req.body.image + "','" + req.body.category + "','" + req.body.price + "','" + req.body.quantity + "','" + req.body.purchasedate + "','" + req.body.vendorname + "','" + req.body.vendorcontact + "','" + req.body.descripition + "',true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP," + req.body.display + ");", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < req.body.multi.length; i++) {
                db.executeSql("INSERT INTO `images`(`productid`,`catid`,`listimages`,`createddate`)VALUES(" + data.insertId + ",1,'" + req.body.multi[i] + "',CURRENT_TIMESTAMP);", function(data, err) {
                    if (err) {
                        console.log("Error in store.js", err);
                    } else {}
                });
            }
        }
    });
    return res.json('success');

});
router.get("/GetAllProductsListURL", (req, res, next) => {
    db.executeSql("select * from products where display= true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/RemoveProductDetailsURL/:id", (req, res, next) => {

    db.executeSql("Delete from products where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.post("/UploadProductImage", (req, res, next) => {
    var imgname = generateUUID();

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images/products');
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {

            cb(null, imgname + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage }).single('file');
    upload(req, res, function(err) {
        console.log("path=", config.url + 'images/products/' + req.file.filename);

        if (req.fileValidationError) {
            console.log("err1", req.fileValidationError);
            return res.json("err1", req.fileValidationError);
        } else if (!req.file) {
            console.log('Please select an image to upload');
            return res.json('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            console.log("err3");
            return res.json("err3", err);
        } else if (err) {
            console.log("err4");
            return res.json("err4", err);
        }
        return res.json('/images/products/' + req.file.filename);

        console.log("You have uploaded this image");
    });
});

router.post("/UploadMultiProductImage", (req, res, next) => {
    var imgname = generateUUID();

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images/listimages');
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {

            cb(null, imgname + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage }).single('file');
    upload(req, res, function(err) {
        console.log("path=", config.url + '/images/listimages/' + req.file.filename);

        if (req.fileValidationError) {
            console.log("err1", req.fileValidationError);
            return res.json("err1", req.fileValidationError);
        } else if (!req.file) {
            console.log('Please select an image to upload');
            return res.json('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            console.log("err3");
            return res.json("err3", err);
        } else if (err) {
            console.log("err4");
            return res.json("err4", err);
        }
        return res.json('/images/listimages/' + req.file.filename);
        console.log("You have uploaded this image");
    });
});

router.get("/RemoveRecentUoloadImage", midway.checkToken, (req, res, next) => {
    console.log(req.body);
    db.executeSql("SELECT * FROM images ORDER BY createddate DESC LIMIT 1", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateProductList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("UPDATE `products` SET name='" + req.body.name + "',descripition='" + req.body.descripition + "',category='" + req.body.category + "',purchasedate='" + req.body.purchasedate + "',quantity=" + req.body.quantity + ",price=" + req.body.price + ",display=" + req.body.display + " where id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})
router.post("/Verification", (req, res, next) => {
    let otp = Math.floor(100000 + Math.random() * 900000);
    db.executeSql("INSERT INTO `registerotp`(`email`, `otp`, `isactive`,`createdate`,`updateddate`) VALUES ('" + req.body.email + "'," + otp + ",true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)", function (data1, err) {
        if (err) {
            console.log(err);
        } else {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com",
                port: 465,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'ptlshubham@gmail.com', // generated ethereal user
                    pass: 'qrrimzmxjcpabunj', // generated ethereal password
                },
            });
            const output = `
                        <h3>One Time Password</h3>
                        <p>To authenticate, please use the following One Time Password(OTP):<h3>` + otp + `</h3></p>
                        <p>OTP valid for only 2 Minutes.</P>
                        <p>Don't share this OTP with anyone.</p>
`;
            const mailOptions = {
                from: '"KerYar" <ptlshubham@gmail.com>',
                subject: "Password resetting",
                to: req.body.email,
                Name: '',
                html: output

            };
            transporter.sendMail(mailOptions, function(error, info) {
                console.log('fgfjfj')
                if (error) {
                    console.log(error);
                    res.json("Error");
                } else {
                    console.log('Email sent: ' + info.response);
                    data1.otp = otp;
                    res.json(data1);
                }
            });
        }
    })
    console.log(req.body)
});

router.post("/GetRegisterOtp", (req, res, next) => {
    console.log(req.body)
    db.executeSql("select * from registerotp where email = '" + req.body.email + "'", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });


});

router.post("/SaveUserCustomerList", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("INSERT INTO `users`(`email`,`password`,`role`,`isactive`)VALUES('" + req.body.email + "','" + encPassword + "','Customer',true);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            db.executeSql("INSERT INTO `customer`(`fname`,`lname`,`email`,`contact`,`gender`,`createddate`,`uid`)VALUES('" + req.body.fname + "','" + req.body.lname + "','" + req.body.email + "','" + req.body.contact + "','" + req.body.gender + "',CURRENT_TIMESTAMP," + data.insertId + ");", function(data, err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data);
                }
            });
        }
        return res.json('success');
    });
});

router.post("/SaveVendorList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `vendor`( `fname`, `gst`, `contact`, `whatsapp`, `address`, `city`, `pincode`, `isactive`, `createdate`, `updatedate`) VALUES ('" + req.body.fname + "','" + req.body.gst + "','" + req.body.contact + "','" + req.body.whatsapp + "','" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + ",true,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            console.log(err)
        } else {

            return res.json('success');
        }
    });
});
router.get("/GetAllVendor", (req, res, next) => {
    db.executeSql("select * from vendor", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/RemoveVendorList", (req, res, next) => {

    console.log(req.body);
    db.executeSql("Delete from vendor where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateVendorList", (req, res, next) => {
    db.executeSql("UPDATE `vendor` SET fname='" + req.body.fname + "',gst='" + req.body.gst + "',contact='" + req.body.contact + "',whatsapp='" + req.body.whatsapp + "',address='" + req.body.address + "',city='" + req.body.city + "',updatedate=CURRENT_TIMESTAMP WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});
router.get("/GetCustDetails", (req, res, next) => {
    db.executeSql("select c.fname,c.lname,c.contact,c.whatsapp,c.email,c.gender from customer c where custid = id" + req.body.id + "", function (data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetCustomerDataById", (req, res, next) => {
    console.log(req.body)
    db.executeSql("select * from customer where id = " + req.body.id+"", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});
// router.post("/GetCustomerTotalPoints", (req, res, next) => {
//     db.executeSql("select * from point where custid = " + req.body.id + "", function (data, err) {
//         if (err) {
//             console.log("Error in store.js", err);
//         } else {
//             return res.json(data);
//         }
//     });
// })


router.post("/UploadBannersImage",  (req, res, next) => {
    var imgname = generateUUID();

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'images/banners');
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {

            cb(null, imgname + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage }).single('file');
    upload(req, res, function(err) {
        console.log("path=", config.url + 'images/banners/' + req.file.filename);

        if (req.fileValidationError) {
            console.log("err1", req.fileValidationError);
            return res.json("err1", req.fileValidationError);
        } else if (!req.file) {
            console.log('Please select an image to upload');
            return res.json('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            console.log("err3");
            return res.json("err3", err);
        } else if (err) {
            console.log("err4");
            return res.json("err4", err);
        }
        return res.json('/images/banners/' + req.file.filename);

        console.log("You have uploaded this image");
    });
});

router.post("/SaveWebBanners", (req, res, next) => {
    console.log(req.body);
    db.executeSql("INSERT INTO `webbanners`(`name`,`bannersimage`,`status`)VALUES('" + req.body.name + "','" + req.body.bannersimage + "'," + req.body.status + ");", function(data, err) {
        if (err) {
            res.json("error");
        } else {
            res.json("success");
        }
    });
});

router.get("/GetWebBanners",  (req, res, next) => {
    console.log("call-4");
    console.log(req.body.id)
    db.executeSql("select * from webbanners ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.post("/RemoveWebBanners",  (req, res, next) => {
    console.log(req.id)
    db.executeSql("Delete from webbanners where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.post("/UpdateActiveWebBanners",  (req, res, next) => {
    console.log(req.body)
    db.executeSql("UPDATE  `webbanners` SET status=" + req.body.status + " WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.get("/GetWebBanner",  (req, res, next) => {
    db.executeSql("select * from webbanners where status=1", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});
// let secret = 'prnv';
router.post('/login', function(req, res, next) {

    const body = req.body;
    console.log(body);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from admin where email='" + req.body.email + "';", function(data, err) {
        console.log(data);
        if (data.length > 0) {
            db.executeSql("select * from admin where email='" + req.body.email + "' and password='" + encPassword + "';", function(data1, err) {
                console.log(data1);
                if (data1.length > 0) {

                    module.exports.user1 = {
                        username: data1[0].email,
                        password: data1[0].password
                    }
                    let token = jwt.sign({ username: data1[0].email, password: data1[0].password },
                        secret, {
                            expiresIn: '1h' // expires in 24 hours
                        }
                    );
                    console.log("token=", token);
                    data[0].token = token;

                    res.cookie('auth', token);
                    res.json(data);
                } else {
                    return res.json(2);
                }
            });
        } else {
            return res.json(1);
        }
    });

});
let secret = 'prnv';
router.post('/GetUsersLogin', function(req, res, next) {
    const body = req.body;
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from users where email='" + req.body.email + "';", function(data, err) {
        console.log(data);
        if (data == null || data == undefined || data.length ===0) {
            return res.json(1);
        } else {
            // var time = get_time_diff;
            // console.log(time);
            db.executeSql("select * from users where email='" + req.body.email + "' and password='" + encPassword + "';", function(data1, err) {
                if (data1.length > 0) {
                    module.exports.user1 = {
                        username: data1[0].email,
                        password: data1[0].password
                    }
                    let token = jwt.sign({ username: data1[0].email, password: data1[0].password },
                        secret, {
                            expiresIn: '1h' // expires in 24 hours
                        }
                    );
                    console.log("token=", token);


                    res.cookie('auth', token);
                    if (data1[0].role == 'Admin') {
                        let resdata = [];
                        db.executeSql("select * from admin where uid=" + data1[0].userid, function(data2, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata.push(data2[0]);
                                resdata[0].token = token;
                                resdata[0].role = data1[0].role;
                                resdata[0].last_login = data1[0].out_time;
                                resdata[0].last_inTime = data1[0].in_time;
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata);
                            }
                        })

                    } else if (data1[0].role == 'Customer') {
                        let resdata1 = [];
                        db.executeSql("select * from customer where id=" + data1[0].userid, function(data3, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata1.push(data3[0]);
                                resdata1[0].token = token;
                                resdata1[0].role = data1[0].role;
                                resdata1[0].last_login = data1[0].out_time;
                                resdata1[0].last_inTime = data1[0].in_time;
                                
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata1);
                            }
                        })
                    } else if (data1[0].role == 'Student') {
                        let resdata2 = [];
                        db.executeSql("select * from studentlist where uid=" + data1[0].userid, function(data4, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata2.push(data4[0]);
                                resdata2[0].token = token;
                                resdata2[0].role = data1[0].role;
                                resdata2[0].last_login = data1[0].out_time;
                                resdata2[0].last_inTime = data1[0].in_time;
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata2);
                            }
                        })
                    } else if (data1[0].role == 'Visitor') {
                        let resdata3 = [];
                        db.executeSql("select * from visitorreg where uid=" + data1[0].userid, function(data5, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata3.push(data5[0]);
                                resdata3[0].token = token;
                                resdata3[0].role = data1[0].role;
                                resdata3[0].last_login = data1[0].out_time;
                                resdata3[0].last_inTime = data1[0].in_time;
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata3);
                            }
                        })
                    } else if (data1[0].role == 'Parents') {
                        let resdata4 = [];
                        db.executeSql("select * from parentsinfo where uid=" + data1[0].userid, function(data6, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata4.push(data6[0]);
                                resdata4[0].token = token;
                                resdata4[0].role = data1[0].role;
                                resdata4[0].last_login = data1[0].out_time;
                                resdata4[0].last_inTime = data1[0].in_time;
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata4);
                            }
                        })
                    } else if (data1[0].role == 'Sub-Admin') {
                        let resdata5 = [];
                        db.executeSql("select * from admin where uid=" + data1[0].userid, function(data7, err) {
                            if (err) {
                                console.log(err);
                            } else {
                                resdata5.push(data7[0]);
                                resdata5[0].token = token;
                                resdata5[0].role = data1[0].role;
                                resdata5[0].last_login = data1[0].out_time;
                                resdata5[0].last_inTime = data1[0].in_time;
                                db.executeSql("UPDATE  `users` SET status=true,in_time=CURRENT_TIMESTAMP WHERE userid=" + data1[0].userid, function(msg, err) {
                                    if (err) {
                                        console.log("Error in store.js", err);
                                    } else {}
                                });
                                return res.json(resdata5);
                            }
                        })

                    }


                } else {
                    return res.json(2);
                }
            });
        }

    });

});

router.post("/UpdateLogoutDetails", (req, res, next) => {
    console.log(req.body)
    db.executeSql("UPDATE users SET status=false,out_time=CURRENT_TIMESTAMP WHERE userid=" + req.body.userid, function(msg, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            db.executeSql("INSERT INTO `logintime`(`userid`, `login_minute`, `login_date`)VALUES(" + req.body.userid + "," + req.body.loginMinute + ",CURRENT_TIMESTAMP);", function(data, err) {
                if (err) {
                    console.log("Error in store.js", err);
                } else {
                    return res.json('Success');
                }
            });
        }
    });
});


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


module.exports = router;