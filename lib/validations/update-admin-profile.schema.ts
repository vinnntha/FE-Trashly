import { z } from "zod";

export const updateAdminProfileSchema = z
  .object({
    namaUnit: z.string().trim().optional(),
    namaPengelola: z.string().trim().optional(),
    telp: z
      .string()
      .trim()
      .refine(
        (val) => !val || /^[0-9+\-\s]{8,16}$/.test(val),
        "Format nomor telepon tidak valid (minimal 8 angka)"
      )
      .optional(),
  })
  .refine(
    (data) => Boolean(data.namaUnit || data.namaPengelola || data.telp),
    {
      message: "Minimal salah satu data harus diisi untuk memperbarui profil.",
      path: ["namaUnit"],
    }
  );

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;
