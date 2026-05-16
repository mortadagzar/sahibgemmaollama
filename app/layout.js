import { Noto_Naskh_Arabic } from 'next/font/google';
import './globals.css';

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-naskh-arabic',
  display: 'swap'
});

export const metadata = {
  title: 'صحبوية | مركز القيادة',
  description: 'الهيكل المرئي RTL لمركز قيادة صحبوية.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={notoNaskhArabic.variable}>
      <body>{children}</body>
    </html>
  );
}
