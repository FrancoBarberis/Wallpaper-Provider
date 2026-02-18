# Wallpaper Provider

Un proveedor de wallpapers listo para usar: **frontend en React + Vite** con **Tailwind CSS**, endpoints serverless en `api/` para exponer catálogos de imágenes y despliegue en **Vercel**.  
Este proyecto se basa en la estructura original del template React + Vite, visible en el repositorio. [1](https://github.com/FrancoBarberis/Wallpaper-Provider)

---

## ✨ Características

- **Catálogo de wallpapers** con imágenes almacenadas en `public/assets/`.  
- **API Serverless** dentro de la carpeta `api/` (compatible con Vercel).  
- **Interfaz rápida** construida con **React + Vite**, que provee recarga en caliente (HMR) y build optimizado. [1](https://github.com/FrancoBarberis/Wallpaper-Provider)  
- **Tailwind CSS** para estilos utilitarios simples y escalables (configurado en `tailwind.config.js`). [1](https://github.com/FrancoBarberis/Wallpaper-Provider)  
- **ESLint** incluido para mantener calidad de código. [1](https://github.com/FrancoBarberis/Wallpaper-Provider)  
- **Despliegue fácil en Vercel**, plataforma optimizada para este tipo de proyectos. [2](https://vercel.com/)

---

## 🚀 Demo / Producción

Si está desplegado, el proyecto se encuentra disponible en:  
**https://wallpaper-provider.vercel.app**  
(Este enlace figura en la sección “About” del repositorio). [1](https://github.com/FrancoBarberis/Wallpaper-Provider)

---

## 🧱 Stack Técnico

- **React + Vite** (configuración y archivos base proporcionados por el template). [1](https://github.com/FrancoBarberis/Wallpaper-Provider)  
- **Tailwind CSS**  
- **ESLint**  
- **Vercel** (deploy + serverless). [2](https://vercel.com/)

---

## 📁 Estructura del Proyecto

```plaintext
Wallpaper-Provider/
├─ api/                # Endpoints serverless (Vercel)
├─ public/
│  └─ assets/          # Imágenes y wallpapers
├─ src/                # Código del frontend (React)
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ eslint.config.js
├─ vercel.json
└─ vite.config.js
