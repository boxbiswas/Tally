import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';
import ItemListHeader from '../components/itemList/ItemListHeader';
import ItemTable from '../components/itemList/ItemTable';


export default function ItemList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const companyId = localStorage.getItem('activeCompanyId');

    /**
     * Fetch items from API with optional search parameter
     */
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

    // Initial load
    useEffect(() => {
        fetchItems();
    }, [companyId]);

    // Debounced search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    /**
     * Handle item deletion with confirmation
     */
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
        <div className="rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
            }}>

            <ItemListHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCreate={() => navigate('/inventory/create')}
            />

            <ItemTable
                items={items}
                loading={loading}
                onEdit={(id) => navigate(`/inventory/edit/${id}`)}
                onDelete={handleDelete}
            />
        </div>
    );
}