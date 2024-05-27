const connection = require("./db");

const createTables = () => {
  let sql1_d = "DROP TABLE IF EXISTS Restaurants";
  connection.query(sql1_d, function (err) {
    if (err) throw err;
    console.log("Table Restaurants dropped");

    let sql1 =
      "CREATE TABLE Restaurants (id INT(11) AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), city VARCHAR(100), places INT(10), terrace VARCHAR(3), parking VARCHAR(3))";
    connection.query(sql1, function (err) {
      if (err) throw err;
      console.log("Table Restaurants created");

      let sql2_d = "DROP TABLE IF EXISTS Employes";
      connection.query(sql2_d, function (err) {
        if (err) throw err;
        console.log("Table Employes dropped");

        let sql2 =
          "CREATE TABLE Employes (id INT(11) AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(100), last_name VARCHAR(100), hire_date DATE, restaurant_id INT(11), FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id))";
        connection.query(sql2, function (err) {
          if (err) throw err;
          console.log("Table Employes created");

          let dummyRestaurants = [
            {
              name: "Café de la paix",
              city: "Grenoble",
              places: 50,
              terrace: "non",
              parking: "oui",
            },
            {
              name: "Restaurant le Hublot",
              city: "Annecy",
              places: 40,
              terrace: "oui",
              parking: "non",
            },
            {
              name: "Le Belvedère",
              city: "La Chambotte",
              places: 80,
              terrace: "oui",
              parking: "oui",
            },
          ];

          let insertRestaurantSql =
            "INSERT INTO Restaurants (name, city, places, terrace, parking) VALUES ?";
          connection.query(
            insertRestaurantSql,
            [dummyRestaurants.map((r) => [r.name, r.city, r.places, r.terrace, r.parking])],
            function (err) {
              if (err) throw err;
              console.log("Dummy data inserted into Restaurants table");
            }
          );

          let dummyEmployees = [
            {
              first_name: "Jack",
              last_name: "Hikes",
              hire_date: "2022-10-22",
              restaurant_id: 1,
            },
            {
              first_name: "John",
              last_name: "Smith",
              hire_date: "2018-02-02",
              restaurant_id: 3,
            },
            {
              first_name: "Paul",
              last_name: "Gates",
              hire_date: "2018-02-02",
              restaurant_id: 3,
            },
            {
              first_name: "Mathew",
              last_name: "Domica",
              hire_date: "2012-04-11",
              restaurant_id: 2,
            },
            {
              first_name: "Joe",
              last_name: "Alburn",
              hire_date: "2018-02-02",
              restaurant_id: 1,
            },
          ];

          let insertEmployeeSql =
            "INSERT INTO Employes (first_name, last_name, hire_date, restaurant_id) VALUES ?";
          connection.query(
            insertEmployeeSql,
            [dummyEmployees.map((e) => [e.first_name, e.last_name, e.hire_date, e.restaurant_id])],
            function (err) {
              if (err) throw err;
              console.log("Dummy data inserted into Employees table");
            }
          );
        });
      });
    });
  });
};

module.exports = createTables;
