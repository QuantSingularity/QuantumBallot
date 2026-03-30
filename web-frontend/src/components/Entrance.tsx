import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/Container";
import SideBarComponent from "@/components/SidebarComponent";
import { useAuth } from "@/context/AuthContext";
import { loadImages } from "@/services/firebase";
import Login from "./Login";

function Entrance() {
  const { authState, isLoggedIn, setImageList } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn?.();
    if (!authState?.authenticated) {
      navigate("/");
    }

    loadImages(setImageList);
  }, [isLoggedIn, authState?.authenticated, navigate, setImageList]);

  return (
    <div className="flex flex-col gap-2 w-screen h-screen">
      {authState?.authenticated && (
        <div className="flex flex-row">
          <div>
            <SideBarComponent />
          </div>

          <div className="pl-60 w-screen">
            <div className="p-3" style={{ backgroundColor: "#FAFAFA" }}>
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
