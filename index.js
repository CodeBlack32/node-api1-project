const express = require("express");

const server = express();

const port = 8000;

const db = require("./api/users");

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get("/", (req, res) => {
  // express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
  res.send("Hello World");
});

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(port, () => console.log("API running on port 8000"));

// turns all express objects to json Stringify
server.use(express.json());

// HTTP Method
// URI: scheme://host_name:port/path?parameter_list
// https://www.google.com/some/document?with_params=value

// R - Read (CRUD)
server.get("/api/users", (req, res) => {
  db.getUsers()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((err) => {
      res.status(500).json({ success: false, err });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.getUserById()
    .then((userId) => {
      if (userId) {
        res.status(200).end();
      } else {
        res.status(404).json({ success: false, message: "id invalid" });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, err });
    });
});

// C - Create(CRUD)
server.post("/api/users", (req, res) => {
  const users = req.body;
  db.createUser(users)
    .then((user) => {
      res.status(201).json({ success: true, user });
    })
    .catch((err) => {
      res.status(500).json({ success: false, err });
    });
});

// D - Delete(CRUD)
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  db.deleteUser(id)
    .then((deleted) => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({ success: false, message: "id invalid" });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, err });
    });
});

// U - updateUser(CRUD)
server.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;

  db.updateUser(id, newInfo)
    .then((updated) => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({ success: false, message: "id invalid" });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, err });
    });
});
