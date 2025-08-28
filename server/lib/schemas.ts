export const registerBodySchema = {
  type: "object",
  properties: {
    firstname: { type: "string" },
    lastname: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    role: { type: "string" },
  },
  required: ["email", "password", "role"],
};
