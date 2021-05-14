"use strict";

$(document).ready(function () {
  myFeature.init();
});

let myFeature = {
  // Input pattern
  regex: new RegExp("^[-+]?[0-9]+$"),

  // Indicate whether should CALC action calculate if nothing changes.
  keepOldResult: false,
  // JQuery Selectors
  clearAllAction: $("#clear"),
  clearEachAction: $(".clear-input"),
  firstInput: $("#first-input"),
  secondInput: $("#second-input"),
  resultOutput: $("#result"),
  swapAction: $("#swap"),
  calcAction: $("#calc"),
  operatorOptions: $('input[name="options"]'),
  errorModal: $("#error-modal"),
  errorModalBody: $("#error-modal-body"),
  alertModal: $("#alert-modal"),
  historyHeader: $("#history-header"),
  historyTable: $("#history-table"),
  historyTableBody: $("#history"),
  delHistoryAction: $("#del-history"),
  saveHistoryAction: $("#save-history"),
  confirmDeleteAction: $("#confirm-delete"),

  // Getter and setter methods
  getSelectedOperator: () => $('input[name="options"]:checked').val(),
  getFirstInput: () => myFeature.firstInput.val(),
  setFirstInput: (value) => myFeature.firstInput.val(value),
  getSecondInput: () => myFeature.secondInput.val(),
  setSecondInput: (value) => myFeature.secondInput.val(value),
  getResultOutput: () => myFeature.resultOutput.val(),
  setResultOutput: (value) => myFeature.resultOutput.val(value),
  getLocalStorageHistory: () =>
    JSON.parse(localStorage.getItem("history")) || [],
  setLocalStorageHistory: (value) =>
    localStorage.setItem("history", JSON.stringify(value)),

  init: function () {
    // Enable tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // Render history table first
    myFeature.renderHistory();
    // Add event listeners
    myFeature.inputListener();
    myFeature.saveHistoryListener();
    myFeature.deleteHistoryListener();
  },

  inputListener: function () {
    // Clear function to clean up input and output
    myFeature.clearAllAction.on("click", () => {
      myFeature.setFirstInput("");
      myFeature.setSecondInput("");
      myFeature.setResultOutput("");
      myFeature.keepOldResult = false;
    });

    // Clear first or second input
    myFeature.clearEachAction.on("click", function () {
      $(this).parent().next().val("");
      myFeature.keepOldResult = false;
    });

    // Swap two integers action
    myFeature.swapAction.on("click", function () {
      let temp = myFeature.getFirstInput();
      myFeature.setFirstInput(myFeature.getSecondInput());
      myFeature.setSecondInput(temp);
      myFeature.keepOldResult = false;
    });

    // Input only accepts [0-9+-]
    [myFeature.firstInput, myFeature.secondInput].map((selector) => {
      selector.keypress(function (e) {
        let a = [];
        let k = e.which;
        a.push(43);
        a.push(45);
        for (let i = 48; i < 58; i++) a.push(i);
        if (!(a.indexOf(k) >= 0)) e.preventDefault();
      });
    });
    // When input change, press CALC will calc with new value
    // Otherwise, do nothing.
    [
      myFeature.firstInput,
      myFeature.secondInput,
      myFeature.operatorOptions,
    ].map((selector) => {
      selector.on("change", () => {
        myFeature.keepOldResult = false;
      });
    });

    // Start calculate the result
    myFeature.calcAction.on("click", () => {
      // Get input and remove all leading zeros.
      let firstVal = mathMethod.removeLeadingZero(myFeature.getFirstInput());
      let secondVal = mathMethod.removeLeadingZero(myFeature.getSecondInput());

      // Save original input for storing and rendering later
      let savedFirstVal = firstVal;
      let savedSecondVal = secondVal;
      // Validate input
      if (
        firstVal !== "" &&
        secondVal !== "" &&
        myFeature.checkPattern(firstVal, secondVal)
      ) {
        // User press CALC second time without any input change
        // => Do nothing
        if (myFeature.keepOldResult) return;
        // Get selected operator
        let option = myFeature.getSelectedOperator();
        let res = "";
        try {
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
                res = "-" + mathMethod.findSum(firstVal, secondVal);
              } else if (firstVal[0] == "-") {
                // This means result = secondVal - firstVal
                // Remove unary op "-"
                firstVal = firstVal.substr(1);
                // If secondVal < firstVal, result = - (firstVal - secondVal)
                if (mathMethod.isSmaller(secondVal, firstVal)) {
                  res = "-" + mathMethod.findDifference(firstVal, secondVal);
                } else {
                  // If secondVal >= firstVal, result = secondVal - firstVal
                  res = mathMethod.findDifference(secondVal, firstVal);
                }
              } else if (secondVal[0] == "-") {
                // This means result = firstVal - secondVal
                // Remove unary op "-"
                secondVal = secondVal.substr(1);
                // If firstVal < secondVal, result = - (secondVal - firstVal)
                if (mathMethod.isSmaller(firstVal, secondVal)) {
                  res = "-" + mathMethod.findDifference(secondVal, firstVal);
                } else {
                  // If firstVal >= secondVal, result = firstVal - secondVal
                  res = mathMethod.findDifference(firstVal, secondVal);
                }
              } else {
                // Normal sum, result = firstVal + secondVal
                res = mathMethod.findSum(firstVal, secondVal);
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
                  res = "-" + mathMethod.findDifference(firstVal, secondVal);
                } else {
                  // If secondVal >= firstVal, result = secondVal - firstVal
                  res = mathMethod.findDifference(secondVal, firstVal);
                }
              } else if (firstVal[0] == "-") {
                // result = - (firstVal + secondVal)
                res = "-" + mathMethod.findSum(firstVal, secondVal);
              } else if (secondVal[0] == "-") {
                // result = firstVal + secondVal
                secondVal = secondVal.substr(1);
                res = mathMethod.findSum(firstVal, secondVal);
              } else {
                // result = firstVal - secondVal
                // If firstVal < secondVal, result = - (secondVal - firstVal)
                if (mathMethod.isSmaller(firstVal, secondVal)) {
                  res = "-" + mathMethod.findDifference(secondVal, firstVal);
                } else {
                  // If firstVal >= secondVal, result = firstVal - secondVal
                  res = mathMethod.findDifference(firstVal, secondVal);
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
                res = mathMethod.findProduct(firstVal, secondVal);
              } else if (firstVal[0] == "-") {
                // Remove unary op
                firstVal = firstVal.substr(1);
                // Add unary op later
                res = "-" + mathMethod.findProduct(firstVal, secondVal);
              } else if (secondVal[0] == "-") {
                // Remove unary op
                secondVal = secondVal.substr(1);
                // Add unary op later
                res = "-" + mathMethod.findProduct(firstVal, secondVal);
              } else {
                // Normal product, result = firstVal * secondVal
                res = mathMethod.findProduct(firstVal, secondVal);
              }
              break;
            default:
              break;
          }
          // Remove leading zero
          res = mathMethod.removeLeadingZero(res);

          // Print result
          myFeature.setResultOutput(res);
          // Prepend last result to history table
          myFeature.renderLastResult(
            savedFirstVal,
            option,
            savedSecondVal,
            res
          );
          // Set old result state to true
          myFeature.keepOldResult = true;

          // Add latest calculation to local storage
          let exp = {
            firstInt: savedFirstVal,
            op: option,
            secondInt: savedSecondVal,
            result: res,
          };
          let oldHistory = myFeature.getLocalStorageHistory();
          oldHistory.push(exp);
          myFeature.setLocalStorageHistory(oldHistory);
        } catch (error) {
          // Notify error!
          myFeature.errorModalBody.text(error.toString());
          myFeature.errorModal.modal("show");
        }
      } else {
        // Notify error!
        myFeature.errorModalBody.text("Missing one or more parameters!");
        myFeature.errorModal.modal("show");
      }
    });
  },

  renderLastResult: function (firstInt, op, secondInt, result) {
    [
      myFeature.historyTable,
      myFeature.delHistoryAction,
      myFeature.saveHistoryAction,
    ].map((selector) => {
      selector.removeClass("d-none");
    });
    let currentIndex = myFeature.historyTableBody.children().length;
    myFeature.historyHeader.text("Calculation History");
    let newRow = `<tr>
                      <th scope="row">${currentIndex + 1}</th>
                      <td class="text-break">${firstInt}</td>
                      <td>${op}</td>
                      <td class="text-break">${secondInt}</td>
                      <td class="text-break">${result}</td>
                    </tr>`;
    myFeature.historyTableBody.prepend(newRow);
  },

  renderHistory: function () {
    let oldHistory = myFeature.getLocalStorageHistory();
    if (oldHistory == 0) {
      myFeature.historyHeader.text("No Calculation History");
      [
        myFeature.historyTable,
        myFeature.delHistoryAction,
        myFeature.saveHistoryAction,
      ].map((selector) => {
        selector.addClass("d-none");
      });
      return;
    }
    myFeature.historyHeader.text("Calculation History");
    for (let i = 0; i < oldHistory.length; i++) {
      let newRow = `<tr>
                      <th scope="row">${i + 1}</th>
                      <td class="text-break">${oldHistory[i].firstInt}</td>
                      <td>${oldHistory[i].op}</td>
                      <td class="text-break">${oldHistory[i].secondInt}</td>
                      <td class="text-break">${oldHistory[i].result}</td>
                    </tr>`;
      myFeature.historyTableBody.prepend(newRow);
    }
  },

  saveHistoryListener: function () {
    myFeature.saveHistoryAction.on("click", async () => {
      streamSaver.mitm = "../mitm.html";
      console.log("saving");
      let oldHistory = myFeature.getLocalStorageHistory();
      // Convert Array Object to CSV
      let csv =
        "firstInt,operator,secondInt,result\n" +
        oldHistory
          .map(function (d) {
            return JSON.stringify(Object.values(d));
          })
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");
      console.log(typeof csv);
      const blob = new Blob([csv]);
      const fileStream = streamSaver.createWriteStream(
        "calculate-history.csv",
        {
          size: blob.size, // Makes the percentage visiable in the download
        }
      );

      // One quick alternetive way if you don't want the hole blob.js thing:
      // const readableStream = new Response(
      //   Blob || String || ArrayBuffer || ArrayBufferView
      // ).body
      const readableStream = blob.stream();

      // more optimized pipe version
      // (Safari may have pipeTo but it's useless without the WritableStream)
      if (window.WritableStream && readableStream.pipeTo) {
        await readableStream.pipeTo(fileStream);
        return console.log("done writing");
      }

      // Write (pipe) manually
      window.writer = fileStream.getWriter();

      const reader = readableStream.getReader();
      const pump = () =>
        reader
          .read()
          .then((res) =>
            res.done ? writer.close() : writer.write(res.value).then(pump)
          );

      pump();
    });
  },

  deleteHistoryListener: function () {
    myFeature.delHistoryAction.on("click", () => {
      myFeature.alertModal.modal("show");
      // Confirm delete action
      myFeature.confirmDeleteAction.on("click", () => {
        // No old value in history
        myFeature.keepOldResult = false;
        // Render history header
        myFeature.historyHeader.text("No Calculation History");
        // Hide history table
        [
          myFeature.historyTable,
          myFeature.delHistoryAction,
          myFeature.saveHistoryAction,
        ].map((selector) => {
          selector.addClass("d-none");
        });
        // Delete rows value
        myFeature.historyTableBody.empty();
        // Clear local storage
        localStorage.removeItem("history");
        // Hide modal
        myFeature.alertModal.modal("hide");
      });
    });
  },

  checkPattern: function (input1, input2) {
    return myFeature.regex.test(input1) && myFeature.regex.test(input2);
  },
};


