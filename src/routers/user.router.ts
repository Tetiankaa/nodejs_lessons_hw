import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { updateUserValidator } from "../validators/user.validator";

const router = Router();
router.get("/", userController.getList);
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.delete(
  "/:id",
  authMiddleware.checkAccessToken,
  commonMiddleware.isValidId,
  userController.deleteById,
);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(updateUserValidator),
  userController.updateMe,
);
router.get("/:id", commonMiddleware.isValidId, userController.getById);
export const userRouter = router;
