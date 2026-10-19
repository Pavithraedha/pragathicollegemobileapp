import React from 'react';
import {
  Building,
  UserCheck,
  Phone,
  Utensils,
  Clock,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';

export const ParentHostel: React.FC = () => {
  const { selectedChild, hostelDetails } = useCampus();

  if (!selectedChild.hostelAllocated) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Building className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Day Scholar Student</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {selectedChild.fullName} is registered as a day scholar and utilizes school transport ({selectedChild.busRoute || 'Bus Route 12'}). No campus boarding hostel room is currently allocated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              <span>Campus Hostel & Boarding Residence</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Secure residential wing accommodation for {selectedChild.fullName}
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg">
            Hostel Fee Cleared
          </span>
        </div>
      </div>

      {/* Room & Warden Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Building className="w-4 h-4 text-purple-600" />
            <span>Room & Block Allocation</span>
          </div>

          <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Residence:</span>
              <span className="font-semibold text-slate-900">{hostelDetails.hostelName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Block Wing:</span>
              <span className="font-semibold text-slate-900">{hostelDetails.block}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Room Number:</span>
              <span className="font-semibold text-purple-900">{hostelDetails.roomNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bed Allocation:</span>
              <span className="font-semibold text-slate-900">{hostelDetails.bedNo}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Warden Administration</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Chief Warden:</span>
              <span className="font-semibold text-slate-900">{hostelDetails.wardenName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-blue-700 font-mono">{hostelDetails.wardenPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">24/7 Security Desk:</span>
              <span className="font-semibold text-slate-800 text-[11px]">{hostelDetails.emergencyWardenContact}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mess and Meal Schedule */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Dining & Mess Timings</span>
          </div>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
            {hostelDetails.messType} Menu
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-slate-500 text-[11px] block">Breakfast</span>
            <span className="font-semibold text-slate-900 mt-1 block font-mono">
              {hostelDetails.mealTimings.breakfast}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-slate-500 text-[11px] block">Lunch</span>
            <span className="font-semibold text-slate-900 mt-1 block font-mono">
              {hostelDetails.mealTimings.lunch}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-slate-500 text-[11px] block">Evening Refreshment</span>
            <span className="font-semibold text-slate-900 mt-1 block font-mono">
              {hostelDetails.mealTimings.snacks}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-slate-500 text-[11px] block">Dinner</span>
            <span className="font-semibold text-slate-900 mt-1 block font-mono">
              {hostelDetails.mealTimings.dinner}
            </span>
          </div>
        </div>
      </div>

      {/* Outpass & Leave History */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Hostel Gate Outpass & Departure History
          </h3>
          <span className="text-[11px] text-slate-400">Electronic Biometric Gate Log</span>
        </div>

        <div className="space-y-2">
          {hostelDetails.outpassHistory.map((op) => (
            <div
              key={op.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-900">{op.destination}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Dep: {op.departureDate} → Ret: {op.returnDate}
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                  op.status === 'Returned'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {op.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
