const Joi = require('joi')

const loginSchema = Joi.object({
  account: Joi.string()
    .required()
    .alphanum()
    .min(6)
    .max(11)
    .messages({
      'string.empty': '账号不能为空',
      'string.min': '账号长度至少6位',
      'string.max': '账号长度不能超过11位',
      'string.alphanum': '账号只能包含字母和数字'
    }),
  password: Joi.string()
    .required()
    .min(6)
    .max(11)
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,11}$'))
    .messages({
      'string.empty': '密码不能为空',
      'string.min': '密码长度至少6位',
      'string.max': '密码长度不能超过11位',
      'string.pattern.base': '密码必须同时包含字母和数字'
    })
})

//校验中间件
const vailidateLogin = (req, res, next) => {
  const {error} = loginSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    })
  }

  next()
}

module.exports ={
  loginSchema,
  vailidateLogin
}
