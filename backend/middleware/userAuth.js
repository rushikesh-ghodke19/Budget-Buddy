import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // ✅ FIX

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
