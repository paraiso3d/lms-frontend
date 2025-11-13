import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Book {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    author: string;
    datePublished: string;
    bookImage: string;
    dateModified: string;
}

const categories = [
    { id: '1', name: 'Fiction' },
    { id: '2', name: 'Non-Fiction' },
    { id: '3', name: 'Science' },
    { id: '4', name: 'Technology' },
    { id: '5', name: 'History' },
    { id: '6', name: 'Biography' },
];

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        description: '',
        author: '',
        datePublished: '',
        bookImage: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingBook) {
            // Update existing book
            setBooks(books.map(book =>
                book.id === editingBook.id
                    ? { ...formData, id: editingBook.id, dateModified: new Date().toISOString() }
                    : book
            ));
        } else {
            // Add new book
            const newBook: Book = {
                id: Date.now().toString(),
                ...formData,
                dateModified: new Date().toISOString(),
            };
            setBooks([...books, newBook]);
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            categoryId: '',
            title: '',
            description: '',
            author: '',
            datePublished: '',
            bookImage: '',
        });
        setEditingBook(null);
        setIsDialogOpen(false);
    };

    const handleEdit = (book: Book) => {
        setEditingBook(book);
        setFormData({
            categoryId: book.categoryId,
            title: book.title,
            description: book.description,
            author: book.author,
            datePublished: book.datePublished,
            bookImage: book.bookImage,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this book?')) {
            setBooks(books.filter(book => book.id !== id));
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCategoryName = (categoryId: string) => {
        return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-gray-900 mb-2">Books Management</h1>
                    <p className="text-gray-600">Manage your library collection</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search books by title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Book ID</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date Published</TableHead>
                            <TableHead>Last Modified</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBooks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                    No books found. Add your first book to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBooks.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
                                    <TableCell>
                                        {book.bookImage ? (
                                            "integrated wait"
                                        ) : (
                                            <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="text-gray-900">{book.title}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{book.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getCategoryName(book.categoryId)}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.datePublished}</TableCell>
                                    <TableCell>{new Date(book.dateModified).toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(book)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(book.id)}
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
                        <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                        <DialogDescription>
                            {editingBook ? 'Update the book information below.' : 'Fill in the details to add a new book to your library.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="datePublished">Date Published</Label>
                                    <Input
                                        id="datePublished"
                                        type="date"
                                        value={formData.datePublished}
                                        onChange={(e) => setFormData({ ...formData, datePublished: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bookImage">Book Image URL</Label>
                                <Input
                                    id="bookImage"
                                    type="url"
                                    value={formData.bookImage}
                                    onChange={(e) => setFormData({ ...formData, bookImage: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingBook ? 'Update Book' : 'Add Book'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
