import AppNavigation from "./src/navigation";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "./tamagui.config.ts";

const App = () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AppNavigation />
    </TamaguiProvider>
  );
};

export default App;
