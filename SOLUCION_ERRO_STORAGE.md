# Solución: Error al Subir Archivos a Supabase Storage

## Paso 1: Verificar el Bucket en Supabase Dashboard

1. Ve a tu proyecto en Supabase Dashboard: https://supabase.com/dashboard
2. Navega a **Storage** en el menú lateral
3. Busca el bucket llamado `prefunding-receipts`
4. Si existe, haz clic en "Edit" y verifica:
   - ✅ **Public bucket**: Debe estar ACTIVADO (toggle verde)
   - ✅ **File size limit**: 5242880 (5MB)
   
5. Si NO existe:
   - Haz clic en "New bucket"
   - Name: `prefunding-receipts`
   - ✅ **Public bucket**: ACTIVAR
   - File size limit: 5242880
   - Clic en "Create bucket"

## Paso 2: Ejecutar las Políticas de Storage

1. En Supabase Dashboard, ve a **SQL Editor**
2. Copia y pega este código:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to prefunding-receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to prefunding-receipts" ON storage.objects;

-- Create policy for allowing public uploads to prefunding-receipts bucket
CREATE POLICY "Allow public uploads to prefunding-receipts"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prefunding-receipts');

-- Create policy for allowing public reads from prefunding-receipts bucket
CREATE POLICY "Allow public read access to prefunding-receipts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prefunding-receipts');
```

3. Haz clic en "Run" para ejecutar el SQL

## Paso 3: Verificar las Políticas

1. En Supabase Dashboard, ve a **Storage** → **Policies**
2. Deberías ver 2 políticas para `prefunding-receipts`:
   - ✅ "Allow public uploads to prefunding-receipts"
   - ✅ "Allow public read access to prefunding-receipts"

## Paso 4: Probar de Nuevo

1. Recarga la página de prefondeo
2. Abre la consola del navegador (F12 → Console)
3. Intenta subir un archivo
4. Si hay error, verás mensajes detallados en la consola
5. Comparte el mensaje de error con el desarrollador

## Errores Comunes y Soluciones

### Error: "new row violates row-level security policy"
**Solución**: El bucket no está configurado como público o faltan las políticas. Ejecuta los pasos 1 y 2.

### Error: "Bucket not found"
**Solución**: Crea el bucket `prefunding-receipts` siguiendo el Paso 1.

### Error: "insufficient privileges"
**Solución**: Verifica que las políticas se hayan ejecutado correctamente (Paso 2).

## Verificar que Funciona

Para verificar que todo está bien configurado:

1. Ve a Supabase Dashboard → Storage → `prefunding-receipts`
2. Intenta crear un archivo de prueba manualmente (si tienes permisos)
3. Deberías poder crear y ver archivos sin problemas

## Contacto

Si después de seguir estos pasos aún hay errores, comparte:
1. La URL de tu dashboard de Supabase
2. El error que ves en la consola del navegador
3. Una captura de pantalla de las políticas de storage

