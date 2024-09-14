
const {news} = require('../../models/index')
const fs = require('fs');
const path = require('path');
// const {dirname} =require('path')
class Controller {

  static async getAllNews(req, res) {
    try {
        const data = await news.findAll({
          order: [['createdAt', 'DESC']]
        });

        // Format data for response
        const formattedData = data.map((newsItem) => {
            let details = [];
            try {
                details = JSON.parse(newsItem.details);
                if (!Array.isArray(details)) {
                    details = [details]; 
                }
                
            } catch (e) {
                console.error('Error parsing details:', e);
            }
            let formatdetails = JSON.parse(details)
            // console.log(formatdetails);
                // Remove 'image' property from each 'details' object
                formatdetails.map(detail => delete detail.image);
            return {
                id: newsItem.id,
                name: newsItem.name,
                imageNews: JSON.parse(newsItem.imageNews),
                details: formatdetails,
                createdAt: newsItem.createdAt,
                updatedAt: newsItem.updatedAt,
            };
        });

        res.status(200).json(formattedData); // Send formatted data as JSON response
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Failed to fetch news', error: error.message });
    }
}
static async getAllNewsAdmin(req,res) {
    try {
      const data = await news.findAll();
      res.json(data);
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ message: 'Server error', error });
    }
}
    static async getNewsById(req, res) {
      try {
        const { id } = req.query;
    
        if (!id) {
          return res.status(400).json({ message: 'ID parameter is required' });
        }
    
        const data = await news.findByPk(id);
    
        if (!data) {
          throw {
            name: 'news not found'
          };
        }
    
        // Parse and format the details field
        console.log(JSON.parse(data.details));
        let details;
        try {
          details = JSON.parse(data.details);
        } catch (e) {
          details = [];
        }
    
        // Ensure details is an array
        if (!Array.isArray(details)) {
          details = details;
        }
          const datadetalis = JSON.parse(details)
        // Log the parsed details to check its structure
        console.log('Parsed details:', details);
    
        // Format data for response
        const formattedData = {
          id: data.id,
          name: data.name,
          imageNews: JSON.parse(data.imageNews),
          details: datadetalis.map((detail, index) => ({
            index: index + 1,
            text: detail.text,
            image: detail.image
          })),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
    
        res.status(200).json(formattedData);
      } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Failed to fetch news', error: error.message });
      }
    }
    
    static async getNewsByIdAdmin(req, res) {
      try {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({ message: 'ID parameter is required' });
        }
    
        const data = await news.findByPk(id);
    
        if (!data) {
          throw {
            name: 'news not found'
          };
        }
    
        // Parse and format the details field
        // console.log(JSON.parse(data.details));
        let details;
        try {
          details = JSON.parse(data.details);
        } catch (e) {
          details = [];
        }
    
        // Ensure details is an array
        if (!Array.isArray(details)) {
          details = details;
        }
          const datadetalis = JSON.parse(details)
        // Log the parsed details to check its structure
        // console.log('Parsed details:', details);
    
        // Format data for response
        const formattedData = {
          id: data.id,
          name: data.name,
          imageNews: JSON.parse(data.imageNews),
          details: datadetalis.map((detail, index) => ({
            index: index + 1,
            text: detail.text,
            image: detail.image
          })),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
    
        res.status(200).json(formattedData);
      } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Failed to fetch news', error: error.message });
      }
    } 
    static async postNews(req,res) {
       
            try {
                const {name,details} = req.body
              let mainImages = [];
              if (req.files && req.files.length > 0) {
                mainImages = req.files.map((file, index) => ({
                  link: file.path,
                }));
              }
              const imageNews = JSON.stringify(mainImages);
              // const processedDetails = details.map(detail => ({
              //   text: detail.text,
              //   image : detail.image
              // }));
              const data = await news.create({
                name,
                details: JSON.stringify(details),
                imageNews 
              });
        
              res.status(201).json(data);
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: "Internal server error" });
            }
          
    }
    static async updateNews(req, res) {
      try {
        const { name, details } = req.body;
        const mainImages = req.files ? req.files.map(file => ({
          link: file.path,
        })) : [];
    
        // Ambil berita yang ada berdasarkan ID
        const data = await news.findByPk(req.params.id);
        if (!data) return res.status(404).json({ message: 'Data not found' });
    
        // Menggabungkan gambar lama dan gambar baru
        let existingImages = [];
        if (data.imageNews) {
          existingImages = JSON.parse(data.imageNews);
        }
        const updatedImages = [...existingImages, ...mainImages];
    
        // Update data berita
        data.name = name;
        data.imageNews = JSON.stringify(updatedImages); // Gabungkan gambar lama dan gambar baru
        data.details = JSON.stringify(details); // Update detail berita
        
        await data.save(); // Simpan perubahan
    
        res.json(data);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
      }
    }
    static async deleteImageNews(req, res) {
      try {
        const { id, filename } = req.params; // Assuming you pass both `id` and `filename`
  
        // Define the file path to delete
        const filePath = path.join('assets/News', filename);
        console.log(filePath);
  
        // Check if the file exists
        if (fs.existsSync(filePath)) {
          // Delete the file from the file system
          fs.unlinkSync(filePath);
  
          // Remove the image reference from the data store
          const updateResult = await news.removeImageFromDataStore(id, filename);
  
          if (updateResult) {
            res.status(200).json({ message: "Image deleted successfully" });
          } else {
            res.status(404).json({ message: "Image reference not found in data store" });
          }
        } else {
          res.status(404).json({ message: "Image not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  
    static async removeImageFromDataStore(id, filename) {
      try {
        // Normalize the path format
        const link = path.join('assets/News', filename)
  
        // Update the JSON field in the News table
        const [updateCount] = await news.update(
          {
            imageNews: sequelize.json(`array_remove(imageNews, '{"link": "${link}"}')`)
          },
          {
            where: {
              id: id,
              imageNews: {
                [Op.contains]: [{ link: link }]
              }
            }
          }
        );
  
        // Return true if any record was updated
        return updateCount > 0;
      } catch (error) {
        console.error('Error removing image from data store:', error);
        return false;
      }
    }
    
    
    
    
    
    
    
    
    
  static async deleteNews(req, res) {
    const { id } = req.params;
    try {
        const newsItem = await news.findByPk(id);
        if (!newsItem) {
            return res.status(404).json({ message: 'News item not found' });
        }

        // Optionally, delete associated files from the server here

        await newsItem.destroy();
        res.status(200).json({ message: 'News item deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

}

module.exports = Controller