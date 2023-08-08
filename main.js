const form = document.querySelector(".js-cd-form");
const display = document.querySelector(".js-display-cards");
const submitButton = form.querySelector(".js-submit-btn");
const successScreen = document.querySelector(".js-success-screen");
//linking all input elements, their corresponding display elements and validation preferences on an array of objects
const inputsAndDisplays = [
  {
    name: "ch name",
    inputElement: form.querySelector(".js-input-ch-name"),
    displayElement: display.querySelector(".js-display-ch-name"),
    errorElement: form.querySelector(".js-ch-name-error"),
    onlyNumbers: false,
    minLength: 0,
    maxLength: 0
  },
  {
    name: "ccn",
    inputElement: form.querySelector(".js-input-ccn"),
    displayElement: display.querySelector(".js-display-ccn"),
    errorElement: form.querySelector(".js-ccn-error"),
    onlyNumbers: true,
    minLength: 19,
    maxLength: 19
  },
  {
    name: "exp month",
    inputElement: form.querySelector(".js-input-exp-month"),
    displayElement: display.querySelector(".js-display-exp-month"),
    errorElement: form.querySelector(".js-exp-month-error"),
    onlyNumbers: true,
    minLength: 2,
    maxLength: 2
  },
  {
    name: "exp year",
    inputElement: form.querySelector(".js-input-exp-year"),
    displayElement: display.querySelector(".js-display-exp-year"),
    errorElement: form.querySelector(".js-exp-year-error"),
    onlyNumbers: true,
    minLength: 2,
    maxLength: 2
  },
  {
    name: "cvc",
    inputElement: form.querySelector(".js-input-cvc"),
    displayElement: display.querySelector(".js-display-cvc"),
    errorElement: form.querySelector(".js-cvc-error"),
    onlyNumbers: true,
    minLength: 3,
    maxLength: 3
  }
];

// input value to display on keyup event
for (let i = 0, len = inputsAndDisplays.length; i < len; i++) {
  let item = inputsAndDisplays[i];
  displayTheInput(item);
};
// input validation and error messages
submitButton.addEventListener("click", (e) => {
  let success = true;
  e.preventDefault();
  for (let i = 0, len = inputsAndDisplays.length; i < len; i++) {
    let item = inputsAndDisplays[i];
    //input is not blank validation and the domming the error message
    let [inputIsNotBlank, errorMsg] = validateNotBlank(item.inputElement);
    let currentInputError = false;
    if (!inputIsNotBlank) {
      success = false;
      currentInputError = true;
    }
    item.errorElement.textContent = errorMsg;
    item.errorElement.setAttribute("aria-hidden", inputIsNotBlank);
    item.inputElement.setAttribute("aria-invalid", !inputIsNotBlank);
    /* validating the inputs that only accept numbers */
    if (item.onlyNumbers) {
      let [onlyHasNumbers, errorMsg] = validateOnlyNumber(item.inputElement);
      if (!onlyHasNumbers) {
        success = false;
        currentInputError = true;
        item.errorElement.textContent = errorMsg;
        item.errorElement.setAttribute("aria-hidden", inputIsNotBlank);
        item.inputElement.setAttribute("aria-invalid", !inputIsNotBlank);
      }
    }
    if (currentInputError) {
      item.inputElement.parentElement.classList.add("error-state");
    }
    else {
      item.inputElement.parentElement.classList.remove("error-state");
    }
  }
  /* do not display both expiration errors at the same time, but do read it on screen readers */
  let expMonthItem = inputsAndDisplays.find(obj => {
    return obj.name === "exp month";
  });
  let expYearItem = inputsAndDisplays.find(obj => {
    return obj.name === "exp year";
  });
  if (expMonthItem.inputElement.getAttribute("aria-invalid") &&
    expYearItem.inputElement.getAttribute("aria-invalid")) {
    expYearItem.errorElement.classList.add("sr-only");
  }
  if (success) {
    form.setAttribute("aria-hidden", true);
    successScreen.setAttribute("aria-hidden", false);
  }
});

function displayTheInput(item) {
  item.inputElement.addEventListener("keyup", () => {
    if (item.name === "ccn") {
      item.inputElement.value = formatCCN(item.inputElement.value.replaceAll(" ", ""));
    }
    if (item.maxLength && item.maxLength < item.inputElement.value.length) {
      item.inputElement.value = item.inputElement.value.substring(0, item.maxLength);
    }
    item.displayElement.textContent = item.inputElement.value;
  });
}
// put spaces between every four number
const formatCCN = (number) => {
  let numarray = number.split("");
  let newarray = [];
  for (let i = 0; i < numarray.length; i++) {
    if (i != 0 && i % 4 == 0) {
      newarray.push(" ");
    }
    newarray.push(numarray[i]);
  }
  return newarray.join("");
};

const validateOnlyNumber = (element) => {
  if (!/^[0-9\s]*$/.test(element.value)) {
    return [false, "Wrong format, numbers only"];
  }
  return [true, ""];
};

const validateNotBlank = (element) => {
  if (element.value.replaceAll(" ", "") == "") {
    return [false, "Can't be blank"]
  }
  return [true, ""];
}