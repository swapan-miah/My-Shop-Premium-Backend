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
    const database = client.db("check-m-e-1");
    // const database = client.db("check-mariam-enter-mirzapur");
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

    // / find income-sector
    app.get("/cash-report", async (req, res) => {
      try {
        // const crose_maching_backend_key = process.env.Front_Backend_Key;
        // const crose_maching_frontend_key =
        //   req.headers.authorization?.split(" ")[1];

        // if (crose_maching_backend_key === crose_maching_frontend_key) {
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
              if (transaction.paymentType === "previous_amount") {
                previous_amount += transaction.amount;
              } else if (transaction.paymentType === "deposit") {
                deposit += transaction.amount;
              } else if (transaction.paymentType === "bonus") {
                bonus += transaction.amount;
              } else if (transaction.paymentType === "withdraw") {
                withdraw += transaction.amount;
              } else if (transaction.paymentType === "bankCost") {
                bankCost += transaction.amount;
              }
            }

            totalAmount =
              previous_amount + deposit + bonus - withdraw - bankCost;
            mainAmount += totalAmount;
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
          bankTotal: mainAmount,
        };

        res.send(sell_Info);
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
      console.log("I am from all supplier");

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
          console.log(collectionName);

          const { crose_maching_key, ...data } = req.body;
          const info = {
            ...data,
          };

          const Result = await database
            .collection(collectionName)
            .insertOne(info);

          console.log(Result);

          res.send(Result);
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
          console.log(collectionName);

          const { crose_maching_key, ...data } = req.body;
          const info = {
            ...data,
          };

          const Result = await database
            .collection(collectionName)
            .insertOne(info);

          console.log(Result);

          res.send(Result);
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
    app.get("/update-price-field", async (req, res) => {
      const updateResult = await storeCollection.updateMany(
        {}, // Empty filter matches all documents
        {
          $rename: { quantity: "store_quantity" },
        }
      );

      res.send("yes");
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
