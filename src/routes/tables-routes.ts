import { Router } from "express";
import { TablesController } from "../controllers/tables-controller";

const tablesController = new TablesController();

export const tableRoutes = Router();

tableRoutes.get("/", tablesController.index);
tableRoutes.post("/", tablesController.create);
tableRoutes.patch("/:id", tablesController.update);
tableRoutes.delete("/:id", tablesController.remove);