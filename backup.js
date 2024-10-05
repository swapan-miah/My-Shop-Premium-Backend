let previousDebt = 0;
let currentDebt = 0;
let bankCost = 0;
let fine = 0;
let bonus = 0;

for (const bank of bank_name_list) {
  const transactionDate = new Date(transaction.date);

  const collectionName = bank.collectionName;
  if (collectionName) {
    const bank_collection = database.collection(collectionName);
    const transaction = await bank_collection.find({}).toArray();

    let previousDebt = 0;
    let previousDebtAmount = 0;
    let currentDebt = 0;
    let currentDebtAmount = 0;

    // পূর্বের ঋণ (timeFrame এর আগের দিন পর্যন্ত)
    if (transactionDate < timeFrameStartDate) {
      if (transaction.paymentType === "debt_repayment") {
        previousDebtAmount += transaction.amount; // debt_repayment amount will be subtracted
        previousDebt += transaction.willBePaidAmount - transaction.amount;
      }
    }

    // বর্তমান ঋণ (timeFrame এর মধ্যে)
    if (
      transactionDate >= timeFrameStartDate &&
      transactionDate <= selectedDate
    ) {
      if (transaction.paymentType === "debt_repayment") {
        currentDebtAmount += transaction.amount; // debt_repayment amount will be subtracted
        currentDebt += transaction.willBePaidAmount - transaction.amount;
      } else if (transaction.paymentType === "bankCost") {
        bankCost += transaction.amount;
      } else if (transaction.paymentType === "fine") {
        fine += transaction.amount;
      } else if (transaction.paymentType === "bonus") {
        bonus += transaction.amount;
      }
    }
  }
}
