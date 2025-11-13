import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Transaction {
    id: string;
    bookTitle: string;
    borrowerName: string;
    borrowerEmail: string;
    borrowDate: string;
    dueDate: string;
    returnDate: string;
    status: 'borrowed' | 'returned' | 'overdue';
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        bookTitle: '',
        borrowerName: '',
        borrowerEmail: '',
        borrowDate: '',
        dueDate: '',
        returnDate: '',
        status: 'borrowed' as 'borrowed' | 'returned' | 'overdue',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTransaction) {
            // Update existing transaction
            setTransactions(transactions.map(transaction =>
                transaction.id === editingTransaction.id
                    ? { ...formData, id: editingTransaction.id }
                    : transaction
            ));
        } else {
            // Add new transaction
            const newTransaction: Transaction = {
                id: Date.now().toString(),
                ...formData,
            };
            setTransactions([...transactions, newTransaction]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            bookTitle: '',
            borrowerName: '',
            borrowerEmail: '',
            borrowDate: '',
            dueDate: '',
            returnDate: '',
            status: 'borrowed',
        });
        setEditingTransaction(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            bookTitle: transaction.bookTitle,
            borrowerName: transaction.borrowerName,
            borrowerEmail: transaction.borrowerEmail,
            borrowDate: transaction.borrowDate,
            dueDate: transaction.dueDate,
            returnDate: transaction.returnDate,
            status: transaction.status,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            setTransactions(transactions.filter(transaction => transaction.id !== id));
        }
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.borrowerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
            borrowed: { variant: 'default', label: 'Borrowed' },
            returned: { variant: 'secondary', label: 'Returned' },
            overdue: { variant: 'destructive', label: 'Overdue' },
        };

        const config = variants[status] || { variant: 'outline' as const, label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-gray-900 mb-2">Transactions</h1>
                    <p className="text-gray-600">Track book borrowing and returns</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Transaction
                </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search by book, borrower name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Book Title</TableHead>
                            <TableHead>Borrower Name</TableHead>
                            <TableHead>Borrower Email</TableHead>
                            <TableHead>Borrow Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Return Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No transactions found. Create your first transaction to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{transaction.bookTitle}</TableCell>
                                    <TableCell>{transaction.borrowerName}</TableCell>
                                    <TableCell>{transaction.borrowerEmail}</TableCell>
                                    <TableCell>{transaction.borrowDate}</TableCell>
                                    <TableCell>{transaction.dueDate}</TableCell>
                                    <TableCell>{transaction.returnDate || '-'}</TableCell>
                                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(transaction.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
                        <DialogDescription>
                            {editingTransaction ? 'Update the transaction details below.' : 'Fill in the details to record a new book transaction.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bookTitle">Book Title</Label>
                                <Input
                                    id="bookTitle"
                                    value={formData.bookTitle}
                                    onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="borrowerName">Borrower Name</Label>
                                    <Input
                                        id="borrowerName"
                                        value={formData.borrowerName}
                                        onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="borrowerEmail">Borrower Email</Label>
                                    <Input
                                        id="borrowerEmail"
                                        type="email"
                                        value={formData.borrowerEmail}
                                        onChange={(e) => setFormData({ ...formData, borrowerEmail: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="borrowDate">Borrow Date</Label>
                                    <Input
                                        id="borrowDate"
                                        type="date"
                                        value={formData.borrowDate}
                                        onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="returnDate">Return Date</Label>
                                    <Input
                                        id="returnDate"
                                        type="date"
                                        value={formData.returnDate}
                                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: 'borrowed' | 'returned' | 'overdue') => setFormData({ ...formData, status: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="borrowed">Borrowed</SelectItem>
                                        <SelectItem value="returned">Returned</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingTransaction ? 'Update Transaction' : 'Create Transaction'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
