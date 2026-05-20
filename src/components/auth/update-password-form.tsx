"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");

    if (password.length < 8) {
      toast.error("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contrasenas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Contrasena actualizada.");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field
        label="Nueva contrasena"
        name="password"
        type="password"
        placeholder="Minimo 8 caracteres"
        autoComplete="new-password"
      />
      <Field
        label="Confirmar contrasena"
        name="confirm"
        type="password"
        placeholder="Repite la contrasena"
        autoComplete="new-password"
      />
      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? "Guardando..." : "Guardar contrasena"}
      </Button>
    </form>
  );
}
