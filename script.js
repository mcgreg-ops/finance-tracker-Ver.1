function exportCSV() {
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

  // Add spacing line
  csv += "\n";

  // Add totals
  csv += `Total Income,,${totalEarnings}\n`;
  csv += `Total Expense,,${totalExpenses}\n`;
  csv += `Remaining,,${remaining}\n`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "finance-data.csv";
  a.click();
}
