import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./src/middleware/authMiddleware.js";
const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    id: "1",
    role: "admin",
    email: "elmin",
    password: "elmin",
  },
];

app.get("/users", authMiddleware(["user", "admin"]), (req, res) => {
  try {
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});
app.delete("/users", authMiddleware(["admin"]), (req, res) => {
  try {
    res.send("silindi");
  } catch (error) {
    res.json({ error });
  }
});
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((x) => x.email === email);
    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "incorrect password" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
  res.send("Hello World!");
});
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((x) => x.email === email);
  if (user) {
    return res.status(400).json({ message: "Email is already exist" });
  }
  users.push({ id: uuidv4(), role: "user", email, password });
  res.status(200).json({ message: "OK" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
