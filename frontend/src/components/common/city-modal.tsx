"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";

const GUINEE_CITIES = [
  "Conakry",
  "Kindia",
  "Labé",
  "Kankan",
  "Nzérékoré",
  "Siguiri",
  "Mamou",
  "Boké",
  "Faranah",
  "Coyah",
];

export function CityModal() {
  const { user, hasSeenCityModal, setHasSeenCityModal, setUser } =
    useAuthStore();
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);

  const isOpen = !!user && !hasSeenCityModal && !user.city;

  const handleSubmit = async () => {
    if (!selectedCity) return;
    setLoading(true);
    try {
      const { data } = await api.patch("/users/me", { city: selectedCity });
      setUser(data);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
      setHasSeenCityModal();
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-sm mx-4 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            📍 Tu es dans quelle ville ?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {GUINEE_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                selectedCity === city
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedCity || loading}
            className="w-full"
          >
            {loading ? "Enregistrement..." : "Continuer"}
          </Button>
          <Button
            variant="ghost"
            onClick={setHasSeenCityModal}
            className="w-full text-muted-foreground"
          >
            Passer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
