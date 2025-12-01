import { useState } from 'react';
import { Upload, Download, Trash2, Database } from 'lucide-react';
import { aiSmartImport } from '../lib/aiDataExtractor';
import { exportDatabase, clearDatabase, getDatabaseStats } from '../lib/database';
import { loadSampleData } from '../lib/dataImporter';

/**
 * Admin panel for database management
 */
export default function AdminPanel() {
    const [textInput, setTextInput] = useState('');
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState('');
    const stats = getDatabaseStats();

    const handleAIImport = async () => {
        if (!textInput.trim()) {
            setMessage('Please paste product data');
            return;
        }

        setImporting(true);
        try {
            aiSmartImport(textInput);
            setMessage('✅ Data imported successfully!');
            setTextInput('');
        } catch (err) {
            setMessage('❌ Import failed');
        } finally {
            setImporting(false);
        }
    };

    const handleExport = () => {
        const data = exportDatabase();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pricescout-database.json';
        a.click();
        setMessage('✅ Database exported');
    };

    const handleClear = () => {
        if (window.confirm('Clear entire database?')) {
            clearDatabase();
            setMessage('✅ Database cleared');
        }
    };

    const handleLoadSample = () => {
        loadSampleData();
        setMessage('✅ Sample data loaded');
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-6 h-6" />
                Database Manager
            </h2>

            {/* Database Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Entries</p>
                    <p className="text-2xl font-bold">{stats.totalEntries}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Platforms</p>
                    <p className="text-2xl font-bold">{stats.platforms.length}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">{stats.categories.length}</p>
                </div>
            </div>

            {/* AI Import */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Paste Product Data (AI will extract):</label>
                <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste unstructured product data here (product name, price, platform, etc.)"
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAIImport}
                    disabled={importing}
                    className="mt-3 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    <Upload className="w-4 h-4" />
                    {importing ? 'Processing...' : 'AI Import'}
                </button>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleLoadSample}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    <Database className="w-4 h-4" />
                    Load Sample Data
                </button>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <Download className="w-4 h-4" />
                    Export Database
                </button>
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear Database
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
}
