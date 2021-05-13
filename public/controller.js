let oldValue = false;

$(document).ready(function () {
  renderHistory();
  inputListener();
});

function inputListener() {
  // Clear function to clean up input
  $("#clear").on("click", () => {
    $("#first-input,#second-input,#result").val("");
  });

  $(".float-right").on("click", function () {
    // Clear first or second input
    $(this).parent().next().val("");
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
  $("#first-input,#second-input").on("change", () => {
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
          case "1":
            // Adding here
            res = firstVal + secondVal;
            break;
          case "2":
            // Subtracting here
            res = firstVal - secondVal;
            break;
          case "3":
            // Multiplying here
            res = firstVal * secondVal;
            break;
          default:
            break;
        }

        $("#result").val(res.toString());
        // Prepend last result to history table
        renderLastResult(firstVal.toString(),option.toString(),secondVal.toString(),res.toString());
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
  let oldHistory = JSON.parse(localStorage.getItem("history"));
  if (oldHistory === null) {
    $(".table").toggleClass(".d-none");
    return;
  }

  for (let i = 0; i < oldHistory.length; i++) {
    let symb = "";
    switch (oldHistory[i].op) {
      case "1":
        symb = "+";
        break;
      case "2":
        symb = "-";
        break;
      case "3":
        symb = "*";
        break;
      default:
        break;
    }
    let newRow = `<tr>
                    <th scope="row">${i + 1}</th>
                    <td class="text-break">${oldHistory[i].firstInt}</td>
                    <td>${symb}</td>
                    <td class="text-break">${oldHistory[i].secondInt}</td>
                    <td class="text-break">${oldHistory[i].result}</td>
                  </tr>`;
    $("#history").prepend(newRow);
  }
}

function renderLastResult(firstInt,op,secondInt,result) {
  let symb = "";
  let currentIndex = $("#history").children().length;
  switch (op) {
    case "1":
      symb = "+";
      break;
    case "2":
      symb = "-";
      break;
    case "3":
      symb = "*";
      break;
    default:
      break;
  }
  let newRow = `<tr>
                    <th scope="row">${currentIndex+1}</th>
                    <td class="text-break">${firstInt}</td>
                    <td>${symb}</td>
                    <td class="text-break">${secondInt}</td>
                    <td class="text-break">${result}</td>
                  </tr>`;
  $("#history").prepend(newRow);
}
