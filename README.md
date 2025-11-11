# TCG Shop 🎴

[English](#english) | [Español](#español)

---

## English

E-commerce platform for Trading Card Games with multi-language support and modern payment integration.

## 🌟 Features

- **Multi-language Support** (Spanish, English, French, German)
- **Secure Authentication** with Clerk
- **Payment Processing** with Stripe
- **Product Management** with Supabase
- **Responsive Design** with Tailwind CSS
- **SEO Optimized** with Open Graph metadata
- **GDPR Compliant** with cookie consent management
- **Legal Pages** (Privacy Policy, Cookie Policy, Legal Notice)

## 🚀 Local Installation

### Prerequisites

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/JDRBdev/TCG_Shop.git
cd TCG_Shop
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the project root and add the following variables:

```env
# Site configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. **Set up Clerk**

- Create an account at [Clerk](https://clerk.com/)
- Create a new application
- Copy the API keys to your `.env.local` file
- Configure the redirect URLs in the Clerk dashboard

5. **Set up Supabase**

- Create an account at [Supabase](https://supabase.com/)
- Create a new project
- Copy the project URL and anon key to your `.env.local` file
- Create the necessary tables for products and orders

6. **Set up Stripe**

- Create an account at [Stripe](https://stripe.com/)
- Get your API keys from the dashboard
- Configure webhooks for payment events
- Copy the keys to your `.env.local` file

7. **Run the development server**

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

8. **Open in browser**

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## 📁 Project Structure

```
TCG_Shop/
├── app/
│   ├── [lang]/              # Internationalized routes
│   │   ├── layout.tsx       # i18n layout
│   │   ├── page.tsx         # Home page
│   │   ├── productos/       # Products pages
│   │   ├── ofertas/         # Offers page
│   │   ├── torneos/         # Tournaments page
│   │   ├── politica-de-privacidad/    # Privacy policy
│   │   ├── politica-de-cookies/       # Cookie policy
│   │   └── aviso-legal/               # Legal notice
│   ├── api/                 # API routes
│   ├── components/          # React components
│   │   ├── atoms/           # Small components
│   │   ├── molecules/       # Medium components
│   │   └── organisms/       # Large components
│   ├── data/                # Static data
│   ├── dictionaries/        # i18n translations
│   └── interfaces/          # TypeScript interfaces
├── lib/                     # Utility libraries
├── public/                  # Static assets
│   └── images/              # Images
├── middleware.ts            # Next.js middleware
└── next.config.ts           # Next.js configuration
```

## 🌍 Supported Languages

- 🇪🇸 Spanish (`es`)
- 🇬🇧 English (`en`)
- 🇫🇷 French (`fr`)
- 🇩🇪 German (`de`)

## 🛠️ Technologies Used
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [Supabase](https://supabase.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site (e.g. http://localhost:3000) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable (public) key |
| `CLERK_SECRET_KEY` | Clerk secret key (private) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side, keep secret) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable (public) key |
| `STRIPE_SECRET_KEY` | Stripe secret key (private) |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**JDRBdev**

- GitHub: [@JDRBdev](https://github.com/JDRBdev)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting
- All contributors and users of this project

## 📞 Support

If you have any questions or issues, please open an issue in the repository.

---

Made with ❤️ by JDRBdev

---

## Español

Plataforma de e-commerce para juegos de cartas coleccionables con soporte multiidioma e integración de pagos moderna.

## 🌟 Características

- **Soporte Multiidioma** (Español, Inglés, Francés, Alemán)
- **Autenticación Segura** con Clerk
- **Procesamiento de Pagos** con Stripe
- **Gestión de Productos** con Supabase
- **Diseño Responsive** con Tailwind CSS
- **Optimizado para SEO** con metadatos Open Graph
- **Cumplimiento RGPD** con gestión de consentimiento de cookies
- **Páginas Legales** (Política de Privacidad, Política de Cookies, Aviso Legal)

## 🚀 Instalación Local

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/) o [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Pasos de Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/JDRBdev/TCG_Shop.git
cd TCG_Shop
```

2. **Instala las dependencias**

```bash
npm install
# o
pnpm install
# o
yarn install
```

3. **Configura las variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables:

```env
# Configuración del Sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Autenticación Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tu_clave_publica_clerk
CLERK_SECRET_KEY=tu_clave_secreta_clerk

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_clave_publica_stripe
STRIPE_SECRET_KEY=tu_clave_secreta_stripe
```

4. **Configura Clerk**

- Crea una cuenta en [Clerk](https://clerk.com/)
- Crea una nueva aplicación
- Copia las claves API a tu archivo `.env.local`
- Configura las URLs de redirección en el panel de Clerk

5. **Configura Supabase**

- Crea una cuenta en [Supabase](https://supabase.com/)
- Crea un nuevo proyecto
- Copia la URL del proyecto y la clave anónima a tu archivo `.env.local`
- Crea las tablas necesarias para productos y pedidos

6. **Configura Stripe**

- Crea una cuenta en [Stripe](https://stripe.com/)
- Obtén tus claves API desde el panel
- Configura webhooks para eventos de pago
- Copia las claves a tu archivo `.env.local`

7. **Ejecuta el servidor de desarrollo**

```bash
npm run dev
# o
pnpm dev
# o
yarn dev
```

8. **Abre en el navegador**

Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación en funcionamiento.

## 📁 Estructura del Proyecto

```
TCG_Shop/
├── app/
│   ├── [lang]/              # Rutas internacionalizadas
│   │   ├── layout.tsx       # Layout i18n
│   │   ├── page.tsx         # Página de inicio
│   │   ├── productos/       # Páginas de productos
│   │   ├── ofertas/         # Página de ofertas
│   │   ├── torneos/         # Página de torneos
│   │   ├── politica-de-privacidad/    # Política de privacidad
│   │   ├── politica-de-cookies/       # Política de cookies
│   │   └── aviso-legal/               # Aviso legal
│   ├── api/                 # Rutas API
│   ├── components/          # Componentes React
│   │   ├── atoms/           # Componentes pequeños
│   │   ├── molecules/       # Componentes medianos
│   │   └── organisms/       # Componentes grandes
│   ├── data/                # Datos estáticos
│   ├── dictionaries/        # Traducciones i18n
│   └── interfaces/          # Interfaces TypeScript
├── lib/                     # Librerías de utilidad
├── public/                  # Recursos estáticos
│   └── images/              # Imágenes
├── middleware.ts            # Middleware de Next.js
└── next.config.ts           # Configuración de Next.js
```

## 🌍 Idiomas Soportados

- 🇪🇸 Español (`es`)
- 🇬🇧 Inglés (`en`)
- 🇫🇷 Francés (`fr`)
- 🇩🇪 Alemán (`de`)

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Librería UI:** [React](https://reactjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Autenticación:** [Clerk](https://clerk.com/)
- **Base de Datos:** [Supabase](https://supabase.com/)
- **Pagos:** [Stripe](https://stripe.com/)
- **Despliegue:** [Vercel](https://vercel.com/)

## 📝 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linter
npm run lint
```

## 🔒 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | URL pública de tu sitio (p. ej. http://localhost:3000) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clave pública de Clerk |
| `CLERK_SECRET_KEY` | Clave secreta de Clerk |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave Service Role de Supabase (privada) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una rama de características (`git checkout -b feature/CaracteristicaIncreible`)
3. Confirma tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Empuja a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**JDRBdev**

- GitHub: [@JDRBdev](https://github.com/JDRBdev)

## 🙏 Agradecimientos

- Equipo de Next.js por el increíble framework
- Vercel por el hosting
- Todos los colaboradores y usuarios de este proyecto

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.

---

Hecho con ❤️ por JDRBdev
