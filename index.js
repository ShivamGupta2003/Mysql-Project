// const { faker } = require("@faker-js/faker");
// const mysql = require("mysql2");
// const express = require("express");
// const app = express();
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const methodOverride = require("method-override");
// app.use(methodOverride("_method"));
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));

// // Set up EJS view engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: 16004,
//   ssl: { rejectUnauthorized: false },
// });

// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// // Home route

// app.get("/", (req, res) => {
//   let q = `SELECT count(*) FROM user `;
//   try {
//     connection.query(q, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       //   console.log(result);

//       let counts = result[0]["count(*)"];

//       res.render("home.ejs", { counts });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });

// //   show user

// app.get("/users", (req, res) => {
//   let q = `SELECT * FROM user `;
//   try {
//     connection.query(q, (err, users) => {
//       if (err) {
//         throw err;
//       }
//       //   console.log(result);

//       res.render("showusers.ejs", { users });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });
// // Edit Route
// app.get("/users/:id/edit", (req, res) => {
//   let { id } = req.params;
//   let q = `SELECT * FROM user WHERE id = '${id}'`;

//   try {
//     connection.query(q, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       if (result.length === 0) {
//         return res.status(404).send("User not found");
//       }

//       let user = result[0];
//       res.render("edit.ejs", { user });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error occurred while fetching user data");
//   }
// });

// //  update route

// app.patch("/users/:id", (req, res) => {
//   let { id } = req.params;
//   let { password: formPass, username: newusername } = req.body;

//   let q = `SELECT * FROM user WHERE id = '${id}'`;

//   try {
//     connection.query(q, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       if (result.length === 0) {
//         return res.status(404).send("User not found");
//       }

//       let user = result[0];
//       if (formPass != user.password) {
//         res.send("wrong password");
//       } else {
//         let q2 = `UPDATE user SET username = '${newusername} 'WHERE id='${id}'`;
//         connection.query(q2, (err, result) => {
//           if (err) throw err;
//           res.redirect("/users");
//         });
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error occurred while fetching user data");
//   }
// });

// app.get("/users/new", (req, res) => {
//   res.render("new.ejs");
// });

// app.post("/users", (req, res) => {
//   let { username, email, password } = req.body;
//   let id = uuidv4(); // Generate a unique ID for the user

//   let q = `INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)`;

//   connection.query(q, [id, email, username, password], (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).send("Error occurred while adding user");
//     }
//     res.redirect("/users");
//   });
// });

// // delete get

// app.get("/users/:id/delete", (req, res) => {
//   let { id } = req.params;
//   let q = `SELECT * FROM user WHERE id = '${id}'`;

//   try {
//     connection.query(q, (err, result) => {
//       if (err) {
//         throw err;
//       }

//       if (result.length === 0) {
//         return res.status(404).send("User not found");
//       }

//       let user = result[0];
//       res.render("delete.ejs", { user });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error occurred while fetching user data");
//   }
// });

// // delete post

// app.delete("/users/:id", (req, res) => {
//   let { id } = req.params;
//   let { password: formPass } = req.body;

//   let q = `SELECT * FROM user WHERE id = '${id}'`;

//   try {
//     connection.query(q, (err, result) => {
//       if (err) throw err;

//       if (result.length === 0) {
//         return res.status(404).send("User not found");
//       }

//       let user = result[0];

//       // Check if the password matches
//       if (formPass !== user.password) {
//         return res.send("Wrong password");
//       }

//       // Proceed to delete the user
//       let q2 = `DELETE FROM user WHERE id='${id}'`;

//       connection.query(q2, (err, result) => {
//         if (err) throw err;
//         res.redirect("/users");
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Error occurred while deleting user");
//   }
// });

// app.listen("3000", () => {
//   console.log(" app is listening on port 3000");
// });

// //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// //   try{

// //     connection.query( q ,[data], (err, result)=>{

// //         if(err){

// //             throw err;
// //         }
// //           console.log(result);
// //     });
// //   }
// //   catch(err){
// //      console.log(err);

// //   }
// //    connection.end();
const express = require("express");
const mysql = require("mysql2");
const { faker } = require("@faker-js/faker");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
require("dotenv").config(); // For environment variables

const app = express();

// Middleware setup
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// DB credentials
const DB_NAME = process.env.DB_NAME || "userdb";

// Initial connection (no DB yet)
const baseConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 16004,
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,
});

// Create DB and table if not exists
const initSQL = `
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
USE \`${DB_NAME}\`;
CREATE TABLE IF NOT EXISTS user (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
`;

// Initialize DB and then run app
baseConnection.connect((err) => {
  if (err) throw err;

  baseConnection.query(initSQL, (err) => {
    if (err) throw err;
    console.log("Database and user table ready.");

    // Reconnect with DB selected
    global.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: DB_NAME,
      port: 16004,
      ssl: { rejectUnauthorized: false },
    });

    // Start server
    app.listen(3000, () => {
      console.log("App is listening on port 3000");
    });
  });
});

// Get random user
const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// Home route (count users)
app.get("/", (req, res) => {
  const q = `SELECT COUNT(*) AS count FROM user`;
  global.connection.query(q, (err, result) => {
    if (err) return res.status(500).send("Database error");
    const count = result[0].count;
    res.render("home.ejs", { counts: count });
  });
});

// Show all users
app.get("/users", (req, res) => {
  const q = `SELECT * FROM user`;
  global.connection.query(q, (err, users) => {
    if (err) return res.status(500).send("Database error");
    res.render("showusers.ejs", { users });
  });
});

// Render new user form
app.get("/users/new", (req, res) => {
  res.render("new.ejs");
});

// Add new user
app.post("/users", (req, res) => {
  const { username, email, password } = req.body;
  const id = uuidv4();
  const q = `INSERT INTO user (id, email, username, password) VALUES (?, ?, ?, ?)`;
  global.connection.query(q, [id, email, username, password], (err) => {
    if (err) return res.status(500).send("Error adding user");
    res.redirect("/users");
  });
});

// Render edit form
app.get("/users/:id/edit", (req, res) => {
  const { id } = req.params;
  const q = `SELECT * FROM user WHERE id = ?`;
  global.connection.query(q, [id], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).send("User not found");
    res.render("edit.ejs", { user: result[0] });
  });
});

// Update user
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const { password: formPass, username: newUsername } = req.body;

  const q = `SELECT * FROM user WHERE id = ?`;
  global.connection.query(q, [id], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).send("User not found");

    const user = result[0];
    if (formPass !== user.password) {
      return res.send("Wrong password");
    }

    const q2 = `UPDATE user SET username = ? WHERE id = ?`;
    global.connection.query(q2, [newUsername, id], (err) => {
      if (err) return res.status(500).send("Error updating user");
      res.redirect("/users");
    });
  });
});

// Render delete confirmation
app.get("/users/:id/delete", (req, res) => {
  const { id } = req.params;
  const q = `SELECT * FROM user WHERE id = ?`;
  global.connection.query(q, [id], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).send("User not found");
    res.render("delete.ejs", { user: result[0] });
  });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const { password: formPass } = req.body;

  const q = `SELECT * FROM user WHERE id = ?`;
  global.connection.query(q, [id], (err, result) => {
    if (err || result.length === 0)
      return res.status(404).send("User not found");

    const user = result[0];
    if (formPass !== user.password) {
      return res.send("Wrong password");
    }

    const q2 = `DELETE FROM user WHERE id = ?`;
    global.connection.query(q2, [id], (err) => {
      if (err) return res.status(500).send("Error deleting user");
      res.redirect("/users");
    });
  });
});

// Generate a fake user (for testing)
app.get("/generate-fake-user", (req, res) => {
  const [id, username, email, password] = getRandomUser();
  const q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;
  global.connection.query(q, [id, username, email, password], (err) => {
    if (err) return res.status(500).send("Error inserting fake user");
    res.send("Fake user inserted successfully");
  });
});
