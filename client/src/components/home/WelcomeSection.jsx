import { Link } from "react-router-dom";

export default function WelcomeSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-accent font-semibold tracking-widest text-sm uppercase mb-2">
          Welcome To MediCore
        </p>
        <h2 className="text-4xl font-heading font-bold text-primary mb-6">
          A Great Place to Receive Care
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
  At MediCore, we are committed to delivering compassionate, 
  high-quality healthcare to every patient. With a team of experienced 
  specialists, modern facilities, and a patient-first approach, we 
  ensure you receive the best possible care — from routine checkups 
  to complex medical treatments.
</p>
        <Link
          to="/about"
          className="text-accent font-semibold hover:underline inline-flex items-center gap-2"
        >
          Learn More <span>→</span>
        </Link>
      </div>

      {/* Full width image below */}
      <div className="max-w-7xl mx-auto mt-10 rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1400"
          alt="Medical team"
          className="w-full h-72 object-cover object-top"
        />
      </div>
    </section>
  );
}
