const finalCashFlowArray = await hand_Pocket_Cash_Collection.find({}).toArray();

// এখানে filteredFinalCashFlow ব্যবহার করে প্রয়োজনীয় ফিল্টার করা হতে পারে
let filteredFinalCashFlow = filterByTimeFrame(
  finalCashFlowArray,
  selectedDate,
  timeFrame
);

// Initialize variables to hold the total amounts for each payment type
let allSell = 0;
let allLoan = 0;
let allWithdraw = 0;
let allDeposit = 0;
let allDebtRepayment = 0;

// Iterate through the filtered cash flow array and calculate totals
filteredFinalCashFlow.forEach((object) => {
  if (object.paymentType === "sell") {
    allSell += object.amount;
  }
  if (object.paymentType === "loan") {
    allLoan += object.amount;
  }
  if (object.paymentType === "withdraw") {
    allWithdraw += object.amount;
  }
  if (object.paymentType === "deposit") {
    allDeposit += object.amount;
  }
  if (object.paymentType === "debt_repayment") {
    allDebtRepayment += object.amount;
  }
});

// Calculate final cash flow
const final_Cash_Flow =
  allSell + allLoan + allWithdraw - allDeposit - allDebtRepayment;

console.log("Final Cash Flow: ", final_Cash_Flow);
