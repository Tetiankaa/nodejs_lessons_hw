import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/user.validator";

const router = Router();
router.get("/", userController.getList);
router.get("/:id", commonMiddleware.isValidId, userController.getById);
router.post(
  "/",
  commonMiddleware.isBodyValid(createUserValidator),
  userController.create,
);
router.delete("/:id", commonMiddleware.isValidId, userController.deleteById);
router.put(
  "/:id",
  commonMiddleware.isBodyValid(updateUserValidator),
  commonMiddleware.isValidId,
  userController.updateById,
);
export const userRouter = router;
