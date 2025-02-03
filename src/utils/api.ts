const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-3d-web-app.vercel.app"
    : "http://localhost:5000";

/**
 * Upload a 3D model to the backend.
 * @param file The 3D model file to upload (File object).
 * @returns The URL of the uploaded model.
 */
export const testCORS = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log("Test response:", data);
  } catch (error) {
    console.error("CORS test failed:", error);
  }
};

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

export const getPresignedPost = async (file: File): Promise<any> => {
  const response = await fetch(`${BASE_URL}/api/get-presigned-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get pre-signed URL");
  }

  const { presignedPost } = await response.json();
  return presignedPost;
};

// 📌 **Upload File to S3 Using the Pre-Signed URL**
export const uploadFileToS3 = async (file: File, presignedPost: any): Promise<string> => {
  console.log("Pre-Signed URL Data:", presignedPost);

  const formData = new FormData();
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  formData.append("Content-Type", file.type); // ✅ Ensure Content-Type matches
  formData.append("file", file);

  console.log("Uploading file to:", presignedPost.url);
  console.log("Form Data:", formData);

  const uploadResponse = await fetch(presignedPost.url, {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    console.error("Upload Failed:", await uploadResponse.text());
    throw new Error("Failed to upload file to S3");
  }

  return `${presignedPost.url}/${presignedPost.fields.key}`;
};

/**
 * Fetch the list of 3D models from the backend.
 * @returns An array of objects containing model names and URLs.
 */
export const fetchModels = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/load`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching models:", error);
  }
};

/**
 * Delete a 3D model from the backend.
 * @param filename The name of the file to delete.
 */
export const handleDeleteModel = async (filename: string): Promise<void> => {
  if (!window.confirm(`Are you sure you want to delete ${filename}?`)) return;

  try {
    const response = await fetch(`${BASE_URL}/api/uploads/${filename}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to delete model: ${error.error || response.statusText}`
      );
    }
    alert("Model deleted successfully!");

  } catch (error) {
    console.error("Error deleting model:", error);
    alert("Failed to delete the model");
  }
};

/**
 * Load a 3D model from the backend.
 * @param filename The name of the file to delete.
 */
export const handleLoadModel = async (filename: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/api/uploads/${filename}`);
    const data = await response.json();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to load model: ${error.error || response.statusText}`
      );
    }

    if (!data.url) throw new Error("Invalid model URL received");
    return data.url;

  } catch (error) {
    console.error("Error loading model:", error);
    alert("Failed to load the model");
  }
};
