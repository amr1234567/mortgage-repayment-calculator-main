let resultSection = document.getElementsByClassName("result-section")[0];

class Form {
  constructor() {
    this.form = document.getElementsByTagName("form")[0];
    this.mortgageAmountDiv = document.getElementsByClassName("amount-input")[0];
    this.mortgageAmountInput = document.querySelector(".amount-input input");
    this.mortgageTermDiv = document.getElementsByClassName("date-input")[0];
    this.mortgageTermInput = document.querySelector(".date-input input");
    this.interestRateDiv = document.querySelector(
      ".rate-input .input-with-late-icon"
    );
    this.mortgageInterestRateDiv = document.querySelector(".rate-input");
    this.interestRateInput = document.querySelector(".rate-input input");
    this.typeOptionsDivs = document.querySelectorAll(".type-option");
    this.typeOptionsRadios = document.querySelectorAll(".type-option input");
    this.inputContainers = document.querySelectorAll(".input-container");
    this.resultSection = document.querySelector(".result-section");
    this.inputContainersInputs = document.querySelectorAll(
      ".input-container > input"
    );
    this.inputContainersInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        this.inputContainers.forEach((container) => {
          container.classList.remove("input-container-focus");
          if (input.id === container.dataset.id) {
            container.classList.add("input-container-focus");
          }
        });
        input.classList.add("input-container-focus");
      });
      input.addEventListener("blur", () => {
        this.inputContainers.forEach((input) => {
          input.classList.remove("input-container-focus");
        });
      });
    });
  }

  clearForm() {
    console.log("clearing form");
    this.mortgageAmountInput.value = "";
    this.mortgageTermInput.value = "";
    this.interestRateInput.value = "";
    this.typeOptionsRadios.forEach((radio) => {
      radio.checked = false;
    });
    this.removeErrorPs();
    this.inputContainersInputs.forEach((input) => {
      input.classList.remove("input-container-focus");
    });
    this.resultSection.innerHTML = `
    <div class="normal-view">
        <img src="/assets/images/illustration-empty.svg" alt="illustration-empty">
        <h3>Results shown here</h3>
        <p>Complete the form and click “calculate repayments” to see what
          your monthly repayments would be.</p>
      </div>
    `;
  }
  onSubmit(e) {
    e.preventDefault();
    let formData = new FormData(this.form);
    this.typeOptionsRadios.forEach((radio) => {
      if (radio.checked) {
        formData.set("type", radio.value);
      }
    });
    if (!formData.get("type")) {
      formData.set("type", "");
    }
    if (this.validateForm(formData)) {
      let result = this.calculateMortgage(formData);
      this.showResultSection(result, +formData.get("date"));
    }
  }
  calculateMortgage(formData) {
    return (+formData.get("amount") * +formData.get("rate")) / 100;
  }
  showResultSection(result, years) {
    resultSection.innerHTML = `
       <div class="results">
        <header>
          <h3>Your results</h3>
          <p>Your results are shown below based on the information you provided.
            To adjust the results, edit the form and click “calculate repayments” again.</p>
        </header>
        <div class="result-with-overflow">
          <div class="overflow"></div>
          <div class="result-content">
            <div class="inserts-parts">
              <div class="inserts-per-amount-part">
                <p class="header">Your monthly repayments</p>
                <p class="result-amount">${"$" + result.toLocaleString()}</p>
              </div>
              <div class="result-separator"></div>
              <div class="total-inserts">
                <p class="header">
                  Total you'll repay over the term
                </p>
                <p class="result-amount">${
                  "$" + (result * years * 12).toLocaleString()
                }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  validateForm(formData) {
    this.removeErrorPs();
    let validAmount = this.validateAmount(formData.get("amount"));
    let validDate = this.validateDate(formData.get("date"));
    let validRate = this.validateRate(formData.get("rate"));
    let validType = this.validateType(formData.get("type"));
    return validAmount && validDate && validRate && validType;
  }

  removeErrorPs() {
    this.inputContainers.forEach((input) => {
      input.classList.remove("input-container-error");
    });
    if (this.mortgageInterestRateDiv.querySelector(".error"))
      this.mortgageInterestRateDiv.removeChild(
        this.mortgageInterestRateDiv.querySelector(".error")
      );
    if (this.mortgageAmountDiv.querySelector(".error"))
      this.mortgageAmountDiv.removeChild(
        this.mortgageAmountDiv.querySelector(".error")
      );
    if (this.mortgageTermDiv.querySelector(".error"))
      this.mortgageTermDiv.removeChild(
        this.mortgageTermDiv.querySelector(".error")
      );
  }

  validateAmount(amount) {
    if (amount && !(isNaN(amount) || amount <= 0)) {
      return true;
    }
    if (!this.hasClassInChildren(this.mortgageAmountDiv.children, "error")) {
      let p = document.createElement("p");
      p.textContent = "Please enter a valid amount";
      p.classList.add("error");
      this.mortgageAmountDiv.appendChild(p);
    }
    this.inputContainers.forEach((input) => {
      if (input.dataset.id == "amount") {
        input.classList.add("input-container-error");
      }
    });
    return false;
  }
  validateDate(date) {
    if (date && !(isNaN(date) || date <= 0)) {
      return true;
    }
    if (!this.hasClassInChildren(this.mortgageTermDiv.children, "error")) {
      let p = document.createElement("p");
      p.textContent = "Please enter a valid date";
      p.classList.add("error");
      this.mortgageTermDiv.appendChild(p);
    }
    this.inputContainers.forEach((input) => {
      if (input.dataset.id == "date") {
        input.classList.add("input-container-error");
      }
    });
    return false;
  }
  validateRate(rate) {
    if (rate && !(isNaN(rate) || rate < 0 || rate > 100)) {
      return true;
    }
    if (
      !this.hasClassInChildren(this.mortgageInterestRateDiv.children, "error")
    ) {
      let p = document.createElement("p");
      p.textContent = "Please enter a valid date";
      p.classList.add("error");
      this.mortgageInterestRateDiv.appendChild(p);
    }
    this.inputContainers.forEach((input) => {
      if (input.dataset.id == "rate") {
        input.classList.add("input-container-error");
      }
    });
    return false;
  }
  validateType(type) {
    console.log(type === "" || ["Interest-Only", "Repayment"].includes(type));
    return type === "" || ["Interest-Only", "Repayment"].includes(type);
  }

  hasClassInChildren = (children, className) => {
    for (let child of children) {
      if (child.classList.contains(className)) {
        return true;
      }
    }
    return false;
  };
  removeSelectedFromRadioOptions(typeOptionsDivs) {
    typeOptionsDivs.forEach(function (radioDiv) {
      if (radioDiv.classList.contains("type-option-selected")) {
        radioDiv.classList.remove("type-option-selected");
        radioDiv.classList.add("type-option");
      }
    });
  }

  loadEventsForRadioButtons() {
    this.typeOptionsDivs.forEach((radioDiv) => {
      radioDiv.addEventListener("click", () => {
        this.removeSelectedFromRadioOptions(this.typeOptionsDivs);
        this.typeOptionsRadios.forEach((radio) => {
          if (radio.id === radioDiv.dataset.id) {
            radio.checked = true;
            radioDiv.classList.add("type-option-selected");
            radioDiv.classList.remove("type-option");
          }
        });
      });
    });

    this.typeOptionsRadios.forEach((radio) => {
      radio.addEventListener("click", () => {
        this.removeSelectedFromRadioOptions(this.typeOptionsDivs);
        this.typeOptionsDivs.forEach((radioDiv) => {
          if (radioDiv.dataset.id === radio.id) {
            radioDiv.classList.add("type-option-selected");
            radioDiv.classList.remove("type-option");
          }
        });
      });
    });
  }
}

let form = new Form();
form.loadEventsForRadioButtons();

let clearForm = () => {
  form.clearForm();
};
