const Account = require("./models/Account");

const newAccount = new Account({
    email: "shiyi12k1@gmail.com",
    password: "123",
    type: 2,
});

console.log(newAccount);
