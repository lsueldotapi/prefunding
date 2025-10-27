# Ejemplo Práctico: Ver Comprobantes en Retool

## 📋 Pasos Simples para Implementar

### 1. Query en Retool - Obtener Prefondeos

**Nombre de la Query:** `get_prefondeos`

**Código SQL:**

```sql
SELECT 
  p.id,
  p.client_id,
  p.amount,
  p.status,
  p.processed_at,
  p.receipt_url,
  p.receipt_file_name,
  c.client_company_name,
  c.vertical
FROM prefunding_v2 p
LEFT JOIN clients_duplicate c ON p.client_id = c.id
ORDER BY p.processed_at DESC;
```

**Ejecutar:** Cada vez que se abre la página o cuando cambias los filtros

---

### 2. Tabla en Retool - Mostrar los Datos

**Componente:** Table

**Data Source:** `get_prefondeos.data`

**Columnas a mostrar:**

| Campo | Display Name | Data Source |
|-------|-------------|-------------|
| `client_company_name` | Cliente | `{{ table1.getColumnInRow(row, 'client_company_name') }}` |
| `amount` | Monto | `${{ table1.getColumnInRow(row, 'amount') }}` |
| `vertical` | Vertical | `{{ table1.getColumnInRow(row, 'vertical') }}` |
| `processed_at` | Fecha | `{{ table1.getColumnInRow(row, 'processed_at') }}` |
| **Comprobante** | **Comprobante** | [Ver botón abajo] |

---

### 3. Agregar Columna de Comprobante con Botón

**Opción A: Botón Simple (Recomendado)**

En la columna "Comprobante", usar este componente:

**Type:** Button component

**Button Text:**
```javascript
{{ table1.getColumnInRow(row, 'receipt_url') ? '📄 Ver' : 'No disponible' }}
```

**Button Action (Click):**
```javascript
{{ table1.getColumnInRow(row, 'receipt_url') }}
```

**Custom Action (After Click):**
```javascript
// Abrir en nueva pestaña
window.open(table1.getColumnInRow(row, 'receipt_url'), '_blank');
```

---

**Opción B: Link HTML (Más Visual)**

Crear una columna customizada:

**Type:** Custom component

**Code:**
```javascript
<div style={{ 
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}}>
  {table1.getColumnInRow(row, 'receipt_url') ? (
    <>
      <span style={{ fontSize: '20px' }}>📄</span>
      <a 
        href={table1.getColumnInRow(row, 'receipt_url')}
        target="_blank"
        style={{
          color: '#10b981',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        {table1.getColumnInRow(row, 'receipt_file_name') || 'Ver Comprobante'}
      </a>
      <span style={{ fontSize: '12px', color: '#999' }}>
        ({Math.round((table1.getColumnInRow(row, 'receipt_url') || '').length / 10) * 10} MB)
      </span>
    </>
  ) : (
    <span style={{ color: '#ccc' }}>Sin comprobante</span>
  )}
</div>
```

---

### 4. Filtro por Comprobantes

**Agregar filtro opcional:**

Query update:
```sql
SELECT 
  p.id,
  p.client_id,
  p.amount,
  p.status,
  p.processed_at,
  p.receipt_url,
  p.receipt_file_name,
  c.client_company_name,
  c.vertical
FROM prefunding_v2 p
LEFT JOIN clients_duplicate c ON p.client_id = c.id
WHERE 
  {{ has_receipt.value === 'all' ? '1=1' : (has_receipt.value === 'yes' ? 'p.receipt_url IS NOT NULL' : 'p.receipt_url IS NULL') }}
ORDER BY p.processed_at DESC;
```

**Agregar dropdown filter:**

**Component:** Select

**Name:** `has_receipt`

**Options:**
- `{ label: 'Todos', value: 'all' }`
- `{ label: 'Con Comprobante', value: 'yes' }`
- `{ label: 'Sin Comprobante', value: 'no' }`

---

## 🎨 Mejora Visual

### Icono según Tipo de Archivo

```javascript
const fileUrl = table1.getColumnInRow(row, 'receipt_url');
const fileName = table1.getColumnInRow(row, 'receipt_file_name') || '';

let icon = '📄';
if (fileName.endsWith('.pdf')) icon = '📄 PDF';
else if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) icon = '🖼️ Imagen';

return fileUrl ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <a 
      href={fileUrl}
      target="_blank"
      style={{ color: '#10b981', textDecoration: 'none' }}
    >
      {fileName || 'Descargar'}
    </a>
  </div>
) : <span style={{ color: '#ccc' }}>N/A</span>;
```

---

## 🚨 Debugging

Si no ves los comprobantes:

1. **Verifica la query:**
   ```sql
   SELECT receipt_url FROM prefunding_v2 LIMIT 5;
   ```
   Deberías ver URLs como: `https://[proyecto].supabase.co/storage/v1/object/public/prefunding-receipts/...`

2. **Verifica que Retool tiene acceso a la tabla:**
   - Ve a tu conexión de Supabase en Retool
   - Prueba ejecutar la query directamente

3. **Prueba la URL manualmente:**
   - Copia una `receipt_url` de la base de datos
   - Ábrela en el navegador
   - Si carga, el problema es en Retool
   - Si no carga, el problema es en Supabase Storage

---

## ✅ Checklist de Implementación

- [ ] Retool conectado a Supabase
- [ ] Query `get_prefondeos` creada y funcionando
- [ ] Tabla mostrando los datos
- [ ] Columna de comprobante agregada
- [ ] Botón/link funcionando
- [ ] Probar con un prefondeo real con comprobante
- [ ] Probar con un prefondeo sin comprobante

---

## 🎯 Resultado Final

Deberías poder:
1. Ver lista de prefondeos en Retool
2. Hacer clic en "Ver" o el link del comprobante
3. Se abre en nueva pestaña el PDF/imagen
4. Puedes descargarlo directamente

¿Todo claro? Si necesitas ayuda con algún paso específico, dime! 🚀

