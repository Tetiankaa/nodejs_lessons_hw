import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { updateUserValidator } from "../validators/user.validator";

const router = Router();
router.get("/", userController.getList);
router.get("/:id", commonMiddleware.isValidId, userController.getById);
router.delete("/:id", commonMiddleware.isValidId, userController.deleteById);
router.put(
  "/:id",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(updateUserValidator),
  commonMiddleware.isValidId,
  userController.updateById,
);
export const userRouter = router;
