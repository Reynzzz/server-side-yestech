const {Products} = require('../../models/index')


class Controller {
    static async getAllProducts(req,res) {
        try {
            const data = await Products.findAll()
            res.status(200).json(data)
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg : 'Internal server error'
            })
        }
    }
}

module.exports = Controller