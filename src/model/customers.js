const Pool = require('../config/db');

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(
      `SELECT * FROM customers WHERE email='${email}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const createCustomer = (data) => {
  const { id, email, password, fullname, phone, tgl_lahir, role } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO customers(id, email,password,fullname,phone,tgl_lahir,role) VALUES('${id}','${email}','${password}','${fullname}',${phone},'${tgl_lahir}','${role}')`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const selectAllCustomer = (search,sortBY,sort,limit,offset) =>{
    return Pool.query(`SELECT * FROM customers WHERE fullname LIKE '%${search}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectCustomer = (id) =>{
    return Pool.query(`SELECT * FROM customers WHERE id='${id}'`);
}

// const insertCustomer = (data) =>{
//     const { id,name,phone,tgl_lahir,email,pw} = data;
//     return Pool.query(`INSERT INTO customers(id,name,phone,tgl_lahir,email,pw) VALUES('${id}','${name}',${phone},'${tgl_lahir}','${email}','${pw}')`);
// }

const updateCustomer = (data) =>{
    const { id, email, password, fullname, phone, tgl_lahir, role } = data;
    return Pool.query(`UPDATE customers SET email='${email}', password='${password}', fullname='${fullname}', phone=${phone}, tgl_lahir='${tgl_lahir}', role='${role}' WHERE id='${id}'`);
}

const deleteCustomer = (id) =>{
    return Pool.query(`DELETE FROM customers WHERE id='${id}'`);
}

const countData = () =>{
    return Pool.query('SELECT COUNT(*) FROM customers')
  }
  
const findId =(id)=>{
    return  new Promise ((resolve,reject)=> 
    Pool.query(`SELECT id FROM customers WHERE id='${id}'`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
  }

module.exports = {
    findEmail,
    createCustomer,
    selectAllCustomer,
    selectCustomer,
    // insertCustomer,
    updateCustomer,
    deleteCustomer,
    countData,
    findId
}