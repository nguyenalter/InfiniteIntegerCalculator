let mathMethod = require("./math");

function startCalculate(firstVal, secondVal, option) {
    // Remove "+" in front of input if needed
    if (firstVal[0] == "+") firstVal = firstVal.substr(1);
    if (secondVal[0] == "+") secondVal = secondVal.substr(1);
  
    switch (option) {
      case "+":
        // Adding here
        if (firstVal[0] == "-" && secondVal[0] == "-") {
          // Remove unary op
          firstVal = firstVal.substr(1);
          secondVal = secondVal.substr(1);
          // result = - (firstVal + secondVal)
          return "-" + mathMethod.findSum(firstVal, secondVal);
        } else if (firstVal[0] == "-") {
          // This means result = secondVal - firstVal
          // Remove unary op "-"
          firstVal = firstVal.substr(1);
          // If secondVal < firstVal, result = - (firstVal - secondVal)
          if (mathMethod.isSmaller(secondVal, firstVal)) {
            return "-" + mathMethod.findDifference(firstVal, secondVal);
          } else {
            // If secondVal >= firstVal, result = secondVal - firstVal
            return mathMethod.findDifference(secondVal, firstVal);
          }
        } else if (secondVal[0] == "-") {
          // This means result = firstVal - secondVal
          // Remove unary op "-"
          secondVal = secondVal.substr(1);
          // If firstVal < secondVal, result = - (secondVal - firstVal)
          if (mathMethod.isSmaller(firstVal, secondVal)) {
            return "-" + mathMethod.findDifference(secondVal, firstVal);
          } else {
            // If firstVal >= secondVal, result = firstVal - secondVal
            return mathMethod.findDifference(firstVal, secondVal);
          }
        } else {
          // Normal sum, result = firstVal + secondVal
          return mathMethod.findSum(firstVal, secondVal);
        }
  
        break;
      case "-":
        // Subtracting here
        // result = secondVal - firstVal
        if (firstVal[0] == "-" && secondVal[0] == "-") {
          // Remove unary op "-"
          firstVal = firstVal.substr(1);
          secondVal = secondVal.substr(1);
  
          // If secondVal < firstVal, result = - (firstVal - secondVal)
          if (mathMethod.isSmaller(secondVal, firstVal)) {
            return "-" + mathMethod.findDifference(firstVal, secondVal);
          } else {
            // If secondVal >= firstVal, result = secondVal - firstVal
            return mathMethod.findDifference(secondVal, firstVal);
          }
        } else if (firstVal[0] == "-") {
          // result = - (firstVal + secondVal)
          firstVal = firstVal.substr(1);
          return "-" + mathMethod.findSum(firstVal, secondVal);
        } else if (secondVal[0] == "-") {
          // result = firstVal + secondVal
          secondVal = secondVal.substr(1);
          return mathMethod.findSum(firstVal, secondVal);
        } else {
          // result = firstVal - secondVal
          // If firstVal < secondVal, result = - (secondVal - firstVal)
          if (mathMethod.isSmaller(firstVal, secondVal)) {
            return "-" + mathMethod.findDifference(secondVal, firstVal);
          } else {
            // If firstVal >= secondVal, result = firstVal - secondVal
            return mathMethod.findDifference(firstVal, secondVal);
          }
        }
        break;
      case "*":
        // Multiplying here
        if (firstVal[0] == "-" && secondVal[0] == "-") {
          // Remove unary op
          firstVal = firstVal.substr(1);
          secondVal = secondVal.substr(1);
          // Normal multiplying
          return mathMethod.findProduct(firstVal, secondVal);
        } else if (firstVal[0] == "-") {
          // Remove unary op
          firstVal = firstVal.substr(1);
          // Add unary op later
          return "-" + mathMethod.findProduct(firstVal, secondVal);
        } else if (secondVal[0] == "-") {
          // Remove unary op
          secondVal = secondVal.substr(1);
          // Add unary op later
          return "-" + mathMethod.findProduct(firstVal, secondVal);
        } else {
          // Normal product, result = firstVal * secondVal
          return mathMethod.findProduct(firstVal, secondVal);
        }
        break;
      default:
        break;
    }
  }

module.exports = startCalculate;