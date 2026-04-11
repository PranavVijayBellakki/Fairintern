import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, IndianRupee, ArrowUpRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface InternshipCardProps {
  id: string;
  role: string;
  company: string;
  stipend: string;
  className?: string;
}

export function InternshipCard({ id, role, company, stipend, className }: InternshipCardProps) {
  return (
    <Link 
      to={`/internships/${id}`}
      className={cn(
        "block relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 overflow-hidden group",
        "hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:-translate-y-2 hover:border-indigo-400/50",
        className
      )}
    >
      {/* Glossy top highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-primary-300 transition-colors flex items-center gap-2">
            {role}
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
          </h3>
          <div className="flex items-center text-slate-300 text-sm gap-5 font-medium">
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400" /> {company}</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-primary-400" /> {stipend}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
