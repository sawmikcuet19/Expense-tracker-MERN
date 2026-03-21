import IncomeModel from "../models/incomeModel.js";
import * as XLSX from "xlsx";
import getDateRange from "../utils/dataFilter.js";

//add income

export async function addIncome(req, res) {
    const userId = req.user._id;
    const {description, amount, category, date} = req.body;

    try {
        if (!description || !category || !date || !amount) {
            return res.status(400).json({
                success: false,
                message: "Fields can't be empty"
            });
        }
        const newIncome = new IncomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });
        await newIncome.save();
        res.json({
            success: true,
            message: "Successfully added income"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
}

//get income all
export async function getAllIncome(req, res) {
    const userId = req.user._id;

    try {
        const income = await IncomeModel.find({ userId }).sort({ date: -1 });
        res.json({
            income
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//update an income
export async function updateIncome(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount } = req.body;


    try {
        const income = await IncomeModel.findOneAndUpdate({ _id: id, userId }, {description, amount}, {new: true});
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.json({
            success: true,
            message: "Income updated successfully",
            data: income
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// to delete an income
export async function deleteIncome(req, res) {

    try {
        const income = await IncomeModel.findByIdAndDelete({ _id: req.params.id });
        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        return res.json({
            success: true,
            message: "Income deleted successfully"
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
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await IncomeModel.find({ userId }).sort({date: -1});

        const plainData = incomes.map((income) => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: new Date(income.date).toLocaleDateString(),
        }));



        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");

        XLSX.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// To get income overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const {start, end} = getDateRange(range);

        const incomes = await IncomeModel.find({
            userId,
            date: {$gte: start, $lte: end},
        }).sort({date: -1});

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length: 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
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