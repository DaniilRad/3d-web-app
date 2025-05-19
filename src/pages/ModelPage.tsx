import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

// import io from "socket.io-client";
import { socket } from "@/main";

import { TORUS_COMBINATIONS } from "@/components/utils/Constants";

import Footer from "@/components/model/Footer";
import { TorusLoad } from "@/components/model/TorusLoad";
import { Model } from "@/components/model/Model";
import { Light } from "@/components/model/Light";
import { Header } from "@/components/model/Header";

export default function ModelPage() {
  const cameraRef = useRef<any>(null);

  const [tukeModels, setTukeModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [userModels, setUserModels] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);
  const [activeModelSource, setActiveModelSource] =
    useState<string>("userModels");

  const [currentModelList, setCurrentModelList] = useState<
    { id: string; author: string; url: string; folder: string }[]
  >([]);

  const [textureFolder, setTextureFolder] = useState("grass");
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const switchInterval = 5000;
  const [countdown, setCountdown] = useState(switchInterval / 1000);

  useEffect(() => {
    let modelList =
      activeModelSource === "tuke-models" ? tukeModels : userModels;
    if (currentModelIndex >= modelList.length) {
      setCurrentModelIndex(0);
    }
    setCurrentModelList(modelList);
  }, [activeModelSource, currentModelIndex, tukeModels, userModels]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 15, 0);
      cameraRef.current.fov = 60;
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [cameraRef.current]);

  useEffect(() => {
    socket.on("model_uploaded", (file) => {
      setAutoSwitch(false);

      socket.emit("get_files");
      socket.once("files_list", ({ tukeModels, userModels }) => {
        setTukeModels(tukeModels);
        setUserModels(userModels);
        setLoading(false);

        const newIndex = currentModelList.findIndex((model) => {
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
      setCurrentModelList(modelList);
      setLoading(false);
    });

    return () => {
      socket.off("files_list");
    };
  }, []);

  useEffect(() => {
    if (currentModelList.length > 1 && autoSwitch) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setCurrentModelIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % currentModelList.length;
              return nextIndex;
            });
            return switchInterval / 1000;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentModelList, autoSwitch]);

  useEffect(() => {
    socket.on("camera_update", (data) => {
      if (cameraRef.current) {
        const position = new THREE.Vector3(...data.position);
        cameraRef.current.position.copy(position);

        // Apply rotation
        const rotation = new THREE.Quaternion(...data.rotation);
        cameraRef.current.quaternion.copy(rotation);

        if (data.zoom !== undefined) {
          cameraRef.current.zoom = data.zoom;
          cameraRef.current.updateProjectionMatrix();
        }
      }
    });

    return () => {
      socket.off("camera_update");
    };
  }, []);

  useEffect(() => {
    socket.on("settings_update", (data) => {
      setAutoSwitch(data.autoSwitch);
      setTextureFolder(data.txtrFolder);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

  useEffect(() => {
    socket.on("model_settings_update", (data) => {
      setActiveModelSource(data.activeModelSource);

      const modelList =
        data.activeModelSource === "tuke-models" ? tukeModels : userModels;
      if (data.currentModelIndex >= modelList.length) {
        setCurrentModelIndex(0);
      } else {
        setCurrentModelIndex(data.currentModelIndex);
      }
    });

    return () => {
      socket.off("model_settings_update");
    };
  }, [tukeModels, userModels]);

  useEffect(() => {
    socket.emit("model_switch", currentModelIndex);
    return () => {
      socket.off("model_switch");
    };
  }, [currentModelIndex]);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      {/* <div className="absolute top-[50%] -right-0 z-50 h-20 w-20 bg-amber-300 sm:bg-amber-600 md:bg-amber-900 lg:bg-blue-300 xl:bg-blue-600 2xl:bg-blue-900" /> */}
      <Header
        models={currentModelList}
        currentModelIndex={currentModelIndex}
        autoSwitch={autoSwitch}
        countdown={countdown}
      />
      <div className="z-40 flex-1">
        <Canvas>
          <PerspectiveCamera ref={cameraRef} makeDefault />
          <Light isHelper={false} />
          <Suspense fallback={<TorusLoad colors={TORUS_COMBINATIONS.color1} />}>
            {!loading &&
            currentModelList.length > 0 &&
            currentModelList[currentModelIndex] ? (
              <Model
                url={currentModelList[currentModelIndex].url}
                textureFolder={textureFolder}
              />
            ) : (
              <TorusLoad colors={TORUS_COMBINATIONS.color2} />
            )}
          </Suspense>
        </Canvas>
      </div>
      <Footer />
    </div>
  );
}
