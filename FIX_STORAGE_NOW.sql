-- แก้ไขทันที - รัน SQL commands นี้ใน Supabase SQL Editor

-- 1. อัปเดต bucket ให้เป็น public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'audio-files';

-- 2. ลบ policies เก่า (ถ้ามี)
DROP POLICY IF EXISTS "Anyone can view public audio files" ON storage.objects;
DROP POLICY IF EXISTS "Public audio access" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload audio files" ON storage.objects;

-- 3. สร้าง policy ใหม่สำหรับ public read (สำคัญที่สุด!)
CREATE POLICY "Public read access for audio files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'audio-files');

-- 4. Policy สำหรับ authenticated upload
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'audio-files' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Policy สำหรับ update/delete own files
CREATE POLICY "Users can manage their own audio files"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'audio-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'audio-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. ตรวจสอบผลลัพธ์
SELECT 
  id, name, public, file_size_limit, allowed_mime_types,
  created_at, updated_at
FROM storage.buckets 
WHERE id = 'audio-files';

-- 7. ดู policies ที่สร้าง
SELECT 
  policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%audio%';
