let earnings = JSON.parse(localStorage.getItem("earnings")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// SAVE
function saveData() {
  localStorage.setItem("earnings", JSON.stringify(earnings));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// RENDER
function render() {
  const earningsList = document.getElementById("earnings-list");
  const expensesList = document.getElementById("expenses-list");

  earningsList.innerHTML = "";
  expensesList.innerHTML = "";

  earnings.forEach((item, index) => {
    earningsList.innerHTML += `
      <div class="row">
        <input type="text" placeholder="Label" value="${item.label}" onchange="updateEarningLabel(${index}, this.value)">
        <input type="number" placeholder="Amount" value="${item.amount}" onchange="updateEarningAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteEarning(${index})">X</button>
      </div>
    `;
  });

  expenses.forEach((item, index) => {
    expensesList.innerHTML += `
      <div class="row">
        <input type="text" placeholder="Label" value="${item.label}" onchange="updateExpenseLabel(${index}, this.value)">
        
        <select onchange="updateExpenseCategory(${index}, this.value)">
          <option value="Food" ${item.category === "Food" ? "selected" : ""}>Food</option>
          <option value="Bills" ${item.category === "Bills" ? "selected" : ""}>Bills</option>
          <option value="Transport" ${item.category === "Transport" ? "selected" : ""}>Transport</option>
          <option value="Personal" ${item.category === "Personal" ? "selected" : ""}>Personal</option>
        </select>

        <input type="number" placeholder="Amount" value="${item.amount}" onchange="updateExpenseAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteExpense(${index})">X</button>
      </div>
    `;
  });
}

// GLOBAL FUNCTIONS
window.addEarning = function () {
  earnings.push({ label: "", amount: 0 });
  saveData();
  render();
  calculateAndUpdate();
};

window.addExpense = function () {
  expenses.push({ label: "", category: "Food", amount: 0 });
  saveData();
  render();
  calculateAndUpdate();
};

window.deleteEarning = function (index) {
  earnings.splice(index, 1);
  saveData();
  render();
  calculateAndUpdate();
};

window.deleteExpense = function (index) {
  expenses.splice(index, 1);
  saveData();
  render();
  calculateAndUpdate();
};

window.updateEarningLabel = function (index, value) {
  earnings[index].label = value;
  saveData();
  calculateAndUpdate();
};

window.updateEarningAmount = function (index, value) {
  earnings[index].amount = parseFloat(value) || 0;
  saveData();
  calculateAndUpdate();
};

window.updateExpenseLabel = function (index, value) {
  expenses[index].label = value;
  saveData();
  calculateAndUpdate();
};

window.updateExpenseAmount = function (index, value) {
  expenses[index].amount = parseFloat(value) || 0;
  saveData();
  calculateAndUpdate();
};

window.updateExpenseCategory = function (index, value) {
  expenses[index].category = value;
  saveData();
  calculateAndUpdate();
};

// CALCULATE
function calculateAndUpdate() {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalEarnings - totalExpenses;

  document.getElementById("total-earnings").innerText = totalEarnings;
  document.getElementById("total-expenses").innerText = totalExpenses;
  document.getElementById("remaining").innerText = remaining;
}

// EXPORT
window.exportCSV = function () {
  let csv = "Label,Type,Amount\n";

  let totalEarnings = 0;
  let totalExpenses = 0;

  earnings.forEach(e => {
    csv += `${e.label},Income,${e.amount}\n`;
    totalEarnings += e.amount;
  });

  expenses.forEach(e => {
    csv += `${e.label},Expense,${e.amount}\n`;
    totalExpenses += e.amount;
  });

  const remaining = totalEarnings - totalExpenses;

  csv += "\n";
  csv += `Total Income,,${totalEarnings}\n`;
  csv += `Total Expense,,${totalExpenses}\n`;
  csv += `Remaining,,${remaining}\n`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "finance-data.csv";
  a.click();
};

// INIT
render();
