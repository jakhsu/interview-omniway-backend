const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:3033", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Load figures data from JSON file
const figures = JSON.parse(
  fs.readFileSync(path.join(__dirname, "figures.json"))
);

// Hardcoded user data
const user = {
  identifier: "002@m-inno.com",
  password: "Pass002",
};

// Secret keys
const accessTokenSecret = "access-secret-key";
const refreshTokenSecret = "refresh-secret-key";

// Endpoint to login and get tokens
app.post("/api/auth/local", (req, res) => {
  const { identifier, password } = req.body;

  // Simple user verification
  if (identifier === user.identifier && password === user.password) {
    const accessToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      accessTokenSecret,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      refreshTokenSecret,
      {
        expiresIn: "5m",
      }
    );

    const hardcodedResponse = {
      jwt: accessToken,
      user: {
        id: 2,
        username: "002",
        email: "002@m-inno.com",
        provider: "local",
        confirmed: true,
        blocked: false,
        displayName: "Ms. Two",
        createdAt: "2024-07-04T14:01:46.100Z",
        updatedAt: "2024-07-04T14:01:46.100Z",
        photoURL: {
          id: 2,
          name: "avatar.webp",
          alternativeText: null,
          caption: null,
          width: 512,
          height: 512,
          formats: {
            small: {
              ext: ".webp",
              url: "/uploads/small_avatar_95e95c45c3.webp",
              hash: "small_avatar_95e95c45c3",
              mime: "image/webp",
              name: "small_avatar.webp",
              path: null,
              size: 13.23,
              width: 500,
              height: 500,
            },
            xsmall: {
              ext: ".webp",
              url: "/uploads/xsmall_avatar_95e95c45c3.webp",
              hash: "xsmall_avatar_95e95c45c3",
              mime: "image/webp",
              name: "xsmall_avatar.webp",
              path: null,
              size: 1.45,
              width: 64,
              height: 64,
            },
            thumbnail: {
              ext: ".webp",
              url: "/uploads/thumbnail_avatar_95e95c45c3.webp",
              hash: "thumbnail_avatar_95e95c45c3",
              mime: "image/webp",
              name: "thumbnail_avatar.webp",
              path: null,
              size: 4.14,
              width: 156,
              height: 156,
            },
          },
          hash: "avatar_95e95c45c3",
          ext: ".webp",
          mime: "image/webp",
          size: 12.28,
          url: "/uploads/avatar_95e95c45c3.webp",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2024-07-04T14:01:39.036Z",
          updatedAt: "2024-07-04T14:01:39.036Z",
        },
      },
    };

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, path: "/" });

    return res.json(hardcodedResponse);
  }

  res.status(401).send("Invalid credentials");
});

// Endpoint to login and get tokens (mobile only)
app.post("/api/auth/mobile", (req, res) => {
  const { identifier, password } = req.body;

  // Simple user verification
  if (identifier === user.identifier && password === user.password) {
    const accessToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      accessTokenSecret,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      refreshTokenSecret,
      {
        expiresIn: "5m",
      }
    );

    const hardcodedResponse = {
      jwt: accessToken,
      refreshToken, // Include refresh token in response payload
      user: {
        id: 2,
        username: "002",
        email: "002@m-inno.com",
        provider: "local",
        confirmed: true,
        blocked: false,
        displayName: "Ms. Two",
        createdAt: "2024-07-04T14:01:46.100Z",
        updatedAt: "2024-07-04T14:01:46.100Z",
        photoURL: {
          id: 2,
          name: "avatar.webp",
          alternativeText: null,
          caption: null,
          width: 512,
          height: 512,
          formats: {
            small: {
              ext: ".webp",
              url: "/uploads/small_avatar_95e95c45c3.webp",
              hash: "small_avatar_95e95c45c3",
              mime: "image/webp",
              name: "small_avatar.webp",
              path: null,
              size: 13.23,
              width: 500,
              height: 500,
            },
            xsmall: {
              ext: ".webp",
              url: "/uploads/xsmall_avatar_95e95c45c3.webp",
              hash: "xsmall_avatar_95e95c45c3",
              mime: "image/webp",
              name: "xsmall_avatar.webp",
              path: null,
              size: 1.45,
              width: 64,
              height: 64,
            },
            thumbnail: {
              ext: ".webp",
              url: "/uploads/thumbnail_avatar_95e95c45c3.webp",
              hash: "thumbnail_avatar_95e95c45c3",
              mime: "image/webp",
              name: "thumbnail_avatar.webp",
              path: null,
              size: 4.14,
              width: 156,
              height: 156,
            },
          },
          hash: "avatar_95e95c45c3",
          ext: ".webp",
          mime: "image/webp",
          size: 12.28,
          url: "/uploads/avatar_95e95c45c3.webp",
          previewUrl: null,
          provider: "local",
          provider_metadata: null,
          createdAt: "2024-07-04T14:01:39.036Z",
          updatedAt: "2024-07-04T14:01:39.036Z",
        },
      },
    };

    return res.json(hardcodedResponse);
  }

  res.status(401).send("Invalid credentials");
});

// Endpoint to refresh the access token
app.post("/api/token/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { identifier: user.identifier, id: user.id },
      accessTokenSecret,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      refreshTokenSecret,
      {
        expiresIn: "5m",
      }
    );
    res.cookie("refreshToken", refreshToken, { httpOnly: true, path: "/" });
    res.json({ accessToken });
  });
});

// Endpoint to refresh the access token for mobile
app.post("/api/token/refresh/mobile", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { identifier: user.identifier, id: user.id },
      accessTokenSecret,
      {
        expiresIn: "20s",
      }
    );
    const newRefreshToken = jwt.sign(
      { identifier: user.identifier, id: 2 },
      refreshTokenSecret,
      {
        expiresIn: "5m",
      }
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  });
});

// Middleware to authenticate access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Protected endpoint
app.get("/protected", authenticateToken, (req, res) => {
  res.send("protected resource");
});

// New protected figures endpoint
app.get("/api/figures", authenticateToken, (req, res) => {
  res.json(figures);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
