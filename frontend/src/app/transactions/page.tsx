"use client"

import { useAuth } from "@/hooks/useAuth"
import { useTransactions } from "@/hooks/useTransactions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TransactionsPage() {
  const { user } = useAuth()
  const { transactions, isLoading } = useTransactions()
  const router = useRouter()

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All your payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : transactions?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            ) : (
              <div className="space-y-4">
                {transactions?.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {transaction.senderId === user.id ? (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">
                          {transaction.senderId === user.id ? "Sent to" : "Received from"}{" "}
                          {transaction.senderId === user.id ? transaction.recipientEmail : transaction.senderEmail}
                        </p>
                        <p className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          transaction.senderId === user.id ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {transaction.senderId === user.id ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
