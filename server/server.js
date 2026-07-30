import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dns from 'dns';
import Document from './models/Document.js';

// Force Node.js to resolve IPv4 addresses first (fixes querySrv ECONNREFUSED on modern Node versions)
dns.setDefaultResultOrder('ipv4first');

// Load environment variables (reload trigger #2)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/palace-archives';
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Cloudinary configuration fallback to placeholder if not set
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'placeholder_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder_secret'
});

// Configure Multer for Memory Storage (prevents temp file issues)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Stream Upload Helper for Cloudinary
const uploadFromBuffer = (fileBuffer, fileName, fileFormat) => {
  return new Promise((resolve, reject) => {
    // Determine file type category (PDF and docx are raw files in Cloudinary)
    // Cloudinary uploader requires resource_type auto or raw. auto is good but sometimes fails
    // for DOCX/other office files unless raw is specified. So we use auto.
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'palace_archives',
        public_id: fileName.split('.')[0] + '_' + Date.now() + '.' + fileFormat,
        use_filename: true
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// Route: Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Route: Upload document
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and Category are required fields' });
    }

    // Check Cloudinary config validity
    if (process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' || !process.env.CLOUDINARY_CLOUD_NAME) {
      // Mock upload for testing purposes if credentials are not filled
      console.warn('Using mock upload mode: Cloudinary credentials not configured.');
      const fileFormat = file.originalname.split('.').pop().toLowerCase();
      const mockDoc = new Document({
        title,
        description: description || '',
        category,
        url: '#mock-url-' + Date.now() + '.' + fileFormat,
        cloudinaryId: 'mock_id_' + Date.now(),
        format: fileFormat,
        size: file.size
      });
      await mockDoc.save();
      return res.json({ success: true, message: 'Mock upload successful (Credentials missing)', document: mockDoc });
    }

    // Upload buffer to Cloudinary
    const fileFormat = file.originalname.split('.').pop().toLowerCase();
    const result = await uploadFromBuffer(file.buffer, file.originalname, fileFormat);

    // Save document to DB
    const newDoc = new Document({
      title,
      description: description || '',
      category,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      format: result.format || fileFormat,
      size: result.bytes || file.size
    });

    await newDoc.save();
    res.json({ success: true, document: newDoc });
  } catch (error) {
    console.error('Upload error details:', error);
    res.status(500).json({ error: 'Failed to upload document to Cloudinary and database', details: error.message });
  }
});

// Route: Delete document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if it's a mock document
    if (doc.cloudinaryId.startsWith('mock_id_')) {
      await Document.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Mock document deleted successfully' });
    }

    // Delete from Cloudinary
    // Note: Documents (like pdf, docx) are raw files in Cloudinary, requiring resource_type: 'raw'
    // Images are resource_type: 'image'. We can check format or just default to raw since PDF/DOCX are raw.
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.format.toLowerCase());
    const resourceType = isImage ? 'image' : 'raw';

    await cloudinary.uploader.destroy(doc.cloudinaryId, { resource_type: resourceType });

    // Delete from MongoDB
    await Document.findByIdAndDelete(id);

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete document', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
