import { Router } from 'express';
const router = Router();
import { uploader } from '../cloudinary.js';
import { multerUploads } from '../multer.js';

import { Image } from '../models/Image.js';

router.get('/', async (req, res) => {
  const images = await Image.find();
  res.render('index', { images });
});

router.get('/upload', (req, res) => {
  res.render('upload');
});

router.post('/upload', multerUploads, async (req, res) => {
  const image = new Image();
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

    await image.save();

    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

router.get('/image/:id', async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);
  res.render('profile', { img: image });
});

router.get('/image/:id/delete', async (req, res) => {
  const { id } = req.params;
  const image = await Image.findByIdAndDelete(id);
  await uploader
    .destroy(image.cloudinary_id)
    .then((result) => console.log(result));

  res.redirect('/');
});

export default router;
