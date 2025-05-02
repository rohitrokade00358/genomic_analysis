const bcrypt = require("bcrypt");
const plainPassword = "Shivaaria9@";
const storedHash = "$2b$10$YojlzeePLV9GIQIbVGAjXu47T4wl69A0RCMPoX27a7FQ4MMqqSlT6";

bcrypt.compare(plainPassword, storedHash, (err, result) => {
  if (err) throw err;
  console.log("Password Match:", result); // Should log `true`
});