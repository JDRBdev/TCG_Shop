import { getDictionary } from "../../hooks/dictionaries"
import LegalRenderer from "../../components/organisms/legal-renderer"

export default async function CookiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supportedLangs = ["en", "es", "fr", "de"] as const
  const safeLang = supportedLangs.includes(lang as any) ? (lang as typeof supportedLangs[number]) : "es"
  const dict = await getDictionary(safeLang)

  return <LegalRenderer dict={dict} keyPath="legal.cookies" />
}
