module.exports = {
    find_user: `SELECT * FROM user WHERE user.email = ?`,
    get_vis_by_user: `SELECT uvf.idVisualization, v.title FROM user_visualization_filter uvf, visualization v 
    WHERE uvf.idVisualization = v.idVisualization AND uvf.email = ?`,
    get_filters_by_vis: `SELECT f.column, f.operator, f.values FROM user_visualization_filter uvf, visualization v,
    filter f WHERE uvf.idFilter = f.idFilter AND uvf.idVisualization= v.idVisualization
    AND uvf.email = ? AND uvf.idVisualization = ?`,
    get_domo_id: `SELECT v.idDomo FROM visualization v WHERE v.idVisualization = ?`
}