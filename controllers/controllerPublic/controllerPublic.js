const {
    Banner,
    historyYestech,
    Products,
    YestechOwner,
    CaseList,
    categoryYestechOwner,
    categoryProducts,
    Warehouse
  } = require("../../models/index");
  const fs = require("fs");
  const path = require("path");
  class Controller {
    static async getBanner(req, res) {
      try {
        const dataBanner = await Banner.findAll();
        res.status(200).json(dataBanner);
      } catch (error) {
        console.log(error);
      }
    }
    static async getBannerById(req, res) {
      try {
        const { id } = req.params;
        const data = await Banner.findOne({
          where: {
            id,
          },
        });
        res.status(200).json(data);
      } catch (error) {}
    }


 
    // category Products
    static async getCategopryProducts(req, res) {
      try {
        const data = await categoryProducts.findAll();
        res.status(200).json(data);
      } catch (error) {
        console.log(error);
      }
    }
   
    // Products
    static async getProduct(req, res) {
      try {
        const data = await Products.findAll({
          attributes: [
            "id",
            "name",
            "mainImg",
            "categoryId",
            "title",
            "section",
            "createdAt",
            "updatedAt",
          ],
          include: [categoryProducts],
        });
  
        const formattedData = data.map((product) => ({
          ...product.toJSON(),
          mainImg: JSON.parse(product.mainImg),
        }));
  
        res.status(200).json(formattedData);
        //   console.log(formattedData[0].mainImg[0].link);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  
   
  
    // Case List
    static async getCaseList(req, res) {
      try {
        const data = await CaseList.findAll();
  
        const formattedData = data.map((product) => ({
          ...product.toJSON(),
          image: JSON.parse(product.image),
        }));
  
        res.status(200).json(formattedData);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  
   
  
    // cateogry Yestech
    static async getCategopryYestech(req, res) {
      try {
        const data = await categoryYestechOwner.findAll();
        res.status(200).json(data);
      } catch (error) {
        console.log(error);
      }
    }
   
  
    // Yestch Owner
    static async getYestechOwner(req, res) {
      try {
        const data = await YestechOwner.findAll({
          include: [categoryYestechOwner],
        });
        res.status(200).json(data);
      } catch (error) {
        console.log(error);
      }
    }
   
    // histori yestech
    static async getHistroriYestech(req, res) {
      try {
        const data = await historyYestech.findAll();
        res.status(200).json(data);
      } catch (error) {
        console.log(error);
      }
    }
    
    static async getWarehouse(req,res) {
      try {
        const data = await Warehouse.findAll()
        res.status(200).json(data)
      } catch (error) {
        console.log(error);
      }
    } 
  }
  
  module.exports = Controller;
  