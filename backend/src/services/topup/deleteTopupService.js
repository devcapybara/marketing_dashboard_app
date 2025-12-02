const Topup = require('../../models/Topup');
const cloudinary = require('../../config/cloudinary');

async function deleteTopupService(topupId) {
  try {
    const topup = await Topup.findById(topupId);

    if (!topup) {
      throw new Error('Topup not found');
    }

    // Delete receipt from Cloudinary if exists
    if (topup.receiptUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = topup.receiptUrl.split('/');
        const publicId = urlParts[urlParts.length - 1].split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
        
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting receipt from Cloudinary:', cloudinaryError);
        // Continue with topup deletion even if Cloudinary deletion fails
      }
    }

    await Topup.findByIdAndDelete(topupId);

    return { message: 'Topup deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteTopupService;

