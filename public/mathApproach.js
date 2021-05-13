function findSum(op1,op2){
    let result = "";
    
    // Swap if first string is larger than second one
    if (op1.length > op2.length){
        [op1, op2] = [op2, op1];
    }

    let n1 = op1.length;
    let n2 = op2.length;
    let diff = n2 - n1;

    // Initially take carry zero
    let carry = 0;
 
    // Traverse from end of both Strings
    for (let i = n1 - 1; i >= 0; i--){
        // Do school mathematics, compute sum of
        // current digits and carry
        let sum = parseInt(op1[i]) + parseInt(op2[i+diff]) + carry;
        result = sum % 10 + result;
        carry = Math. floor(sum / 10);
        //console.log(sum + " " + result+" "+carry);
    }
 
    // Add remaining digits of op2[]
    for (let i = n2 - n1 - 1; i >= 0; i--){
        let sum = parseInt(op2[i]) + carry;
        result = sum % 10 + result;
        carry = Math. floor(sum / 10);
        //console.log(sum + " " + result+" "+carry);
    }
 
    // Add remaining carry
    if (carry > 0)
    result = carry + result;
 
    return result;
}

function isSmaller(op1,op2){
    // Calculate lengths of both string
    let n1 = op1.length, n2 = op2.length;
 
    if (n1 < n2)
        return true;
    if (n2 < n1)
        return false;
 
    // If both string have the same length, compare each value of them.
    for (let i = 0; i < n1; i++) {
        if (op1[i] < op2[i])
            return true;
        else if (op1[i] > op2[i])
            return false;
    }
    return false;
}

// This function only find the difference of two POSITIVE INTEGERS.
function findDifference(op1,op2){
    let result = "";
    
    // Swap if first string is smaller than second one
    if (isSmaller(op1,op2)){
        [op1, op2] = [op2, op1];
    }

    let n1 = op1.length;
    let n2 = op2.length;
    let diff = n1 - n2;

    // Initially take carry zero
    let carry = 0;
 
    // Traverse from end of both Strings
    for (let i = n2 - 1; i >= 0; i--){
        // Do school mathematics, compute difference of
        // current digits and carry
        let sub = op1[i+diff] - op2[i] - carry;
        if (sub < 0) {
            sub = sub + 10;
            carry = 1;
        }
        else carry = 0;
        result = sub + result;
    }
 
    // subtract remaining digits of op1[]
    for (let i = n1 - n2 - 1; i >= 0; i--){
        if (op1[i] == '0' && carry > 0) {
            result = "9" + result;
            continue;
        }
        let sub =  op1[i] - carry;
        if (i > 0 || sub > 0) // remove preceding 0's
            result = sub + result;
        carry = 0;
    }
 
    return result;

}

function findProduct(op1,op2){

}

//console.log(findSum("51235","3141555"));
console.log(findDifference("125552123521556161","314155563161366666666666666666"))