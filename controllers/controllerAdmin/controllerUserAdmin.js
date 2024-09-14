const { compare } = require('../../helpers/bcrypt/bcrypt')
const { sign } = require('../../helpers/jwt/jwt')
const {Admin} = require('../../models/index')

class Controller {

    static async registerAdmin(req,res) {
       
            try {
                const {email,password} = req.body
                const data = await Admin.create({
                    email,
                    password,
                })
    
                res.status(201).json(data)
            } catch (error) {
                // console.log(error);
                // if (error.name === 'SequelizeValidationError') {
                //     const validationErrors = error.errors.map(err => err.message);
                //     console.error('Kesalahan validasi:', validationErrors);
                //     res.status(400).json(validationErrors );
                //   } else if(error.name ==='SequelizeUniqueConstraintError') {
                //     res.status(400).json({
                //         message : error.errors[0].message
                //     })
                // }
                //    else {
                    console.error('Gagal membuat admin:', error.message);
                    res.status(500).json({ error: 'Gagal membuat admin' });
                //   }
        }
    }
    static async Login (req,res) {
        try {
            const {email,password} = req.body
            const user = await Admin.findOne({
                where :{
                    email
                }
            })
            if(!user) {
                throw {
                    name : 'invalid login'
                }
            }else {
                let comparePassowrd = compare(password,user.password)
                if(!comparePassowrd) {
                    throw {
                        name: 'invalid login'
                    }
                } else {
                    const {id,email} = user
                    let token = sign({
                        id,
                        email
                    })
                    res.status(201).json({
                        access_token : token,
                        user
                    })
                }
            }
        } catch (error) {
            if(error.name ==='SequelizeValidationError') {
                res.status(400).json({
                    message : err.errors[0].message
                })
            }
            else if(error.name ==='SequelizeUniqueConstraintError') {
                res.status(400).json({
                    message : err.errors[0].message
                })
            }  else if(error.name ==='invalid login') {
                res.status(400).json({
                    message : "invalid email/password"
                })
            } 
            else if(error.name ==='inavalidToken') {
                res.status(400).json({
                    message : "Please Login"
                })
            } 
              else {
                res.status(500).json({
                    message:'internal server error'
                })
            }
           console.log(error);
        }
    }
}

module.exports = Controller