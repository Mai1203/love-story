"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Letter from "@/components/Letter";
import Map from "@/components/Map";
import Gallery from "@/components/Gallery";
import Stars from "@/components/Stars";
import Secrets from "@/components/Secrets";
import Memories from "@/components/Memories";
import Countdown from "@/components/Countdown";
import FinalSection from "@/components/FinalSection";
import AudioPlayer from "@/components/AudioPlayer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main > section");
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.6, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 25%",
              scrub: 0.6,
            },
          }
        );
      });

      const cards = gsap.utils.toArray<HTMLElement>("section .group, section .backdrop-blur");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.96 },
          {
            scale: 1,
            duration: 0.8,
            ease: "power1.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative bg-bg-primary">
      <Hero />
      <Timeline />
      <Letter />
      <Map />
      <Gallery />
      <Stars />
      <Secrets />
      <Memories />
      <Countdown />
      <FinalSection />
      <AudioPlayer />
    </main>
  );
}