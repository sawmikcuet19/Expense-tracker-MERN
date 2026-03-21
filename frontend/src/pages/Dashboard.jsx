import React, { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  PieChart as PieChartIcon, 
  ArrowDown, 
  ArrowUp, 
  DollarSign, 
  ShoppingCart, 
  ChevronUp, 
  ChevronDown, 
  TrendingUp, 
  Activity 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import axios from "axios";
import GaugeCard from "../components/GaugeCard";
import { dashboardStyles, chartStyles } from "../assets/dummyStyles";
import { 
  INCOME_CATEGORY_ICONS, 
  EXPENSE_CATEGORY_ICONS, 
  COLORS 
} from "../assets/color";
import { 
  getTimeFrameRange, 
  getPreviousTimeFrameRange, 
  calculateData 
} from "../components/Helpers";

const API_BASE = "http://localhost:4000/api";

function toIsoWithClientTime(dateValue) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (typeof dateValue === "string" && dateValue.length === 10) {
    const now = new Date();
    const hhmmss = now.toTimeString().slice(0, 8);
    const combined = new Date(`${dateValue}T${hhmmss}`);
    return combined.toISOString();
  }

  try {
    return new Date(dateValue).toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

const Dashboard = () => {
  const { 
    transactions: outletTransactions = [], 
    timeFrame = "monthly", 
    setTimeFrame = () => {},
    refreshTransactions,
    user
  } = useOutletContext();

  const [gaugeData, setGaugeData] = useState([]);
  const [overviewMeta, setOverviewMeta] = useState({});
  const [showAllIncome, setShowAllIncome] = useState(false);
  const [showAllExpense, setShowAllExpense] = useState(false);

  const timeFrameRange = useMemo(() => getTimeFrameRange(timeFrame), [timeFrame]);
  const prevTimeFrameRange = useMemo(() => getPreviousTimeFrameRange(timeFrame), [timeFrame]);

  const isDateInRange = (date, start, end) => {
    const transactionDate = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    transactionDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return transactionDate >= startDate && transactionDate <= endDate;
  };

  const filteredTransactions = useMemo(
    () => (outletTransactions || []).filter((t) => 
      isDateInRange(t.date, timeFrameRange.start, timeFrameRange.end)
    ),
    [outletTransactions, timeFrameRange]
  );

  const prevFilteredTransactions = useMemo(
    () => (outletTransactions || []).filter((t) => 
      isDateInRange(t.date, prevTimeFrameRange.start, prevTimeFrameRange.end)
    ),
    [outletTransactions, prevTimeFrameRange]
  );

  const currentTimeFrameData = useMemo(() => {
    const data = calculateData(filteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [filteredTransactions]);

  const prevTimeFrameData = useMemo(() => {
    const data = calculateData(prevFilteredTransactions);
    data.savings = data.income - data.expenses;
    return data;
  }, [prevFilteredTransactions]);

  useEffect(() => {
    const fetchOverview = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE}/dashboard/overview`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { range: timeFrame }
        });
        
        if (res.data?.success) {
          const data = res.data.data;
          const recent = (data.recentTransactions || []).map((item) => {
            const typeFromServer = item.type || (item.category ? "expense" : "income");
            return {
              id: item._id || item.id || Date.now() + Math.random(),
              date: item.date || item.createdAt || new Date().toISOString(),
              description: item.description || item.note || item.title || (typeFromServer === "income" ? item.source : item.category),
              amount: Number(item.amount) || 0,
              type: typeFromServer,
              category: item.category || (typeFromServer === "income" ? "Salary" : "Other"),
              raw: item,
            };
          });

          setOverviewMeta({
            monthlyIncome: Number(data.monthlyIncome || 0),
            monthlyExpense: Number(data.monthlyExpense || 0),
            savings: Number(data.savings || data.monthlyIncome - data.monthlyExpense || 0),
            spendByCategory: data.spendByCategory || {},
            expenseDistribution: data.expenseDistribution || [],
            recentTransactions: recent,
          });
        }
      } catch (err) {
        console.error("Dashboard overview fetch error:", err);
      }
    };
    fetchOverview();
  }, [timeFrame, outletTransactions]);

  useEffect(() => {
    const maxValues = {
      income: Math.max(currentTimeFrameData.income, 5000),
      expenses: Math.max(currentTimeFrameData.expenses, 3000),
      savings: Math.max(Math.abs(currentTimeFrameData.savings), 2000),
    };

    setGaugeData([
      { name: "Income", value: currentTimeFrameData.income, max: maxValues.income },
      { name: "Spent", value: currentTimeFrameData.expenses, max: maxValues.expenses },
      { name: "Savings", value: currentTimeFrameData.savings, max: maxValues.savings },
    ]);
  }, [currentTimeFrameData, timeFrame]);

  const displayExpenses = timeFrame === "monthly" && overviewMeta.monthlyExpense ? overviewMeta.monthlyExpense : currentTimeFrameData.expenses;

  const financialOverviewData = useMemo(() => {
    if (timeFrame === "monthly" && overviewMeta.expenseDistribution?.length > 0) {
      return overviewMeta.expenseDistribution.map(d => ({ name: d.category, value: Math.round(Number(d.amount) || 0) }));
    }
    const categories = {};
    filteredTransactions.forEach(t => {
      if (t.type === "expense") categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.keys(categories).map(c => ({ name: c, value: Math.round(categories[c]) }));
  }, [filteredTransactions, overviewMeta, timeFrame]);

  const incomeTransactions = useMemo(() => filteredTransactions.filter(t => t.type === "income").sort((a,b) => new Date(b.date) - new Date(a.date)), [filteredTransactions]);
  const expenseTransactions = useMemo(() => filteredTransactions.filter(t => t.type === "expense").sort((a,b) => new Date(b.date) - new Date(a.date)), [filteredTransactions]);

  const displayedIncome = showAllIncome ? incomeTransactions : incomeTransactions.slice(0, 3);
  const displayedExpense = showAllExpense ? expenseTransactions : expenseTransactions.slice(0, 3);

  return (
    <div className={dashboardStyles.container}>
      <header className={dashboardStyles.headerContainer}>
        <div className={dashboardStyles.headerContent}>
          <div>
            <h1 className={dashboardStyles.headerTitle}>Welcome back, {user?.name || "User"}!</h1>
            <p className={dashboardStyles.headerSubtitle}>Here's what's happening with your money today.</p>
          </div>
        </div>
      </header>

      <div className={dashboardStyles.gaugeGrid}>
        {gaugeData.map((data, index) => (
          <GaugeCard key={index} gauge={data} timeFrameLabel={timeFrame} />
        ))}
      </div>

      <div className={dashboardStyles.pieChartContainer}>
        <div className={dashboardStyles.pieChartHeader}>
          <h3 className={dashboardStyles.pieChartTitle}>
            <PieChartIcon className="w-6 h-6 text-teal-500" />
            Expense Distribution
            <span className={dashboardStyles.listSubtitle}> ({timeFrameRange.label})</span>
          </h3>
        </div>
        <div className={dashboardStyles.pieChartHeight}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400}>
            <PieChart className={chartStyles.pieChart}>
              <Pie
                data={financialOverviewData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
                labelLine={false}
              >
                {financialOverviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${Math.round(value).toLocaleString()}`, "Amount"]}
                contentStyle={dashboardStyles.tooltipContent}
                itemStyle={dashboardStyles.tooltipItem}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={10} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={dashboardStyles.listsGrid}>
        <div className={dashboardStyles.listContainer}>
          <div className={dashboardStyles.listHeader}>
            <h3 className={dashboardStyles.listTitle}><TrendingUp className="w-6 h-6 text-green-500" /> Recent Income</h3>
          </div>
          <div className={dashboardStyles.transactionList}>
            {displayedIncome.map(t => (
              <div key={t.id} className={dashboardStyles.incomeTransactionItem}>
                <div className={dashboardStyles.transactionContent}>
                  <p className={dashboardStyles.transactionDescription}>{t.description}</p>
                </div>
                <div className={dashboardStyles.transactionAmount}>
                  <p className={dashboardStyles.incomeAmount}>+${t.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={dashboardStyles.listContainer}>
          <div className={dashboardStyles.listHeader}>
            <h3 className={dashboardStyles.listTitle}><ShoppingCart className="w-6 h-6 text-orange-500" /> Recent Expenses</h3>
          </div>
          <div className={dashboardStyles.transactionList}>
            {displayedExpense.map(t => (
              <div key={t.id} className={dashboardStyles.expenseTransactionItem}>
                <div className={dashboardStyles.transactionContent}>
                  <p className={dashboardStyles.transactionDescription}>{t.description}</p>
                </div>
                <div className={dashboardStyles.transactionAmount}>
                  <p className={dashboardStyles.expenseAmount}>-${t.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
