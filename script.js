let earnings = JSON.parse(localStorage.getItem("earnings")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let savings = JSON.parse(localStorage.getItem("savings")) || [];

// SAVE
function saveData() {
  localStorage.setItem("earnings", JSON.stringify(earnings));
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("savings", JSON.stringify(savings));
}

// RENDER
function render() {
  const earningsList = document.getElementById("earnings-list");
  const expensesList = document.getElementById("expenses-list");
  const savingsList = document.getElementById("savings-list");

  earningsList.innerHTML = "";
  expensesList.innerHTML = "";
  savingsList.innerHTML = "";

  // Earnings
  earnings.forEach((item, index) => {
    earningsList.innerHTML += `
      <div class="row">
        <input type="text" placeholder="Label" value="${item.label}" onchange="updateEarningLabel(${index}, this.value)">
        <input type="number" placeholder="Amount" value="${item.amount}" onchange="updateEarningAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteEarning(${index})">X</button>
      </div>
    `;
  });

  // Expenses
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

  // Savings
  savings.forEach((item, index) => {
    savingsList.innerHTML += `
      <div class="row">
        <input type="text" placeholder="Label" value="${item.label}" onchange="updateSavingLabel(${index}, this.value)">
        <input type="number" placeholder="Amount" value="${item.amount}" onchange="updateSavingAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteSaving(${index})">X</button>
      </div>
    `;
  });

  calculateAndUpdate();
}

window.exportCSV = function () {
  let csv = "Label,Type,Amount\n";

  let totalEarnings = 0;
  let totalExpenses = 0;
  let totalSavings = 0;

  earnings.forEach(e => {
    csv += `${e.label},Income,${e.amount}\n`;
    totalEarnings += e.amount;
  });

  expenses.forEach(e => {
    csv += `${e.label},Expense,${e.amount}\n`;
    totalExpenses += e.amount;
  });

  savings.forEach(s => {
    csv += `${s.label},Savings,${s.amount}\n`;
    totalSavings += s.amount;
  });

  const remaining = totalEarnings - totalExpenses;

  csv += "\n";
  csv += `Total Earnings,,${totalEarnings}\n`;
  csv += `Total Expenses,,${totalExpenses}\n`;
  csv += `Total Savings,,${totalSavings}\n`;
  csv += `Remaining,,${remaining}\n`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "finance-data.csv";
  a.click();
};

// GLOBAL FUNCTIONS
window.addEarning = function () {
  earnings.push({ label: "", amount: 0 });
  saveData();
  render();
};

window.addExpense = function () {
  expenses.push({ label: "", category: "Food", amount: 0 });
  saveData();
  render();
};

window.addSaving = function () {
  savings.push({ label: "", amount: 0 });
  saveData();
  render();
};

window.deleteEarning = function (index) {
  earnings.splice(index, 1);
  saveData();
  render();
};

window.deleteExpense = function (index) {
  expenses.splice(index, 1);
  saveData();
  render();
};

window.deleteSaving = function (index) {
  savings.splice(index, 1);
  saveData();
  render();
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

window.updateSavingLabel = function (index, value) {
  savings[index].label = value;
  saveData();
  calculateAndUpdate();
};

window.updateSavingAmount = function (index, value) {
  savings[index].amount = parseFloat(value) || 0;
  saveData();
  calculateAndUpdate();
};

// CALCULATE
function calculateAndUpdate() {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
  const remaining = totalEarnings - totalExpenses;

  document.getElementById("total-earnings").innerText = totalEarnings;
  document.getElementById("total-expenses").innerText = totalExpenses;
  document.getElementById("total-savings").innerText = totalSavings;
  document.getElementById("remaining").innerText = remaining;

  const container = document.getElementById("category-totals");

const categoryTotals = {};

expenses.forEach(e => {
  const category = e.category || "Other";
  categoryTotals[category] = (categoryTotals[category] || 0) + e.amount;
});

container.innerHTML = "";

if (Object.keys(categoryTotals).length === 0) {
  container.innerHTML = "<p>No category data</p>";
} else {
  for (let category in categoryTotals) {
    container.innerHTML += `
      <p><strong>${category}</strong>: ₱${categoryTotals[category]}</p>
    `;
  }
}

// INIT
render();
