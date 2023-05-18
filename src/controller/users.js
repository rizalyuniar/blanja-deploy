const {
  findEmail,
//   create,
  createUser,
  selectUserEmail
  // createUsers,
  // createUsersVerification,
  // checkUsersVerification,
  // deleteUsersVerification,
  // updateAccountVerification,
  // findId,
} = require("../model/users");

const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require('jsonwebtoken')
const { sendMail } = require("../config/mail");

const userController = {
  register: async (req, res) => {
    try {
      const { email, password, fullname } = req.body;
      const { rowCount } = await findEmail(email)
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();

      if (rowCount) {
        return res.json({
          Message: "Email is already exist",
        })
      }

      let data = {
        id,
        email,
        password: passwordHash,
        fullname,
        role: "seller",
      };
      createUser(data)
        .then((result) => 
          commonHelper.response(res, result.rows, 201, "Register success")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { rows: [user], } = await findEmail(email);
      if (!user) {
        return res.status(403).json({
          Message : "Email is invalid"
        })
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return res.status(403).json({
          Message : "Password is invalid"
        })
      }
      delete user.password;
      const payload = {
        email: user.email,
        role: user.role,
      };
      user.token = authHelper.generateToken(payload);
      user.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, user, 201, "login is successful");
    } catch (error) {
      console.log(error);
    }
  },
  refreshToken: (req, res) => {
    const refreshToken = req.body.refreshToken;
    const decoded = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
    const payload = {
      email: decoded.email,
      role: decoded.role,
    }
    const result = {
      token: authHelper.generateToken(payload),
      refreshToken: authHelper.generateRefreshToken(payload),
    };
    commonHelper.response(res,result,200);
  },
  profile: async (req, res, next) => {
    const email = req.payload.email;
    const role = req.payload.role;
    if (role == "customer") {
      return res.json({
        Message : "unauthorized"
      })
    }
    const {
      rows: [user],
    } = await findEmail(email);
    delete user.password;
    commonHelper.response(res, user, 200);
  },

  registerVerif: async (req, res) => {
    try {
      const { email, password, fullname } = req.body;
      const { rowCount } = await findEmail(email)
      if (rowCount) {
        return res.json({
          Message: "Email is already exist",
        })
      }
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();
      const payload = {
        fullname,
        email: req.body.email,
        password: passwordHash,
        id: id,
        role: "seller",
      };
      console.log(payload);
      const token = authHelper.generateToken(payload);
      sendMail(token, req.body.email);
      console.log(token);
      commonHelper.response(res, null, 200, "Check your email");
    } catch (error) {
      commonHelper.response(res, null, 500, error.detail);
    }
  },

  verifUser: async (req, res) => {
    const token = req.params.id;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.SECRETE_KEY_JWT);
    } catch (error) {
        if (error && error.name === "JsonWebTokenError") {
            return commonHelper.response(res, null, 401, "Token invalid");
        } else if (error && error.name === "TokenExpiredError") {
            return commonHelper.response(res, null, 403, "Token expired");
        } else {
            return commonHelper.response(res, null, 401, "Token not active");
        }
    }
    
    try {
      const result = await selectUserEmail(decoded.email);
      if (result.rowCount > 0) {
        return commonHelper.response(res, null, 400, "Email already verified");
      }
    } catch (err) {
      console.log(err);
      return commonHelper.response(res, null, 500, err.detail);
    }
    createUser(decoded)
      .then((result) => {
        // Display the result
        return commonHelper.response(res, result.rows, 201, "User created");
      })
      .catch((err) => {
        console.log(err);
        return commonHelper.response(res, null, 400, err.detail);
      });
  },
};

module.exports = userController;
