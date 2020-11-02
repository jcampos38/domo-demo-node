const dbConnection = require("../dbConnection");
const queries = require("../queries/queries");

module.exports = class UserDao {
  static async findUser(email) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let todo = await con.query(queries.find_user, [email]);
      await con.query("COMMIT");
      todo = JSON.parse(JSON.stringify(todo));
      return todo;
    } catch (ex) {
      console.log(ex);
      throw ex;
    } finally {
      await con.release();
      await con.destroy();
    }
  }
};