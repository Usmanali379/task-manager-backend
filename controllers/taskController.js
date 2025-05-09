const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getAllTasks = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            startDate,
            endDate
        } = req.query;

        // Build query
        const query = { user: req.user._id };

        // Add search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Add status filter
        if (status) {
            query.status = status;
        }

        // Add priority filter
        if (priority) {
            query.priority = priority;
        }

        // Add date range filter
        if (startDate || endDate) {
            query.dueDate = {};
            if (startDate) {
                query.dueDate.$gte = new Date(startDate);
            }
            if (endDate) {
                query.dueDate.$lte = new Date(endDate);
            }
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Execute query with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [tasks, total] = await Promise.all([
            Task.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit),
            Task.countDocuments(query)
        ]);

        res.json({
            tasks,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            user: req.user._id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (task) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.priority = req.body.priority || task.priority;
            task.status = req.body.status || task.status;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (task) {
            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get task analytics
// @route   GET /api/tasks/analytics
// @access  Private
const getTaskAnalytics = async (req, res) => {
    try {
        // Get date ranges for analytics
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        // Priority distribution
        const priorityDistribution = await Task.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Completion rate over time (last 7 days)
        const completionTrend = await Task.aggregate([
            {
                $match: {
                    user: req.user._id,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$_id.status", "Completed"] }, "$count", 0]
                        }
                    },
                    total: { $sum: "$count" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Upcoming deadlines
        const upcomingDeadlines = await Task.find({
            user: req.user._id,
            dueDate: { $gte: today, $lte: sevenDaysFromNow },
            status: "Pending"
        }).sort({ dueDate: 1 }).limit(5);
        console.log("upcomingDeadlines", upcomingDeadlines);
        // Task status distribution
        const statusDistribution = await Task.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Priority distribution by status
        const priorityByStatus = await Task.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: {
                        priority: "$priority",
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Overdue tasks count
        const overdueTasks = await Task.countDocuments({
            user: req.user._id,
            dueDate: { $lt: today },
            status: "Pending"
        });

        // Format the response
        const formattedPriorityDistribution = priorityDistribution.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { High: 0, Medium: 0, Low: 0 });

        const formattedStatusDistribution = statusDistribution.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { Pending: 0, Completed: 0 });

        const formattedPriorityByStatus = priorityByStatus.reduce((acc, curr) => {
            if (!acc[curr._id.status]) {
                acc[curr._id.status] = { High: 0, Medium: 0, Low: 0 };
            }
            acc[curr._id.status][curr._id.priority] = curr.count;
            return acc;
        }, {});

        res.json({
            priorityDistribution: formattedPriorityDistribution,
            statusDistribution: formattedStatusDistribution,
            completionTrend,
            upcomingDeadlines,
            priorityByStatus: formattedPriorityByStatus,
            overdueTasks
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskAnalytics,
}; 