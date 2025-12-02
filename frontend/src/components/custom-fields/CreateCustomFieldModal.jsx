import { useState } from 'react';
import { customMetricFieldService } from '../../services/customMetricFieldService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateCustomFieldModal = ({ clients, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clientId: user?.role === 'CLIENT' ? user.clientId : '',
    platform: 'ALL',
    fieldName: '',
    fieldLabel: '',
    fieldType: 'NUMBER',
    isRequired: false,
    defaultValue: '',
    displayOrder: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        defaultValue: formData.defaultValue ? parseFloat(formData.defaultValue) || formData.defaultValue : null,
        displayOrder: parseInt(formData.displayOrder) || 0,
      };

      await customMetricFieldService.createCustomField(submitData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create custom field');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark-card border border-dark-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Create Custom Field</h2>
          <button
            onClick={onClose}
            className="text-dark-text-muted hover:text-dark-text"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && clients.length > 0 && (
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-2">
                Client <span className="text-red-400">*</span>
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.companyName && `(${client.companyName})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="platform" className="block text-sm font-medium mb-2">
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="ALL">All Platforms</option>
              <option value="META">Meta</option>
              <option value="TIKTOK">TikTok</option>
              <option value="GOOGLE">Google</option>
              <option value="X">X</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fieldName" className="block text-sm font-medium mb-2">
                Field Name (snake_case) <span className="text-red-400">*</span>
              </label>
              <input
                id="fieldName"
                name="fieldName"
                type="text"
                value={formData.fieldName}
                onChange={handleChange}
                className="input w-full font-mono"
                required
                placeholder="page_view"
                pattern="[a-z0-9_]+"
                title="Use lowercase letters, numbers, and underscores only"
              />
              <p className="text-xs text-dark-text-muted mt-1">
                Example: page_view, form_conversions, wa_conversions
              </p>
            </div>

            <div>
              <label htmlFor="fieldLabel" className="block text-sm font-medium mb-2">
                Field Label <span className="text-red-400">*</span>
              </label>
              <input
                id="fieldLabel"
                name="fieldLabel"
                type="text"
                value={formData.fieldLabel}
                onChange={handleChange}
                className="input w-full"
                required
                placeholder="Page View"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fieldType" className="block text-sm font-medium mb-2">
                Field Type <span className="text-red-400">*</span>
              </label>
              <select
                id="fieldType"
                name="fieldType"
                value={formData.fieldType}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="NUMBER">Number</option>
                <option value="TEXT">Text</option>
                <option value="PERCENTAGE">Percentage</option>
                <option value="CURRENCY">Currency</option>
              </select>
            </div>

            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium mb-2">
                Display Order
              </label>
              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                className="input w-full"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="defaultValue" className="block text-sm font-medium mb-2">
                Default Value
              </label>
              <input
                id="defaultValue"
                name="defaultValue"
                type={formData.fieldType === 'NUMBER' || formData.fieldType === 'PERCENTAGE' || formData.fieldType === 'CURRENCY' ? 'number' : 'text'}
                value={formData.defaultValue}
                onChange={handleChange}
                className="input w-full"
                step={formData.fieldType === 'PERCENTAGE' ? '0.01' : formData.fieldType === 'CURRENCY' ? '0.01' : '1'}
              />
            </div>

            <div className="flex items-center">
              <input
                id="isRequired"
                name="isRequired"
                type="checkbox"
                checked={formData.isRequired}
                onChange={handleChange}
                className="w-4 h-4 rounded border-dark-border"
              />
              <label htmlFor="isRequired" className="ml-2 text-sm font-medium">
                Required Field
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Field'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomFieldModal;

