import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'components/img'),
    filename: (req, file, cb) => cb(null, req.params.id + '.jpeg')
});

const fileFilter = (req, file, cb) => file.mimetype == 'image/jpeg' ? cb(null, true) : cb(null, false)

const multerConfig = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default multerConfig;