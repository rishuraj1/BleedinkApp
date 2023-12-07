import AppNavigation from "./src/navigation";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "./tamagui.config.ts";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={tamaguiConfig}>
        <AppNavigation />
      </TamaguiProvider>
    </QueryClientProvider>
  );
};

export default App;
