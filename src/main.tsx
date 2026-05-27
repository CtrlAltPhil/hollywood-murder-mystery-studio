import { createRoot } from "react-dom/client";
import "@fontsource/press-start-2p/400.css";
import "@fontsource/limelight/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cinzel/900.css";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
