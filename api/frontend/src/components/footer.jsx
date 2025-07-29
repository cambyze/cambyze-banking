import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-white/80 backdrop-blur text-[#4A6FA5] py-3 border-t border-[#e3eafc]">
            <div className="container mx-auto text-center text-xs">
                <p>&copy; {new Date().getFullYear()}   {t("Aplication.footer.text")}</p>
            </div>
        </footer>
    );
}