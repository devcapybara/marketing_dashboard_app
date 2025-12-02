# Custom Fields System - Guide

## 📋 Overview

Custom Fields System memungkinkan aplikasi untuk menambahkan field baru ke Daily Metrics tanpa perlu migrate database setiap kali. Ini memberikan fleksibilitas untuk mengakomodasi kebutuhan data yang berbeda per client atau platform.

## 🎯 Use Case

Dari spreadsheet user, kita lihat kebutuhan field yang berbeda per platform:
- **Google Ads**: Page View, Form Conversions, WA Conversions, Rute Conversions, Kontak Conversions
- **Meta Ads**: Form Conversions, WA Conversions
- **TikTok Ads**: (akan berkembang seiring waktu)

Dengan Custom Fields System, kita bisa:
1. Tambah field baru tanpa perlu update schema database
2. Field berbeda per client atau per platform
3. Field definitions bisa di-manage melalui UI
4. Tidak perlu migrate database setiap kali butuh field baru

## 🏗 Architecture

### Models

#### DailyMetric
```javascript
{
  // Standard fields
  spend, revenue, impressions, clicks, leads,
  
  // Custom fields (Mixed type)
  customFields: {
    "pageView": 100,
    "formConversions": 5,
    "waConversions": 10,
    "ruteConversions": 20,
    "kontakConversions": 3
  }
}
```

#### CustomMetricField
```javascript
{
  clientId: ObjectId,
  platform: 'META' | 'TIKTOK' | 'GOOGLE' | 'ALL',
  fieldName: 'pageView', // snake_case
  fieldLabel: 'Page View', // Display label
  fieldType: 'NUMBER' | 'TEXT' | 'PERCENTAGE' | 'CURRENCY',
  isRequired: false,
  defaultValue: 0,
  displayOrder: 1,
  isActive: true
}
```

## 🔌 API Endpoints

### Create Custom Field
```
POST /api/custom-metric-fields
Body: {
  clientId: string,
  platform: 'META' | 'TIKTOK' | 'GOOGLE' | 'ALL',
  fieldName: string, // snake_case, unique per client+platform
  fieldLabel: string, // Display label
  fieldType: 'NUMBER' | 'TEXT' | 'PERCENTAGE' | 'CURRENCY',
  isRequired: boolean,
  defaultValue: any,
  displayOrder: number
}
```

### List Custom Fields
```
GET /api/custom-metric-fields?clientId=xxx&platform=META
```

## 📝 Field Types

### NUMBER
- Untuk angka bulat atau desimal
- Contoh: pageView, formConversions, waConversions

### TEXT
- Untuk teks
- Contoh: campaignName, adGroupName

### PERCENTAGE
- Untuk persentase
- Contoh: CTR (Click-Through Rate)

### CURRENCY
- Untuk mata uang
- Contoh: costPerConversion

## 🎨 Frontend Implementation (Pending)

### Custom Fields Management Page
- List semua custom fields untuk client/platform
- Create/Edit/Delete custom field definitions
- Preview form dengan custom fields

### Dynamic Metrics Form
- Load custom fields berdasarkan client/platform
- Render form fields secara dinamis
- Validate berdasarkan fieldType dan isRequired
- Format display berdasarkan fieldType

### Example Flow

1. **Admin/Client** buat custom field definition:
   ```
   fieldName: "pageView"
   fieldLabel: "Page View"
   fieldType: "NUMBER"
   platform: "GOOGLE"
   ```

2. **Form Metrics** akan otomatis include field ini:
   ```jsx
   {customFields.map(field => (
     <input
       type={field.fieldType === 'NUMBER' ? 'number' : 'text'}
       name={`customFields.${field.fieldName}`}
       label={field.fieldLabel}
       required={field.isRequired}
     />
   ))}
   ```

3. **Data tersimpan** di DailyMetric.customFields:
   ```json
   {
     "pageView": 100,
     "formConversions": 5
   }
   ```

## 📊 Charts Integration

Custom fields bisa digunakan di charts:
- Bar chart untuk custom fields per platform
- Line chart untuk trend custom fields over time
- Comparison chart untuk custom fields across platforms

## 🔄 Migration Strategy

Untuk data existing:
1. Custom fields akan kosong `{}` untuk data lama
2. Bisa diisi manual atau via bulk update
3. Tidak perlu migrate database schema

## 🚀 Future Enhancements

1. **Field Validation Rules**: Min/max values, regex patterns
2. **Field Dependencies**: Show field A jika field B > 0
3. **Field Calculations**: Auto-calculate field C dari field A + B
4. **Field Templates**: Pre-defined field sets untuk platform tertentu
5. **Field Import/Export**: Export field definitions untuk backup/sharing

## 📚 Examples dari Spreadsheet User

### Google Ads Custom Fields
- `pageView` (NUMBER)
- `formConversions` (NUMBER)
- `waConversions` (NUMBER)
- `ruteConversions` (NUMBER)
- `kontakConversions` (NUMBER)
- `ctr` (PERCENTAGE) - bisa dihitung dari clicks/impressions
- `costPerConversion` (CURRENCY) - bisa dihitung dari spend/conversions

### Meta Ads Custom Fields
- `formConversions` (NUMBER)
- `waConversions` (NUMBER)
- `ctr` (PERCENTAGE)
- `costPerConversion` (CURRENCY)

## ⚠️ Important Notes

1. **fieldName harus unique** per client+platform combination
2. **fieldName menggunakan snake_case** untuk konsistensi
3. **Custom fields tidak replace standard fields** (spend, revenue, dll)
4. **Custom fields optional** - tidak wajib diisi kecuali isRequired=true
5. **Platform 'ALL'** berarti field berlaku untuk semua platform

---

**Last Updated**: December 2024  
**Status**: Backend Complete | Frontend UI Pending

