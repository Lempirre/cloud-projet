"use client";

import { useMutation } from "@tanstack/react-query";
import { getSimilarImages } from "../server";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderCircle, ScanSearch } from "lucide-react";
import { useState } from "react";

const regex = /^(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2})\.jpg$/;
const models = ["MobileNet", "Resnet50", "VGG16"] as const;
const distances = ["euclidienne", "chi square", "bhattacharyya"] as const;

const formSchema = z.object({
  image: z
    .string()
    .refine(
      (name) => regex.test(name),
      "Seulement les images de cette sélection sont acceptées."
    ),
  model: z.enum(models),
  distance: z.enum(distances),
  k: z.enum(["20", "50"]),
});
type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "VGG16",
      distance: "euclidienne",
      k: "20",
      image: "",
    },
  });

  const { data, mutate: server_getSimilarImages, isPending } = useMutation({
    mutationFn: getSimilarImages,
  });

  function onSubmit(values: FormValues) {
    const { image, model, distance, k } = values;
    const formData = new FormData();
    formData.append("filename", image);
    formData.append("descriptor", model);
    formData.append("similarity", distance);
    formData.append("topn", k);
    server_getSimilarImages(formData);
  }

  function openDialog() {
    setIsDialogOpen(true);
  }
  function closeDialog() {
    setIsDialogOpen(false);
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "2rem auto",
        padding: "0 1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <section
        style={{
          backgroundColor: "#fafafa",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {/* IMAGE SELECTION */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="image"
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
              }}
            >
              Image de recherche
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="image de recherche"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    maxWidth: "220px",
                    maxHeight: "160px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "220px",
                    height: "160px",
                    borderRadius: "16px",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    fontStyle: "italic",
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  Aucune image sélectionnée
                </div>
              )}
              <button
                type="button"
                onClick={openDialog}
                style={{
                  padding: "0.6rem 1.2rem",
                  border: "2px solid #0070f3",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#0070f3",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s, color 0.3s",
                  flexGrow: 1,
                  maxWidth: "200px",
                }}
              >
                Choisir une image
              </button>
            </div>
            {form.formState.errors.image && (
              <p
                style={{
                  color: "#d32f2f",
                  marginTop: "0.25rem",
                  fontWeight: "600",
                }}
              >
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          {/* DIALOGUE DE SÉLECTION */}
          {isDialogOpen && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={closeDialog}
            >
              <div
                style={{
                  width: "80vw",
                  height: "80vh",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <header
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2 style={{ margin: 0, fontWeight: "700" }}>Choisir une image</h2>
                  <button type="button" onClick={closeDialog} aria-label="Fermer">
                    &times;
                  </button>
                </header>
                <div
                  style={{
                    flexGrow: 1,
                    overflowY: "auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {Array.from({ length: 1000 }, (_, i) => {
                    const num = i + 1;
                    const imgSrc = `/images/${num}.jpg`;
                    const selected = currentImage === imgSrc;
                    return (
                      <img
                        key={num}
                        src={imgSrc}
                        alt={`Image ${num}`}
                        style={{
                          borderRadius: "12px",
                          boxShadow: selected
                            ? "0 0 0 4px #0070f3"
                            : "0 4px 12px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          width: "100%",
                          objectFit: "cover",
                          transition: "box-shadow 0.25s ease-in-out",
                        }}
                        onClick={() => {
                          setCurrentImage(imgSrc);
                          form.setValue("image", `${num}.jpg`, { shouldValidate: true });
                        }}
                      />
                    );
                  })}
                </div>
                <div style={{ textAlign: "right", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={closeDialog}
                    disabled={!currentImage}
                    style={{
                      padding: "0.6rem 1.4rem",
                      borderRadius: "8px",
                      backgroundColor: currentImage ? "#0070f3" : "#ccc",
                      color: "white",
                      cursor: currentImage ? "pointer" : "not-allowed",
                    }}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FORM CONTROLS */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { id: "model", label: "Modèle", options: models },
              { id: "distance", label: "Distance", options: distances },
              { id: "k", label: "Top N", options: ["20", "50"] as const },
            ].map(({ id, label, options }) => (
              <div key={id} style={{ flex: "1 1 200px", minWidth: "200px" }}>
                <label htmlFor={id} style={{ fontWeight: "700" }}>
                  {label}
                </label>
                <select id={id} {...form.register(id as keyof FormValues)}>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{ padding: "0.85rem 2rem", display: "flex", gap: "0.75rem" }}
          >
            {isPending ? (
              <>
                <LoaderCircle />
                Chargement...
              </>
            ) : (
              <>
                <ScanSearch />
                Rechercher
              </>
            )}
          </button>
        </form>

        {/* AFFICHAGE DES RÉSULTATS */}
        {data?.rp_curve && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Courbe rappel-précision</h3>
            <img src={`${data.rp_curve}?t=${Date.now()}`} alt="RP Curve" />
          </div>
        )}
        {data?.similar_images && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Images similaires</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: "10px",
              }}
            >
              {data.similar_images.map((num: string) => (
                <img key={num} src={`/images/${num}.jpg`} alt={`#${num}`} />
              ))}
            </div>
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
