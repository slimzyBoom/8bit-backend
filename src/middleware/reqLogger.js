const logger = (req, res, next) => {
  const { method, originalUrl } = req;
  const instance_timestamp = new Date().toISOString();
  console.log(`[${instance_timestamp}] ${method} ${originalUrl}`);
  next();
};

module.exports = logger;
