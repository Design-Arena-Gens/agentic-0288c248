export const metadata = { title: 'Multi Upload Agent', description: 'n8n multi-platform uploader UI' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif', padding: 24, maxWidth: 900, margin: '0 auto' }}>
        {children}
      </body>
    </html>
  );
}
