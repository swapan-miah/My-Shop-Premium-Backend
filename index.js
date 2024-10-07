const express = require("express");
const app = express();
const port = process.env.PORT || 7000;
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//midleware
app.use(cors());
app.use(express.json()); // req.body undefined solve

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozyrkam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});

async function run() {
  try {
    // const database = client.db("check-m-e-1");
    const database = client.db("check-mariam-enter-mirzapur");
    const adminCollection = database.collection("admin");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const storeCollection = database.collection("store");
    const damage_Collection = database.collection("damage");
    const purchase_history_Collection = database.collection("purchase-history");
    const sells_history_Collection = database.collection("sells-history");
    const due_Collection = database.collection("due");
    const due_payment_Collection = database.collection("due-payment-history");
    const cost_Collection = database.collection("cost-history");
    const final_amount_Collection = database.collection("final-amount");
    const basic_expense_Collection = database.collection("basic-expense");
    const bank_name_Collection = database.collection("bank-collection-name");
    const supplier_name_Collection = database.collection(
      "supplier-name-collection"
    );
    const hand_Pocket_Cash_Collection = database.collection("hand-pocket-cash");
    const cash_box_Collection = database.collection("cash-box");

    //------------- find admin by login email
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };

      const user = await adminCollection.findOne(query);

      res.send({ isAdmin: user?.role == "admin" });
    });

    // find all products
    app.get("/products", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await productCollection.find(query).toArray();
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find all products Name
    app.get("/productsOption", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await productCollection.find(query).toArray();
          const productsName = result.map((product) => product?.product_name);
          res.send(productsName);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find product info by product name for pre order
    app.get("/productInfo_by_productName", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const product_name = req.query?.product_name;
          if (!product_name) {
            return res
              .status(400)
              .send({ message: "Product name is required" });
          }

          const query = { product_name };
          const result = await productCollection.findOne(query);

          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Product not found" });
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single product
    app.get("/product/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await productCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all pre orders
    app.get("/pre-orders", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await orderCollection.find(query).toArray();
          const pre_order = result.filter((item) => !item?.is_order == true);
          res.send(pre_order);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find all orders
    app.get("/orders", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await orderCollection.find(query).toArray();
          const pre_order = result.filter(
            (item) => item?.is_order === true && !item?.is_hidden === true
          );
          res.send(pre_order);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find Store collection
    app.get("/store", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await storeCollection.find(query).toArray();

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find purchase history collection
    app.get("/purchase-history", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await purchase_history_Collection
            .find(query)
            .toArray();
          const reverseResult = result.reverse();
          res.send(reverseResult);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single pre order item but order item is same collection
    // so get single order item
    app.get("/find-this-pre-order/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await orderCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all store  products Name
    app.get("/find-store-products-name", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const data = await storeCollection.find(query).toArray();
          // const filterProducts = data.filter(
          //   (product) => product?.store_quantity !== 0
          // );
          const productsName = data.map((product) => product?.product_name);
          res.send(productsName);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find store product info by product name for sells
    app.get("/store-product-info-by-product-name", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const product_name = req.query?.product_name;
          if (!product_name) {
            return res
              .status(400)
              .send({ message: "Product name is required" });
          }

          const query = { product_name };
          const result = await storeCollection.findOne(query);

          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Product not found" });
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find Store collection
    app.get("/sells-history", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          if (req.query?.date === "all") {
            // "all" হলে সমস্ত ডেটা ফেচ করবে
            const result = (
              await sells_history_Collection.find({}).toArray()
            ).reverse();
            res.send(result);
          } else {
            // নির্দিষ্ট তারিখের ডেটা ফেচ করবে
            const date = req.query.date;
            const query = { date: date };

            const result = (
              await sells_history_Collection.find(query).toArray()
            ).reverse();
            res.send(result);
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    app.get("/sell-history/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await sells_history_Collection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single stor item
    app.get("/get-single-store-item/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await storeCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find store product info by product name for store
    app.get("/find-this-item-store-old-price", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const product_name = req.query?.product_name;
          if (!product_name) {
            return res
              .status(400)
              .send({ message: "Product name is required" });
          }

          const query = { product_name };
          const result = await storeCollection.findOne(query);

          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Product not found" });
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all due
    app.get("/due", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await due_Collection.find(query).toArray();
          const reverseResult = result.reverse();

          res.send(reverseResult);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find due recode for invoice payment form
    app.get("/due/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await due_Collection.findOne(query);

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all due
    app.get("/due-payment-list", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await due_payment_Collection.find(query).toArray();
          const reverseResult = result.reverse();

          res.send(reverseResult);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // due find by id for due invoice
    app.get("/due-payment-invoice/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await due_payment_Collection.findOne(query);

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // Summary endpoint with updated subTotal calculation
    app.get("/summary", async (req, res) => {
      try {
        const queryDate = req.query?.date;

        if (!queryDate) {
          return res
            .status(400)
            .send({ message: "Date query parameter is required" });
        }

        const query = { date: queryDate };

        // Fetch sell history data
        const sell_his_result = await sells_history_Collection
          .find(query)
          .toArray();

        // Fetch due payment data
        const due_payment_res = await due_payment_Collection
          .find(query)
          .toArray();

        // Fetch cost data
        const cost_list = await cost_Collection.find(query).toArray();

        // Subtract one day from queryDate to get the previous day's main amount
        const previousDayDate = new Date(queryDate);
        previousDayDate.setDate(previousDayDate.getDate() - 1);
        const previousDayQuery = {
          date: previousDayDate.toISOString().split("T")[0],
        };

        // Fetch the previous day's main amount
        const prevDayResult = await final_amount_Collection.findOne(
          previousDayQuery
        );
        const prevDayMainValue = prevDayResult?.amount || 0; // Default to 0 if no result

        // Calculate total profit from sells
        const totalSellsProfit = sell_his_result.length
          ? sell_his_result.reduce((acc, sell) => {
              const allProductsProfit = sell.products.reduce(
                (productAcc, product) => productAcc + product.profit,
                0
              );
              return acc + allProductsProfit;
            }, 0)
          : 0;

        // Calculate overall due and paid from sell history
        const overallDue = sell_his_result.length
          ? sell_his_result.reduce((acc, item) => acc + Number(item.due), 0)
          : 0;

        const overallPaid = sell_his_result.length
          ? sell_his_result.reduce((acc, item) => acc + Number(item?.paid), 0)
          : 0;

        // Calculate the total amount paid from the due payment collection
        const overallPaidFromDue = due_payment_res.length
          ? due_payment_res.reduce((acc, item) => acc + Number(item?.paid), 0)
          : 0;

        // Calculate total cost from the cost collection
        const allCost = cost_list.length
          ? cost_list.reduce((acc, item) => acc + Number(item?.amount), 0)
          : 0;

        // Calculate the updated subTotal using prevDayMainValue, overallPaid, and overallPaidFromDue
        const overallSubTotal =
          prevDayMainValue + overallPaid + overallPaidFromDue;

        // Construct the summary object
        const sell_summary = {
          prevDayAmount: prevDayMainValue,
          profit: totalSellsProfit,
          due: overallDue,
          paid: overallPaid,
          subTotalForSale: overallPaid + overallPaidFromDue,
          subTotalAmount: overallSubTotal,
          duePayment: overallPaidFromDue,
          totalCost: allCost,
          amount: overallSubTotal - allCost,
        };

        // Send the summary result
        res.send(sell_summary);
      } catch (error) {
        res.status(500).send({
          message: "An error occurred",
          error: error.message,
        });
      }
    });

    // Endpoint to get the main amount for a specific day
    app.get("/find-prev-day-main-amount", async (req, res) => {
      try {
        const queryDate = req.query?.date;

        // Check if date parameter is provided
        if (!queryDate) {
          return res
            .status(400)
            .send({ message: "Date query parameter is required" });
        }

        // MongoDB query to find the main amount by date
        const query = { date: queryDate };

        // Use `find` and convert the cursor to an array
        const result = await final_amount_Collection.find(query).toArray();

        // Send the result back to the client
        res.send(result);
      } catch (error) {
        console.error(
          "An error occurred while fetching the previous day's main amount:",
          error
        );
        res.status(500).send({
          message: "An error occurred",
          error: error.message, // Include error message for better understanding
        });
      }
    });

    // find all products
    app.get("/cost-list", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const queryDate = req.query?.date;

          if (!queryDate) {
            return res
              .status(400)
              .send({ message: "Date query parameter is required" });
          }
          const query = { date: queryDate };

          const result = await cost_Collection.find(query).toArray();
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // Find Damage List
    app.get("/damage-list", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        // Check if keys match
        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          // Fetch damage list from MongoDB and convert to array
          const result = await damage_Collection.find(query).toArray();

          res.send(result); // Send the result as the response
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single product
    app.get("/this-damage-product-find/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await damage_Collection.findOne(query);

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // / find income-sector
    app.get("/income-sector", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const queryDate = req.query?.date;
          const timeFrame = req.query?.timeFrame;

          if (!queryDate || !timeFrame) {
            return res.status(400).send({
              message: "Date and timeFrame query parameters are required",
            });
          }

          // Fetch all results without any filter
          const allResults = await income_sector_Collection.find({}).toArray();

          // Parse the query date
          const selectedDate = new Date(queryDate);
          let filteredResults = [];

          // Filter based on timeFrame
          if (timeFrame === "daily") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else if (timeFrame === "weekly") {
            const startOfWeek = (date) => {
              const d = new Date(date);
              const day = d.getDay();
              const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
              return new Date(d.setDate(diff));
            };

            const endOfWeek = (date) => {
              const d = new Date(startOfWeek(date));
              d.setDate(d.getDate() + 6);
              return d;
            };

            const weekStart = startOfWeek(selectedDate);
            const weekEnd = endOfWeek(selectedDate);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= weekStart && itemDate <= weekEnd;
            });
          } else if (timeFrame === "monthly") {
            const monthStart = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              1
            );
            const monthEnd = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth() + 1,
              0
            );
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= monthStart && itemDate <= monthEnd;
            });
          } else if (timeFrame === "yearly") {
            const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
            const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= yearStart && itemDate <= yearEnd;
            });
          } else if (timeFrame === "custom") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else {
            return res
              .status(400)
              .send({ message: "Invalid timeFrame parameter" });
          }

          // Send the filtered result to the frontend
          res.send(filteredResults);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find Expenditure_Sector
    app.get("/expenditure-sector", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const queryDate = req.query?.date;
          const timeFrame = req.query?.timeFrame;

          if (!queryDate || !timeFrame) {
            return res.status(400).send({
              message: "Date and timeFrame query parameters are required",
            });
          }

          // Fetch all results without any filter
          const allResults = await expen_sector_Collection.find({}).toArray();

          // Parse the query date
          const selectedDate = new Date(queryDate);
          let filteredResults = [];

          // Filter based on timeFrame
          if (timeFrame === "daily") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else if (timeFrame === "weekly") {
            const startOfWeek = (date) => {
              const d = new Date(date);
              const day = d.getDay();
              const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
              return new Date(d.setDate(diff));
            };

            const endOfWeek = (date) => {
              const d = new Date(startOfWeek(date));
              d.setDate(d.getDate() + 6);
              return d;
            };

            const weekStart = startOfWeek(selectedDate);
            const weekEnd = endOfWeek(selectedDate);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= weekStart && itemDate <= weekEnd;
            });
          } else if (timeFrame === "monthly") {
            const monthStart = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              1
            );
            const monthEnd = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth() + 1,
              0
            );
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= monthStart && itemDate <= monthEnd;
            });
          } else if (timeFrame === "yearly") {
            const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
            const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= yearStart && itemDate <= yearEnd;
            });
          } else if (timeFrame === "custom") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else {
            return res
              .status(400)
              .send({ message: "Invalid timeFrame parameter" });
          }

          // Send the filtered result to the frontend
          res.send(filteredResults);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  find income-sector
    app.get("/cash-report", async (req, res) => {
      try {
        const queryDate = req.query?.date;
        const timeFrame = req.query?.timeFrame;

        if (!queryDate || !timeFrame) {
          return res.status(400).send({
            message: "Date and timeFrame query parameters are required",
          });
        }

        const selectedDate = new Date(queryDate);

        // ------------------- Sells History -----------------------
        const allResults = await sells_history_Collection.find({}).toArray();
        let filteredResults = filterByTimeFrame(
          allResults,
          selectedDate,
          timeFrame
        );

        // ------------------- Due Payments -------------------------
        const allDuePaidResults = await due_payment_Collection
          .find({})
          .toArray();
        let filteredDuePaymentResults = filterByTimeFrame(
          allDuePaidResults,
          selectedDate,
          timeFrame
        );

        // ------------------- Expenses -----------------------------
        const allExpenseResults = await basic_expense_Collection
          .find({})
          .toArray();
        let filteredExpenseResults = filterByTimeFrame(
          allExpenseResults,
          selectedDate,
          timeFrame
        );

        // ------------------- Bank Information ---------------------
        const bank_name_list = await bank_name_Collection.find({}).toArray();

        let mainAmount = 0;
        let previousBankTotal = 0;
        let totalDeposit = 0;
        let totalWithdraw = 0;
        let fine1 = 0;

        const timeFrameStartDate = getStartDateForTimeFrame(
          selectedDate,
          timeFrame
        ); // Helper function for timeFrame start date

        for (const bank of bank_name_list) {
          const collectionName = bank.collectionName;

          if (collectionName) {
            const bank_collection = database.collection(collectionName);
            const bank_info = await bank_collection.find({}).toArray();

            let totalAmount = 0;
            let previous_amount = 0;
            let deposit = 0;
            let bonus = 0;
            let withdraw = 0;
            let bankCost = 0;

            for (const transaction of bank_info) {
              const transactionDate = new Date(transaction.date);

              // Current timeFrame calculations (timeFrame start date to selected date)
              if (
                transactionDate >= timeFrameStartDate &&
                transactionDate <= selectedDate
              ) {
                if (transaction.paymentType === "deposit") {
                  deposit += transaction.amount;
                } else if (transaction.paymentType === "bonus") {
                  bonus += transaction.amount;
                } else if (transaction.paymentType === "withdraw") {
                  withdraw += transaction.amount;
                } else if (transaction.paymentType === "bankCost") {
                  bankCost += transaction.amount;
                }
              }

              // Previous bank total (before the start of timeFrame)
              if (transactionDate < timeFrameStartDate) {
                if (transaction.paymentType === "previous_amount") {
                  previous_amount += transaction.amount;
                } else if (transaction.paymentType === "deposit") {
                  previous_amount += transaction.amount;
                } else if (transaction.paymentType === "bonus") {
                  previous_amount += transaction.amount;
                } else if (transaction.paymentType === "withdraw") {
                  previous_amount -= transaction.amount; // Withdrawals reduce the total
                } else if (transaction.paymentType === "bankCost") {
                  previous_amount -= transaction.amount;
                }
              }

              // selected time bank total
              if (transactionDate <= selectedDate) {
                if (transaction.paymentType === "previous_amount") {
                  totalAmount += transaction.amount;
                } else if (transaction.paymentType === "deposit") {
                  totalAmount += transaction.amount;
                } else if (transaction.paymentType === "bonus") {
                  totalAmount += transaction.amount;
                } else if (transaction.paymentType === "withdraw") {
                  totalAmount -= transaction.amount; // Withdrawals reduce the total
                } else if (transaction.paymentType === "bankCost") {
                  totalAmount -= transaction.amount;
                }
              }
            }

            // Bank calculations
            // ব্যাংকে ছিল = timeFrame এর আগের দিন পর্যন্ত previous_amount + deposit + bonus - withdraw - bankCost - fine;

            mainAmount += totalAmount;
            previousBankTotal += previous_amount;
            totalDeposit += deposit + bonus; // totalDeposit includes 'previous_amount' if it falls within the timeFrame
            totalWithdraw += withdraw;
          }
        }

        // ................... bank others info .............

        let debtPaid_by_timeFrame = 0;
        let bankCost = 0;
        let fine = 0;
        let bonus = 0;
        let previousDebtTotal = 0; // মোট previousDebt অ্যাকিউমুলেট করার জন্য
        let currentDebtTotal = 0; // মোট currentDebt অ্যাকিউমুলেট করার জন্য

        for (const bank of bank_name_list) {
          const collectionName = bank.collectionName;

          if (collectionName) {
            const bank_collection = database.collection(collectionName);
            const bank_info = await bank_collection.find({}).toArray();

            // ব্যাংকের প্রতিটি ট্রানজেকশনের জন্য অ্যাকিউমুলেট করা মান
            let previousDebtAmount = 0;
            let willBePaidAmount = 0;
            let previousFine = 0;
            let currentFine = 0;
            let currentDebtAmount = 0;
            let current_willBePaidAmount = 0;

            for (const transaction of bank_info) {
              const transactionDate = new Date(transaction.date);

              // পূর্বের ঋণ (timeFrame এর আগের দিন পর্যন্ত)
              if (transactionDate < timeFrameStartDate) {
                if (transaction.paymentType === "debt_repayment") {
                  previousDebtAmount += transaction.amount; // debt_repayment amount will be subtracted
                }
                if (transaction?.willBePaidAmount) {
                  willBePaidAmount += transaction.willBePaidAmount;
                }
                if (transaction.paymentType === "fine") {
                  previousFine += transaction.amount; // পূর্বের fine এখানে অ্যাকিউমুলেট করা হচ্ছে
                }
              }

              // বর্তমান ঋণ (timeFrame এর মধ্যে)
              if (transactionDate <= selectedDate) {
                if (transaction.paymentType === "debt_repayment") {
                  currentDebtAmount += transaction.amount; // debt_repayment amount will be subtracted
                }
                if (transaction?.willBePaidAmount) {
                  current_willBePaidAmount += transaction.willBePaidAmount;
                }
                if (transaction.paymentType === "fine") {
                  currentFine += transaction.amount; // বর্তমান fine এখানে অ্যাকিউমুলেট করা হচ্ছে
                }
              }

              // অন্যান্য ট্রানজেকশন (timeFrame এর মধ্যে)
              if (
                transactionDate >= timeFrameStartDate &&
                transactionDate <= selectedDate
              ) {
                if (transaction.paymentType === "debt_repayment") {
                  debtPaid_by_timeFrame += transaction.amount;
                } else if (transaction.paymentType === "bankCost") {
                  bankCost += transaction.amount;
                } else if (transaction.paymentType === "fine") {
                  fine += transaction.amount;
                } else if (transaction.paymentType === "bonus") {
                  bonus += transaction.amount;
                }
              }
            }

            // প্রতিটি ব্যাংকের জন্য হিসাব কনসোল এ দেখানো হচ্ছে
            const previousDebt =
              willBePaidAmount - previousDebtAmount + previousFine;
            const currentDebt =
              current_willBePaidAmount - currentDebtAmount + currentFine;

            // মোট previousDebt এবং currentDebt আপডেট করা হচ্ছে
            previousDebtTotal += previousDebt;
            currentDebtTotal += currentDebt;
          }
        }

        // লুপের শেষে মোট previousDebt এবং currentDebt প্রদর্শন করা হচ্ছে
        console.log("Total Previous Debt:", previousDebtTotal);
        console.log("Total Current Debt:", currentDebtTotal);

        // ------------------- Supplier Information ---------------------
        const supplier_name_list = await supplier_name_Collection
          .find({})
          .toArray();

        let supplier_due_before_timeFrame = 0; // TimeFrame এর আগের পাওনা
        let supplier_payment_within_timeFrame = 0; // TimeFrame এর মধ্যে দেয়া পেমেন্ট
        let supplier_due_at_end_of_timeFrame = 0; // TimeFrame শেষে বকেয়া

        const previousDay = new Date(timeFrameStartDate);

        for (const supplier of supplier_name_list) {
          const collectionName = supplier.collectionName;
          if (collectionName) {
            const supplier_collection = database.collection(collectionName);
            const supplier_info = await supplier_collection.find({}).toArray();

            let total_bill_before_timeFrame = 0;
            let total_payment_before_timeFrame = 0;

            let total_bill_within_timeFrame = 0;
            let total_payment_within_timeFrame = 0;

            for (const transaction of supplier_info) {
              const transactionDate = new Date(transaction.date);

              // Current timeFrame calculations (timeFrame start date to selected date)
              if (
                transactionDate >= timeFrameStartDate &&
                transactionDate <= selectedDate
              ) {
                if (transaction.paymentType === "bill") {
                  total_bill_within_timeFrame += transaction.amount;
                } else if (transaction.paymentType === "payment") {
                  total_payment_within_timeFrame += transaction.amount;
                }
              }

              // Previous period before the timeFrame (পাওনার হিসাব)
              if (transactionDate <= selectedDate) {
                if (transaction.paymentType === "bill") {
                  total_bill_before_timeFrame += transaction.amount;
                } else if (transaction.paymentType === "payment") {
                  total_payment_before_timeFrame += transaction.amount;
                }
              }
            }

            // Calculate due before the timeFrame
            const due_before_timeFrame =
              total_bill_before_timeFrame - total_payment_before_timeFrame;
            supplier_due_before_timeFrame += due_before_timeFrame;

            // Calculate payment within the timeFrame
            supplier_payment_within_timeFrame += total_payment_within_timeFrame;

            // Calculate due at the end of the timeFrame
            const due_at_end_of_timeFrame =
              total_bill_before_timeFrame - total_payment_before_timeFrame;

            supplier_due_at_end_of_timeFrame += due_at_end_of_timeFrame;
          }
        }

        // ------------------- final Cash Flow Array -----------------------------
        const finalCashFlowArray = await hand_Pocket_Cash_Collection
          .find({})
          .toArray();

        // Initialize variables to hold the total amounts for each payment type
        let allSell = 0;
        let allLoan = 0;
        let allWithdraw = 0;
        let allDeposit = 0;
        let allDebtRepayment = 0;
        let allPayment = 0;
        let Previouse_amount = 0;

        for (const object of finalCashFlowArray) {
          const transactionDate = new Date(object.date);

          if (transactionDate <= selectedDate) {
            if (object.paymentType === "sell") {
              allSell += object.amount || 0; // Safeguard against undefined
            }
            if (object.paymentType === "loan") {
              allLoan += object.amount || 0;
            }
            if (object.paymentType === "withdraw") {
              allWithdraw += object.amount || 0;
            }
            if (object.paymentType === "deposit") {
              allDeposit += object.amount || 0;
            }
            if (object.paymentType === "debt_repayment") {
              allDebtRepayment += object.amount || 0;
            }
            if (object.paymentType === "payment") {
              allPayment += object.amount || 0;
            }
            if (object.paymentType === "Previouse_amount") {
              Previouse_amount += object.amount || 0;
            }
          }
        }

        // Calculate final cash flow
        const final_Cash_Flow =
          Previouse_amount +
          allSell +
          allLoan +
          allWithdraw -
          allDeposit -
          allDebtRepayment -
          allPayment;

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
          // supplier_due_before_timeFrame, // সাপ্লায়ার পাওনা (timeFrame এর আগের দিন পর্যন্ত)
          supplier_payment_within_timeFrame, // সাপ্লায়ারকে দিয়েছি (timeFrame এর মধ্যে)
          supplier_due_at_end_of_timeFrame, // সাপ্লায়ার বকেয়া (timeFrame এর শেষে)

          previousDebtTotal, // পূর্বের ঋণ (timeFrame এর আগের দিন পর্যন্ত)
          currentDebtTotal, // বর্তমান ঋণ (timeFrame এর মধ্যে)
          debtPaid_by_timeFrame, // (timeFrame এর মধ্যে)
          bankCost, // (timeFrame এর মধ্যে)
          fine, // (timeFrame এর মধ্যে)
          bonus, //(timeFrame এর মধ্যে)
          final_Cash_Flow,
        };

        res.send(sell_Info);
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // Helper function to get the start date of the timeFrame
    function getStartDateForTimeFrame(selectedDate, timeFrame) {
      let startDate = new Date(selectedDate);

      if (timeFrame === "daily") {
        startDate.setHours(0, 0, 0, 0);
      } else if (timeFrame === "weekly") {
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek); // Set to the previous Sunday
      } else if (timeFrame === "monthly") {
        startDate.setDate(1); // Set to the first day of the month
      } else if (timeFrame === "yearly") {
        startDate.setMonth(0, 1); // Set to the first day of the year
      }

      return startDate;
    }

    // Helper function to filter based on timeFrame
    function filterByTimeFrame(data, selectedDate, timeFrame) {
      let filteredData = [];

      if (timeFrame === "daily") {
        filteredData = data.filter((item) => {
          return (
            new Date(item.date).toDateString() === selectedDate.toDateString()
          );
        });
      } else if (timeFrame === "weekly") {
        const startOfWeek = (date) => {
          const d = new Date(date);
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(d.setDate(diff));
        };

        const endOfWeek = (date) => {
          const d = new Date(startOfWeek(date));
          d.setDate(d.getDate() + 6);
          return d;
        };

        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= weekStart && itemDate <= weekEnd;
        });
      } else if (timeFrame === "monthly") {
        const monthStart = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );
        const monthEnd = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0
        );
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= monthStart && itemDate <= monthEnd;
        });
      } else if (timeFrame === "yearly") {
        const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
        const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= yearStart && itemDate <= yearEnd;
        });
      } else if (timeFrame === "custom") {
        filteredData = data.filter((item) => {
          return (
            new Date(item.date).toDateString() === selectedDate.toDateString()
          );
        });
      }

      return filteredData;
    }

    //  find-expense
    app.get("/find-expense", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const queryDate = req.query?.date;
          const timeFrame = req.query?.timeFrame;

          if (!queryDate || !timeFrame) {
            return res.status(400).send({
              message: "Date and timeFrame query parameters are required",
            });
          }

          // Fetch all results without any filter
          const allResults = await basic_expense_Collection.find({}).toArray();

          // Parse the query date
          const selectedDate = new Date(queryDate);
          let filteredResults = [];

          // Filter based on timeFrame
          if (timeFrame === "daily") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else if (timeFrame === "weekly") {
            const startOfWeek = (date) => {
              const d = new Date(date);
              const day = d.getDay();
              const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
              return new Date(d.setDate(diff));
            };

            const endOfWeek = (date) => {
              const d = new Date(startOfWeek(date));
              d.setDate(d.getDate() + 6);
              return d;
            };

            const weekStart = startOfWeek(selectedDate);
            const weekEnd = endOfWeek(selectedDate);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= weekStart && itemDate <= weekEnd;
            });
          } else if (timeFrame === "monthly") {
            const monthStart = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              1
            );
            const monthEnd = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth() + 1,
              0
            );
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= monthStart && itemDate <= monthEnd;
            });
          } else if (timeFrame === "yearly") {
            const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
            const yearEnd = new Date(selectedDate.getFullYear(), 11, 31);
            filteredResults = allResults.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate >= yearStart && itemDate <= yearEnd;
            });
          } else if (timeFrame === "custom") {
            filteredResults = allResults.filter((item) => {
              return (
                new Date(item.date).toDateString() ===
                selectedDate.toDateString()
              );
            });
          } else {
            return res
              .status(400)
              .send({ message: "Invalid timeFrame parameter" });
          }

          res.send(filteredResults);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all bank name
    app.get("/all-bank-info", async (req, res) => {
      try {
        // const crose_maching_backend_key = process.env.Front_Backend_Key;
        // const crose_maching_frontend_key =
        //   req.headers.authorization?.split(" ")[1];

        // if (crose_maching_backend_key === crose_maching_frontend_key) {
        // Step 1: Retrieve all the bank names (collections)
        const bank_name_list = await bank_name_Collection.find({}).toArray();

        // Step 2: Iterate over each collectionName and query the respective collection
        const bank_info_list = [];

        for (const bank of bank_name_list) {
          const collectionName = bank.collectionName; // Access collectionName from each bank document

          if (collectionName) {
            // Step 3: Dynamically query each collection
            const bank_collection = database.collection(collectionName); // Dynamically access the collection
            const bank_info = await bank_collection.find({}).toArray(); // Query all documents from the collection

            bank_info_list.push({
              collectionName: collectionName, // Include the collection name
              data: bank_info, // Include the fetched data
            });
          }
        }

        // Step 4: Send the result back to the client
        res.send(bank_info_list);
        // } else {
        //   res.status(403).send({
        //     message: "Forbidden: Invalid Key",
        //   });
        // }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all-supplier-info
    app.get("/all-supplier-info", async (req, res) => {
      try {
        // const crose_maching_backend_key = process.env.Front_Backend_Key;
        // const crose_maching_frontend_key =
        //   req.headers.authorization?.split(" ")[1];

        // if (crose_maching_backend_key === crose_maching_frontend_key) {
        // Step 1: Retrieve all the bank names (collections)
        const supplier_name_list = await supplier_name_Collection
          .find({})
          .toArray();

        // Step 2: Iterate over each collectionName and query the respective collection
        const supplier_info_list = [];

        for (const supplier of supplier_name_list) {
          const collectionName = supplier.collectionName; // Access collectionName from each bank document

          if (collectionName) {
            // Step 3: Dynamically query each collection
            const supplier_collection = database.collection(collectionName); // Dynamically access the collection
            const supplier_info = await supplier_collection.find({}).toArray(); // Query all documents from the collection

            supplier_info_list.push({
              collectionName: collectionName, // Include the collection name
              data: supplier_info, // Include the fetched data
            });
          }
        }

        // Step 4: Send the result back to the client
        res.send(supplier_info_list);
        // } else {
        //   res.status(403).send({
        //     message: "Forbidden: Invalid Key",
        //   });
        // }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    app.get("/all-bank-info-for-check", async (req, res) => {
      try {
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all hand-cash transcation
    app.get("/hand-cash-trascation", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const result = await hand_Pocket_Cash_Collection.find({}).toArray();
          res.send(result);
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find all cash box transcation
    app.get("/cash-box-trascation", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const result = await cash_box_Collection.find({}).toArray();
          res.send(result);
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // ------------------    add product    ---------------------
    app.post("/add-product", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const product = {
            product_name: req.body?.product_name,
            only_product_name: req.body?.only_product_name,
            unit: req.body?.unit || "",
            company_name: req.body?.company_name,
            size: req.body?.size,
            purchase_price: req.body?.purchase_price,
            unit_type: req.body?.unit_type,
          };
          const productInfo = await productCollection.insertOne(product);
          res.send(productInfo);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });
    // ------------------ Add pre order Product ---------------------
    app.post("/pre-order", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const order = {
            product_name: req.body.product_name,
            company_name: req.body.company_name,
            size: req.body.size,
            quantity: Number(req.body?.quantity),
            purchase_price: Number(req.body?.purchase_price),
            unit_type: req.body?.unit_type,
            discount: Number(req.body?.discount || 0),
            total: Number(req.body?.total),
          };

          // Fetch all orders
          const query = {};
          const result = await orderCollection.find(query).toArray();

          // Filter out orders that are not hidden
          const pendingOrder = result.filter(
            (item) => item?.is_hidden !== true
          );

          // Extract the product names from the pending orders
          const already_have_Product = pendingOrder.map(
            (item) => item.product_name
          );

          // Check if the product is already in the pending orders
          const isPost = already_have_Product.includes(req.body.product_name);

          if (!isPost) {
            // If the product is not already in the pending orders, insert the new order
            const orderInfo = await orderCollection.insertOne(order);
            res.send(orderInfo);
          } else {
            // If the product is already in the pending orders, send a message or handle accordingly
            const message = `  ${req.body?.product_name} is 
            already have in order or pre order list`;
            res.status(400).send({ acknowledged: false, message });
          }
        } else {
          res.status(403).send("Invalid key.");
        }
      } catch (error) {
        console.error("Error handling pre-order add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------ product  store     add hide this order    ---------------------
    app.post("/store", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          // pick product name and id
          const id = req.body?.id;
          const itemName = req.body?.product_name;

          // Check if the product is already in the store
          const queryItem = { product_name: itemName };

          const findItem = await storeCollection.findOne(queryItem);

          const orderItemQuery = { _id: new ObjectId(id) };

          const orderRecord = await orderCollection.findOne(orderItemQuery, {
            projection: { _id: 0, is_order: 0 },
          });

          if (!orderRecord) {
            return res.status(404).send("Order item not found.");
          }

          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];

          const purchaseArray = await purchase_history_Collection
            .find({})
            .toArray();
          const si = purchaseArray.length + 1; // Correct usage of .length

          // Insert into purchase history
          const purchase_info = {
            product_name: req.body.product_name,
            company_name: req.body.company_name,
            size: req.body.size,
            quantity: req.body.quantity,
            purchase_price: req.body.purchase_price,
            storeDate: dateOnly,
            si: si,
          };
          const purchaseHistoryItem =
            await purchase_history_Collection.insertOne(purchase_info);
          if (!purchaseHistoryItem.acknowledged) {
            // return res
            //   .status(500)
            //   .send("Failed to insert into purchase history.");
          }

          // Delete the order from orderCollection
          const deleteOrder = await orderCollection.deleteOne(orderItemQuery);
          if (deleteOrder.deletedCount === 0) {
            return res.status(404).send("Order not found.");
          }

          // Update or create new store item
          if (findItem) {
            // Update existing store item
            const total_quantity =
              findItem?.store_quantity + Number(req.body?.quantity);
            const updateDoc = {
              $set: {
                store_quantity: Number(total_quantity),
                purchase_price: Number(req.body.purchase_price),
                sell_price: Number(req.body?.sell_price),
              },
            };

            const updateResult = await storeCollection.updateOne(
              queryItem,
              updateDoc
            );
            return res.send(updateResult); // Return after sending response
          } else {
            // Create new store item
            const storeItem = {
              product_name: req.body.product_name,
              company_name: req.body.company_name,
              size: req.body.size,
              store_quantity: Number(req.body.quantity),
              purchase_price: Number(req.body.purchase_price),
              sell_price: Number(req.body?.sell_price),
            };

            const storeInfo = await storeCollection.insertOne(storeItem);
            return res.send(storeInfo); // Return after sending response
          }
        } else {
          return res.status(403).send("Unauthorized request."); // Return after unauthorized
        }
      } catch (error) {
        console.error("Error handling store operation:", error);
        return res.status(500).send("Server Error"); // Return after catching error
      }
    });

    //--------------------- sell info add ------------------------------
    app.post("/sell", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          // Extract the storeItem from the request body
          const storeItem = req.body;

          // Remove crose_maching_key from storeItem
          const { crose_maching_key, products, ...storeData } = storeItem;

          // Filter out products with quantity 0
          const filteredProducts = products.filter(
            (product) =>
              Number(product.sell_quantity) > 0 ||
              Number(product.sell_quantity) < 0
          );

          // Check if all products have a quantity of 0
          if (filteredProducts.length === 0) {
            // res.status(400).send({
            //   message: "You did not sell any items. All quantities are zero.",
            // });
            return;
          }

          const sells_his_length =
            (await sells_history_Collection.find({}).toArray()).length || 0;

          const due_payment_his_length =
            (await due_payment_Collection.find({}).toArray()).length || 0;

          // create new invoice
          const new_invoice = sells_his_length + due_payment_his_length + 1;

          // Create a new object with filtered products
          const final_Sells_Item = {
            ...storeData,
            invoice_no: new_invoice,
            products: filteredProducts,
            subTotal1: req.body?.subTotal1,
          };

          // Insert the modified object into the database
          const storeInfo = await sells_history_Collection.insertOne(
            final_Sells_Item
          );

          // res.send(storeInfo);

          // Fetch all data from storeCollection
          const storeAllData = await storeCollection.find().toArray();

          // Update store quantities based on final_Sells_Item
          for (const soldProduct of final_Sells_Item.products) {
            const matchingStoreProduct = storeAllData.find(
              (storeProduct) =>
                storeProduct.product_name === soldProduct.productName
            );

            if (matchingStoreProduct) {
              const newQuantity =
                matchingStoreProduct.store_quantity -
                Number(soldProduct?.sell_quantity);

              // Ensure newQuantity is not negative
              if (newQuantity < 0) {
                // res.status(400).send({
                //   message: `Insufficient stock for ${soldProduct.productName}. Available: ${matchingStoreProduct.quantity}, Requested: ${soldProduct.quantity}`,
                // });
                return;
              }

              // Update the store product's quantity in the database
              await storeCollection.updateOne(
                { _id: matchingStoreProduct._id },
                { $set: { store_quantity: newQuantity } }
              );
            } else {
              // res.status(404).send({
              //   message: `Product ${soldProduct.productName} not found in store`,
              // });
              return;
            }
          }

          if (req.body?.due) {
            const dueInfo = {
              invoice_no: new_invoice,
              customer_name: req.body?.customer?.name,
              customer_address: req.body?.customer?.address,
              customer_mobile: req.body?.customer?.mobile,
              due: req.body?.due,
              date: req.body?.date,
            };
            const dueInsertResult = await due_Collection.insertOne(dueInfo);
          }

          if (storeInfo) {
            // Return only the insertedId
            return res.send({ insertedId: storeInfo.insertedId });
          }
        } else {
          res.status(401).send({ message: "Unauthorized: Invalid key" });
        }
      } catch (error) {
        console.error("Error handling store item addition:", error);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // insert due payment and update due
    app.post("/due-payment", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const invoice_no = req.body?.invoice_no;
          const query = { invoice_no: invoice_no };

          const due_old_record = await due_Collection.findOne(query); //63

          const sells_his_length =
            (await sells_history_Collection.find({}).toArray()).length || 0;

          const due_payment_his_length =
            (await due_payment_Collection.find({}).toArray()).length || 0;
          // create new invoice
          const new_invoice = sells_his_length + due_payment_his_length + 1; //64

          const modify_query = { _id: new ObjectId(due_old_record?._id) }; //63

          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];

          if (req.body.due > 0) {
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                invoice_no: new_invoice,
                customer_name: req.body?.customer_name,
                customer_address: req.body?.customer_address,
                customer_mobile: req.body?.customer_mobile,
                due: req.body?.due,
                date: dateOnly,
              },
            };

            const check = {
              invoice_no: new_invoice,
              customer_name: req.body?.customer_name,
              customer_address: req.body?.customer_address,
              customer_mobile: req.body?.customer_mobile,
              due: req.body?.due,
              date: dateOnly,
            };

            // Update the document in the collection
            const updateResult = await due_Collection.updateOne(
              modify_query,
              updateDoc,
              options
            );
          } else {
            const result = await due_Collection.deleteOne(modify_query);
          }

          const due_payment_history_info = {
            new_invoice_no: new_invoice,
            old_invoice_no: req.body?.invoice_no,
            customer_name: req.body?.customer_name,
            customer_address: req.body?.customer_address,
            customer_mobile: req.body?.customer_mobile,
            old_due: req.body?.old_due,
            paid: req.body?.paid,
            due: req.body?.due,
            date: dateOnly,
          };
          const due_paymnet_info = await due_payment_Collection.insertOne(
            due_payment_history_info
          );
          res.send({ insertedId: due_paymnet_info?.insertedId });
        }
      } catch (error) {
        console.error("Error handling store item addition:", error);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // ------------------    cost post    ---------------------
    app.post("/add-cost", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const cost = {
            type: req.body?.type,
            amount: req.body?.amount,
            reason: req.body?.reason,
            date: req.body?.date,
          };

          const costResult = await cost_Collection.insertOne(cost);
          res.send(costResult);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    cost post    ---------------------
    app.post("/purchase-history", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          // Extract the storeItem from the request body
          const purchase_item = req.body;

          // Remove crose_maching_key from storeItem
          const { crose_maching_key, ...purchaseData } = purchase_item;

          const purchase_his_length =
            (await purchase_history_Collection.find({}).toArray()).length || 0;

          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];
          const purchase_info = {
            ...purchaseData,
            date: dateOnly,
            sl: purchase_his_length + 1,
          };

          const Result = await purchase_history_Collection.insertOne(
            purchase_info
          );
          res.send(Result);
        }
        if (crose_maching_backend_key === crose_maching_frontend_key) {
          // pick product name and id
          const id = req.body?.id;
          const itemName = req.body?.product_name;

          // Check if the product is already in the store
          const queryItem = { product_name: itemName };

          const findItem = await storeCollection.findOne(queryItem);

          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];

          const purchaseArray = await purchase_history_Collection
            .find({})
            .toArray();
          const si = purchaseArray.length + 1;

          // Update or create new store item
          if (findItem) {
            // Update existing store item
            const total_quantity =
              findItem?.store_quantity + Number(req.body?.quantity);
            const updateDoc = {
              $set: {
                store_quantity: Number(total_quantity),
                purchase_price: Number(req.body?.per_unit_price),
              },
            };

            const updateResult = await storeCollection.updateOne(
              queryItem,
              updateDoc
            );
            // return res.send(updateResult); // Return after sending response
          } else {
            // Create new store item
            const storeItem = {
              product_name: req.body.product_name,
              company_name: req.body.company_name,
              store_quantity: Number(req.body.quantity),
              purchase_price: Number(req.body.per_unit_price),
              unit_type: req.body.unit_type,
            };

            const storeInfo = await storeCollection.insertOne(storeItem);
            // return res.send(storeInfo); // Return after sending response
          }
        } else {
          return res.status(403).send("Unauthorized request."); // Return after unauthorized
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    app.post("/dialy-final-amount", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];
          const final_amount = {
            amount: req.body?.amount,
            date: dateOnly,
          };

          const Result = await final_amount_Collection.insertOne(final_amount);
          res.send(Result);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    damage-product-send-damage-listcost post    ---------------------

    app.post("/damage-product-send-damage-list", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const storeProductId = req.body?.storeProductId;
          const product_name = req.body?.product_name;

          const storeItemQuery = { _id: new ObjectId(storeProductId) };

          // storeCollection থেকে প্রোডাক্ট খোঁজা
          const findItem = await storeCollection.findOne(storeItemQuery);

          if (!findItem) {
            return res.status(404).send("Product not found in store.");
          }

          const new_store_quantity =
            req.body?.store_quantity - req.body?.damage_quantity;

          // damage_Collection এ একই product_name এর প্রোডাক্ট খোঁজা
          const existingDamageItem = await damage_Collection.findOne({
            product_name: product_name,
          });

          if (existingDamageItem) {
            // যদি প্রোডাক্ট থাকে, তাহলে damage_quantity আপডেট করা হবে
            const updatedDamageQuantity =
              existingDamageItem.damage_quantity + req.body?.damage_quantity;

            const updateDamageResult = await damage_Collection.updateOne(
              { product_name: product_name },
              { $set: { damage_quantity: updatedDamageQuantity } }
            );

            res.send(updateDamageResult);
          } else {
            // যদি প্রোডাক্ট না থাকে, নতুন damage object damage_Collection এ যোগ করা হবে
            const damage = {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              damage_quantity: req.body?.damage_quantity,
              unit_type: req.body?.unit_type,
            };

            const damageResult = await damage_Collection.insertOne(damage);

            res.send(damageResult);
          }

          // storeCollection এর store_quantity আপডেট করা
          const updateResult = await storeCollection.updateOne(
            { _id: new ObjectId(storeProductId) },
            { $set: { store_quantity: new_store_quantity } }
          );

          if (updateResult.modifiedCount === 1) {
            // console.log("Store quantity updated successfully.");
          } else {
            res.status(500).send("Failed to update store quantity.");
          }
        } else {
          res.status(403).send("Authorization key mismatch.");
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // \create banck collection

    app.post("/create-collection-for-bank", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const collectionName = `${req.body.name}_${req.body.type}`;
          const { crose_maching_key, ...bankData } = req.body;

          const newCollection = await database
            .collection(collectionName)
            .insertOne(bankData);
          const collectionListUpdate = await bank_name_Collection.insertOne({
            collectionName,
          });

          res.status(201).json({
            message: "Collection and bank info created successfully",
            insertedId: newCollection.insertedId,
          });
        } else {
          res.status(403).json({ message: "Forbidden: Invalid Key" });
        }
      } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ message: "Server Error", error });
      }
    });

    // \create supplier collection
    app.post("/create-collection-for-supplier", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const collectionName = `${req.body.name}_${req.body.type}`;
          const { crose_maching_key, ...supplierData } = req.body;

          const newCollection = await database
            .collection(collectionName)
            .insertOne(supplierData);
          const collectionListUpdate = await supplier_name_Collection.insertOne(
            {
              collectionName,
            }
          );

          res.status(201).json({
            message: "Collection and bank info created successfully",
            insertedId: newCollection.insertedId,
          });
        } else {
          res.status(403).json({ message: "Forbidden: Invalid Key" });
        }
      } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ message: "Server Error", error });
      }
    });

    // basic expense
    app.post("/basic-expense", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const expensInfo = req.body;
          const { crose_maching_key, ...storeData } = expensInfo;

          const expensInfoObj = {
            ...storeData,
          };
          const expenseInfo = await basic_expense_Collection.insertOne(
            expensInfoObj
          );
          res.send(expenseInfo);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    bank-transaction    ---------------------
    app.post("/bank-transaction", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const collectionName = req.body?.name;

          const { crose_maching_key, ...data } = req.body;
          const info = {
            ...data,
          };

          const Result = await database
            .collection(collectionName)
            .insertOne(info);

          res.send(Result);

          if (
            data?.paymentType === "loan" ||
            data?.paymentType === "deposit" ||
            data?.paymentType === "withdraw" ||
            data?.paymentType === "debt_repayment"
          ) {
            const Result = await hand_Pocket_Cash_Collection.insertOne(info);
          }
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });
    // ------------------    supplier-transaction    ---------------------
    app.post("/supplier-transaction", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const collectionName = req.body?.name;

          const { crose_maching_key, ...data } = req.body;
          const info = {
            ...data,
          };

          const Result = await database
            .collection(collectionName)
            .insertOne(info);

          res.send(Result);

          if (data?.paymentType === "payment") {
            const Result = await hand_Pocket_Cash_Collection.insertOne(info);
          }
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    hand_Pocket_Cash_Collection    ---------------------
    app.post("/hand-cash-deposit-withdrow", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const { crose_maching_key, ...handCashData } = req.body;

          const info = {
            ...handCashData,
          };
          const handCashResult = await hand_Pocket_Cash_Collection.insertOne(
            info
          );
          res.send(handCashResult);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    hand-cash-deposit-withdrow-every-sell  ---------------------
    app.post("/hand-cash-deposit-withdrow-every-sell", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const { crose_maching_key, amount, ...handCashData } = req.body;

          const info = {
            amount,
            ...handCashData,
          };

          const currentDate = new Date();
          const dateOnly = currentDate.toISOString().split("T")[0];

          const findQuery = {
            date: dateOnly,
            paymentType: "sell",
          };

          const ifExist = await hand_Pocket_Cash_Collection.findOne(findQuery);

          if (ifExist) {
            const options = { upsert: true };
            const updateFilter = { _id: ifExist._id };
            const updateDoc = {
              $set: {
                amount: amount,
              },
            };
            // Update the document in the collection
            const updateResult = await hand_Pocket_Cash_Collection.updateOne(
              updateFilter,
              updateDoc,
              options
            );
            res.send(updateResult);
          } else {
            // If it doesn't exist, insert the new record
            const handCashResult = await hand_Pocket_Cash_Collection.insertOne(
              info
            );
            res.send(handCashResult);
          }
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------    cash box _Collection    ---------------------
    app.post("/cash-box-deposit-withdrow", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const { crose_maching_key, ...handCashData } = req.body;

          const info = {
            ...handCashData,
          };
          const handCashResult = await cash_box_Collection.insertOne(info);
          res.send(handCashResult);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });

    // update product info
    app.put("/product_info_update/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              purchase_price: req.body?.purchase_price,
            },
          };
          // Update the document in the collection
          const updateResult = await productCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // update pre order
    app.put("/update-pre-order/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              quantity: req.body?.quantity,
              purchase_price: req.body?.purchase_price,
            },
          };
          // Update the document in the collection
          const updateResult = await orderCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // update pre order
    app.put("/update-store-item/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              store_quantity: req.body?.store_quantity,
              purchase_price: req.body?.purchase_price,
              sell_price: req.body?.sell_price,
              location: req.body?.location,
            },
          };
          // Update the document in the collection
          const updateResult = await storeCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });
    // pre order to order state update
    app.put("/pre-order-to-order/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              is_order: true,
            },
          };
          // Update the document in the collection
          const updateResult = await orderCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // damage restore
    app.put("/damage-update/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;

        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;

          // Fetch the store item by product name from storeCollection
          const query = { product_name: req.body.product_name };
          const storeItem = await storeCollection.findOne(query);

          if (!storeItem) {
            // return res.status(404).send("Store item not found");
          }

          // Calculate the updated store quantity
          const updatedStoreQuantity =
            req.body.return_quantity + storeItem.store_quantity;

          // Update storeCollection with the new store quantity
          const storeUpdateFilter = { product_name: req.body.product_name };
          const storeUpdateDoc = {
            $set: {
              store_quantity: updatedStoreQuantity,
            },
          };
          const storeUpdate = await storeCollection.updateOne(
            storeUpdateFilter,
            storeUpdateDoc
          );

          res.send(storeUpdate);

          // Calculate updated damage quantity
          const updateDamageQuantity =
            req.body?.damage_quantity - req.body?.return_quantity;

          // Check if updateDamageQuantity is 0, delete if true, otherwise update
          const filter = { _id: new ObjectId(paramsId) };

          if (updateDamageQuantity === 0) {
            // Delete the damage document if the damage quantity is 0
            const deleteResult = await damage_Collection.deleteOne(filter);
            // res.send({
            //   acknowledged: deleteResult.acknowledged,
            //   message: "Damage item deleted",
            // });
          } else {
            // Update the damage document with the new damage quantity
            const updateDoc = {
              $set: {
                damage_quantity: updateDamageQuantity,
              },
            };
            const updateResult = await damage_Collection.updateOne(
              filter,
              updateDoc
            );
            // res.send(updateResult);
          }
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // delete single product
    app.delete("/delete-product/:id", async (req, res) => {
      try {
        const croseMachingBackendKey = process.env.Front_Backend_Key;
        const croseMachingFrontendKey = req.body.crose_maching_key;

        if (croseMachingBackendKey === croseMachingFrontendKey) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await productCollection.deleteOne(query);
          res.send(result);
        }
      } catch (error) {
        console.error("Error handling delete product:", error);
        res.status(500).send("Server Error");
      }
    });

    // delete single pre order item
    app.delete("/delete-pre-order-item/:id", async (req, res) => {
      try {
        const croseMachingBackendKey = process.env.Front_Backend_Key;
        const croseMachingFrontendKey = req.body.crose_maching_key;

        if (croseMachingBackendKey === croseMachingFrontendKey) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          res.send(result);
        }
      } catch (error) {
        console.error("Error handling delete product:", error);
        res.status(500).send("Server Error");
      }
    });

    // prev-due-delete-after-new-sale because previouse due add new sale
    app.delete("/prev-due-delete-after-new-sale/:id", async (req, res) => {
      try {
        const croseMachingBackendKey = process.env.Front_Backend_Key;
        const croseMachingFrontendKey = req.body.crose_maching_key;

        if (croseMachingBackendKey === croseMachingFrontendKey) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await due_Collection.deleteOne(query);
          res.send(result);
        }
      } catch (error) {
        console.error("Error handling delete product:", error);
        res.status(500).send("Server Error");
      }
    });

    // ........................
    app.get("/Sonaly_bank", async (req, res) => {
      const result = await database
        .collection("Sonaly_bank")
        .find({})
        .toArray();
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My Shop Surver is Run");
});

app.listen(port, () => {
  console.log(`My Shop Stander Surver run on Port:  ${port}`);
});
