import { Link } from "react-router-dom";

export default function HeroBanner({ title, breadcrumbs, bgImage }) {
  return (
    <div
      className="relative w-full h-64 md:h-80 bg-cover bg-center flex items-end"
      style={{
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : "url(https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600)",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-primary/60" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 pb-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i < breadcrumbs.length - 1 ? (
                <>
                  <Link
                    to={crumb.to}
                    className="hover:text-accent transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <span>/</span>
                </>
              ) : (
                <span className="text-white/90">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">
          {title}
        </h1>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
    </div>
  );
}
