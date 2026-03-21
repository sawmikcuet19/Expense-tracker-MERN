import ExpenseModel from "../models/ExpenseModel.js";
import * as XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

//add Expense

export async function addExpense(req, res) {
    const userId = req.user._id;
    const {description, amount, category, date} = req.body;

    try {
        if (!description || !category || !date || !amount) {
            return res.status(400).json({
                success: false,
                message: "Fields can't be empty"
            });
        }
        const newExpense = new ExpenseModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newExpense.save();
        res.json({
            success: true,
            message: "Successfully added Expense"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}

//get Expense all
export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {
        const Expense = await ExpenseModel.find({ userId }).sort({ date: -1 });
        res.json({
            Expense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//update an Expense
export async function updateExpense(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount } = req.body;


    try {
        const Expense = await ExpenseModel.findOneAndUpdate({ _id: id, userId }, {description, amount}, {new: true});
        if (!Expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: Expense
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// to delete an Expense
export async function deleteExpense(req, res) {

    try {
        const Expense = await ExpenseModel.findByIdAndDelete({ _id: req.params.id });
        if (!Expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        return res.json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// download the data in excel sheet
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;

    try {
        const Expenses = await ExpenseModel.find({ userId }).sort({date: -1});

        const plainData = Expenses.map((Expense) => ({
            Description: Expense.description,
            Amount: Expense.amount,
            Category: Expense.category,
            Date: new Date(Expense.date).toLocaleDateString(),
        }));



        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "ExpenseModel");

        XLSX.writeFile(workbook, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// To get Expense overview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const {start, end} = getDateRange(range);

        const Expenses = await ExpenseModel.find({
            userId,
            date: {$gte: start, $lte: end},
        }).sort({date: -1});

        const totalExpense = Expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = Expenses.length > 0 ? totalExpense / Expenses.length: 0;
        const numberOfTransactions = Expenses.length;

        const recentTransactions = Expenses.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}