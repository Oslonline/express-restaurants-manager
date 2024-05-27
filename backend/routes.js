const express = require("express");
const connection = require("./db");

const app = express();

app.use(express.json());

// RESTAURANTS
// add restaurant
app.post("/restaurants", (req, res) => {
  let sql =
    "INSERT INTO restaurants (name, city, places, terrace, parking) VALUES (?, ?, ?, ?, ?)";
  let values = [
    req.body.name,
    req.body.city,
    req.body.places,
    req.body.terrace,
    req.body.parking,
  ];

  connection.query(sql, values, function (err) {
    if (err) throw err;
    console.log("Record inserted into Restaurants table");
    res.status(200).end();
  });
});

// display all restaurants
app.get("/restaurants", (req, res) => {
  let sql = "SELECT restaurants.*, COUNT(employes.id) AS employeeCount FROM restaurants LEFT JOIN employes ON restaurants.id = employes.restaurant_id GROUP BY restaurants.id";

  connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
});

// display specific restaurant via restaurant id
app.get("/restaurants/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let sql = "SELECT * FROM restaurants WHERE id = ?";

  connection.query(sql, [id], function (err, row) {
    if (err) throw err;
    res.json(row);
  });
});

// modify restaurant data via restaurant id
app.put("/restaurants/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let updateData = req.body;
  let sql = "UPDATE restaurants SET ? WHERE id = ?";

  connection.query(sql, [updateData, id], function (err) {
    if (err) throw err;
    console.log("Restaurant updated successfully");
    res.status(200).end();
  });
});

// delete restaurant via restaurant id
app.delete("/restaurants/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let deleteEmployeesSql = "DELETE FROM employes WHERE restaurant_id = ?";

  connection.query(deleteEmployeesSql, [id], function (err) {
    if (err) throw err;
    console.log("Employees of the restaurant deleted successfully");
    let deleteRestaurantSql = "DELETE FROM restaurants WHERE id = ?";

    connection.query(deleteRestaurantSql, [id], function (err) {
      if (err) throw err;
      console.log("Restaurant deleted successfully");
      res.status(200).end();
    });
  });
});

// EMPLOYEES
// add employee via restaurant id
app.post("/restaurants/:id/employees", (req, res) => {
  let restaurantId = parseInt(req.params.id);
  let newEmployee = req.body;
  newEmployee.restaurant_id = restaurantId;
  let sql = "INSERT INTO employes SET ?";

  connection.query(sql, newEmployee, function (err) {
    if (err) throw err;
    console.log("Employee inserted into Employes table");
    res.status(200).end();
  });
});

// display all employees via restaurant id
app.get("/restaurants/:rid/employees", (req, res) => {
  let restaurantId = parseInt(req.params.rid);
  let sql = "SELECT * FROM employes WHERE restaurant_id = ?";

  connection.query(sql, restaurantId, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
});

// display specific employee via restaurant id & employee id
app.get("/restaurants/:rid/employees/:id", (req, res) => {
  let restaurantId = parseInt(req.params.rid);
  let employeeId = parseInt(req.params.id);
  let sql = "SELECT * FROM employes WHERE restaurant_id = ? AND id = ?";

  connection.query(sql, [restaurantId, employeeId], function (err, rows) {
    if (err) throw err;
    if (rows.length === 0) {
      res.status(404).json({ error: "Employee not found" });
    } else {
      res.json(rows[0]);
    }
  });
});

app.put("/restaurants/:rid/employees/:id", (req, res) => {
  let restaurantId = parseInt(req.params.rid);
  let employeeId = parseInt(req.params.id);
  let updateData = req.body;
  let sql = "UPDATE employes SET ? WHERE restaurant_id = ? AND id = ?";

  connection.query(
    sql,
    [updateData, restaurantId, employeeId],
    function (err) {
      if (err) {
        console.error("Error updating employee:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log("Employee updated successfully");
      res.status(200).end();
    }
  );
});


// delete employee via restaurant id & employee id
app.delete("/restaurants/:rid/employees/:id", (req, res) => {
  let restaurantId = parseInt(req.params.rid);
  let employeeId = parseInt(req.params.id);
  let sql = "DELETE FROM employes WHERE restaurant_id = ? AND id = ?";

  connection.query(sql, [restaurantId, employeeId], function (err) {
    if (err) throw err;
    console.log("Employee deleted successfully");
    res.status(200).end();
  });
});

module.exports = app;