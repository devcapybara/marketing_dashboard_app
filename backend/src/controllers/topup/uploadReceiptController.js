const cloudinary = require('../../config/cloudinary');
const multer = require('multer');
const { Readable } = require('stream');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
}).single('receipt');

async function uploadReceiptController(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    try {
      // Convert buffer to stream
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'topup-receipts',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: 'Failed to upload receipt to Cloudinary',
              error: error.message,
            });
          }

          return res.status(200).json({
            success: true,
            message: 'Receipt uploaded successfully',
            data: {
              receiptUrl: result.secure_url,
              publicId: result.public_id,
            },
          });
        }
      );

      // Pipe buffer to stream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    } catch (error) {
      next(error);
    }
  });
}

module.exports = uploadReceiptController;

