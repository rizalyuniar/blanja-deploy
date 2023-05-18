const Pool = require('../config/db');

const selectAllCategory = (search,sortBY,sort,limit,offset) =>{
    return Pool.query(`SELECT * FROM categorys WHERE name LIKE '%${search}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectCategory = (id) =>{
    return Pool.query(`SELECT * FROM categorys WHERE id='${id}'`);
}

const insertCategory = (data) =>{
    const { id,name} = data;
    return Pool.query(`INSERT INTO categorys(id,name) VALUES('${id}','${name}')`);
}

const updateCategory = (data) =>{
    const { id,name} = data;
    return Pool.query(`UPDATE categorys SET name='${name}' WHERE id='${id}'`);
}

const deleteCategory = (id) =>{
    return Pool.query(`DELETE FROM categorys WHERE id='${id}'`);
}

const countData = () =>{
    return Pool.query('SELECT COUNT(*) FROM categorys')
  }
  
const findId =(id)=>{
    return  new Promise ((resolve,reject)=> 
    Pool.query(`SELECT id FROM categorys WHERE id='${id}'`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
  }

module.exports = {
    selectAllCategory,
    selectCategory,
    insertCategory,
    updateCategory,
    deleteCategory,
    countData,
    findId
}