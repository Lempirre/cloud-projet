// ./server.ts
export async function getSimilarImages(formData: FormData) {
  const base = process.env.API_URL ?? "http://localhost:5000";
  const response = await fetch(`${base}/search`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des images similaires.");
  }

  return response.json();
}

