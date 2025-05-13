const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 16004,
  ssl: { rejectUnauthorized: true },
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home route

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user `;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      //   console.log(result);

      let counts = result[0]["count(*)"];

      res.render("home.ejs", { counts });
    });
  } catch (err) {
    console.log(err);
  }
});

//   show user

app.get("/users", (req, res) => {
  let q = `SELECT * FROM user `;
  try {
    connection.query(q, (err, users) => {
      if (err) {
        throw err;
      }
      //   console.log(result);

      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});
// Edit Route
app.get("/users/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while fetching user data");
  }
});

//  update route

app.patch("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newusername } = req.body;

  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      let user = result[0];
      if (formPass != user.password) {
        res.send("wrong password");
      } else {
        let q2 = `UPDATE user SET username = '${newusername} 'WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while fetching user data");
  }
});

app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/users", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4(); // Generate a unique ID for the user

  let q = `INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)`;

  connection.query(q, [id, email, username, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error occurred while adding user");
    }
    res.redirect("/users");
  });
});

// delete get

app.get("/users/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while fetching user data");
  }
});

// delete post

app.delete("/users/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass } = req.body;

  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      let user = result[0];

      // Check if the password matches
      if (formPass !== user.password) {
        return res.send("Wrong password");
      }

      // Proceed to delete the user
      let q2 = `DELETE FROM user WHERE id='${id}'`;

      connection.query(q2, (err, result) => {
        if (err) throw err;
        res.redirect("/users");
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while deleting user");
  }
});

app.listen("3000", () => {
  console.log(" app is listening on port 3000");
});

//   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//   try{

//     connection.query( q ,[data], (err, result)=>{

//         if(err){

//             throw err;
//         }
//           console.log(result);
//     });
//   }
//   catch(err){
//      console.log(err);

//   }
//    connection.end();
