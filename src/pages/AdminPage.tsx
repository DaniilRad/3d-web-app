import { Button } from "@/components/ui/button";
import { socket } from "@/main";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [tukeModels, setTukeModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [userModels, setUserModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [localCurrentModelList, setLocalCurrentModelList] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [currentModelList, setCurrentModelList] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);

  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [localCurrentModelIndex, setLocalCurrentModelIndex] = useState(0);
  const [isChooseModel, setIsChooseModel] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    socket.on("login_success", () => {
      setIsLoggedIn(true);
    });
    socket.on("login_failed", ({ message }) => {
      setError(message);
    });
    return () => {
      socket.off("login_success");
      socket.off("login_failed");
    };
  }, []);

  const handleLogin = () => {
    socket.emit("admin_login", loginForm);
  };

  useEffect(() => {
    socket.on("update_index", (currentIndex) => {
      if (currentIndex) {
        setCurrentModelIndex(currentIndex);
      }
    });

    return () => {
      socket.off("update_index");
    };
  }, []);

  useEffect(() => {
    socket.on("model_uploaded", (file) => {
      socket.emit("get_files");
      socket.once("files_list", ({ tukeModels, userModels }) => {
        setTukeModels(tukeModels);
        setUserModels(userModels);

        setCurrentModelList(file.folder);
        const newIndex = localCurrentModelList.findIndex((model) => {
          return model.url === file.modelUrl;
        });
        if (newIndex !== -1) {
          setCurrentModelIndex(newIndex);
        }
      });
    });

    return () => {
      socket.off("model_uploaded");
    };
  }, []);

  useEffect(() => {
    socket.emit("get_files");
    socket.on("files_list", ({ tukeModels, userModels }) => {
      setTukeModels(tukeModels);
      setUserModels(userModels);
      let modelList = userModels;
      setLocalCurrentModelList(modelList);
      setCurrentModelList(modelList);
    });
    return () => {
      socket.off("files_list");
    };
  }, []);

  const changeModelList = (modelFolder: string) => {
    let modelList;
    if (modelFolder === "user") {
      modelList = userModels;
      setLocalCurrentModelList(modelList);
    } else if (modelFolder === "tuke") {
      modelList = tukeModels;
      setLocalCurrentModelList(modelList);
    }
    setIsChooseModel(false);
  };

  const handleDelete = async () => {
    const fileToDelete = localCurrentModelList[localCurrentModelIndex];
    if (!fileToDelete) return;

    try {
      // Send delete request to server via socket
      socket.emit("delete_file", {
        fileName: fileToDelete.id,
        folder: fileToDelete.folder,
      });

      // Listen for delete success event
      socket.on("delete_success", () => {
        // After successful deletion, fetch updated list of files
        socket.emit("get_files"); // Emit get_files to refresh the list
        setIsChooseModel(false); // Close the detail view after deletion
      });

      // Handle the case if there is an error in deletion
      socket.on("delete_error", ({ message }) => {
        console.error("❌ Error deleting file:", message);
        // Optionally, show some error message to the user here
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-deepBlack text-lightGray flex h-screen items-center justify-center">
        <div className="flex flex-col gap-4 rounded-2xl border p-8">
          <h1 className="text-3xl">Admin Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
            className="text-lightGray mt-2 rounded-md border p-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="text-lightGray mt-2 rounded-md border p-2 text-sm"
          />
          <Button onClick={handleLogin} variant={"outline"} className="mt-2">
            Login
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deepBlack font-tech-mono text-lightGray relative flex h-screen flex-col gap-4 p-4">
      <p className="flex w-full items-center justify-center text-3xl">
        Admin Page
      </p>
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-row justify-center gap-5">
          <Button variant={"outline"} onClick={() => changeModelList("tuke")}>
            Tuke Models
          </Button>
          <Button variant={"outline"} onClick={() => changeModelList("user")}>
            User Models
          </Button>
        </div>
        <div className="h-auto max-h-96 w-full overflow-y-auto border-2 border-dashed">
          <div className="grid grid-cols-2 gap-4 p-4">
            {localCurrentModelList.map((model, index) => {
              return (
                <Button
                  key={model.id}
                  variant={"outline"}
                  onClick={() => {
                    setLocalCurrentModelIndex(index);
                    if (index !== localCurrentModelIndex) {
                      setIsChooseModel(isChooseModel);
                    } else {
                      setIsChooseModel(!isChooseModel);
                    }
                  }}
                  className={`overflow-hidden text-ellipsis whitespace-nowrap ${currentModelIndex === index && currentModelList === localCurrentModelList && "text-neonBlue hover:bg-neonBlue hover:text-deepBlack hover:border-neonBlue"}`}
                >
                  {model.id}
                </Button>
              );
            })}
          </div>
        </div>
        {isChooseModel && (
          <div className="fixed bottom-0 left-0 w-full p-8 text-sm">
            <div className="flex w-full flex-row justify-around gap-4 border-2 border-dashed p-4">
              <div className="grid grid-cols-1">
                <div className="flex flex-row gap-2">
                  <p className="text-neonBlue">Name:</p>
                  <p>{localCurrentModelList[localCurrentModelIndex].id}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="text-neonBlue">Author:</p>
                  <p>{localCurrentModelList[localCurrentModelIndex].author}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="text-neonBlue">Folder:</p>
                  <p>/{localCurrentModelList[localCurrentModelIndex].folder}</p>
                </div>
                <div className="flex flex-row gap-2">
                  <p className="text-neonBlue">URL:</p>
                  <p>{localCurrentModelList[localCurrentModelIndex].url}</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Button variant={"destructive"} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
