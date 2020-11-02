const dbConnection = require("../dbConnection");
const queries = require("../queries/queries");

module.exports = class VisualizationDao {
  static async getVisualizationsByUser(email) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let todo = await con.query(queries.get_vis_by_user, [email]);
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

  static async getFiltersByVisId(email, id) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let todo = await con.query(queries.get_filters_by_vis, [email, id]);
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

  static async getDomoId(idVisualization) {
    let con = await dbConnection();
    try {
      await con.query("START TRANSACTION");
      let todo = await con.query(queries.get_domo_id, [idVisualization]);
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