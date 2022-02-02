const homeRoute = require("./createTest");
const express = require("express");
const { Admin } = require("../models/Auth");
const AdminValidator = require("../Validators/adminValidator");
const { Transaction } = require("../models/Transactions");

const generateJWT = require("../utils/generateJWT");
const verifyPass = require("../utils/verifyPassword");
const hashPassword = require("../utils/passwordHash");
const decryptJWT = require("../utils/decryptJWT");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const adminValidator = require("../Validators/adminValidator");
const { response } = require("express");
const { hash, genSalt } = require("bcrypt");
const { Wallet } = require("../models/Wallet");

const nodemailer = require("../Nodemailer Configuration/otpmailer");
const otp = require("../otpAlgorithm/otp");

const { Referral } = require("../models/referral");

const referralCode = require("../referralAlgorithm/referral");
const passwordHash = require("../utils/passwordHash");

const router = express.Router();

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const data = { email, password };

 
	 
		try {
			const admin = await Admin.findOne({ email: email });
			if (!admin || admin.isActive === false) {
				res.status(200).json({
					status: false,
					message: "User not Found",
				});
			} else {
				const passVerifier = await verifyPass(password, admin.password);

				if (!passVerifier) {
					res.status(200).json({
						status: false,
						message: "Invalid Username or password",
					});
				} else {
					const newJWT = await generateJWT(admin);
					if (!newJWT) {
						res.status(200).json({
							status: false,
							message: "JWT Not Created",
						});
					} else {
						res.status(200).json({
							status: true,
							message: "Login Successful",
							accessToken: newJWT,
							user: admin,
						});
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	 
});

//updatePassword for the api

router.post("/updatePassword", async (req, res) => {
	const { email, password, newPassword } = req.body;

	const data = { email, password };

	const verifier = adminValidator("email password", data);

	if (!verifier) {
		res.status(200).json({
			status: false,
			message: "Invalid Cedential Details",
			email: "email must be an email",
		});
	} else {
		try {
			const user = await Admin.findOne({ email: email });
			if (!user) {
				res.status(200).json({
					status: false,
					message: "User not Found",
				});
			} else {
				const passwordVerfier = await verifyPass(password, user.password);
				if (!passwordVerfier) {
					res.status(200).json({
						status: false,
						message: "Invalid UserName or Password",
					});
				} else {
					const { generateSalt, generateHash } = await hashPassword(
						newPassword
					);
					if (!generateHash) {
						res.status(200).json({
							status: false,
							message: "Hash Not Created",
						});
					} else {
						try {
							const updatePassword = await Admin.updateMany(
								{ email: email },
								{
									password: generateHash,
									salt: generateSalt,
								}
							);

							if (!updatePassword) {
								res.status(200).json({
									status: false,
									message: "Password is not updated!!",
								});
							} else {
								res.status(200).json({
									status: true,
									message: "Password is Updated Successfully",
								});
							}
						} catch (error) {
							console.log(error);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});

router.post("/signupTest", async (req, res) => {
	const { userName, email, password } = req.body;

	const resultFromJoi = await adminValidator(
		"userName email password",
		req.body
	);
	if (!resultFromJoi) {
		res.status(200).json({
			status: false,
			message: "Invalid Credential Details",
			email: "Email must be email",
			userName: "Username must be atleast 3 characters long",
			passswod: "Password must be 8 characters Long",
		});
	} else {
		try {
			const userFind = await Admin.findOne({
				$or: [{ email: email }, { userName: userName }],
			});
			if (userFind) {
				res.status(200).json({
					status: false,
					message: "User Already Present!!",
				});
			} else {
				const { generateSalt, generateHash } = await passwordHash(password);
				if (!generateHash) {
					res.status(200).json({
						status: false,
						message: "Password is not Hashed",
					});
				} else {
					const referralGen = referralCode();
					const newUser = await new Admin({
						userName: userName,
						email: email,
						password: generateHash,
						loginType: 'Normal',
						salt: generateSalt,
						referral: referralGen,
						typeUser: 2,
					});
					if (!newUser) {
						res.status(200).json({
							stautus: false,
							message: "User not Created",
						});
					} else {
						const referralData = await new Referral({
							userID: newUser._id,
							referralCode: referralGen,
							email: email,
							userType: 2,
							commisionPercent: 50,
						});

						if (!referralData) {
							res.status(200).json({
								status: false,
								message: "Referral Data is not Generated",
							});
						} else {
							const wallet = await new Wallet({
								userID: newUser._id,
								userType: 2,
							});
							if (!wallet) {
								res.status(200).json({
									status: false,
									message: "Wallet is not generated",
								});
							} else {
								await newUser.save();
								await referralData.save();
								await wallet.save();
								res.status(200).json({
									status: true,
									message: "User Is Created!",
									userName: newUser.userName,
									user: newUser,
									email: newUser.email,
									referral: newUser.referral,
									accessToken: generateJWT(newUser),
								});
							}
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});

// router.post('/nodemailer', async(req, res)=>
// {
//     const {email} = req.body;
//     const resultFromJoi = adminValidator('email', req.body);
//     if(!resultFromJoi)
//     {
//         res.status(200).json(
//             {
//                 status: false,
//                 message: "InValid Credentials",
//                 email: "Email Must be an email"
//             }
//         )
//     }
//     else
//     {
//         const user = await Admin.findOne({email: email});
//         if(!user)
//         {
//             res.status(200).json(
//                 {
//                     status: false,
//                     message: 'No Email Exists'
//                 }
//             )
//         }
//         else
//         {
//             const {token,secret} = otp();
//             try {
//                 const userOTP = await Admin.updateMany({email: email},
//                     {
//                         tokenOTP: token,
//                         tokenSecret: secret
//                     })

//                     if(!userOTP)
//                     {
//                         res.status(200).json(
//                             {
//                                 status: false ,
//                                 message : 'Unable to send OTP'
//                             }
//                         )
//                     }
//                     else
//                     {
//                         try {
//                             const mailer = await nodemailer(email, token);
//                             if(!mailer)
//                             {
//                                 res.status(200).json(
//                                     {
//                                         status: true,
//                                         message : "OTP Sent To Registered email Address"
//                                     }
//                                 )
//                             }

//                         } catch (error) {

//                             console.log(error);
//                         }

//                     }
//             } catch (error) {

//                 console.log(error);
//             }

//         }

//     }
// })

router.post("/signup", async (req, res) => {
	const { email, password, userName } = req.body;

	const data = { email, password, userName };
	const resultFromJoi = adminValidator("email password userName", data);

	if (!resultFromJoi) {
		res.status(200).json({
			status: false,
			message: "Invalid Credential Details",
			NOTE: "email must be email and password must be 8 characters long",
		});
	} else {
		try {
			const admin = await Admin.findOne({
				email: email,
			});
			if (admin) {
				res.status(200).json({
					status: false,
					message: "User ALready Exists",
				});
			} else {
				const { generateHash, generateSalt } = await hashPassword(password);

				if (!generateHash) {
					res.status(200).json({
						status: false,
						message: "Hash not generated!!",
					});
				} else {
					const referralGen = referralCode();
					const referral = await new Referral({
						email: email,
						userID: admin._id,
						referralCode: referralGen,
						commisionPercent: 50,
					});
					if (!referral) {
						res.status(200).json({
							status: 200,
							message: "Referral not Generated",
						});
					} else {
						const user = await new Admin({
							userName: userName,
							email: email,
							password: generateHash,
							salt: generateSalt,
							referral: referralGen,
						});
						if (!user) {
							res.status(200).json({
								status: false,
								message: "User not Found",
							});
						} else {
							if (!user) {
								res.status(200).json({
									status: false,
									message: "user not Found",
								});
							} else {
								const wallet = await new Wallet({
									userID: user._id,
								});

								if (!wallet) {
									res.status(200).json({
										status: false,
										message: "Wallet Not Created!!",
									});
								} else {
									await user.save();
									await referral.save();

									await wallet.save();

									res.status(200).json({
										status: true,
										message: "Signup Successful!!",
										accessToken: generateJWT(user),
										user: user,
									});
								}
							}
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});

/***** get all Teachers by name/status/add date  *****/

router.get("/filterTeacher", async (req, res) => {
	// query object. board will be founded based on it
	const query = {};

	if (req.body.search) {
		query.boardName = {
			$regex: new RegExp(req.body.search.trim(), "i"),
		};
	}

	// check if status is correct
	if (req.body.status) {
		const allowableStatus = ["active", "inactive"];
		const isValidStatus = allowableStatus.includes(req.body.status.trim());
		if (isValidStatus) query.status = req.body.status.trim();
	}

	query.typeUser = 1;

	try {
		const teachers = await Admin.find(query);
		if (!boards) {
			res.status(404).json({
				status: false,
				message: "No Teacher is Found",
			});
		} else {
			res.status(200).json({
				status: true,
				teachers: teachers,
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.get("/getAllTeachers/:offset/:limit", async (req, res) => {
	const limit = parseInt(req.params.limit);
	const offset = (parseInt(req.params.offset) - 1) * limit;
	try {
		const teacher = await Admin.find(
			{ typeUser: "1" },
			{},
			{
				sort: {
					createdAt: -1,
				},
			}
		)
			.limit(limit)
			.skip(offset);
		if (!teacher) {
			res.status(200).json({
				status: false,
				message: "Teachers not Found!",
			});
		} else {
			res.status(200).json({
				status: true,
				message: "Teachers Found are ",
				data: teacher,
			});
		}
	} catch (error) {
		console.log(error);
	}
});
router.post("/adminSignup", async (req, res) => {
	const { email, password, userName } = req.body;

	const data = { email, password, userName };
	const resultFromJoi = adminValidator("email password userName", data);

	if (!resultFromJoi) {
		res.status(200).json({
			status: false,
			message: "Invalid Credential Details",
			NOTE: "email must be email and password must be 8 characters long",
		});
	} else {
		try {
			const admin = await Admin.findOne({
				email: email,
			});
			if (admin) {
				res.status(200).json({
					status: false,
					message: "User ALready Exists",
				});
			} else {
				const { generateHash, generateSalt } = await hashPassword(password);

				if (!generateHash) {
					res.status(200).json({
						status: false,
						message: "Hash not generated!!",
					});
				} else {
					const user = await new Admin({
						userName: userName,
						email: email,
						password: generateHash,
						salt: generateSalt,
						typeUser: 0,
					});

					if (!user) {
						res.status(200).json({
							status: false,
							message: "User not Created",
						});
					} else {
						const wallet = await new Wallet({
							userID: user._id,
						});
						if (!wallet) {
							res.status(200).json({
								status: false,
								message: "Wallet Not Created!!",
							});
						} else {
							const referral = await new Referral({
								userID: user._id,
								email: user.email,
								referralCode: referralCode(),
							});
							await referral.save();

							await wallet.save();
							await user.save();

							res.status(200).json({
								status: true,
								message: "Signup Successful!!",
								accessToken: generateJWT(user),
								admin: user,
							});
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
});
router.put("/changeStatus/:userID", async (req, res) => {
	const { status } = req.body;

	try {
		const user = await Admin.findOne({ _id: req.params.userID });
		if (!user) {
			res.status(200).json({
				status: false,
				message: "User Not Found",
			});
		} else {
			try {
				const statusUpdate = await Admin.updateOne(
					{ _id: req.params.userID },
					{
						isActive: status,
					}
				);

				const statusReferral = await Referral.updateOne(
					{ userID: req.params.userID },
					{
						isActive: status,
					}
				);
				if (status === "false") {
					res.status(200).json({
						status: true,
						message: "User Is Disabled!!",
						details: user,
					});
				} else {
					res.status(200).json({
						status: true,
						message: "User is Enabled!",
						details: user,
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	} catch (error) {
		console.log(error);
	}
});

// router.post('/forgetPassword', async (req, res)=>
// {
//     const {email} = req.body;
//     try {
//         const user = await

//     } catch (error) {

//         console.log(error);
//     }
// })
router.get("/getAllTeachersById/:teacherID", async (req, res) => {
	try {
		const teacher = await Admin.findOne({ _id: req.params.teacherID });
		if (!teacher) {
			res.status(200).json({
				status: false,
				message: "User not present",
			});
		} else {
			const wallet = await Wallet.findOne({ userID: req.params.teacherID });
			if (!wallet) {
				res.status(200).json({
					status: false,
					message: "Wallet is not created for the user",
				});
			} else {
				res.status(200).json({
					status: true,
					message: "User Found",
					data: teacher,
					Wallet: wallet,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
});


//social login for test series app

router.post('/socialLogin', async(req, res)=>
{
    //request fields 
    const {email,loginType, loginName} = req.body;
    const data = {email};

    //validation of hte request body

    const resultFromJoi = await adminValidator('email', data);

    if(!resultFromJoi)
    {
        //return error if validation fails
        res.status(401).json(
            {
                status: false,
                message: "Invalid Credential Details"
            }
        )
    }
    else 
    {

        try {
            //will create the new user for the user. We need no passwords because evrrything will be get validated as it is social login

            const user = await Admin.findOne({email: email});
            if(user)
            {
				const newJWT = generateJWT(user);

                //if user already present then will return login successful
                
                res.status(200).json(
                    {
						status: true,
						message: "Login Successful",
						accessToken: newJWT,
						user: user,
                    }
                )
            }
            else 
            {
                // generate the new user and add it to the db
                const newUser = await new Admin(
                    {
                        
                        email: email,
						loginName: loginName,
                        
                        
                        loginType: loginType,
                        
                        
    
                    }
                )
    
    
                if(!newUser)
                {
                    //if there is some error in the code then it throws an error
                    res.status(500).json(
                        {
                            status: false,
                            message: "Social Login Not created!!",
                            
                        }
                    )
                }
                else 
                {
					const referralGen = referralCode();
                    //user gets saved in the database and the true response is returned
                    // await newUser.save()
					const referralData = await new Referral({
						userID: newUser._id,
						referralCode: referralGen,
						email: email,
						userType: 2,
						commisionPercent: 50,
					});

					if(!referralData)
					{
						res.status(500).json(
							{
								status: false,
								message: "Referral Not Created"
							}
						)
					}
					else 

					{
						const wallet = await new Wallet({
							userID: newUser._id,
							userType: 2,
						});
						if(!wallet) {
							res.status(200).json({
								status: false,
								message: "Wallet is not generated",
							});
						}
						else 
						{
							await newUser.save();
							await referralData.save();
							await wallet.save();
							res.status(200).json({
								status: true,
								message: "User Is Created!",
								userName: newUser.userName,
								user: newUser,
								email: newUser.email,
								referral: newUser.referral,
								accessToken: generateJWT(newUser),
							});

						}


					}
                    
                }
            }
            
        } catch (error) {
            
            console.log(error);
        }
    

    }

   


})


module.exports = router;
