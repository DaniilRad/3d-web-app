import "/src/styles/App.css";
import { Suspense, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { CustomSky } from "@/components/CustomSky";
import { fetchModels } from "@/utils/api";
import { a, useTransition } from "@react-spring/three";

const CHANGE_INTERVAL = 10; // Change model every 10 seconds

// ✅ Preload models before rendering
const preloadModel = (url: string) => {
  useGLTF.preload(url);
};

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const [scale, setScale] = useState(new Vector3(1, 1, 1));
  const [position, setPosition] = useState(new Vector3(0, 0, 0));

  useEffect(() => {
    console.log("Applying model transformations for:", url);

    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 10 / maxDimension;

    const modelBottom = box.min.y * scaleFactor;
    const modelCenterX = (box.min.x + box.max.x) / 2;
    const modelCenterZ = (box.min.z + box.max.z) / 2;

    setScale(new Vector3(scaleFactor, scaleFactor, scaleFactor));
    setPosition(new Vector3(-modelCenterX * scaleFactor, -modelBottom, -modelCenterZ * scaleFactor));
  }, [url, scene]); // ✅ Recalculate scale & position when model changes

  return <primitive object={scene} scale={scale} position={position} />;
};


const StableCamera = () => {
  const { camera, gl, size } = useThree();

  useEffect(() => {
    camera.position.set(15, 8, 15);
    camera.lookAt(0, 5, 0);
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
  }, [camera, gl, size]);

  return null;
};

const ModelPage = () => {
  const [models, setModels] = useState<{ name: string; url: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [nextModel, setNextModel] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const uploadUrl = "http://localhost:5173/#/upload";
  const [countdown, setCountdown] = useState<number>(CHANGE_INTERVAL);

  useEffect(() => {
    const loadModels = async () => {
      const data = await fetchModels();
      setModels(data);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setSelectedModel(data[randomIndex]);

        const nextIndex = (randomIndex + 1) % data.length;
        setNextModel(data[nextIndex]);
        preloadModel(data[nextIndex].url);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (models.length === 0) return;

    const interval = setInterval(() => {
      setSelectedModel(nextModel);

      const currentIndex = models.findIndex(
        (model) => model.url === nextModel?.url
      );
      const nextIndex = (currentIndex + 1) % models.length;
      setNextModel(models[nextIndex]);
      preloadModel(models[nextIndex].url);
      setCountdown(CHANGE_INTERVAL);
    }, CHANGE_INTERVAL * 1000);

    return () => clearInterval(interval);
  }, [models, nextModel]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : CHANGE_INTERVAL));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // ✅ Properly configure useTransition for smooth animations
  const transitions = useTransition(selectedModel, {
    from: {
      position: [0, -2, -10],
      rotation: [0, Math.PI, 0],
      scale: [0.5, 0.5, 0.5],
      opacity: 0,
    },
    enter: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      opacity: 1,
    },
    leave: {
      position: [0, -2, -5],
      rotation: [0, -Math.PI, 0],
      scale: [0, 0, 0],
      opacity: 0,
    },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      {/* Timer Display */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center bg-deepBlack/75 text-mediumGray px-6 py-3 rounded-lg shadow-lg text-xl font-semibold z-50">
        <span className="text-center">Next model in: {countdown}</span>
        <span className="text-center text-neonBlue">{selectedModel?.name}</span>
      </div>
      <img
        className={"absolute inset-0 w-full h-full"}
        src="/vawe.png"
        alt="vawe"
      />

      {/* Main Content */}
      <div className="h-[90vh] w-full">
        <Canvas shadows className="bg-transparent">
          <StableCamera />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={3.0}
            target={[0, 5, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.15}
          />
          <CustomSky />
          <gridHelper args={[50, 50]} position={[0, 0, 0]} />
          <axesHelper args={[5]} />
          <Stage preset={"upfront"} intensity={2} environment={"city"}>
            <Suspense fallback={null}>
              {transitions((props, item) => (
                <a.group
                  position={props.position.to((x, y, z) => [x, y, z])}
                  scale={props.scale.to((x, y, z) => [x, y, z])}
                >
                  {item && <Model key={item.url} url={item.url} />}
                </a.group>
              ))}
            </Suspense>
          </Stage>
        </Canvas>
      </div>

      {/* Footer */}
      <div className="relative w-full h-[10vh] flex justify-center items-center gap-[100px] px-[50px] py-[20px]">
        {/* QR Code Gradient */}
        <div className="relative">
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="qr-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#12C2E9" />
                <stop offset="50%" stopColor="#C471ED" />
                <stop offset="100%" stopColor="#F64F59" />
              </linearGradient>
            </defs>
          </svg>

          <QRCodeSVG
            value={uploadUrl}
            size={80}
            level="H"
            fgColor="url(#qr-gradient)"
            bgColor="transparent"
          />
        </div>
        <span className="w-[65vw] text-sm font-bold text-left">
          Scan the QR code to quickly upload your 3D models directly from your
          device. No complicated steps—just scan, select your file, and upload
          it instantly. Your model will be processed and available for viewing
          in the 3D web app.
        </span>
      </div>
    </div>
  );
};

export default ModelPage;
