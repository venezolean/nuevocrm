// components/QuickInteractionPanel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient"

const REASONS = [
    "No contesta",
    "Número equivocado",
    "Cliente ocupado",
    "Cita agendada",
    "Cliente no interesado",
    "Llamada exitosa"
  ];
  
  const CONTACT_TYPES = [
    "Llamada",
    "Mensaje",
    "WhatsApp",
    "Correo electrónico"
  ];
  
  interface QuickInteractionPanelProps {
    clientId: string;
  }
  
  export const QuickInteractionPanel = ({ clientId }: QuickInteractionPanelProps) => {
    const [loading, setLoading] = useState(false);
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
  
    // Cargar sellerId desde localStorage
    useEffect(() => {
      const stored = localStorage.getItem("seller");
      if (stored) {
        try {
          const seller = JSON.parse(stored) as { id: string };
          setSellerId(seller.id);
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
      const { error } = await supabase.from("client_interactions").insert({
        client_id: clientId,
        seller_id: sellerId,
        interaction_date: new Date().toISOString(),
        type: selectedTypes.length ? selectedTypes : null,
        reason: selectedReason,
        vehicle: null,
        stage: null,
        notes: null
      });
  
      if (error) {
        toast.error("Error al guardar la interacción");
        console.error(error);
      } else {
        toast.success("Interacción registrada correctamente");
        // resetear estados
        setSelectedTypes([]);
        setSelectedReason(null);
      }
      setLoading(false);
    };
  
    return (
      <div className="space-y-4">
        {/* Tipos de contacto */}
        <div>
          <h4 className="font-medium text-sm mb-2">Tipo(s) de contacto</h4>
          <div className="flex flex-wrap gap-2">
            {CONTACT_TYPES.map((type) => {
              const isSelected = selectedTypes.includes(type);
              return (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className={`
                    transition
                    ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                  `}
                  onClick={() =>
                    setSelectedTypes((prev) =>
                      prev.includes(type)
                        ? prev.filter((t) => t !== type)
                        : [...prev, type]
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
            {REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <Button
                  key={reason}
                  variant="outline"
                  size="sm"
                  className={`
                    transition
                    ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                  `}
                  onClick={() => setSelectedReason(reason)}
                >
                  {reason}
                </Button>
              );
            })}
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
            {loading ? "Enviando..." : "Enviar interacción"}
          </Button>
        </div>
      </div>
    );
  };
  