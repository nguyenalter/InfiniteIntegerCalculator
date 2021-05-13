"use strict";

// This function only finds the sum of two POSITIVE INTEGERS
function findSum(op1, op2) {
  let result = "";

  // Swap if first string is larger than second one
  if (op1.length > op2.length) {
    [op1, op2] = [op2, op1];
  }

  let n1 = op1.length;
  let n2 = op2.length;
  let diff = n2 - n1;

  // Initially take carry zero
  let carry = 0;

  // Traverse from end of both Strings
  for (let i = n1 - 1; i >= 0; i--) {
    // Do school mathematics, compute sum of
    // current digits and carry
    let sum = parseInt(op1[i]) + parseInt(op2[i + diff]) + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
    //console.log(sum + " " + result+" "+carry);
  }

  // Add remaining digits of op2[]
  for (let i = n2 - n1 - 1; i >= 0; i--) {
    let sum = parseInt(op2[i]) + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
    //console.log(sum + " " + result+" "+carry);
  }

  // Add remaining carry
  if (carry > 0) result = carry + result;

  return result;
}

function isSmaller(op1, op2) {
  // Calculate lengths of both string
  let n1 = op1.length,
    n2 = op2.length;

  if (n1 < n2) return true;
  if (n2 < n1) return false;

  // If both string have the same length, compare each value of them.
  for (let i = 0; i < n1; i++) {
    if (op1[i] < op2[i]) return true;
    else if (op1[i] > op2[i]) return false;
  }
  return false;
}

// This function only finds the difference of two POSITIVE INTEGERS.
function findDifference(op1, op2) {
  let result = "";

  // Swap if first string is smaller than second one
  if (isSmaller(op1, op2)) {
    [op1, op2] = [op2, op1];
  }

  let n1 = op1.length;
  let n2 = op2.length;
  let diff = n1 - n2;

  // Initially take carry zero
  let carry = 0;

  // Traverse from end of both Strings
  for (let i = n2 - 1; i >= 0; i--) {
    // Do school mathematics, compute difference of
    // current digits and carry
    let sub = op1[i + diff] - op2[i] - carry;
    if (sub < 0) {
      sub = sub + 10;
      carry = 1;
    } else carry = 0;
    result = sub + result;
  }

  // subtract remaining digits of op1[]
  for (let i = n1 - n2 - 1; i >= 0; i--) {
    if (op1[i] == "0" && carry > 0) {
      result = "9" + result;
      continue;
    }
    let sub = op1[i] - carry;
    if (i > 0 || sub > 0)
      // remove preceding 0's
      result = sub + result;
    carry = 0;
  }

  return result;
}

function findProduct(op1, op2) {
  let n1 = op1.length;
  let n2 = op2.length;

  // will keep the result number in vector
  // in reverse order
  let result = [];

  // Below two indexes are used to
  // find positions in result.
  let i1 = 0;
  let i2 = 0;

  // Go from right to left in num1
  for (let i = n1 - 1; i >= 0; i--) {
    let carry = 0;
    // Take current char of first number
    let c1 = op1[i];

    // To shift position to left after every
    // multipliccharAtion of a digit in num2
    i2 = 0;

    // Go from right to left in num2
    for (let j = n2 - 1; j >= 0; j--) {
      // Take current char of second number
      let c2 = op2[j];

      // Multiply with current digit of first number
      // and add result to previously stored result
      // charAt current position.
      let sum = c1 * c2 + result[i1 + i2] + carry;

      // Carry for next itercharAtion
      carry = Math.floor(sum / 10);

      // Store result
      result[i1 + i2] = sum % 10;

      i2++;
    }

    // store carry in next cell
    if (carry > 0) result[i1 + i2] += carry;

    // To shift position to left after every
    // multipliccharAtion of a digit in num1.
    i1++;
  }

  // ignore '0's from the right
  let i = result.length - 1;
  while (i >= 0 && result[i] == 0) i--;

  // If all were '0's - means either both
  // or one of num1 or num2 were '0'
  if (i == -1) return "0";

  // generate the result String
  let s = "";

  while (i >= 0) s += result[i--];

  return s;
}

function findProduct2(op1, op2) {
    let n1 = op1.length;
    let n2 = op2.length;

    let store = [];

    for (let i = n1 - 1; i >= 0; i++){

        for (let j = n2 - 1; j >= 0; j++){

        }
    }
}

//console.log(findSum("51235","3141555"));
//console.log(findDifference("125552123521556161","314155563161366666666666666666"))
console.log(findProduct("345", "678"));
