const express = require("express");

const app = express();

const port = 3333;

app.listen(port, () => {
  console.log(`the app is runnin on port http://localhost:${port}`);
});
