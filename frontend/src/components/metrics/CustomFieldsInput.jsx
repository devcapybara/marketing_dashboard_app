import { useEffect, useState } from 'react';
import { customMetricFieldService } from '../../services/customMetricFieldService';

const CustomFieldsInput = ({ clientId, platform, formData, onChange }) => {
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId && platform) {
      fetchCustomFields();
    } else {
      setCustomFields([]);
      setLoading(false);
    }
  }, [clientId, platform]);

  const fetchCustomFields = async () => {
    try {
      setLoading(true);
      const response = await customMetricFieldService.listCustomFields({
        clientId,
        platform,
      });
      setCustomFields(response.data || []);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
      setCustomFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomFieldChange = (fieldName, value) => {
    const customFields = formData.customFields || {};
    onChange({
      ...formData,
      customFields: {
        ...customFields,
        [fieldName]: value,
      },
    });
  };

  if (loading || !clientId || !platform) {
    return null;
  }

  if (customFields.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="border-t border-dark-border pt-4">
        <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customFields.map((field) => {
            const fieldValue = formData.customFields?.[field.fieldName] || field.defaultValue || '';

            return (
              <div key={field._id}>
                <label htmlFor={`custom_${field.fieldName}`} className="block text-sm font-medium mb-2">
                  {field.fieldLabel}
                  {field.isRequired && <span className="text-red-400 ml-1">*</span>}
                </label>
                {field.fieldType === 'NUMBER' && (
                  <input
                    id={`custom_${field.fieldName}`}
                    type="number"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field.fieldName, parseFloat(e.target.value) || 0)}
                    className="input w-full"
                    required={field.isRequired}
                    min="0"
                    step="1"
                    placeholder={field.defaultValue || '0'}
                  />
                )}
                {field.fieldType === 'PERCENTAGE' && (
                  <input
                    id={`custom_${field.fieldName}`}
                    type="number"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field.fieldName, parseFloat(e.target.value) || 0)}
                    className="input w-full"
                    required={field.isRequired}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder={field.defaultValue || '0'}
                  />
                )}
                {field.fieldType === 'CURRENCY' && (
                  <input
                    id={`custom_${field.fieldName}`}
                    type="number"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field.fieldName, parseFloat(e.target.value) || 0)}
                    className="input w-full"
                    required={field.isRequired}
                    min="0"
                    step="0.01"
                    placeholder={field.defaultValue || '0'}
                  />
                )}
                {field.fieldType === 'TEXT' && (
                  <input
                    id={`custom_${field.fieldName}`}
                    type="text"
                    value={fieldValue}
                    onChange={(e) => handleCustomFieldChange(field.fieldName, e.target.value)}
                    className="input w-full"
                    required={field.isRequired}
                    placeholder={field.defaultValue || ''}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomFieldsInput;

