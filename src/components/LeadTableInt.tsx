// components/QuickInteractionPanel.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "../services/supabaseClient";

const REASONS = [
  "No contesta",
  "Número equivocado",
  "Cliente ocupado",
  "Cita agendada",
  "Cliente no interesado",
  "Llamada exitosa",
] as const;

// Razones que consideramos “fallidas” y van a lead_followups
const FAILED_REASONS = new Set<string>([
  "No contesta",
  "Número equivocado",
  "Cliente no interesado",
]);

interface QuickInteractionPanelProps {
  clientId: string; // este es en realidad contact_requests.id
}

export const QuickInteractionPanel = ({ clientId }: QuickInteractionPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  // Leer sellerId de localStorage
  useEffect(() => {
    const stored = localStorage.getItem("seller");
    if (stored) {
      try {
        setSellerId((JSON.parse(stored) as { id: string }).id);
      } catch {
        console.warn("Error parseando seller en localStorage");
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!sellerId) {
      toast.error("Vendedor no identificado");
      return;
    }
    if (!selectedReason) {
      toast.error("Selecciona primero una razón");
      return;
    }

    setLoading(true);

    try {
      if (FAILED_REASONS.has(selectedReason)) {
        // Lead NO contactado → insertar en lead_followups
        const { error } = await supabase.rpc("insert_lead_followup", {
          p_request_id: clientId,
          p_seller_id: sellerId,
          p_reason: selectedReason,
          p_notes: null,
        });
        if (error) throw error;
        toast.success("Lead agendado para seguimiento (follow-up)");
      } else {
        // Lead contactado → convertir y registrar interacción
        // 1) Convertir lead a cliente
        const { data: newClientId, error: convErr } = await supabase.rpc(
          "convert_lead_to_client",
          { p_request_id: clientId }
        );
        if (convErr) throw convErr;
        if (!newClientId) {
          toast("El lead ya existía o no se encontró", { icon: "ℹ️" });
        }

        // 2) Registrar interacción de cliente
        const { error: intErr } = await supabase.rpc(
          "insert_client_interaction",
          {
            p_client_id: newClientId as string,
            p_seller_id: sellerId,
            p_interaction_date: new Date().toISOString(),
            p_types: selectedTypes.length ? selectedTypes : [selectedReason],
            p_reason: selectedReason,
            p_vehicle: null,
            p_stage: null,
            p_notes: null,
          }
        );
        if (intErr) throw intErr;
        toast.success("Interacción de cliente registrada");
      }

      // Resetear selección
      setSelectedTypes([]);
      setSelectedReason(null);
    } catch (e) {
      console.error(e);
      toast.error("Error al procesar la interacción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tipos de contacto */}
      <div>
        <h4 className="font-medium text-sm mb-2">Tipo(s) de contacto</h4>
        <div className="flex flex-wrap gap-2">
          {["Llamada", "Mensaje", "WhatsApp", "Correo electrónico"].map((type) => {
            const isSel = selectedTypes.includes(type);
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                className={isSel ? "bg-blue-500 text-white" : ""}
                onClick={() =>
                  setSelectedTypes((prev) =>
                    prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                  )
                }
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Razones */}
      <div>
        <h4 className="font-medium text-sm mb-2">Razón de la interacción</h4>
        <div className="flex flex-wrap gap-2">
          {REASONS.map((reason) => (
            <Button
              key={reason}
              variant="outline"
              size="sm"
              className={selectedReason === reason ? "bg-blue-500 text-white" : ""}
              onClick={() => setSelectedReason(reason)}
            >
              {reason}
            </Button>
          ))}
        </div>
      </div>

      {/* Botón de envío */}
      <div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSubmit}
          disabled={loading || !selectedReason}
        >
          {loading ? "Procesando..." : "Enviar interacción"}
        </Button>
      </div>
    </div>
  );
};
