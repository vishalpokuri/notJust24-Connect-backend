const { z } = require("zod");

const signupSchema = z.object({
  password: z.string().min(5, "Password must be atleast 5 characters long"),
  email: z.string().email("Invalid email address"),
});

module.exports = { signupSchema };
