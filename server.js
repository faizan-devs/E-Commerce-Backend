const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log(`MongoDB Connected`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App running on PORT ${PORT}`);
});
