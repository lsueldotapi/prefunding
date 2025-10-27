# Integración de Comprobantes en Retool

## ✅ Ya Tenemos Todo lo Necesario

Las URLs de los comprobantes ya están guardadas en la tabla `prefunding_v2` en las columnas:
- `receipt_url` - URL pública del comprobante
- `receipt_file_name` - Nombre original del archivo

Como el bucket es **público**, las URLs son accesibles desde cualquier lugar.

## 🔗 Opción 1: Integración Directa en Retool (Recomendado)

### Paso 1: Conectar Retool con Supabase

1. En Retool, asegúrate de tener una conexión a Supabase
2. Nombre de la base de datos: `supabase`
3. Usa las credenciales de tu proyecto Supabase

### Paso 2: Crear Query para Obtener Prefondeos

**Query 1: Listar prefondeos con comprobantes**

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
  c.vertical,
  c.country_code
FROM prefunding_v2 p
LEFT JOIN clients_duplicate c ON p.client_id = c.id
WHERE p.receipt_url IS NOT NULL
ORDER BY p.processed_at DESC;
```

### Paso 3: Agregar Botón de Descarga en Retool

1. En tu tabla de prefondeos, agrega una columna para el comprobante
2. Usa este código en el **action button**:

**JavaScript/Code:**

```javascript
// Abrir el comprobante en una nueva pestaña
window.open(currentRow.receipt_url, '_blank');
```

O si quieres descargarlo directamente:

```javascript
// Descargar el comprobante
const link = document.createElement('a');
link.href = currentRow.receipt_url;
link.download = currentRow.receipt_file_name || 'comprobante.pdf';
link.click();
```

### Paso 4: Componente Visual (Opcional)

Puedes mostrar un icono de PDF que al hacer clic descargue el comprobante:

```html
<!-- En un componente HTML -->
<a href={{ table.rowData.receipt_url }} download target="_blank" style="text-decoration: none;">
  <span style="color: #dc2626;">
    📄 {{ table.rowData.receipt_file_name || 'Ver Comprobante' }}
  </span>
</a>
```

## 🔔 Opción 2: Notificación por Email (Opcional - Requiere Configuración Adicional)

Si quieres recibir un email cuando se suba un comprobante, necesitarías:

1. **Database Trigger en Supabase** (cuando se inserta un prefondeo con comprobante)
2. **Edge Function** para enviar el email
3. Configurar servicio de email (SendGrid, AWS SES, etc.)

**Esto requiere más configuración. ¿Te interesa implementarlo?**

## 📊 Opción 3: Vista Mejorada en Retool

### Crear una Vista Detallada del Prefondeo

Query para obtener un prefondeo específico con su comprobante:

```sql
SELECT 
  p.*,
  c.client_company_name,
  c.vertical,
  c.country_code,
  CASE 
    WHEN p.receipt_url IS NOT NULL THEN '✅ Tiene Comprobante'
    ELSE '❌ Sin Comprobante'
  END as has_receipt
FROM prefunding_v2 p
LEFT JOIN clients_duplicate c ON p.client_id = c.id
WHERE p.id = {{prefunding_id}};
```

### Componente para Ver/Descargar Comprobante

```javascript
// Retool JavaScript
if (table.rowData.receipt_url) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <a 
        href={table.rowData.receipt_url} 
        target="_blank"
        style={{ 
          padding: '6px 12px',
          background: '#10b981',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none'
        }}
      >
        📄 Ver Comprobante
      </a>
      <span style={{ fontSize: '12px', color: '#666' }}>
        {table.rowData.receipt_file_name}
      </span>
    </div>
  );
} else {
  return <span style={{ color: '#999' }}>Sin comprobante</span>;
}
```

## 🎯 Ejemplo Completo de Tabla en Retool

### Estructura Recomendada:

| Campo | Valor |
|-------|-------|
| Cliente | `{{ c.client_company_name }}` |
| Monto | `${{ p.amount }}` |
| Fecha | `{{ p.processed_at }}` |
| Vertical | `{{ c.vertical }}` |
| Comprobante | [Botón con código de arriba] |
| Status | `{{ p.status }}` |

## 🔍 Filtrar por Tipo de Comprobante

```sql
-- Solo prefondeos CON comprobante (vertical != Bill payments)
SELECT * FROM prefunding_v2
WHERE receipt_url IS NOT NULL;

-- Solo prefondeos SIN comprobante (vertical = Bill payments o sin comprobante)
SELECT * FROM prefunding_v2
WHERE receipt_url IS NULL;
```

## 📝 Notas Importantes

1. **URLs Públicas**: Como el bucket es público, las URLs funcionan desde cualquier lugar
2. **Seguridad**: Solo usuarios con acceso a la tabla `prefunding_v2` pueden ver las URLs
3. **Persistencia**: Los archivos nunca se eliminan automáticamente
4. **Storage**: Considera implementar limpieza periódica de archivos antiguos si es necesario

## 🚀 Próximos Pasos

1. Conecta Retool a Supabase (si no está conectado)
2. Crea la query básica de prefondeos
3. Agrega el botón de descarga según el ejemplo
4. Prueba con datos reales

¿Necesitas ayuda con algún paso específico?

