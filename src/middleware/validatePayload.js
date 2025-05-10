const validatePayload = (schema, type) => {
  return (req, res, next) => {
    const data = req[type];
    const { error } = schema.validate(data);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export default validatePayload;
