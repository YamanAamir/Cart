// src/components/home/TrustBadgesSection.jsx
"use client";

import { useEffect, useState } from "react";
import TrustBadge from "../common/TrustBadge";
import { BASE_API } from "../../utils/api";

// const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

export default function TrustBadgesSection() {
  const [statsCards, setStatsCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatsCards = async () => {
      try {
        const res = await fetch(`${BASE_API}/website/stats-cards`, {
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json();

        // ✅ handle API shape safely
        if (Array.isArray(json.data)) {
          setStatsCards(json.data);
        } else if (Array.isArray(json)) {
          setStatsCards(json);
        } else {
          setStatsCards([]);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
        setStatsCards([]);
      } finally {
        setLoading(false);
      }
    };

    getStatsCards();
  }, []);

  if (loading) {
    return null; // or skeleton / spinner
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statsCards.map((item) => (
            <TrustBadge
              key={item.id}
              title={item.title}
              value={item.value}
              link={item.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
