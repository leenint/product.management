/* eslint-disable guard-for-in */
const Validator = {
  validate: (inputs, schema) => {
    for (const key in schema) {
      const proShape = schema[key];
      const rs = Validator.validateProperty(inputs[key], proShape, key);
      if (rs != null) {
        return rs;
      }
    }

    return null;
  },

  validateProperty: (value, schema, key, parent = null) => {
    const propertyName = parent ? `${parent}.${key}` : key;
    if (value == null) {
      return schema.optional ? null : `${propertyName} is a required field.`;
    }

    if (schema.type === 'string') {
      if (typeof value !== 'string') {
        return `${propertyName} must be a string.`;
      }
    }

    if (schema.type === 'number') {
      if (typeof value !== 'number') {
        return `${propertyName} must be a number.`;
      }
    }

    if (schema.type === 'str-num') {
      if (typeof value !== 'string') {
        return `${propertyName} must be a string.`;
      }

      const num = parseFloat(value, 10);
      if (Number.isNaN(num)) {
        return `${propertyName} must be a string of number.`;
      }
    }

    if (schema.type === 'object') {
      if (typeof value !== 'object') {
        return `${propertyName} must be a object.`;
      }
      if (schema.shape) {
        for (const key2 in schema.shape) {
          const childSchema = schema.shape[key2];
          const childValue = value[key2];
          const rs = Validator.validateProperty(childValue, childSchema, key2, propertyName);
          if (rs != null) {
            return rs;
          }
        }
      }
    }

    if (schema.type === 'array') {
      if (!Array.isArray(value)) {
        return `${propertyName} must be a array.`;
      }
      if (!schema.empty) {
        if (value.length === 0) {
          return `${propertyName} don't allow empty array.`;
        }
      }

      if (schema.item) {
        for (let i = 0; i < value.length; i++) {
          const childValue = value[i];
          const rs = Validator.validateProperty(childValue, schema.item, `${i}`, propertyName);
          if (rs != null) {
            return rs;
          }
        }
      }
    }
    return null;
  },
};

module.exports = Validator;
