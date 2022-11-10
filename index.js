const express = require('express');
const mongoose = require('mongoose');
const { MONGO_IP, MONGO_PORT, MONGO_USER, MONGO_PASSWORD, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

const session = require('express-session');
const redis = require("redis");
const cors = require('cors');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}?authSource=admin`;

const connectWithRetry = () => {
  mongoose
  .connect(mongoURL)
  .then(() => console.log('Success connected to DB.'))
  .catch((e) => {
    console.log(e);
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();


// REDIS SESSION CONFIGURATION
let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient({ 
  legacyMode: true,
  url: `redis://${REDIS_URL}:${REDIS_PORT}`
});
redisClient.connect()
  .then(() => console.log('Success connected to REDIS'))
  .catch((e) => console.error(e));

app.enable("trust proxy");
app.use(cors({}));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: true,
    secret: SESSION_SECRET,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    }
  }),
);

app.use(express.json());

app.get('/api/v1', (req, res) => {
  res.send('<h2>Hello-world!111!!!==>!DEVELOPMENT MODE => </h2>');
  console.log('ITS RUNNING...');
})

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));