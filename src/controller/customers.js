const {
    findEmail,
    createCustomer,
    selectAllCustomer,
    selectCustomer,
    // insertCustomer,
    updateCustomer,
    deleteCustomer,
    countData,
    findId,
  } = require("../model/customers");
  const commonHelper = require("../helper/common");
  const authHelper = require('../helper/auth');
  const bcrypt = require("bcryptjs");
  const { v4: uuidv4 } = require("uuid");
  const jwt = require('jsonwebtoken')
  
  const customerController = {
    register: async (req, res) => {
      try {
        const { email, password, fullname, phone, tgl_lahir } = req.body;
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
          phone,
          tgl_lahir,
          role: "customer",
        };
        createCustomer(data)
          .then((result) => 
            commonHelper.response(res, result.rows, 201, "Register customer success")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },
    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const { rows: [customer], } = await findEmail(email);
        if (!customer) {
          return res.json({
            Message : "Email is invalid"
          })
        }
        const isValidPassword = bcrypt.compareSync(password, customer.password);
  
        if (!isValidPassword) {
          return res.json({
            Message : "Password is invalid"
          })
        }
        delete customer.password;
        const payload = {
          email: customer.email,
          role: customer.role,
        };
        customer.token = authHelper.generateToken(payload);
        customer.refreshToken = authHelper.generateRefreshToken(payload);
  
        commonHelper.response(res, customer, 201, "login is successful");
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
      if (role == "seller") {
        return res.json({
          Message : "unauthorized"
        })
      }
      const {
        rows: [customer],
      } = await findEmail(email);
      delete customer.password;
      commonHelper.response(res, customer, 200);
    },
    getAllCustomer: async (req, res) => {
      const role = req.payload.role;
      if (role == "seller") {
        return res.json({
          Message : "unauthorized"
        })
      }
      try {
        let sortBY = req.query.sortBY || "id";
        let search = req.query.search || "";
        let sort = req.query.sort || 'ASC';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const result = await selectAllCustomer(search,sortBY,sort,limit,offset);
        const {
          rows: [count],
        } = await countData();
        const totalData = parseInt(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit: limit,
          totalData: totalData,
          totalPage: totalPage,
        };
        commonHelper.response(res, result.rows, 200, "get data success",pagination);
      } catch (error) {
        console.log(error);
      }
    },
    getDetailCustomer: async (req, res) => {
      const id = req.params.id;
      const {rowCount} = await findId(id);
      if (!rowCount) {
        return res.json({
          Message : "data not found"
        })
      }
      selectCustomer(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "get data by id success");
        })
        .catch((err) => res.send(err));
    },
    // createCustomer: async (req, res) => {
    //   const { name,phone,tgl_lahir,email,pw} = req.body;
    //   const {
    //     rows: [count],
    //   } = await countData();
    //   const id = Number(count.count) + 1;
    //   const data = {
    //     id,
    //     name,
    //     phone,
    //     tgl_lahir,
    //     email,
    //     pw,
    //   };
    //   insertCustomer(data)
    //     .then((result) =>
    //       commonHelper.response(res, result.rows, 201, "Customer created")
    //     )
    //     .catch((err) => res.send(err));
    // },
    updateCustomer: async (req, res) => {
      try {
        const id = req.params.id;
        const { email,password,fullname,phone,tgl_lahir,role } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const { rowCount } = await findId(id);
        if (!rowCount) {
          return res.json({
            Message: "data not found"
          });
        }
        const data = {
          id,
          email,
          password: passwordHash,
          fullname,
          phone,
          tgl_lahir,
          role,
        };
        updateCustomer(data)
          .then((result) => 
            commonHelper.response(res, result.rows, 200, "Customer updated")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },
    deleteCustomer: async (req, res) => {
      try {
        const id = req.params.id;
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({ message: "ID is Not Found" });
        }
        deleteCustomer(id)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Customer deleted")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },
  };
  
  module.exports = customerController;