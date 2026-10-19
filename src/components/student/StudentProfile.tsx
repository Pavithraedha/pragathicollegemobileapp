import React from 'react';
import { User, Phone, MapPin, Building, Bus, ShieldCheck, Mail, LogOut } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const StudentProfile: React.FC = () => {
  const { students, hostelDetails, switchRole } = useCampus();
  const student = students[0];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Profile Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-xs"
          />
          <div>
            <div className="text-[11px] font-mono text-blue-600 font-semibold uppercase">
              Student ID: {student.admissionNo}
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">{student.fullName}</h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Grade {student.grade}-{student.section} · Roll Number: {student.rollNo}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-500 block text-[11px]">Date of Birth</span>
            <span className="font-semibold text-slate-900">{student.dob}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Blood Group</span>
            <span className="font-semibold text-slate-900">{student.bloodGroup}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Academic Year</span>
            <span className="font-semibold text-slate-900">{student.academicYear}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Residential Status</span>
            <span className="font-semibold text-purple-700">Hostel Boarder</span>
          </div>
        </div>
      </div>

      {/* Parent & Emergency Contacts */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Parent & Emergency Contact
        </h3>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Father / Guardian:</span>
            <span className="font-semibold text-slate-900">{student.parentName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Parent Mobile:</span>
            <span className="font-mono font-semibold text-blue-700">{student.parentPhone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Parent Email:</span>
            <span className="font-mono text-slate-700 text-[11px]">{student.parentEmail}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
            <span className="text-slate-500">Emergency Phone:</span>
            <span className="font-mono font-semibold text-red-700">{student.emergencyContact.phone}</span>
          </div>
        </div>
      </div>

      {/* Hostel & Transport Information */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Campus Logistics & Residence
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-950">{hostelDetails.hostelName}</div>
                <div className="text-[11px] text-purple-800">
                  {hostelDetails.roomNo} · {hostelDetails.bedNo} · Warden: {hostelDetails.wardenName}
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
              Assigned
            </span>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bus className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-950">{student.busRoute}</div>
                <div className="text-[11px] text-blue-800">Weekend Transport Eligible</div>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
              Active Pass
            </span>
          </div>
        </div>
      </div>

      {/* Switch to Teacher or Parent / Logout */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Role Switcher & Session
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => switchRole('parent')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 text-center transition-colors"
          >
            Switch to Parent View
          </button>
          <button
            onClick={() => switchRole('teacher')}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 text-center transition-colors"
          >
            Switch to Teacher View
          </button>
        </div>
      </div>
    </div>
  );
};
