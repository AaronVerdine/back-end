const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("./auth-model");

//implement user registration
router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);

  user.password = hash;

  Users.add(user)
    .then((saved) => {
      if (req.body) {
        res.status(201).json(saved).send(`<h1>User created successfully!</h1>`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//implement user login
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        req.session.user = {
          id: user.id,
          username: user.username,
          token: user.token,
        };
        res.status(201).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ errorMessage: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// generate token
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "8h",
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({
          message: "There was an error logging out this user",
        });
      } else {
        res.status(200).json({ message: "logged out succeffully" });
      }
    });
  } else {
    res.status(200).json({ message: "already logged out" });
  }
});

module.exports = router;