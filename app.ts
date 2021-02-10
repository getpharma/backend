import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as _ from "lodash";
import { dbService } from "./services/db.service";
import { ENV_APP_PORT_REST } from "./util/secrets.util";
import { userService } from "./services/entities/user.service";
import { mattermostService } from "./services/mattermost.service";
import { UserController } from "./controllers/user.controller";
import { userMiddleware } from "./middlewares/user.middleware";
import { errorHandler } from "./handlers/error-handler";
import { upload } from "./services/factories/multer.service";
import { ProductController } from "./controllers/product.controller";
import { CartController } from "./controllers/cart.controller";
import { OrderController } from "./controllers/order.controller";
import { employeeMiddleware } from "./middlewares/employee.middleware";
import { EmployeeController } from "./controllers/employee.controller";
import { adminMiddleware } from "./middlewares/admin.middleware";
import { cronService } from "./services/factories/cron.service";
import { wholesalerService } from "./services/entities/wholesaler.service";
import { wholesalerMiddleware } from "./middlewares/wholesaler.middleware";
import { WholesalerController } from "./controllers/wholesaler.controller";
import { WholesalerProductController } from "./controllers/wholesaler-product.controller";
import { PickupProductController } from "./controllers/pickup-product.controller";
import { PickupController } from "./controllers/pickup.controller";
import { packagerMiddleware } from "./middlewares/packager.middleware";
import { Order } from "./models/order.model";
import { StockController } from "./controllers/stock.controller";


// Create Express server
const app = express();

// Entities
userService;

// Factories
// cryptService;
// jwtService;
// s3Service;
// validatorService;
// snsService;

// Others
dbService;
mattermostService;
cronService;

// Express configuration
app.set("port", process.env.PORT || ENV_APP_PORT_REST);
// app.use(snsHeaderMiddleware);
app.use(bodyParser.json({limit: "100mb"}));
app.use(bodyParser.urlencoded({extended: true}));

// CORS Setup
const allowedOrigins = [
  "D:/init20",
  "http://localhost",
  "http://localhost:*",
  "http://localhost:3000",
  "http://localhost:4200",
  "http://localhost:5000",
  "http://localhost:59393",
  "http://localhost:61969",
  "http://getpharma-frontend.s3.ap-south-1.amazonaws.com",
  "http://getpharma.in"
];

app.use(cors({
  origin : (origin, callback) => {
    if (!origin || _.includes(allowedOrigins, origin)) {
      callback(undefined, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE"
  ]
}));
app.options("*");

// Static Public Content
app.use("/public", express.static("./public", {maxAge: 31557600000}));

// Global Middleware(s)

/**
 * Primary app routes.
 */


// AUTH
app.post("/login", errorHandler(UserController.login));
app.post("/login-employee", errorHandler(EmployeeController.login));
app.post("/login-wholesaler", errorHandler(WholesalerController.loginWholesaler));

//
app.get("/count-products", errorHandler(ProductController.countProducts));


// ADMIN
app.get("/categories-for-admin", [adminMiddleware], errorHandler(ProductController.categoriesForAdmin));
app.get("/products-for-admin", [adminMiddleware], errorHandler(ProductController.productsForAdmin));

app.get("/users", [adminMiddleware], errorHandler(UserController.allUsers));
app.get("/deleted-users", [adminMiddleware], errorHandler(UserController.showDeletedAt));
app.put("/restore-retailer/:userId([0-9]+)", [adminMiddleware], errorHandler(UserController.restoreRetailer));
app.post("/create-user", [adminMiddleware], errorHandler(UserController.create));
app.put("/user/:userId([0-9]+)", [adminMiddleware], errorHandler(UserController.update));
app.delete("/user/:userId([0-9]+)", [adminMiddleware], errorHandler(UserController.delete));

app.get("/employees", [adminMiddleware], errorHandler(EmployeeController.showEmployees));
app.get("/packagers", [adminMiddleware], errorHandler(EmployeeController.showPackagers));
app.get("/delivery-man", [adminMiddleware], errorHandler(EmployeeController.showDeliveryMan));
app.post("/employees", [adminMiddleware], errorHandler(EmployeeController.createEmployee));
app.put("/employee/:employeeId([0-9]+)", [adminMiddleware], errorHandler(EmployeeController.updateEmployee));
app.delete("/employee/:employeeId([0-9]+)", [adminMiddleware], errorHandler(EmployeeController.deleteById));

app.get("/wholesalers", [adminMiddleware], errorHandler(WholesalerController.wholesalersForAdmin));
app.get("/deleted-wholesalers", [adminMiddleware], errorHandler(WholesalerController.showDeletedAt));
app.put("/restore-wholesaler/:userId([0-9]+)", [adminMiddleware], errorHandler(WholesalerController.restoreWholesaler));
app.post("/wholesalers", [adminMiddleware], errorHandler(WholesalerController.create));
app.put("/wholesaler/:wholesalerId([0-9]+)", [adminMiddleware], errorHandler(WholesalerController.updateWholesaler));
app.delete("/wholesaler/:wholesalerId([0-9]+)", [adminMiddleware], errorHandler(WholesalerController.delete));

app.get("/retailer-orders", [adminMiddleware], errorHandler(OrderController.orderByStatus));
app.get("/retailer-history", [adminMiddleware], errorHandler(OrderController.historyByStatus));
app.get("/product-count", [adminMiddleware], errorHandler(OrderController.productCount));
app.put("/assign-employees/:orderId([0-9]+)", [adminMiddleware], errorHandler(EmployeeController.assignEmployeeToOrder));
app.put("/cancel-order/:orderId([0-9]+)", [adminMiddleware], errorHandler(OrderController.cancelOrder));


app.get("/wholesalers-by-product/:productId([0-9]+)", [adminMiddleware], errorHandler(WholesalerProductController.showByProduct));
app.get("/wp-by-wholesalers/:productId([0-9]+)", [adminMiddleware], errorHandler(WholesalerProductController.showByWholesaler));
app.get("/assigned-wholesaler-products", [adminMiddleware], errorHandler(WholesalerProductController.showAssignedWP));
app.post("/wholesaler-product", [adminMiddleware], errorHandler(WholesalerProductController.createWP));
app.put("/wholesaler-product/:wpId([0-9]+)", [adminMiddleware], errorHandler(WholesalerProductController.updateWP));
app.delete("/wholesaler-product/:wpId([0-9]+)", [adminMiddleware], errorHandler(WholesalerProductController.deleteWP));

app.get("/assigned-pickup-products-admin", [employeeMiddleware], errorHandler(PickupProductController.showPickupProducts));
app.get("/index-pickup-products", [adminMiddleware], errorHandler(PickupProductController.indexPickupProducts));
app.get("/unassigned-pickups", [adminMiddleware], errorHandler(PickupProductController.showUnassignedProducts));
app.post("/assign-all-pickups", [adminMiddleware], errorHandler(PickupProductController.assignAllPickupsToWholesalers));
app.post("/assign-pickups", [adminMiddleware], errorHandler(PickupProductController.assignPickupToWholesalerByDay));
app.put("/assign-pickup/:pickupProductId([0-9]+)", [adminMiddleware], errorHandler(PickupProductController.assignPickupToWholesaler));

app.get("/pickups", [adminMiddleware], errorHandler(PickupController.indexPickups));
app.put("/act-on-revised-rate/:pickupProductId([0-9]+)", [adminMiddleware], errorHandler(PickupProductController.actOnNewRate));

app.put("/assign-packager/:pickupId([0-9]+)", [adminMiddleware], errorHandler(EmployeeController.assignPackager));


// USER
app.get("/me", [userMiddleware], errorHandler(UserController.me));
app.put("/me", [userMiddleware], errorHandler(UserController.updateMe));
app.delete("/me", [userMiddleware], errorHandler(UserController.deleteMe));


// CATEGORY
app.get("/productCategories", errorHandler(ProductController.listProductCategories));
app.post("/productCategories", [adminMiddleware, upload.single("image")], errorHandler(ProductController.createProductCategory));
app.put("/productCategory/:categoryId([0-9]+)", [employeeMiddleware, upload.single("image")], errorHandler(ProductController.updateProductCategory));
app.delete("/productCategory/:categoryId([0-9]+)", [employeeMiddleware], errorHandler(ProductController.deleteProductCategory));


// PRODUCT
app.get("/products/:categoryId([0-9]+)", [userMiddleware], errorHandler(ProductController.listProducts));
app.get("/products", [userMiddleware], errorHandler(ProductController.allProducts));
app.get("/all-products", [wholesalerMiddleware], errorHandler(ProductController.allProducts));
app.get("/trending-products", [userMiddleware], errorHandler(ProductController.trendingProducts));
app.post("/products", [employeeMiddleware, upload.single("image")], errorHandler(ProductController.createProduct));
app.post("/bulk-products", [employeeMiddleware], errorHandler(ProductController.bulkCreateProduct));
app.put("/product/:productId([0-9]+)", [employeeMiddleware, upload.single("image")], errorHandler(ProductController.updateProduct));
app.delete("/product/:productId([0-9]+)", [employeeMiddleware], errorHandler(ProductController.deleteProduct));


// FAVORITES
app.put("/add-to-favorites/:productId([0-9]+)", [userMiddleware], errorHandler(ProductController.addToFavorites));
app.put("/remove-favorites/:productId([0-9]+)", [userMiddleware], errorHandler(ProductController.removeFromFavorites));
app.put("/empty-favorites", [userMiddleware], errorHandler(ProductController.emptyFavorites));
app.get("/favorites", [userMiddleware], errorHandler(ProductController.showFavorites));


// CART
app.get("/my-cart", [userMiddleware], errorHandler(CartController.listCart));
app.put("/add-to-cart", [userMiddleware], errorHandler(CartController.addToCart));
app.delete("/empty-cart", [userMiddleware], errorHandler(CartController.emptyCart));
// app.get("/product-counter/:productId([0-9]+)", [userMiddleware], errorHandler(CartController.countProductOfCart));


// ORDER
app.get("/orders", [userMiddleware], errorHandler(OrderController.showOrders));
app.post("/orders", [userMiddleware], errorHandler(OrderController.addOrder));
app.put("/orders/:orderId([0-9]+)", [userMiddleware], errorHandler(OrderController.updateOrder));
app.get("/history", [userMiddleware], errorHandler(OrderController.showHistory));


// // IMAGES
// app.get("/images", [employeeMiddleware], errorHandler(AttachmentController.listImages));
// app.get("/cover-images", [userMiddleware], errorHandler(AttachmentController.coverImages));
// app.post("/images", [employeeMiddleware, upload.single("image")], errorHandler(AttachmentController.addImage));
// app.put("/image/:imageId([0-9]+)", [employeeMiddleware, upload.single("image")], errorHandler(AttachmentController.updateImage));
// app.delete("/image/:imageId([0-9]+)", [employeeMiddleware], errorHandler(AttachmentController.deleteImage));


// EMPLOYEES
app.get("/my-employee-profile", [employeeMiddleware], errorHandler(EmployeeController.myEmployeeProfile));
app.put("/my-employee-profile", [employeeMiddleware], errorHandler(EmployeeController.updateMe));
app.delete("/my-employee-profile", [employeeMiddleware], errorHandler(EmployeeController.deleteMe));
app.put("/deliver-order", [employeeMiddleware], errorHandler(EmployeeController.deliverOrder));
app.get("/delivery-order", [employeeMiddleware], errorHandler(EmployeeController.deliveryOrders));
app.get("/past-orders", [employeeMiddleware], errorHandler(EmployeeController.showHistory));
app.get("/delivery-man-invoice", [employeeMiddleware], errorHandler(EmployeeController.deliveryManInvoice));

// PACKAGER
app.put("/receive-pickup/:pickupId([0-9]+)", [packagerMiddleware], errorHandler(EmployeeController.receivePickup));
app.get("/packager-invoice", [packagerMiddleware], errorHandler(PickupController.packagerInvoice));
app.put("/pack-order/:orderId([0-9]+)", [packagerMiddleware], errorHandler(OrderController.packOrder));
app.put("/pending-products/:orderId([0-9]+)", [packagerMiddleware], errorHandler(OrderController.addPendingProducts));

// WHOLESALER
app.get("/my-wholesaler-profile", [wholesalerMiddleware], errorHandler(WholesalerController.me));
app.put("/my-wholesaler-profile", [wholesalerMiddleware], errorHandler(WholesalerController.updateMe));
app.delete("/my-wholesaler-profile", [wholesalerMiddleware], errorHandler(WholesalerController.deleteMe));


// WHOLESALER-PRODUCT
app.get("/products-by-wholesaler/:wholesalerId([0-9]+)", [wholesalerMiddleware], errorHandler(WholesalerProductController.showByWholesaler));
app.get("/wholesaler-product/:wpId([0-9]+)", [wholesalerMiddleware], errorHandler(WholesalerProductController.show));
app.post("/wholesalers-products", [wholesalerMiddleware], errorHandler(WholesalerProductController.createWP));
app.post("/add-product", [wholesalerMiddleware, upload.single("image")], errorHandler(WholesalerProductController.createProductByWholesaler));
app.put("/wholesalers-products/:wpId([0-9]+)", [wholesalerMiddleware], errorHandler(WholesalerProductController.updateWP));
app.delete("/wholesalers-products/:wpId([0-9]+)", [wholesalerMiddleware], errorHandler(WholesalerProductController.deleteWP));
app.get("/wholesaler-trends/:categoryId([0-9]+)", [wholesalerMiddleware], errorHandler(ProductController.wholesalerTrends));

// PICKUP PRODUCT
app.get("/pickup-products", [wholesalerMiddleware], errorHandler(PickupProductController.showWholesalerPickupProducts));
app.get("/employee-pickups", [employeeMiddleware], errorHandler(PickupController.showEmployeePickups));
app.put("/pickup-products/:pickupId([0-9]+)", [wholesalerMiddleware], errorHandler(PickupProductController.updatePickupProduct));


// INVOICE
app.get("/invoice", [wholesalerMiddleware], errorHandler(PickupController.showWholesalerPickups));
app.get("/accepted-pickups", [wholesalerMiddleware], errorHandler(PickupController.showAcceptedWholesalerPickups));


// STOCK
app.get("/stocks", [employeeMiddleware], errorHandler(StockController.indexStock));
app.post("/stocks", [adminMiddleware], errorHandler(StockController.createStock));
app.put("/stock/:stockId([0-9]+)", [employeeMiddleware], errorHandler(StockController.updateStock));
app.delete("/stock/:stockId([0-9]+)", [employeeMiddleware], errorHandler(StockController.deleteStock));
app.get("/inventory", [employeeMiddleware], errorHandler(StockController.viewInventory));
app.put("/reduce-inventory", [employeeMiddleware], errorHandler(StockController.reduceFromInventory));


app.get("*", (req, res) => {
  res.send({data: "Works"});
});


export default app;
