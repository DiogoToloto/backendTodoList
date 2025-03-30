const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "secreto123");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido!" });
  }
};

module.exports = authMiddleware;
