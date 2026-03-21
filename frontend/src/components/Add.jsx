import React from "react";
import { modalStyles } from "../assets/dummyStyles";
import { X } from "lucide-react";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Salary", "Freelance", "Investment", "Bonus", "Other"],
  color = "teal"
}) => {
  if (!showModal) return null;

  const colorClass = modalStyles.colorClasses[color] || modalStyles.colorClasses.teal;

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modalContainer}>
        <div className={modalStyles.modalHeader}>
          <h2 className={modalStyles.modalTitle}>{title}</h2>
          <button 
            onClick={() => setShowModal(false)}
            className={modalStyles.closeButton}
          >
            <X size={24} />
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTransaction();
          }}
          className={modalStyles.form}
        >
          {type === "both" && (
            <div>
              <label className={modalStyles.label}>Type</label>
              <div className={modalStyles.typeButtonContainer}>
                <button 
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'income', 
                    modalStyles.colorClasses.teal.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({...prev, type: 'income'}))}
                >
                  Income
                </button>
                <button 
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'expense', 
                    modalStyles.colorClasses.orange.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({...prev, type: 'expense'}))}
                >
                  Expense
                </button>
              </div>
            </div>
          )}

          <div>
            <label className={modalStyles.label}>Description</label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({...prev, description: e.target.value}))}
              className={modalStyles.input(colorClass.ring)}
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label className={modalStyles.label}>Amount</label>
            <input
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({...prev, amount: e.target.value}))}
              className={modalStyles.input(colorClass.ring)}
              placeholder="0.00"
              required
              step="0.01"
            />
          </div>

          <div>
            <label className={modalStyles.label}>Category</label>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction(prev => ({...prev, category: e.target.value}))}
              className={modalStyles.input(colorClass.ring)}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={modalStyles.label}>Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({...prev, date: e.target.value}))}
              className={modalStyles.input(colorClass.ring)}
              required
            />
          </div>

          <button 
            type="submit"
            className={modalStyles.submitButton(colorClass.button)}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
