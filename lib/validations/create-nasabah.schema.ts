import { z } from "zod";

export const createNasabahSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username minimal 3 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  namaNasabah: z.string().trim().min(2, "Nama nasabah minimal 2 karakter"),
  alamat: z.string().trim().min(5, "Alamat minimal 5 karakter"),
  telp: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 karakter")
    .regex(/^[0-9+\-\s]{8,16}$/, "Format nomor telepon tidak valid"),
  foto: z.any().optional(),
});

export type CreateNasabahInput = z.infer<typeof createNasabahSchema>;
