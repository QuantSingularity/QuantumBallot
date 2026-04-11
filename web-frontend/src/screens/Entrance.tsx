import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import SideBarComponent from "@/components/SidebarComponent";
import { useAuth } from "@/context/AuthContext";
import { loadImages } from "@/services/firebase";
import Login from "./Login";

function Entrance() {
  const { authState, isLoggedIn, setImageList } = useAuth();
  const navigate = useNavigate();

  const stableLoadImages = useCallback(() => {
    loadImages(setImageList as any);
  }, [setImageList]);

  useEffect(() => {
    isLoggedIn?.();
    stableLoadImages();
  }, [isLoggedIn, stableLoadImages]);

  useEffect(() => {
    if (authState?.authenticated === false) {
      navigate("/");
    }
  }, [authState?.authenticated, navigate]);

  return (
    <div className="flex flex-col w-screen h-screen">
      {authState?.authenticated && (
        <div className="flex flex-row">
          <SideBarComponent />
          <div className="pl-60 w-full min-h-screen bg-gray-50">
            <div className="p-4">
              <Container />
            </div>
          </div>
        </div>
      )}
      {!authState?.authenticated && <Login />}
    </div>
  );
}

export default Entrance;
