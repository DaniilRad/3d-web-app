export const uploadModel = async (file: File) => {
  const formData = new FormData();
  formData.append("model", file);

  const response = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload: ${response.statusText}`);
  }
  const data = await response.json();
  return data.url;
};

export const fetchModels = async () => {
  const response = await fetch("http://localhost:5000/api/models");

  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const handleDeleteModel = async (modelUrl: string) => {
  try {
    const response = await fetch(modelUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete model: ${response.statusText}`);
    }
    // alert("Model deleted successfully");
  } catch (error) {
    console.error("Error deleting model:", error);
    alert("Failed to delete the model");
  }
};
