const mongoose = require('mongoose');

const uri = "mongodb+srv://ketam123:ketan123@hclproject.ww4ubc9.mongodb.net/digital-ad-bird?appName=Hclproject";

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to connect:", err.message);
    process.exit(1);
  });
