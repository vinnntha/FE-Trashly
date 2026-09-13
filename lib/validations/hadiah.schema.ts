import { z } from "zod";

export const hadiahSchema = z.object({
  namaHadiah: z.string().trim().min(2, "Nama hadiah minimal 2 karakter"),
  poinDibutuhkan: z
    .number({ message: "Poin dibutuhkan harus berupa angka" })
    .positive("Poin dibutuhkan harus lebih besar dari 0"),
  stok: z
    .number({ message: "Stok harus berupa angka" })
    .int("Stok harus berupa bilangan bulat")
    .min(0, "Stok tidak boleh bernilai negatif"),
  foto: z.any().optional(),
});

export type HadiahInput = z.infer<typeof hadiahSchema>;
