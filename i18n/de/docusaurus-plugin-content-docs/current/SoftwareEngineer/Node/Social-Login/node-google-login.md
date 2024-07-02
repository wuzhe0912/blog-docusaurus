---
id: node-google-login
title: '📜 Node - Google Login'
slug: /node-google-login
---

## Requirements Specification

1. 使用 node.js, express 實作 google login.
2. 專案需進行適當優化，將該拆分的檔案與資料夾進行調整。

## Project Structure

```md
true-salary-story-client-api/
├── src/
│ ├── app.js
│ ├── config/
│ │ ├── database.js
│ │ ├── passport.js
│ ├── models/
│ │ ├── User.js
│ ├── routes/
│ │ ├── auth.js
├── .env
├── .gitignore
```

## Environment Variables

```env
GOOGLE_CLIENT_ID = your google client id
GOOGLE_CLIENT_SECRET = your google client secret
JWT_SECRET = use openssl rand -base64 32 generate
FRONTEND_URL = http://localhost:3001
```

## config

### passport.js

```js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database.
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If the user doesn't exist, create a new user.
          user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        // Create a JSON Web Token (JWT) for the user.
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        // Add the token to the user object.
        user.token = token;

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
```

### database.js

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://localhost:27017/true-salary-story-client',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## models

### User.js

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
```

## routes

### auth.js

```js
const express = require('express');
const router = express.Router();
const passport = require('config/passport');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${req.user.token}`);
  }
);

module.exports = router;
```

## app.js

```js
// Group all require statements together
require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('config/database');
const authRoutes = require('routes/auth');
const passport = require('passport');
require('config/passport');

// Initialize Express application
const app = express();

// Connect to the database
connectDB();

// Configure middleware
app.use(cors());
app.use(passport.initialize());

// Set up routes
app.use('/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Repo

- [Github Repo - branch](https://github.com/wuzhe0912/true-salary-story-client-api/tree/feat/google-login-api)
