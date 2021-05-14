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
  timer: $("#timer"),
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
      let firstVal = myFeature.getFirstInput();
      let secondVal = myFeature.getSecondInput();

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
          // Start timer
          let t0 = performance.now();

          // Get input and remove all leading zeros.
          firstVal = myFeature.removeLeadingZero(firstVal);
          secondVal = myFeature.removeLeadingZero(secondVal);

          // Remove "+" in front of input if needed
          if (firstVal[0] == "+") firstVal = firstVal.substr(1);
          if (secondVal[0] == "+") secondVal = secondVal.substr(1);

          // Send expression to server.
          $.ajax({
            url: "/calculator",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
              firstVal: firstVal,
              secondVal: secondVal,
              option: option,
            }),
          })
            .done(function (response) {
              // Get result from server
              res = response.result;

              // End timer
              let t1 = performance.now();
              // Remove leading zero

              res = myFeature.removeLeadingZero(res);

              // Print result
              myFeature.setResultOutput(res);
              // Prepend last result to history table

              // Set execution time
              myFeature.timer.text(
                `execution time: ${(t1 - t0) / 1000} seconds`
              );

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
            })
            .fail((error) => {
              console.log(error);
              // Notify error!
              myFeature.errorModalBody.text(error.toString());
              myFeature.errorModal.modal("show");
              return;
            });
        } catch (error) {
          // Notify error!
          myFeature.errorModalBody.text(error.toString());
          myFeature.errorModal.modal("show");
          return;
        }
      } else {
        // Notify error!
        myFeature.errorModalBody.text("Please double check your input");
        myFeature.errorModal.modal("show");
        return;
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

  // return a new string (included unary op "+" or "-") with no leading zero.
  removeLeadingZero: function (str) {
    let temp = "";
    if (str[0] == "-" || str[0] == "+") {
      temp = str[0];
      str = str.substr(1);
    }
    return temp + str.replace(/^0+/, "") || "0";
  },
};
