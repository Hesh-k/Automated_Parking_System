const ParkingMap = ({parkingSlots}) => {
  
  return (
    <>
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Parking Map</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                <span className="text-sm text-gray-900">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                <span className="text-sm text-gray-900">Occupied</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid lg:grid-cols-5 sm:grid-cols-4 gap-4">
              {parkingSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className={`h-28 rounded-lg flex items-center justify-center
                      ${slot.slotStatus === "Occupied" ? 'bg-red-300 text-red-900' : 'bg-green-300 text-green-800'}
                    `}
                >
                  <div className="text-center">
                    <div className="font-medium">{slot.slotId}</div>
                    <div className="font-medium">{`section-${slot.slotSection}-row-${slot.slotRow}`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  );
};

export default ParkingMap;