

export default function About() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#e3eafc] via-[#f5f8ff] to-[#c9d6f7] text-gray-800 font-sans transition-colors duration-500">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur shadow-md">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <a href="/" className="flex items-center space-x-3">
                        <img
                            src="/path/to/logo.png" // Remplacez par le chemin de votre logo
                            alt="Cambyze Logo"
                            className="h-12 md:h-16 object-contain drop-shadow"
                        />
                        <span className="text-xl font-semibold tracking-wide text-[#4A6FA5] hidden sm:inline">Cambyze</span>
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="text-center max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 border border-[#e3eafc]">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight text-[#4A6FA5] drop-shadow">À Propos de Cambyze</h2>
                    <p className="text-base md:text-lg text-gray-600 mb-8">
                        Cambyze est une plateforme de services bancaires en ligne qui vous permet de gérer vos finances facilement et en toute sécurité.
                    </p>
                </div>
            </section>
        </div>
    );
}