import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRoomSlug,
  isValidParticipantName,
  isValidRoomSlug,
  normalizeParticipantName,
  registerAdminRoom,
  setParticipantName,
} from "@/utils/meetingStorage";
import { APP_NAME } from "@/constants/app";
import "@/styles/meeting.css";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    alt: "Team on a video call",
    position: "center",
  },
  {
    src: "https://media.istockphoto.com/photos/business-team-in-video-conference-picture-id1410142294?b=1&k=20&m=1410142294&s=170667a&w=0&h=l3pHf2oCpdhVWUkSCD8QJMMiO167augTs7T41TY8ZaU=",
    alt: "Business team in video conference",
    position: "center top",
  },
  {
    src: "https://media.istockphoto.com/photos/african-american-customer-woman-talking-to-support-service-employee-picture-id1355302972?b=1&k=20&m=1355302972&s=170667a&w=0&h=Hqyu97HPCdr7P3qu1TfCCVuzWZb5vLtUV7By-bwWzA8=",
    alt: "Customer support video call",
    position: "center",
  },
  {
    src: "https://cdn.pixabay.com/photo/2020/09/25/10/10/education-5600987_960_720.png",
    alt: "Online learning session",
    position: "center",
  },
];

const FEATURES = [
  { icon: "fa-shield-halved", label: "Secure rooms" },
  { icon: "fa-users", label: "60+ participants" },
  { icon: "fa-bolt", label: "Instant join" },
];

export default function CreateMeetingPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const validateName = () => {
    if (!isValidParticipantName(displayName)) {
      setError("Enter your name before continuing (2–40 characters).");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    setError("");
    if (!validateName()) return;

    const slug = createRoomSlug("");
    if (!slug || !isValidRoomSlug(slug)) {
      setError("Could not create a room. Please try again.");
      return;
    }
    setParticipantName(normalizeParticipantName(displayName));
    registerAdminRoom(slug);
    navigate(`/${slug}`);
  };

  const handleJoin = () => {
    setError("");
    if (!validateName()) return;

    const slug = createRoomSlug(joinSlug);
    if (!slug || !isValidRoomSlug(slug)) {
      setError("Enter a valid room ID to join.");
      return;
    }
    setParticipantName(normalizeParticipantName(displayName));
    navigate(`/${slug}`);
  };

  return (
    <div className="landing-shell landing-page h-[100dvh] flex flex-col lg:overflow-hidden">
      <main className="landing-page-body flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="landing-page-inner">
          <div className="landing-brand">
            <div className="app-brand-icon">
              <i className="fa-solid fa-video text-sm" aria-hidden="true" />
            </div>
            <div>
              <span className="app-brand-title text-base block">{APP_NAME}</span>
              <span className="landing-subtitle text-xs">
                Video meetings made simple
              </span>
            </div>
          </div>

          <div className="landing-form-panel">
            <div className="landing-card landing-card--elevated p-5 sm:p-6 lg:p-7">
              <h1 className="landing-title text-2xl sm:text-[1.65rem] font-semibold mb-2 leading-tight">
                Start or join a meeting
              </h1>
              <p className="landing-subtitle text-sm mb-6 leading-relaxed">
                Create a room as admin and collaborate with your team in real time.
              </p>

              <div className="mb-5">
                <label className="landing-label text-sm font-medium block mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g. Alex Johnson"
                  className="landing-input"
                />
              </div>

              <section className="landing-action-block mb-5">
                <div className="landing-action-block__icon">
                  <i className="fa-solid fa-plus" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="landing-label text-sm font-medium mb-1">
                    Create a meeting
                  </h2>
                  <p className="landing-subtitle text-xs mb-3">
                    Room ID is generated automatically. You join as admin here.
                  </p>
                  <button
                    type="button"
                    onClick={handleCreate}
                    className="landing-btn-primary w-full py-2.5 px-4"
                  >
                    <i className="fa-solid fa-video mr-2 text-xs opacity-90" />
                    Create meeting
                  </button>
                </div>
              </section>

              <div className="flex items-center gap-3 my-5">
                <div className="landing-divider flex-1" />
                <span className="landing-divider-label">Or</span>
                <div className="landing-divider flex-1" />
              </div>

              <section className="landing-action-block">
                <div className="landing-action-block__icon landing-action-block__icon--muted">
                  <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="landing-label text-sm font-medium mb-3">
                    Join a meeting
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={joinSlug}
                      onChange={(e) => setJoinSlug(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                      placeholder="abc-def-xyz"
                      className="landing-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleJoin}
                      className="landing-btn-secondary py-2.5 px-5 sm:shrink-0"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </section>

              {error && (
                <p className="landing-error mt-4 text-sm">{error}</p>
              )}
            </div>
          </div>

          <div className="landing-hero-panel">
            <div className="landing-hero-frame">
              {HERO_IMAGES.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  style={{ objectPosition: image.position }}
                  className={`landing-hero-img ${
                    index === activeImage
                      ? "landing-hero-img--active"
                      : "landing-hero-img--idle"
                  }`}
                />
              ))}

              <div className="landing-hero-overlay" />

              <div className="landing-hero-badges">
                {FEATURES.map((f) => (
                  <span key={f.label} className="landing-hero-badge">
                    <i className={`fa-solid ${f.icon}`} aria-hidden="true" />
                    {f.label}
                  </span>
                ))}
              </div>

              <div className="landing-hero-footer">
                <p className="landing-hero-caption">
                  {HERO_IMAGES[activeImage].alt}
                </p>
                <div className="landing-hero-dots">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      aria-current={index === activeImage ? "true" : undefined}
                      onClick={() => setActiveImage(index)}
                      className={`landing-dot ${
                        index === activeImage
                          ? "landing-dot--active"
                          : "landing-dot--idle"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
