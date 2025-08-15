import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTask = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, description, status } = req.body;

    if (!userId) throw new ApiError(400, "You are not logged in or expire your token");

    if (!title) {
        throw new ApiError(400, "Task title is required");
    }

    const task = await Task.create({
        title,
        description,
        status,
        userId
    });

    return res
        .status(201)
        .json(new ApiResponse(201, task, "Task created successfully"));
});


const getTasks = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '', status } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = { userId: req.user?._id };

    if (status && ['To Do', 'In Progress', 'Done'].includes(status)) {
        query.status = status;
    }

    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalTasks] = await Promise.all([
        Task.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
        Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalTasks / limitNum);

    const responseData = {
        tasks,
        pagination: {
            totalTasks,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
        },
    };

    return res.status(200).json(new ApiResponse(200, responseData, "Tasks retrieved successfully"));
});


const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(taskId);

    if (!task || task.userId.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Task not found or you don't have permission");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: { title, description, status } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});


const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!mongoose.isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const task = await Task.findById(taskId);

    if (!task || task.userId.toString() !== req.user?._id.toString()) {
        throw new ApiError(404, "Task not found or you don't have permission");
    }

    await Task.findByIdAndDelete(taskId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Task deleted successfully"));
});


export { createTask, getTasks, updateTask, deleteTask };