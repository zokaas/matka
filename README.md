# matka

        {/* Behind Target - Completely Different Design */}
        {behindAmount > 0 && (
          <div className="mt-2.5 rounded-lg overflow-hidden border border-gray-100">
            {/* Target Status Card */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-500 rounded-full p-1.5 mr-3">
                  <ArrowDownRight className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium">Tavoiteseuranta</h3>
              </div>
              
              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Progress */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white/70 text-xs mb-1">Nykyinen</p>
                  <p className="text-white font-bold text-xl">{formattedTotalProgress}</p>
                  <p className="text-white/70 text-xs">kilometriä</p>
                </div>
                
                {/* Target */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white/70 text-xs mb-1">Tavoite</p>
                  <p className="text-white font-bold text-xl">{formattedExpectedProgress}</p>
                  <p className="text-white/70 text-xs">kilometriä</p>
                </div>
              </div>
              
              {/* Behind Amount */}
              <div className="mt-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/70 text-xs">Tavoitteesta jäljessä</p>
                    <p className="text-white font-bold text-2xl">{formattedBehindAmount} km</p>
                  </div>
                  
                  <div className="bg-red-500 h-12 w-12 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {Math.round((behindAmount / expectedProgressToday) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}