import express, { json } from 'express'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
const app = express()
const port = 3000

app.use(express.json())

const TOKEN_KEY = "jfd*AS(#$@^(Q!&U$(#0r-03483pJASEporj324k432p"
const users = [
    {
        id: "1",
        role: "user",
        email: "elmin",
        password: "elmin"
    }
]

app.get('/users', (req, res) => {
    const token=req.headers.authorization
    if (!token) {
      return res.status(401).send("Vizqirt")
    }
    const decoded = jwt.verify(token,TOKEN_KEY);
    res.send(users)
})
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body
        const user = users.find(x => x.email === email)
        if (!user) {
            return res.status(404).json({ message: "email not found" })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "incorrect password" })
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, TOKEN_KEY,{expiresIn:"1h"});
        return res.status(200).json({ token })
    } catch (error) {
        res.status(400).json({ error })
    }
    res.send('Hello World!')
})
app.post('/register', (req, res) => {
    const { email, password } = req.body
    const user = users.find(x => x.email === email)
    if (user) {
        return res.status(400).json({ message: "Email is already exist" })
    }
    users.push({ id: uuidv4(), role: "user", email, password })
    res.status(200).json({ message: "OK" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})