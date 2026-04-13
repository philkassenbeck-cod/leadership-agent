import "./globals.css";

export const metadata = {
  title: "Leadership Agent — StrengthsFinder",
  description: "Debrief individuel et équipe basé sur StrengthsFinder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
