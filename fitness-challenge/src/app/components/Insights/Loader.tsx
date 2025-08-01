import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
  </div>
);

export default Loader;
