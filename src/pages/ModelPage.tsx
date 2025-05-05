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
  const [models, setModels] = useState<
    { id: string; author: string; url: string }[]
  >([]);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const switchInterval = 5000;
  const [countdown, setCountdown] = useState(switchInterval / 1000);

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
      socket.once(
        "files_list",
        (modelsList: { id: string; author: string; url: string }[]) => {
          if (modelsList.length > 0) {
            setModels(modelsList);
            setLoading(false);

            const newIndex = modelsList.findIndex((model) => {
              return model.url === file.modelUrl;
            });
            if (newIndex !== -1) {
              setCurrentModelIndex(newIndex);
            }
          }
        },
      );
    });

    return () => {
      socket.off("model_uploaded");
    };
  }, []);

  useEffect(() => {
    socket.emit("get_files");
    socket.on(
      "files_list",
      (modelsList: { id: string; author: string; url: string }[]) => {
        if (modelsList.length > 0) {
          setModels(modelsList);
          setLoading(false);
        }
      },
    );

    return () => {
      socket.off("files_list");
    };
  }, []);

  useEffect(() => {
    if (models.length > 1 && autoSwitch) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setCurrentModelIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % models.length;
              return nextIndex;
            });
            return switchInterval / 1000;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [models, autoSwitch]);

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
      setCurrentModelIndex(data.currentModelIndex);
    });
    return () => {
      socket.off("settings_update");
    };
  }, []);

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
        models={models}
        currentModelIndex={currentModelIndex}
        autoSwitch={autoSwitch}
        countdown={countdown}
      />
      <div className="z-40 flex-1">
        <Canvas>
          <PerspectiveCamera ref={cameraRef} makeDefault />
          <Light isHelper={false} />
          <Suspense fallback={<TorusLoad colors={TORUS_COMBINATIONS.color1} />}>
            {!loading && models.length > 0 ? (
              <Model url={models[currentModelIndex].url} />
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
