"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function RecentTransactions() {
  const { user } = useAuth();
  const { transactions, isLoading } = useTransactions();

  if (isLoading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  const recentTransactions = transactions?.slice(0, 5) || [];

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent transactions
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            {transaction.senderId === user?.id ? (
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            ) : (
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
            )}
            <div>
              <p className="text-sm font-medium">
                {transaction.senderId === user?.id
                  ? "Sent to"
                  : "Received from"}{" "}
                {transaction.senderId === user?.id
                  ? transaction.recipientEmail
                  : transaction.senderEmail}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(transaction.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                transaction.senderId === user?.id
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {transaction.senderId === user?.id ? "-" : "+"}$
              {transaction.amount.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
