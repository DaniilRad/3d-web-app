const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-3d-web-app.vercel.app"
    : "http://localhost:5000";

/**
 * Upload a 3D model to the backend.
 * @param file The 3D model file to upload (File object).
 * @returns The URL of the uploaded model.
 */
export const uploadModel = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("model", file);

  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to upload: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  return data.url;
};

/**
 * Fetch the list of 3D models from the backend.
 * @returns An array of objects containing model names and URLs.
 */
export const fetchModels = async (): Promise<{ name: string; url: string }[]> => {
  const response = await fetch(`${BASE_URL}/api/load`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch models: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Delete a 3D model from the backend.
 * @param filename The name of the file to delete.
 */
export const handleDeleteModel = async (filename: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/api/uploads/${filename}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete model: ${error.error || response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting model:", error);
    alert("Failed to delete the model");
  }
};
