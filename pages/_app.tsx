import "../styles/globals.css";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

// function SafeHydrate({ children }: { children: JSX.Element }) {
//   return (
//     <div suppressHydrationWarning>
//       {typeof window === "undefined" ? null : children}
//     </div>
//   );
// }

const App = ({ Component, pageProps }: AppProps) => {
  return (
    // <SafeHydrate>
    <Component {...pageProps} />
    // </SafeHydrate>
  );
};

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

// export default App;
