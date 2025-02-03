import "../styles/App.css";
import { ThreeDMoveIcon } from "hugeicons-react";
import { Suspense, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { CustomSky } from "@/components/CustomSky";
import { useNavigate } from "react-router";

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);

  const box = new Box3().setFromObject(scene);
  const size = new Vector3();
  box.getSize(size);

  const maxDimension = Math.max(size.x, size.y, size.z);
  const scaleFactor = 10 / maxDimension;
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
  scene.position.set(0, -size.y / 2, 0);

  return <primitive object={scene} />;
};

const ModelPage = () => {
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [awsUrl, setAwsUrl] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setUploadUrl("https://3d-web-app-three.vercel.app//#/upload");
    setAwsUrl("/camel.glb");
  }, []);

  return (
    <div className="relative h-screen w-screen flex flex-col">
      <img
        className={"absolute inset-0 w-full h-full"}
        src="/vawe.png"
        alt="vawe"
      />
      {/* NavBar */}
      <div className="relative w-full flex justify-between items-center px-[50px] py-[28px]">
        <button
          onClick={() => navigate("/")}
          className="group flex flex-row gap-[10px] px-[10px] items-center cursor-pointer rounded-lg relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></span>
          <ThreeDMoveIcon
            className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300 "
            size={48}
          />
          <div className="relative z-10 text-2xl font-bold text-mediumGray group-hover:text-deepBlack transition-all duration-300 group-hover:font-semibold">
            3D Web App
          </div>
        </button>

        <div className="flex gap-[20px] px-[10px]">
          <button className="p-[10px] relative overflow-hidden rounded-xl bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 text-xl transition-all duration-300 group" onClick={() => navigate("/models")}>
            <span className="relative z-10 text-deepBlack">View Models</span>
          </button>
          <button className="p-[10px] relative overflow-hidden rounded-xl bg-transparent text-xl transition-all duration-300 group" onClick={() => navigate("/manage")}>
            <span className="relative z-10 text-mediumGray group-hover:text-deepBlack transition-all duration-300">
              Manage Models
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#12C2E9]/75 via-[#C471ED]/75 to-[#F64F59]/75 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow w-full">
        <Canvas
          shadows
          className="bg-transparent"
          camera={{ near: 0.1, far: 1000, position: [15, 8, 15] }}
        >
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
          <Stage preset={"upfront"} intensity={2} environment={"city"}>
            <Suspense>
              {!awsUrl ? <mesh /> : <Model key={awsUrl} url={awsUrl} />}
            </Suspense>
          </Stage>
        </Canvas>
      </div>

      {/* Footer */}
      <div className="relative w-full h-fit flex justify-center items-center gap-[100px] px-[50px] py-[20px]">
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
