const Error = require("../errors");

const checkPermission = (requestUser, resourceId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceId) return;
  throw new Error.Unauthorized("Not authorized to access this route");
};

module.exports = checkPermission;
