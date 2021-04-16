const mongoose = require('mongoose');

const db = process.env.MONGO_URI;

return new Promise((res, rej) => {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('Connected to Database');
  res(true);
});
