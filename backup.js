// ------------------- Supplier Information ---------------------
const supplier_name_list = await supplier_name_Collection.find({}).toArray();
let totalBill = 0;
let totalPayment = 0;
let totalGet = 0;
let how_much_previous_get = 0;
let how_much_had_paid = 0; // Variable to store total payments in the timeFrame

const previousDay = new Date(timeFrameStartDate);
previousDay.setDate(previousDay.getDate() - 1); // Get the previous day of timeFrame start

for (const supplier of supplier_name_list) {
  const collectionName = supplier.collectionName;
  if (collectionName) {
    const supplier_collection = database.collection(collectionName);
    const supplier_info = await supplier_collection.find({}).toArray();

    let how_much_amout_bill = 0;
    let how_much_amout_paid = 0;
    let previous_amout_bill = 0;
    let previous_amout_paid = 0;

    for (const transaction of supplier_info) {
      const transactionDate = new Date(transaction.date);

      // Current timeFrame calculations (timeFrame start date to selected date)
      if (
        transactionDate >= timeFrameStartDate &&
        transactionDate <= selectedDate
      ) {
        if (transaction.paymentType === "bill") {
          how_much_amout_bill += transaction.amount;
        } else if (transaction.paymentType === "payment") {
          how_much_amout_paid += transaction.amount;
          how_much_had_paid += transaction.amount; // Sum all payments within timeFrame
        }
      }

      // Previous period before the timeFrame
      if (transactionDate <= previousDay) {
        if (transaction.paymentType === "bill") {
          previous_amout_bill += transaction.amount;
        } else if (transaction.paymentType === "payment") {
          previous_amout_paid += transaction.amount;
        }
      }
    }

    // Calculate the remaining amount to get from the supplier within timeFrame
    const how_much_amout_get = how_much_amout_bill - how_much_amout_paid;
    totalBill += how_much_amout_bill;
    totalPayment += how_much_amout_paid;
    totalGet += how_much_amout_get;

    // Calculate previous remaining amount to get before the timeFrame start date
    const previous_get = previous_amout_bill - previous_amout_paid;
    how_much_previous_get += previous_get;
  }
}

// ------------------- Final Calculation --------------------
const grandTotal = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.grand_total || 0),
  0
);
const profit = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.total_profit || 0),
  0
);
const previouse_due = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.previous_due || 0),
  0
);
const total_due = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.total_due || 0),
  0
);
const paid = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.paid || 0),
  0
);
const due = filteredResults?.reduce(
  (acc, item) => acc + Number(item?.due || 0),
  0
);
const allDuepaid = filteredDuePaymentResults?.reduce(
  (acc, item) => acc + Number(item?.paid || 0),
  0
);
const allExpense = filteredExpenseResults?.reduce(
  (acc, item) => acc + Number(item?.amount || 0),
  0
);

const sell_Info = {
  grandTotal: grandTotal,
  profit: profit,
  previouse_due: previouse_due + allDuepaid,
  total_due: total_due,
  paid: paid + allDuepaid,
  due,
  allExpense,
  bankTotal: mainAmount, // bank total till the selected timeFrame
  bankPreviousTotal: previousBankTotal, // bank total till the previous day of the timeFrame
  bankDeposit: totalDeposit, // total deposits during the timeFrame (includes 'previous_amount' within timeFrame)
  bankWithdraw: totalWithdraw, // total withdraws during the timeFrame
  // supplierBill: totalBill, // total bills from suppliers
  // supplierPayment: totalPayment, // total payments to suppliers
  supplierGet: totalGet, // total remaining amount to get from suppliers
};
