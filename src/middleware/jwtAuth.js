import jwt from "jsonwebtoken";

export default function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Unauthorized", data: {} });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.user = decode;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized", data: {} });
  }
}
