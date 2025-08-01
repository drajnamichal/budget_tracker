
import React from 'react';
import { formatCurrency } from '../utils';
import { ChartEmoji, MoneyEmoji, HouseEmoji } from './icons';

interface SummaryProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}

const Summary: React.FC<SummaryProps> = ({ totalBudget, totalSpent, remainingBudget }) => {
  const percentageSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  let progressBarColor = 'bg-emerald-500';
  let statusMessage = 'Všetko v poriadku, rozpočet je pod kontrolou.';
  
  if (percentageSpent > 100) {
    progressBarColor = 'bg-red-600';
    statusMessage = 'Pozor! Prekročili ste rozpočet.';
  } else if (percentageSpent >= 90) {
    progressBarColor = 'bg-red-500';
    statusMessage = 'Varovanie: Rozpočet je takmer vyčerpaný!';
  } else if (percentageSpent >= 75) {
    progressBarColor = 'bg-amber-500';
    statusMessage = 'Blížite sa k limitu rozpočtu.';
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <ChartEmoji className="text-xl" />
          Súhrn rozpočtu
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <HouseEmoji className="text-sm" />
            Celkový rozpočet
          </h3>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{formatCurrency(totalBudget)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <MoneyEmoji className="text-sm" />
            Minuté
          </h3>
          <p className="text-2xl font-semibold text-rose-600 mt-1">{formatCurrency(totalSpent)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <MoneyEmoji className="text-sm" />
            Zostáva
          </h3>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-600">Priebeh</span>
            <span className={`text-sm font-bold ${percentageSpent > 100 ? 'text-red-600' : 'text-slate-600'}`}>
                {percentageSpent.toFixed(2)}%
            </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3.5">
          <div 
            className={`h-3.5 rounded-full transition-all duration-500 ease-out ${progressBarColor}`} 
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-2">{statusMessage}</p>
      </div>
    </div>
  );
};

export default Summary;