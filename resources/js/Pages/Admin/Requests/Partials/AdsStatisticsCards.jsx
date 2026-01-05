import { ClipboardList, Tv, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import AdsChart from "./AdsChart";
export default function AdsStatisticsCard({ state }) {
  return (
    <>
      <div
        className="
              grid grid-cols-1 md:grid-cols-3 gap-6 mb-6
              "
      >
        {/* Stats */}
        <motion.div
          whileHover={{ y: -10 }}
          className="
                  md:col-span-1 flex bg-gradient-to-br
                  from-[#001246] via-[#001b66] to-[#002a80]
                  rounded-[2.5rem] shadow-2xl shadow-blue-900/30
               text-white relative overflow-hidden group
                  cursor-pointer
                  "
        >
          <div
            className="
                        rounded-3xl
                        p-6
                        flex flex-row md:flex-col
                        justify-between
                        relative
                        w-full
                        text-center
                        "
          >
            <div
              className="
                      flex items-center gap-4
                      flex-col md:flex-row
                      text-center md:text-rightl"
            >
              <div className="p-3 rounded-xl">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-white/40 text-sm mb-1">
                {" "}
                عدد الإعلانات المسجلة بالنظام
              </p>
            </div>
            <p
              className="
                      text-4xl md:text-6xl lg:text-8xl
                      font-black tracking-tighter italic
                      text-center
                      md:absolute md:left-0 md:right-0 md:top-1/2 md:-translate-y-1/2"
              style={{ alignSelf: "center" }}
            >
              {state.total || 0}
            </p>
          </div>
          <Tv
            size={150}
            className="absolute -bottom-3 -left-2 text-white/5 -rotate-10 transition-transform group-hover:scale-110"
          />
        </motion.div>

        {/* Chart */}
        <div className="lg:col-span-2 md:col-span-2 ">
          {/* chart card here */}
          <div className="bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 ">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-black text-gray-800 text-sm">
                  توزيع حالات الطلبات
                </h3>
              </div>
            </div>

            {/* Chart */}
            <div className="relative flex-1 min-h-[260px] ">
              <AdsChart state={state} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
