import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();
router.get("/", userController.getList);
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isAvatarValid,
  userController.uploadAvatar,
);
router.get("/:id", commonMiddleware.isValidId, userController.getById);
export const userRouter = router;
