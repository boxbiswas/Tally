import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';

export default function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    const fetchItems = async (search = '') => {
        try {
            setLoading(true);
            const url = search
                ? `/company/${companyId}/item?search=${search}`
                : `/company/${companyId}/item`;
            const response = await api.get(url);
            setItems(response.data.items);
        } catch (error) {
            toast.error('Failed to fetch stock items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [companyId]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/company/${companyId}/item/${id}`);
            toast.success('Item deleted successfully');
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete item');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Package className="h-6 w-6 text-blue-600" />
                    Stock Items Master
                </h2>

                <div className="flex w-full sm:w-auto items-center gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/inventory/create')}
                        className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4" /> Create Item (Alt+S)
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 border-b">
                        <tr>
                            <th className="p-4 font-semibold">SKU</th>
                            <th className="p-4 font-semibold">Item Name</th>
                            <th className="p-4 font-semibold text-right">Purchase Price</th>
                            <th className="p-4 font-semibold text-right">Selling Price</th>
                            <th className="p-4 font-semibold text-right">Current Stock</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No items found.</td></tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-mono text-xs">{item.sku}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.name}</td>
                                    <td className="p-4 text-right">₹{item.purchasePrice.toFixed(2)}</td>
                                    <td className="p-4 text-right">₹{item.sellingPrice.toFixed(2)}</td>
                                    <td className="p-4 text-right">
                                        <span className={`font-semibold ${item.quantity <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {item.quantity} {item.unit}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => navigate(`/inventory/edit/${item.id}`)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Alter Item"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete Item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}