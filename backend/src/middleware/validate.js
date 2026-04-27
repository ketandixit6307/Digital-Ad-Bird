const { AppError } = require('./errorHandler');

const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({ ...req.body, ...req.params, ...req.query });
    if (!result.success) {
      const message = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }
    req.validatedData = result.data;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;
