import { type AppType } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { api } from "@/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="">
      <Toaster />
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
