const Task = require('../models/task')

const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body

        if (!title || !description || !priority) {
            return res.status(400).json({
                message: "fill all the required fields"
            })
        }
        const task = await Task.create({
            title,
            description,
            priority,
            user: req.user.userId
        })
        res.status(201).json({
            message: "task created successfully",
            task,
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        })
        if (!task) {
            return res.status(404).json({
                message: "task not found"
            })
        }

        res.status(200).json({
            message: "task deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const { status } = req.body
        const allowedStatuses = [
            "pending",
            "in-progress",
            "completed"
        ]
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invlid Task status"
            })
        }
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            { status },
            { new: true, runValidators: true }
        )

        if (!task) {
            return res.status(404).json({
                message: "task not found"
            })
        }

        res.status(200).json({
            message: "status updated successfully",
            task,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const editTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body
        const updates = {}

        if (title !== undefined) {
            updates.title = title
        }

        if (description !== undefined) {
            updates.description = description
        }

        if (priority !== undefined) {
            updates.priority = priority
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "atleast give 1 field to update"
            })
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            updates,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "task not found"
            });
        }

        res.status(200).json({
            message: "task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}


const markAsComplete = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            { status: "completed" },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "task not found"
            });
        }

        res.status(200).json({
            message: "task marked as completed",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId
        const tasks = await Task.find({ user: userId }).sort({
            createdAt: -1
        })
        const totalTasks = tasks.length
        const completedTasks = tasks.filter(
            (task) => task.status === "completed"
        ).length
        const pendingTasks = tasks.filter((task) => task.status === "pending").length
        const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length

        res.status(200).json({
            message: "Dashboard fetched successfully",
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
            },
            tasks,
        })
    } catch (error) {
        res.status(500).json({
            message: 'failed to fetch dashboard',

        })
    }
}


module.exports = { getDashboard ,createTask,deleteTask,updateTask,editTask,markAsComplete}