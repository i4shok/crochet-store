const jwt = require(
  "jsonwebtoken"
);

const auth = (
  req,
  res,
  next
) => {

  const authHeader =
  req.header(
    "Authorization"
  );

if (!authHeader) {
  return res
    .status(401)
    .json({
      message:
        "No token",
    });
}

const token =
  authHeader.replace(
    "Bearer ",
    ""
  );

  if (!token) {
    return res
      .status(401)
      .json({
        message:
          "No token",
      });
  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user =
      decoded;

    next();

  } catch {

    res
      .status(401)
      .json({
        message:
          "Invalid token",
      });
  }
};

module.exports = auth;