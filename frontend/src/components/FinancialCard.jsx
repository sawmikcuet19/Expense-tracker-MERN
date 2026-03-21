import React from "react";

const FinancialCard = ({ 
  title, 
  label, // Added support for label
  amount, 
  value, // Added support for value
  icon, 
  iconBg, 
  iconColor, 
  borderColor,
  additionalContent,
  hideSymbol = false // New prop
}) => {
  const displayTitle = title || label || "Metric";
  const displayAmount = Number(amount != null ? amount : value) || 0;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${borderColor} flex items-center gap-4`}>
      <div className={`p-3 rounded-xl ${iconBg || ''} ${iconColor || ''}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{displayTitle}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {!hideSymbol && "$"}
          {displayAmount.toLocaleString("en-US")}
        </h3>
        {additionalContent}
      </div>
    </div>
  );
};

export default FinancialCard;
