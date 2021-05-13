"use strict";

let oldValue = false;

$(document).ready(function () {
  // Trigger tooltip
  $('[data-toggle="tooltip"]').tooltip();
  renderHistory();
  inputListener();
  saveHistoryListener();
  deleteHistoryListener();
});

function inputListener() {
  // Clear function to clean up input
  $("#clear").on("click", () => {
    $("#first-input,#second-input,#result").val("");
    oldValue = false;
  });

  // Clear first or second input
  $(".clear-input").on("click", function () {
    $(this).parent().next().val("");
    oldValue = false;
  });

  // Swap two integers
  $("#swap").on("click", function () {
    let temp = $("#first-input").val();
    $("#first-input").val($("#second-input").val());
    $("#second-input").val(temp);
    oldValue = false;
  });

  // Input only accepts [0-9+-]
  $("#first-input,#second-input").keypress(function (e) {
    let a = [];
    let k = e.which;

    // Check for '+' or '-' at first position
    // if ($("#first-input").val() == "") {
    //   // If current input is empty, reset usage
    //   firstOpUsage = false;
    //   if (k == 43 || k == 45) {
    //     firstOpUsage = true;
    //     return;
    //   }
    // }
    // 43 is "+", 45 is "-" and 48-58 equal to 0-9 in ASCII.
    a.push(43);
    a.push(45);
    for (i = 48; i < 58; i++) a.push(i);
    if (!(a.indexOf(k) >= 0)) e.preventDefault();
  });

  // When input change, press CALC will calc with new value
  // Otherwise, do nothing.
  $('#first-input,#second-input,input[name="options"]').on("change", () => {
    oldValue = false;
  });

  $("#calc").on("click", () => {
    if ($("#first-input").val() !== "" && $("#second-input").val() !== "") {
      // Start calculate...
      if (oldValue) return;
      // Get selected operator
      let option = $('input[name="options"]:checked').val();
      let res = "";
      try {
        let firstVal = BigInt($("#first-input").val());
        let secondVal = BigInt($("#second-input").val());
        switch (option) {
          case "+":
            // Adding here
            res = firstVal + secondVal;
            break;
          case "-":
            // Subtracting here
            res = firstVal - secondVal;
            break;
          case "*":
            // Multiplying here
            res = firstVal * secondVal;
            break;
          default:
            break;
        }
        // Print result
        $("#result").val(res.toString());
        // Prepend last result to history table
        renderLastResult(
          firstVal.toString(),
          option.toString(),
          secondVal.toString(),
          res.toString()
        );
        oldValue = true;

        // TODO - Add prev value to history (local storage).
        let exp = {
          firstInt: firstVal.toString(),
          op: option,
          secondInt: secondVal.toString(),
          result: res.toString(),
        };
        let oldHistory = JSON.parse(localStorage.getItem("history")) || [];
        oldHistory.push(exp);
        localStorage.setItem("history", JSON.stringify(oldHistory));
      } catch (error) {
        // Notify error!
        $(".modal-body").text(error.toString());
        $("#error-modal").modal("show");
      }
    } else {
      // Notify error!
      $(".modal-body").text("Missing one or more parameters!");
      $("#error-modal").modal("show");
    }
  });
}

function renderHistory() {
  // G
  let oldHistory = JSON.parse(localStorage.getItem("history"));
  if (oldHistory === null) {
    $("#history-header").text("No Calculation History");
    $("#history-table,#del-history,#save-history").addClass("d-none");
    return;
  }
  $("#history-header").text("Calculation History");
  for (let i = 0; i < oldHistory.length; i++) {
    let newRow = `<tr>
                    <th scope="row">${i + 1}</th>
                    <td class="text-break">${oldHistory[i].firstInt}</td>
                    <td>${oldHistory[i].op}</td>
                    <td class="text-break">${oldHistory[i].secondInt}</td>
                    <td class="text-break">${oldHistory[i].result}</td>
                  </tr>`;
    $("#history").prepend(newRow);
  }
}

function renderLastResult(firstInt, op, secondInt, result) {
  $("#history-table,#del-history,#save-history").removeClass("d-none");
  let currentIndex = $("#history").children().length;
  $("#history-header").text("Calculation History");
  let newRow = `<tr>
                    <th scope="row">${currentIndex + 1}</th>
                    <td class="text-break">${firstInt}</td>
                    <td>${op}</td>
                    <td class="text-break">${secondInt}</td>
                    <td class="text-break">${result}</td>
                  </tr>`;
  $("#history").prepend(newRow);
}

function saveHistoryListener() {
  $("#save-history").on("click", async () => {
    streamSaver.mitm = "./mitm.html";
    console.log("saving");
    let oldHistory = JSON.parse(localStorage.getItem("history")) || [];
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
    const fileStream = streamSaver.createWriteStream("calculate-history.csv", {
      size: blob.size, // Makes the percentage visiable in the download
    });

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
}

function deleteHistoryListener() {
  $("#del-history").on("click", () => {
    $("#alert-modal").modal("show");
    // Confirm delete action
    $("#confirm-delete").on("click", () => {
      // No old value in history
      oldValue = false;

      // Render history header
      $("#history-header").text("No Calculation History");
      // Hide history table
      $("#history-table,#del-history,#save-history").addClass("d-none");
      // Delete rows value
      $("#history").empty();
      // Clear local storage
      localStorage.removeItem("history");
      // Hide modal
      $("#alert-modal").modal("hide");
    });
  });
}

let myFeature = {
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
  selectedOperatorOption: $('input[name="options"]:checked'),
  errorModal: $("#error-modal"),
  errorModalBody: $("#error-modal-body"),
  alertModal: $("#alert-modal"),
  modalBody: $(".modal-body"),
  historyHeader: $("#history-header"),
  historyTable: $("#history-table"),
  historyTableBody: $("history"),
  delHistoryAction: $("#del-history"),
  saveHistoryAction: $("#save-history"),
  confirmDeleteAction: $("confirm-delete"),

  // Getter and setter methods
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
    $('[data-toggle="tooltip"]').tooltip(), myFeature.eventListener();
    // Render history table first
    myFeature.renderHistory();
    // Add event listeners
    myFeature.eventListener();
    myFeature.deleteHistoryListener();
    myFeature.saveHistoryListener();
  },

  eventListener: function () {
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
        for (i = 48; i < 58; i++) a.push(i);
        if (!(a.indexOf(k) >= 0)) e.preventDefault();
      });
    });
    [
      // When input change, press CALC will calc with new value
      // Otherwise, do nothing.
      (myFeature.firstInput, myFeature.secondInput, myFeature.operatorOptions),
    ].map((selector) => {
      selector.on("change", () => {
        oldValue = false;
      });
    });

    myFeature.calcAction.on("click", () => {
      if (
        myFeature.getFirstInput() !== "" &&
        myFeature.getSecondInput() !== ""
      ) {
        // Start calculate...
        if (oldValue) return;
        // Get selected operator
        let option = myFeature.selectedOperatorOption.val();
        let res = "";
        try {
          let firstVal = BigInt(myFeature.getFirstInput());
          let secondVal = BigInt(myFeature.getSecondInput());
          switch (option) {
            case "+":
              // Adding here
              res = firstVal + secondVal;
              break;
            case "-":
              // Subtracting here
              res = firstVal - secondVal;
              break;
            case "*":
              // Multiplying here
              res = firstVal * secondVal;
              break;
            default:
              break;
          }
          // Print result
          myFeature.setResultOutput(res.toString());
          // Prepend last result to history table
          myFeature.renderLastResult(
            firstVal.toString(),
            option,
            secondVal.toString(),
            res.toString()
          );
          oldValue = true;

          let exp = {
            firstInt: firstVal.toString(),
            op: option,
            secondInt: secondVal.toString(),
            result: res.toString(),
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
      streamSaver.mitm = "./mitm.html";
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

  deleteHistoryListener: function(){
    myFeature.delHistoryAction.on("click", () => {
      myFeature.alertModal.modal("show");
      // Confirm delete action
      myFeature.confirmDeleteAction.on("click", () => {
        // No old value in history
        oldValue = false;
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
  }
};
