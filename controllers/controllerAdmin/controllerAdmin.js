const {
  Banner,
  historyYestech,
  Products,
  YestechOwner,
  CaseList,
  categoryYestechOwner,
  categoryProducts,
  Warehouse,
  Type,
  sequelize,
  Section
} = require("../../models/index");
// // const sequelize = require('../sequelize');
// sequelize
const fs = require("fs");
const path = require("path");
const { Op } = require('sequelize');
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
  static async postBanner(req, res) {
    try {
      const { details, title, link } = req.body;
      const imageBanner = req.file.path;
      const data = await Banner.create({ details, title, link, imageBanner });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const { title, details, link } = req.body;
      // console.log(req.body.title);
      
      const newImageBanner = req.file ? req.file.path : null;

      const banner = await Banner.findByPk(id);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }
      const oldImageBanner = banner.imageBanner;

      banner.title = title || banner.title;
      banner.details = details || banner.details;
      banner.link = link || banner.link;
      if (newImageBanner) {
        banner.imageBanner = newImageBanner;
      }
      await banner.save();
      if (newImageBanner && oldImageBanner) {
        fs.unlink(path.resolve(oldImageBanner), (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: `Failed to delete old image: ${err.message}` });
          }
        });
      }
      res.status(200).json(banner);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the banner" });
    }
  }
  static async deleteBanner(req, res) {
    try {
      const { id } = req.params;

      const banner = await Banner.findByPk(id);
      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }

      const imageBanner = banner.imageBanner;
      await banner.destroy();

      if (imageBanner) {
        fs.unlink(path.resolve(imageBanner), (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: `Failed to delete image: ${err.message}` });
          }
        });
      }

      res
        .status(200)
        .json({ message: "Banner and associated image deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "An error occurred while deleting the banner",
          details: error.message,
        });
    }
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
  static async postCategoryProducts(req, res) {
    try {
      const { name } = req.body;
      const data = await categoryProducts.create({ name });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async updateCategoryProducts(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await categoryProducts.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.update({ name });
  
      res.status(200).json({ message: 'Category updated successfully', data: category });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred while updating the category' });
    }
  }
  static async deleteCategoryProducts(req, res) {
    try {
      const { id } = req.params;
      const category = await categoryProducts.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await category.destroy();
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'An error occurred while deleting the category' });
    }
  }
  
  //types 
  static async getTypes(req, res) {
    try {
      const data = await Type.findAll();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async postTypes(req, res) {
    try {
      const { name } = req.body;
      const data = await Type.create({ name });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async updateType(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const type = await Type.findByPk(id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      type.name = name;
      await type.save();
  
      res.status(200).json(type);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while updating the type" });
    }
  }
  static async deleteType(req, res) {
    try {
      const { id } = req.params;
      const type = await Type.findByPk(id);
      if (!type) {
        return res.status(404).json({ message: "Type not found" });
      }
      await type.destroy();
  
      res.status(200).json({ message: "Type deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred while deleting the type" });
    }
  }
  
  // Products
  static async getProduct(req, res) {
    try {
        const { page , limit, categoryId, search, typeId } = req.query;
        const offset = page && limit ? (page - 1) * limit : null;

        const queryOptions = {
           
            include: [

                { model: categoryProducts },
                { model: Type }
            ],
        };

        // Initialize where clause if necessary
        queryOptions.where = {};

        if (categoryId) {
            queryOptions.where.categoryId = categoryId;
        }

        if (search) {
            queryOptions.where.name = { [Op.like]: `%${search}%` };
        }

        if (typeId && typeId !== 'all') {
          queryOptions.where.typeId = typeId;
      }


        if (limit && offset !== null) {
            queryOptions.limit = parseInt(limit, 10);
            queryOptions.offset = parseInt(offset, 10);
        }

        const totalCount = await Products.count({ where: queryOptions.where });
        const totalPages = limit ? Math.ceil(totalCount / limit) : 1;

        const data = await Products.findAll(queryOptions);

        const formattedData = data.map((product) => ({
          ...product.toJSON(),
          mainImg: JSON.parse(product.mainImg).map(link => ({ link })),
          sections: JSON.parse(product.sections),
          parameters : JSON.parse(product.parameters)
      }));
      

        if (formattedData.length === 0) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({
            totalItems: totalCount,
            totalPages: totalPages,
            currentPage: page ? parseInt(page, 10) : 1,
            data: formattedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProductDetailsAdmin(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Products.findOne({
            where: { id },
            include: [
                { model: categoryProducts },
                { model: Type }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const formattedProduct = {
            ...product.toJSON(),
            mainImg: JSON.parse(product.mainImg).map(link => ({ link })),
            sections: JSON.parse(product.sections),
            parameters : JSON.parse(product.parameters) 
        };

        res.status(200).json({ data: formattedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
  static async getProductDetails(req, res) {
    try {
        const { id } = req.query;
    
      
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Products.findOne({
            where: { id },
            include: [
                { model: categoryProducts },
                { model: Type }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const formattedProduct = {
            ...product.toJSON(),
            mainImg: JSON.parse(product.mainImg).map(link => ({ link })),
            sections: JSON.parse(product.sections),
            parameters : JSON.parse(product.parameters) 
        };

        res.status(200).json({ data: formattedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
static async postProducts(req, res) {
  try {
    const mainImgUrls = req.files.map((file) => file.path);
    const { name, categoryId, detailsHome, typeId, sections, parameters } = req.body;
    const mainImg = JSON.stringify(mainImgUrls);
    console.log(parameters);
    // Membuat produk baru dengan data yang diterima
    const product = await Products.create({
      name,
      detailsHome,
      mainImg,
      categoryId,
      typeId,
      sections,
      parameters
    });

  

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
static async updateProducts(req, res) {
  try {
    const { id } = req.params;
    const { name, categoryId, detailsHome, typeId, sections, parameters } = req.body;
    const newImgUrls = req.files.map((file) => file.path);

    // Find the existing product by ID
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Combine old and new images
    let existingImgUrls = [];
    if (product.mainImg) {
      existingImgUrls = JSON.parse(product.mainImg);
    }
    const combinedImgUrls = existingImgUrls.concat(newImgUrls);
    const mainImg = JSON.stringify(combinedImgUrls);

    // Update the product with new data
    product.name = name;
    product.detailsHome = detailsHome;
    product.mainImg = mainImg;
    product.categoryId = categoryId;
    product.typeId = typeId;
    product.sections = sections;
    product.parameters = parameters;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
static async deleteProducts(req, res) {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.mainImg) {
      const imgUrls = JSON.parse(product.mainImg);
      imgUrls.forEach((imgPath) => {
        const fullPath = path.resolve(imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


  // static async postProducts(req, res) {
  //   const { name, detailsHome } = req.body;
  //   const files = req.files;
    
  //   let transaction;
  //   try {
  //     transaction = await sequelize.transaction();
  
  //     // Process main images
  //     const mainImgFiles = files.filter(file => file.fieldname === 'mainImg');
  //     const mainImagesUrls = mainImgFiles.map(image => ({
  //       url: `assets/products/${image.filename}`
  //     }));
  //     const mainImgJson = JSON.stringify(mainImagesUrls); // Serialize to JSON string
    
  //     // Create new product
  //     const newProduct = await Products.create({
  //       name,
  //       detailsHome,
  //       mainImg: mainImgJson, // Store JSON string in the database
  //     }, { transaction });
  
  //     // Process sections
  //     if (req.body.sections) {
  //       const sections = JSON.parse(req.body.sections);
  
  //       for (const section of sections) {
  //         const sectionFiles = files.filter(file => file.fieldname.startsWith(`sections[${sections.indexOf(section)}][images]`));
  //         const images = sectionFiles.map(image => ({
  //           url: `assets/products/${image.filename}`
  //         }));
  //         const imagesJson = JSON.stringify(images); // Serialize to JSON string
  
  //         await Section.create({
  //           productId: newProduct.id,
  //           type: section.type,
  //           title: section.title,
  //           description: section.description,
  //           titlePosition: section.titlePosition,
  //           descriptionPosition: section.descriptionPosition,
  //           background: section.background,
  //           layout: section.layout,
  //           images: imagesJson, // Store JSON string in the database
  //         }, { transaction });
  //       }
  //     }
  
  //     // Commit transaction if successful
  //     await transaction.commit();
  
  //     res.status(201).json({ message: 'Product created successfully' });
  //   } catch (error) {
  //     // Rollback transaction if error occurs
  //     if (transaction) await transaction.rollback();
  
  //     console.error('Error creating product:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }
  
  
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
  static async getCaseById(req, res) {
    try {
      const { id } = req.params;
      const data = await CaseList.findByPk(id);
  
      if (data) {
        const formattedData = {
          ...data.toJSON(),
          image: JSON.parse(data.image),
        };
  
        res.status(200).json(formattedData);
      } else {
        res.status(404).json({ message: "Case not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
  static async postCaseList(req, res) {
    try {
      let mainImages = [];
      if (req.files && req.files.length > 0) {
        mainImages = req.files.map((file, index) => ({
          link: file.path,
        }));
      }
      const { name, location, product, details } = req.body;
      const image = JSON.stringify(mainImages);

      const data = await CaseList.create({
        name,
        image,
        location,
        product,
        details,
      });

      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async updateCaseList(req, res) {
    try {
      const { id } = req.params;
      let mainImages = [];
  
      // If new images are uploaded, process them
      if (req.files && req.files.length > 0) {
        mainImages = req.files.map((file) => ({
          link: file.path,
        }));
      }
  
      const { name, location, product, details } = req.body;
      const image = JSON.stringify(mainImages);
  
      const caseList = await CaseList.findByPk(id);
  
      if (!caseList) {
        return res.status(404).json({ message: "CaseList not found" });
      }
  
      // Combine new images with existing images
      const existingImages = JSON.parse(caseList.image) || [];
      const updatedImages = [...existingImages, ...mainImages];
  
      caseList.name = name || caseList.name;
      caseList.image = updatedImages.length > 0 ? JSON.stringify(updatedImages) : caseList.image;
      caseList.location = location || caseList.location;
      caseList.product = product || caseList.product;
      caseList.details = details || caseList.details;
  
      await caseList.save();
  
      res.status(200).json(caseList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async deleteCaseList(req, res) {
    try {
      const { id } = req.params;
      const caseList = await CaseList.findByPk(id);
  
      if (!caseList) {
        return res.status(404).json({ message: "CaseList not found" });
      }
  
      // Parse existing images and delete them
      const existingImages = JSON.parse(caseList.image) || [];
      
      existingImages.forEach((image) => {
        const imagePath = path.resolve(image.link);
        
        // Check if file exists before trying to delete
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);  // Delete the file
        }
      });
  
      // Delete the caseList entry from the database
      await caseList.destroy();
  
      res.status(200).json({ message: "CaseList deleted successfully" });
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
  static async postCategoryYestech(req, res) {
    try {
      const { name } = req.body;
      const data = await categoryYestechOwner.create({ name });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  
  static async editCategoryYestech(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const existingCategory = await categoryYestechOwner.findByPk(id);
  
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await existingCategory.update({ name });
      res.status(200).json(existingCategory);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  static async deleteCategoryYestech(req, res) {
    try {
      const { id } = req.params; 
      const existingCategory = await categoryYestechOwner.findByPk(id);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      await existingCategory.destroy();
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
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
  static async postYestechOwner(req, res) {
    try {
      const {
        name,
        details,
        categoryYestechOwnerId,
        noHp,
        email,
        alamat,
        linkWeb,
        instagram,
        facebook,
        tiktok,
        youtube,
      } = req.body;
      const image = req.file.path;
      const data = await YestechOwner.create({
        name,
        details,
        categoryYestechOwnerId,
        noHp,
        alamat,
        linkWeb,
        email,
        instagram,
        facebook,
        tiktok,
        youtube,
        image,
      });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async editYestechOwner(req, res) {
    try {
      const { id } = req.params; 
      const {
        name,
        details,
        categoryYestechOwnerId,
        noHp,
        email,
        alamat,
        linkWeb,
        instagram,
        facebook,
        tiktok,
        youtube,
      } = req.body;
      
      const image = req.file ? req.file.path : null;
  
      const existingYestechOwner = await YestechOwner.findByPk(id);
      if (!existingYestechOwner) {
        return res.status(404).json({ message: 'YestechOwner not found' });
      }
  
      const updatedData = {
        name: name || existingYestechOwner.name,
        details: details || existingYestechOwner.details,
        categoryYestechOwnerId: categoryYestechOwnerId || existingYestechOwner.categoryYestechOwnerId,
        noHp: noHp || existingYestechOwner.noHp,
        email: email || existingYestechOwner.email,
        alamat: alamat || existingYestechOwner.alamat,
        linkWeb: linkWeb || existingYestechOwner.linkWeb,
        instagram: instagram || existingYestechOwner.instagram,
        facebook: facebook || existingYestechOwner.facebook,
        tiktok: tiktok || existingYestechOwner.tiktok,
        youtube: youtube || existingYestechOwner.youtube,
        image: image || existingYestechOwner.image,
      };
      
      await existingYestechOwner.update(updatedData);
      res.status(200).json(existingYestechOwner);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  static async deleteYestechOwner(req, res) {
    try {
      const { id } = req.params;
      const yestechOwner = await YestechOwner.findByPk(id);
  
      if (!yestechOwner) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      // Hapus file gambar jika ada
      if (yestechOwner.image) {
        const imagePath = path.join(__dirname, '../', yestechOwner.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err);
          } else {
            console.log('Image deleted successfully');
          }
        });
      }
  
      // Hapus data dari database
      await YestechOwner.destroy({ where: { id } });
  
      res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
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
  static async postHistoriYestech(req, res) {
    try {
      const { name, image, year } = req.body;
      // console.log(req.body);
      const data = await historyYestech.create({ name, image, year });
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
    }
  }
  static async deleteHistoriYestech(req, res) {
    try {
      const { id } = req.params;
      const data = await historyYestech.destroy({ where: { id } });
  
      if (data) {
        res.status(200).json({ message: 'Data successfully deleted' });
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error deleting data' });
    }
  }
  static async editHistory(req, res) {
    try {
      const { id } = req.params;
      const { name, image, year } = req.body;
      
      const existingCategory = await historyYestech.findByPk(id);
  
      if (!existingCategory) {
        return res.status(404).json({ message: 'history not found' });
      }
      await existingCategory.update({ name,image,year });
      res.status(200).json(existingCategory);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // warehouse 
  static async getWarehouse(req,res) {
    try {
      const data = await Warehouse.findAll()
      const formattedData = data.map((product) => ({
        ...product.toJSON(),
        image: JSON.parse(product.image),
      }));
    res.status(200).json(formattedData)
    } catch (error) {
      console.log(error);
    }
  } 
  static async postWarehouse(req, res) {
    try {
      let mainImages = [];
      if (req.files && req.files.length > 0) {
        mainImages = req.files.map((file, index) => ({
          link: file.path,
        }));
      }
      const { name, alamat } = req.body;
      const image = JSON.stringify(mainImages);

      const data = await Warehouse.create({
        name,
        image,
        alamat
      });

      res.status(201).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async deleteWarehouse(req, res) {
    try {
      const { id } = req.params;
      const warehouse = await Warehouse.findByPk(id);
      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }
      await Warehouse.destroy({
        where: {
          id,
        },
      });
  
      res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
}

module.exports = Controller;
