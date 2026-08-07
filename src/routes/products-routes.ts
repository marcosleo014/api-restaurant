import { Router } from "express";
import { ProductController } from "../controllers/products-controller";

const productsController = new ProductController();

export const productsRoutes = Router();

productsRoutes.get("/", productsController.index);
productsRoutes.post("/", productsController.create);
productsRoutes.patch("/:id", productsController.update);
productsRoutes.delete("/:id", productsController.remove);