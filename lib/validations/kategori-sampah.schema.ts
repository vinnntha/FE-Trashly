import { z } from "zod";

export const kategoriSampahSchema = z.object({
  namaKategori: z.string().trim().min(2, "Nama kategori minimal 2 karakter"),
  hargaPerKg: z
    .number({ message: "Harga per kg harus berupa angka" })
    .positive("Harga per kg harus lebih besar dari 0"),
  poinPerKg: z
    .number({ message: "Poin per kg harus berupa angka" })
    .positive("Poin per kg harus lebih besar dari 0"),
  jenis: z.enum(["PLASTIK", "KERTAS", "LOGAM", "KACA"]),
  foto: z.any().optional(),
});

export type KategoriSampahInput = z.infer<typeof kategoriSampahSchema>;
