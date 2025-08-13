const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DATABASE_NAME;
    if (!uri || !dbName) {
      throw new Error('MongoDB URI or database name is not defined in environment variables');
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName, 
    });
    console.log(`MongoDB Connected to database: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
