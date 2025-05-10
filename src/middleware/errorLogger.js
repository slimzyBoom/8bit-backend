const errorHandler = (err, req, res, next) => {
  const { method, originalUrl } = req;
  const instance_timestamp = new Date().toISOString();
  const messaage = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;

  console.error(
    `[${instance_timestamp}] ${method} ${originalUrl} - ${statusCode}: ${messaage}`
  );
  res.status(statusCode).json({
    message: messaage,
  });

};

export default errorHandler;
