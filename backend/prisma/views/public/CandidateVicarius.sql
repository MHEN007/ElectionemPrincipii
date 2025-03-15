SELECT
  id,
  name
FROM
  "Voter"
WHERE
  (
    (kelas = 11)
    AND (kelompok = 'PVRA' :: "Role")
  );