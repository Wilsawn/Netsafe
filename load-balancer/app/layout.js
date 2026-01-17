export const metadata = {
  title: "SafeNet Load Balancer",
  description: "AI Edge Load Balancer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
