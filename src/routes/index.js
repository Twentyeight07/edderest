import { Router } from 'express';
const router = Router();
import { uploader } from '../cloudinary.js';
import { multerUploads } from '../multer.js';

import { Image } from '../models/Image.js';
import { User } from '../models/Users.js';
import { isAuthenticated } from '../lib/helpers.js';

router.get('/', isAuthenticated, async (req, res) => {
  const images = await Image.find().populate('userId', {
    fullname: 1,
    username: 1,
    _id: 0,
  });
  console.log(images);
  res.render('index', { images });
});

router.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload');
});

router.post('/upload', isAuthenticated, multerUploads, async (req, res) => {
  const image = new Image();
  const user = await User.findById(req.user.id);
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'edderest',
  };

  try {
    //cloudinary upload
    const result = await uploader.upload(req.file.path, options);

    const imagePath = result.secure_url;
    const imageId = result.public_id;

    //database upload
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = await imagePath;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    image.created_at = Date.now();
    image.cloudinary_id = await imageId;
    image.userId = req.user.id;

    await image.save();

    user.images.concat(await image._id);
    await user.save();
    // console.log(user);

    req.flash('success_msg', 'Image uploaded! :) ');
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

router.get('/image/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id).populate('userId');
  const isOwner = image.userId._id == req.user.id;
  const isAdmin = req.user.admin;
  res.render('picture', { img: image, owner: isOwner, admin: isAdmin });
});

router.get('/image/:id/delete', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const image = await Image.findByIdAndDelete(id);
  await uploader
    .destroy(image.cloudinary_id)
    .then((result) => console.log(result));

  res.redirect('/');
});

export default router;
