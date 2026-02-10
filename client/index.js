import { registerRootComponent } from "expo";
import { Platform } from "react-native";

import App from "@/App";

if (Platform.OS === "web" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

registerRootComponent(App);
