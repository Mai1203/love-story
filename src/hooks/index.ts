import { useEffect, useState } from "react";
import { CountdownData } from "@/types";

export function useCountdown(targetDate: string): CountdownData {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    return {
      targetDate,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [countdown, setCountdown] = useState<CountdownData>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
}

export function useSunflowers() {
  const [sunflowers, setSunflowers] = useState<number[]>([]);

  useEffect(() => {
    setSunflowers(Array.from({ length: 8 }, (_, i) => i));
  }, []);

  return sunflowers;
}

export function useStars() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(
    []
  );

  useEffect(() => {
    setStars(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  return stars;
}