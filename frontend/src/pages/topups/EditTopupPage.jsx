import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { topupService } from '../../services/topupService';

const EditTopupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    platform: 'META',
    date: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    notes: '',
    receiptUrl: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');

  useEffect(() => {
    fetchTopup();
  }, [id]);

  const fetchTopup = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await topupService.getTopupById(id);
      const topup = response.data;
      
      const dateStr = new Date(topup.date).toISOString().split('T')[0];
      
      setFormData({
        platform: topup.platform || 'META',
        date: dateStr,
        amount: topup.amount?.toString() || '',
        paymentMethod: topup.paymentMethod || 'BANK_TRANSFER',
        notes: topup.notes || '',
        receiptUrl: topup.receiptUrl || '',
      });
    } catch (err) {
      console.error('Error fetching topup:', err);
      setError(err.response?.data?.message || 'Failed to load topup');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setReceiptFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadReceipt = async () => {
    if (!receiptFile) return;

    try {
      setUploadingReceipt(true);
      setError('');
      const response = await topupService.uploadReceipt(receiptFile);
      setFormData(prev => ({
        ...prev,
        receiptUrl: response.data.receiptUrl,
      }));
      setReceiptFile(null);
      setReceiptPreview('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview('');
    setFormData(prev => ({
      ...prev,
      receiptUrl: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
      };

      await topupService.updateTopup(id, submitData);
      navigate(`/topups/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update topup');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/topups/${id}`)}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Topup Detail
          </button>
          <h1 className="text-3xl font-bold mb-2">Edit Topup</h1>
          <p className="text-dark-text-muted">Update data top-up akun iklan</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="platform" className="block text-sm font-medium mb-2">
              Platform <span className="text-red-400">*</span>
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="META">Meta (Facebook/Instagram)</option>
              <option value="TIKTOK">TikTok</option>
              <option value="GOOGLE">Google Ads</option>
              <option value="X">X (Twitter)</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount <span className="text-red-400">*</span>
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="input w-full"
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="E_WALLET">E-Wallet</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Receipt Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Receipt (Optional)
            </label>
            
            {formData.receiptUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <a
                    href={formData.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover text-sm"
                  >
                    View Current Receipt
                  </a>
                  <button
                    type="button"
                    onClick={handleRemoveReceipt}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <img
                  src={formData.receiptUrl}
                  alt="Current receipt"
                  className="max-w-xs max-h-48 rounded border border-dark-border"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input w-full"
                />
                {receiptPreview && (
                  <div className="space-y-2">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="max-w-xs max-h-48 rounded border border-dark-border"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleUploadReceipt}
                        disabled={uploadingReceipt || !receiptFile}
                        className="btn-secondary text-sm"
                      >
                        {uploadingReceipt ? 'Uploading...' : 'Upload Receipt'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null);
                          setReceiptPreview('');
                        }}
                        className="btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input w-full"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/topups/${id}`)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditTopupPage;

