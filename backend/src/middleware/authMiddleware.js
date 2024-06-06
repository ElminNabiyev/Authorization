import jwt from "jsonwebtoken";
import 'dotenv/config';

export const authMiddleware = (role) => {
  return (req, res, next) => {
    try {
        let token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer")) {
        return res.status(401).send("Vizqirt");
      }
      token = token.slice(7);
      let decoded = jwt.verify(token, process.env.TOKEN_KEY);
      if (!role.includes(decoded.role)) {
        return res.status(401).send("icaze yoxdu");
      }
      next();
    } catch (error) {
      res.send({error});
    }
  };
};
