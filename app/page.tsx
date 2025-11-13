"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, MessageSquare, BarChart3, Star, Play, Globe, Clock, CheckCircle, ArrowRight, Zap, Target, Heart } from 'lucide-react'
import { useEffect, useState } from "react"
import Image from "next/image"
interface Langue {
  _id: string
  name: string
  levels?: string
  students?: number
  flag?: string
  color?: string
  discount?: number
}
const COLORS = [
  "from-blue-500 to-blue-600",
  "from-red-500 to-red-600",
  "from-yellow-500 to-orange-500",
  "from-green-500 to-green-600",
  "from-purple-500 to-pink-500",
  "from-gray-600 to-gray-700"
]

const getFlagByName = (name: string) => {
  const map: Record<string, string> = {
    Anglais: "🇬🇧",
    Français: "🇫🇷",
    Espagnol: "🇪🇸",
    Allemand: "🇩🇪",
    Italien: "🇮🇹",
    Chinois: "🇨🇳",
  }
  return map[name] || "🏳️"
}

export default function HomePage() {

  const testimonials = [
  {
    name: "Sofia Ben Ali",
    role: "Étudiante en anglais",
    content:
      "Les cours d’anglais m’ont vraiment aidée à améliorer ma prononciation et ma confiance à l’oral. Les professeurs sont passionnés et bienveillants !",
    rating: 5,
    image: "/images/etudiant1.jpg",
  },
  {
    name: "Luca Romano",
    role: "Étudiant en italien",
    content:
      "J’ai adoré la méthode interactive pour apprendre l’italien. C’est motivant et j’ai progressé plus vite que prévu !",
    rating: 4,
    image: "/images/etudiant2.jpg",
  },
  {
    name: "Chen Wei",
    role: "Étudiant en chinois mandarin",
    content:
      "Apprendre le chinois ici a été une expérience incroyable ! Les supports visuels et les activités de groupe rendent tout plus facile.",
    rating: 5,
    image: "/images/etudiant3.jpg",
  },
];


  const stats = [
    { number: "2,500+", label: "Étudiants actifs", icon: Users },
    { number: "150+", label: "Cours disponibles", icon: BookOpen },
    { number: "25+", label: "Formateurs experts", icon: Award },
    { number: "98%", label: "Taux de réussite", icon: Target }
  ]

  const features = [
    {
      icon: Zap,
      title: "Apprentissage accéléré",
      description: "Méthodes innovantes pour progresser rapidement",
      color: "text-yellow-500"
    },
    {
      icon: Globe,
      title: "6 langues disponibles",
      description: "Large choix de formations linguistiques",
      color: "text-blue-500"
    },
    {
      icon: Clock,
      title: "Horaires flexibles",
      description: "Cours adaptés à votre emploi du temps",
      color: "text-green-500"
    },
    {
      icon: Heart,
      title: "Suivi personnalisé",
      description: "Accompagnement individuel de qualité",
      color: "text-red-500"
    }
  ]
 const [languages, setLanguages] = useState<Langue[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLangues = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/langues")
      const data = await res.json()

      const langs = data.langues.map((l: any) => ({
        ...l,
        name: l.name ? l.name.charAt(0).toUpperCase() + l.name.slice(1) : "",
        levels: l.description || "A1 → B2",
        students: l.students || Math.floor(Math.random() * 500),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        discount: l.discount || 0,
        flag: l.flag || getFlagByName(l.name)
      }))

      setLanguages(langs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLangues()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

 


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
               <div className="relative w-12 h-12">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                {/* Logo image */}
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src="/logo.png" // <-- mettre ton image dans /public/logo.png
                    alt="Logo EcoleLangues"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               Polyglotte formation
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#formations" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Formations
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                À propos
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Témoignages
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">

              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6">
                    Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
     <section className="relative overflow-hidden py-20 lg:py-32">
  {/* Image en arrière-plan qui prend tout l'espace */}
  <div className="absolute inset-0">
    <img 
      src="https://www.taalecole.ca/wp-content/uploads/2015/06/Multi-1.jpg" 
      alt="Étudiants" 
      className="w-full h-full object-cover"
      style={{ filter: 'brightness(0.8) saturate(1.2)' }} // image plus nette et colorée
    />
    {/* Overlay subtil pour lisibilité du texte */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-30"></div>
  </div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-semibold text-blue-700 mb-6 tracking-wide shadow-sm">
          Centre de formation de langues 
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          Maîtrisez les{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            langues
          </span>{" "}
          avec excellence
        </h1>
        <p className="text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
          Rejoignez plus de 2,500 étudiants qui ont transformé leur avenir grâce à nos formations linguistiques innovantes et personnalisées.
        </p>

        <div className="flex items-center justify-center lg:justify-start mt-8 space-x-8 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Bienvenue
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Sans engagement
          </div>
        </div>
      </div>

      {/* Éléments décoratifs avec animations subtiles */}
      <div className="relative">
        <div className="absolute -top-8 -right-8 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      </div>
    </div>
  </div>
</section>
 

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
<section className="relative py-20 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
  {/* Image en arrière-plan */}
  <div className="absolute inset-0 -z-10">
    <img
      src="/images/langues-flou.jpg"
      alt="Arrière-plan langues"
      className="w-full h-full object-cover opacity-30 filter blur-xl"
    />
  </div>

  {/* Contenu de la section */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Pourquoi choisir Polyglotte formation ?
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Une approche moderne et personnalisée pour un apprentissage efficace et durable
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
        >
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl mb-6">
              <feature.icon className={`h-8 w-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>



      {/* Languages Section */}
      <section id="formations" className="relative py-20 bg-white overflow-hidden">



  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Nos formations linguistiques
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Découvrez notre large gamme de cours adaptés à tous les niveaux, du débutant à l'expert
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {languages.map((language, index) => (
        <Card
          key={language._id || index}
          className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden"
        >
          <div className={`h-2 bg-gradient-to-r ${language.color}`}></div>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">
                {language.flag?.startsWith("http") ? (
                  <img src={language.flag} alt="flag" className="w-10 h-10" />
                ) : (
                  <span>{language.flag}</span>
                )}
              </div>

              <div className="flex flex-col items-end space-y-1">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                  {language.students && language.students > 0 ? `${language.students} étudiants` : ''}
                </Badge>

                <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0">
                  {language.discount && language.discount > 0 ? `-${language.discount}%` : ''}
                </Badge>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">{language.name}</h3>
            <p className="text-gray-600 mb-4">Niveaux disponibles: {language.levels}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                Flexible
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>


      {/* Video/Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Découvrez notre centre en vidéo
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Plongez dans l'univers Polyglotte formation et découvrez nos méthodes d'enseignement innovantes, nos espaces modernes et l'ambiance chaleureuse qui règne dans notre centre.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Salles de classe modernes et équipées</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Méthodes pédagogiques interactives</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  <span className="text-lg">Ambiance conviviale et motivante</span>
                </div>
              </div>
            </div>
          <div className="relative">
  <div className="relative bg-gradient-to-br from-blue-800 to-purple-800 rounded-2xl p-8 shadow-2xl">
    <div className="aspect-video bg-black/20 rounded-xl overflow-hidden mb-6">
      <video
        className="w-full h-full object-cover rounded-xl"
        controls
        autoPlay
        muted
        loop
      >
        <source src="/videos/centre-visite.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    </div>
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-2"></h3>
      <p className="text-blue-100"></p>
    </div>
  </div>

  <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
</div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos étudiants
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les témoignages de ceux qui ont réussi leur parcours linguistique avec nous
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Prêt à commencer votre aventure linguistique ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Rejoignez des milliers d'étudiants qui ont déjà transformé leur avenir.
            Commencez dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          </div>
        </div>
      </section>


<section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Contactez-nous
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Vous pouvez nous joindre par téléphone, email ou en visitant notre centre.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Carte */}
      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <iframe
          title="Localisation"
          className="w-full h-full"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195309280187!2d10.761887515314872!3d35.77736678015783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd35e5f9a8f1b5%3A0x123456789abcdef!2sMonastir%2C%20Tunisie!5e0!3m2!1sfr!2s!4v1700000000000!5m2!1sfr!2s"
allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Informations et formulaire */}
      <div className="flex flex-col justify-center">
        {/* Infos */}
        <div className="mb-8 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900">Nos coordonnées</h3>
          <p className="text-gray-700"><strong>Adresse:</strong> 123 Rue de l’Éducation, Monastir, Tunisie</p>
          <p className="text-gray-700"><strong>Téléphone:</strong> +216 29 838 868</p>
          <p className="text-gray-700"><strong>Email:</strong> contact@centrelinguistique.tn</p>
        </div>

        {/* Formulaire */}
      
      </div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold">Polyglotte Formation</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Votre partenaire de confiance pour l'apprentissage des langues.
                Excellence pédagogique et innovation technologique au service de votre réussite.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Formations</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Anglais</li>
                <li className="hover:text-white transition-colors cursor-pointer">Français</li>
                <li className="hover:text-white transition-colors cursor-pointer">Espagnol</li>
                <li className="hover:text-white transition-colors cursor-pointer">Allemand</li>
                <li className="hover:text-white transition-colors cursor-pointer">Italien</li>
                <li className="hover:text-white transition-colors cursor-pointer">Chinois</li>
              </ul>
            </div>
            <div>
             
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 Polyglotte formation. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Politique de confidentialité
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Conditions d'utilisation
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
