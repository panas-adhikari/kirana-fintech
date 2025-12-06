"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types";
import { format } from "date-fns";

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No transactions found. Start by adding one!
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                {format(new Date(transaction.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{transaction.description || "-"}</TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${transaction.transaction_type === "sale"
                                            ? "bg-green-100 text-green-800"
                                            : transaction.transaction_type === "expense"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {transaction.transaction_type}
                                </span>
                            </TableCell>
                            <TableCell className="capitalize">{transaction.payment_method}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.transaction_type === "sale" ? "text-green-600" : "text-red-600"
                                }`}>
                                {transaction.transaction_type === "sale" ? "+" : "-"}
                                NPR {transaction.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
