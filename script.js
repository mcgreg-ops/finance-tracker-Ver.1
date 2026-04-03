let earnings = JSON.parse(localStorage.getItem("earnings")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveData() {
  localStorage.setItem("earnings", JSON.stringify(earnings));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function render() {
  const earningsList = document.getElementById("earnings-list");
  const expensesList = document.getElementById("expenses-list");

  earningsList.innerHTML = "";
  expensesList.innerHTML = "";

  earnings.forEach((item, index) => {
    earningsList.innerHTML += `
      <div class="row">
        <input type="text" value="${item.label}" onchange="updateEarningLabel(${index}, this.value)">
        <input type="number" value="${item.amount}" onchange="updateEarningAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteEarning(${index})">X</button>
      </div>
    `;
  });

  expenses.forEach((item, index) => {
    expensesList.innerHTML += `
      <div class="row">
        <input type="text" value="${item.label}" onchange="updateExpenseLabel(${index}, this.value)">
        <input type="number" value="${item.amount}" onchange="updateExpenseAmount(${index}, this.value)">
        <button class="delete-btn" onclick="deleteExpense(${index})">X</button>
      </div>
    `;
  });
}

function addEarning() {
  earnings.push({ label: "", amount: 0 });
  saveData();
  render();
}

function addExpense() {
  expenses.push({ label: "", amount: 0 });
  saveData();
  render();
}

function deleteEarning(index) {
  earnings.splice(index, 1);
  saveData();
  render();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  render();
}

function updateEarningLabel(index, value) {
  earnings[index].label = value;
  saveData();
}

function updateEarningAmount(index, value) {
  earnings[index].amount = parseFloat(value) || 0;
  saveData();
}

function updateExpenseLabel(index, value) {
  expenses[index].label = value;
  saveData();
}

function updateExpenseAmount(index, value) {
  expenses[index].amount = parseFloat(value) || 0;
  saveData();
}

function calculate() {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalEarnings - totalExpenses;

  document.getElementById("total-earnings").innerText = totalEarnings;
  document.getElementById("total-expenses").innerText = totalExpenses;
  document.getElementById("remaining").innerText = remaining;
}

function exportCSV() {
  let csv = "Label,Type,Amount\n";

  earnings.forEach(e => {
    csv += `${e.label},Income,${e.amount}\n`;
  });

  expenses.forEach(e => {
    csv += `${e.label},Expense,${e.amount}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "finance-data.csv";
  a.click();
}

render();
