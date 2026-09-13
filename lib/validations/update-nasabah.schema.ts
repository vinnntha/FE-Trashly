import { z } from "zod";

export const updateNasabahSchema = z.object({
  namaNasabah: z.string().trim().min(2, "Nama nasabah minimal 2 karakter").optional(),
  namaLengkap: z.string().trim().optional(),
  telp: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^[0-9+\-\s]{8,16}$/.test(val),
      "Format nomor telepon tidak valid"
    )
    .optional(),
  noTelepon: z.string().trim().optional(),
  alamat: z.string().trim().min(5, "Alamat minimal 5 karakter").optional(),
  foto: z.any().optional(),
});

export type UpdateNasabahInput = z.infer<typeof updateNasabahSchema>;
