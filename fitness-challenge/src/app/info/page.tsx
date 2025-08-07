import React from "react";
import { ACTIVITY_WEIGHTS, USER_WEEKLY_HOURS } from "../constants/challengeParams";

const groupUsersByHours = (users: Record<string, number>) => {
  const grouped: Record<number, string[]> = {};
  Object.entries(users).forEach(([name, hours]) => {
    if (!grouped[hours]) grouped[hours] = [];
    grouped[hours].push(name);
  });
  return grouped;
};

const InfoPage = () => {
  const groupedUsers = groupUsersByHours(USER_WEEKLY_HOURS);

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 space-y-10">
      <section>
        <h2 className="text-xl font-bold mb-2">ℹ️ Miten kilometrilaskenta toimii?</h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Jokaisella osallistujalla on oma viikoittainen tavoite tunnissa. Kaikki pyrkivät saavuttamaan keskimäärin
          <strong> 16.935 kilometriä viikossa</strong>. Jokaiselle lasketaan henkilökohtainen kerroin kaavalla:
        </p>
        <div className="bg-white p-4 my-3 rounded shadow text-sm sm:text-base">
          <code className="block font-mono text-sm">
            🧮 kilometrit = tunnit × lajin kerroin × henkilökohtainen kilometrikerroin
          </code>
        </div>
        <p className="text-sm sm:text-base leading-relaxed">
          Esimerkiksi jos juokset 2 h viikossa ja henkilökohtainen kertoimesi on 4.23, saat
          <strong> 2 × 1.0 × 4.23 = 8.46 km</strong>.
        </p>
        <p className="text-sm sm:text-base leading-relaxed mt-2">
          Henkilökohtainen kilometrikerroin on laskettu kaavalla:
          <code className="font-mono text-sm"> 16.935 / viikkotavoite (tunteina)</code>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🚴 Osallistujat ja viikoittaiset kertoimet</h2>
        <div className="space-y-4">
          {Object.entries(groupedUsers)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([hours, names]) => {
              const kmPerHour = (16.935 / Number(hours)).toFixed(2);
              return (
                <div key={hours} className="bg-white p-4 rounded shadow text-sm sm:text-base">
                  <p className="font-medium">
                    <strong>{names.join(", ")}</strong> <br />
                    🕒 {hours} h / viikko → 🎯 <strong>{kmPerHour}x km / tunti</strong>
                  </p>
                </div>
              );
            })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🏋️‍♂️ Lajikohtaiset kertoimet</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {Object.entries(ACTIVITY_WEIGHTS).map(([activity, weight]) => (
            <div key={activity} className="bg-white rounded shadow px-3 py-2">
              <strong>{activity}</strong>: {weight}x
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          Kertoimet perustuvat lajin intensiteettiin. Esimerkiksi juoksu = 1.0, golf = 0.25.
        </p>
      </section>
    </div>
  );
};

export default InfoPage;