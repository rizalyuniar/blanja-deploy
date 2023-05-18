const {
  selectAllCategory,
  selectCategory,
  insertCategory,
  updateCategory,
  deleteCategory,
  countData,
  findId,
} = require("../model/categorys");
const commonHelper = require("../helper/common");
const { v4: uuidv4 } = require("uuid");

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      let sortBY = req.query.sortBY || "id";
      let search = req.query.search || "";
      let sort = req.query.sort || 'ASC';
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const result = await selectAllCategory(search,sortBY,sort,limit,offset);
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
  getDetailCategory: async (req, res) => {
    const id = req.params.id;
    const {rowCount} = await findId(id);
    if (!rowCount) {
      return res.json({
        Message : "data not found"
      })
    }
    selectCategory(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "get data by id success");
      })
      .catch((err) => res.send(err));
  },
  createCategory: async (req, res) => {
    const role = req.payload.role;
    if (role == "customer") {
      return res.json({
        Message : "unauthorized"
      })
    }
    const { name } = req.body;
    const id = uuidv4();
    const data = {
      id,
      name,
    };
    insertCategory(data)
      .then((result) =>
        commonHelper.response(res, result.rows, 201, "Category created")
      )
      .catch((err) => res.send(err));
  },
  updateCategory: async (req, res) => {
    const role = req.payload.role;
    if (role == "customer") {
      return res.json({
        Message : "unauthorized"
      })
    }
    try {
      const id = req.params.id;
      const { name } = req.body;
      const { rowCount } = await findId(id);
      if (!rowCount) {
        return res.json({
          Message: "data not found"
        });
      }
      const data = {
        id,
        name,
      };
      updateCategory(data)
        .then((result) => 
          commonHelper.response(res, result.rows, 200, "Category updated")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
  deleteCategory: async (req, res) => {
    const role = req.payload.role;
    if (role == "customer") {
      return res.json({
        Message : "unauthorized"
      })
    }
    try {
      const id = req.params.id;
      const { rowCount } = await findId(id);
      if (!rowCount) {
        res.json({ message: "ID is Not Found" });
      }
      deleteCategory(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Category deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = categoryController;