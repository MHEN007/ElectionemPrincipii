SELECT
  id,
  name
FROM
  "Voter"
WHERE
  (
    (kelas = 10)
    AND (kelompok = 'PVRA' :: "Role")
  );