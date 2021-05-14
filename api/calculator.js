let startCalculate = require("../calculate/logicHandler");

const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  let firstVal = req.body.firstVal;
  let secondVal = req.body.secondVal;
  let option = req.body.option;
  let val = startCalculate(firstVal, secondVal, option);

  res.json({result: val });
});

module.exports = router;
