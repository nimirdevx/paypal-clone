"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { ConfirmationModal } from "@/components/confirmation-modal";

const sendMoneySchema = z.object({
  recipientEmail: z.string().email("Invalid email address"),
  amount: z.number().min(0.01, "Amount must be at least $0.01"),
});

type SendMoneyForm = z.infer<typeof sendMoneySchema>;

export default function SendMoneyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<SendMoneyForm | null>(null);
  const [recipientUser, setRecipientUser] = useState<any>(null);
  const { user } = useAuth();
  const { wallet, refetch } = useWallet();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SendMoneyForm>({
    resolver: zodResolver(sendMoneySchema),
  });

  const onSubmit = async (data: SendMoneyForm) => {
    if (!wallet || data.amount > wallet.balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, find the recipient user by email
      const recipient = await api.getUserByEmail(data.recipientEmail);
      setRecipientUser(recipient);
      setFormData(data);
      setShowConfirmation(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Recipient not found",
        variant: "destructive",
      });
    }
  };

  const handleConfirm = async () => {
    if (!formData || !user || !recipientUser) return;

    setIsLoading(true);
    try {
      await api.sendMoney(user.id, recipientUser.id, formData.amount);
      toast({
        title: "Success",
        description: "Money sent successfully",
      });
      reset();
      refetch();
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send money",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
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
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" />
                Send Money
              </CardTitle>
              <CardDescription>
                Available Balance: ${wallet?.balance?.toFixed(2) || "0.00"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient's email"
                    {...register("recipientEmail")}
                  />
                  {errors.recipientEmail && (
                    <p className="text-sm text-red-600">
                      {errors.recipientEmail.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount", { valueAsNumber: true })}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        isLoading={isLoading}
        title="Confirm Transaction"
        description={`Send $${formData?.amount?.toFixed(2)} to ${
          formData?.recipientEmail
        }?`}
      />
    </div>
  );
}
