//Tư duy xây dựng model
/*
- 1 model tương ứng với 1 table
- 1 controller có thể có nhiều model
*/
const sql = require("../utils/db");
module.exports = {
    all: (keyword, status) => {
        // const filter = keyword ? sql`WHERE LOWER(name) LIKE ${"%" + keyword.toLowerCase() + "%"}`:sql``;
        // return sql`SELECT * FROM courses ${filter} ORDER BY id DESC`;
        let filter = sql`WHERE name is NOT NULL`;
        if(status === 'active' || status === 'inactive') {
            filter = sql`${filter} AND status=${status === "active" ? true : false}`;
        }
        if(keyword) {
            filter = sql`${filter} AND LOWER(name) LIKE ${"%" + keyword.toLowerCase() + "%"}`;
        }
        return sql`SELECT * FROM courses ${filter} ORDER BY id DESC`;
    },
    courseUnique: async(name) => {
        const result = await sql`SELECT id FROM courses WHERE LOWER(name)=${name.trim().toLowerCase()}`;
        if(result.length) {
            return false;
        }
        return true;
    },
    get: (id) => {},
    create: async(data) => {
        // console.log(data);
        const name = data.name;
        const price = data.price;
        const status = data.status;
        return sql`INSERT INTO courses(name, price, status) VALUES(${name}, ${price}, ${status === 'active' ? true : false})`;
    },
    update: (data, id) => {
        console.log(data);
        return sql`UPDATE courses 
        SET name=${data.name}, price=${data.price}, status=${data.status === 'active' ? true : false}
        WHERE id=${id}`;
    },
    delete: (id) => {
        // console.log(id);
        return sql`DELETE FROM courses WHERE courses.id=${id}`;
        // return sql`SELECT * FROM courses WHERE id=${id}`;
    },
    findId: (id) => {
        // console.log(id);
        return sql`SELECT * FROM courses WHERE id=${id}`;
    }
    // search: (status) => {
    //     const filter = status ? 
    // }
};