const path = require('path');
const { randomNumber } = require('../helpers/libs');
const fs = require('fs-extra');
const md5 = require('md5');

const { Image, Comment } = require('../models');

const ctrl = {};

//aca es donde manejamos la logica
//separada de lo demas

ctrl.index = async (req, res) => {

    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    const comments = await Comment.find({image_id: image._id});
    
    res.render('images', { image, comments });
     
};

ctrl.create =  (req, res) => {

     const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = await Image.find({ filename: imgUrl });
        if (images.length > 0) {

            saveImage();

        }else{

            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
      
            if(ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
      
                    await fs.rename(imageTempPath, targetPath);
                      const newImg = new Image({
                        title: req.body.title,
                        description: req.body.description,
                        filename: imgUrl + ext,
                      });
                    const imageSaved = await newImg.save();
                    res.redirect('/images/' + imgUrl);

            }else{
    
                    await fs.unlink(imageTempPath);
                    res.status(500).json({error: 'Only Images are allowed'});
    
            }

        }
        
     };

     saveImage();

};

ctrl.like = (req, res) => {
     
};

ctrl.comment = async (req, res) => {
  const image = await Image.findOne({filename: {$regex: req.params.image_id}});
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();
    
    res.redirect('/images/' + image.uniqueId);

  }
  
  
  
};

ctrl.remove = (req, res) => {

};


module.exports = ctrl;