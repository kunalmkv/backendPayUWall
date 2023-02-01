const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const https = require('https');

const user = require('./models/user');
const userWallet = require('./models/wallet');
const Order = require('./models/orders');
const sequelize = require('./util/database');
const purchaseRoutes = require('./routes/purchase');
const premiumRoute = require('./routes/premium');


// get config vars
dotenv.config();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


var cors = require('cors');

const newUserRoutes = require('./routes/newUser');
const existingUserRoutes = require('./routes/existingUser');
const expenseRoutes = require('./routes/expense');
const passwordRoutes = require('./routes/password');
const { default: helmet } = require('helmet');

const PORT = process.env.port || 3000;


const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert')

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cors());
app.use(bodyParser.json());



app.use('/premium', premiumRoute);
app.use('/newUser', newUserRoutes);
app.use('/existingUser', existingUserRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/password', passwordRoutes);
app.use('/user', expenseRoutes);



user.hasMany(userWallet);
userWallet.belongsTo(user);

user.hasMany(Order);
Order.belongsTo(user);
sequelize.sync().then(result => {

    //  https
    // .createServer({ key: privateKey, cert: certificate }, app)
    //  .listen(PORT);
    app.listen(PORT);
})
    .catch(err => {
        console.log(err);
    })
