let categorys = [
    {
      id_category: 1,
      name: "baju",
    },
    {
      id_category: 2,
      name: "sepatu",
    },
    {
      id_category: 3,
      name: "celana",
    },
  ];
  
  let categoryController = {
    getAllCategory: (req, res) => {
      res.send(categorys);
    },
    getDetailCategory: (req, res) => {
      const id = Number(req.params.id);
      let category = categorys.find((category) => category.id_category === id);
      res.send(category);
    },
    createCategory: (req, res) => {
      const { name,  } = req.body;
      const newCategory = {
        id_category: categorys.length + 1,
        name
      };
      categorys.push(newCategory);
      res.json({ message: "category created" });
    },
    updateCategory: (req, res) => {
      const id = Number(req.params.id);
      const index = categorys.findIndex((category) => category.id_category === id);
      const { name } = req.body;
      const updateCategory = {
        id_category: categorys[index].id_category,
        name
      };
      categorys[index] = updateCategory;
      res.json({ message: "category updated" });
    },
    deleteCategory: (req, res) => {
      const id = Number(req.params.id);
      const index = categorys.findIndex((category) => category.id_category === id);
      categorys.splice(index, 1);
      res.json({ message: "category deleted" });
    },
  };
  
  module.exports = categoryController;