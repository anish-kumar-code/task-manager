import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../controllers/task.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(authentication, createTask);
router.route("/").get(authentication, getTasks);
router.route("/:taskId").patch(authentication, updateTask);
router.route("/:taskId").delete(authentication, deleteTask);

export default router;