export interface OTFMemberSummary {
    totalClassesBooked: number;
    totalClassesAttended: number;
    totalIntro: number;
    totalOTLiveClassesBooked: number;
    totalOTLiveClassesAttended: number;
    totalClassesUsedHRM: number;
    totalStudiosVisited: number;
    firstVisitDate: string;
    lastClassVisitedDate: string;
    lastClassBookedDate: string;
    lastClassStudioVisited: number;
}

export interface OTFInStudioWorkoutSummary {
    classHistoryUuId: string;
    dateCreated: string;
    dateUpdated: string;

    // Class info
    classDate: string;
    // classId: null,  // @NOTE: Not sure what `classId` is. Dropping this for now.
    classType: string;
    isIntro: boolean;
    isLeader: boolean;
    source: string;
    version: string;
    workoutType: OTFWorkoutType;
    
    // Workout Data
    activeTime: number;
    stepCount: number;
    totalCalories: number;
    minuteByMinuteHr: number[];
    avgHr: number;
    maxHr: number;
    avgPercentHr: number;
    maxPercentHr: number;
    totalSplatPoints: number;
    redZoneTimeSecond: number;
    orangeZoneTimeSecond: number;
    greenZoneTimeSecond: number;
    blueZoneTimeSecond: number;
    blackZoneTimeSecond: number;

    // @NOTE: Excluded for privacy reason
    // memberEmail?: string;
    // memberName: string;
    // memberPerformanceId: string;
    // memberUuId: string;

    // Studio Info - Excluded by default, but could be included.
    coach: string;
    studioAccountUuId: string;
    studioNumber: string;
    studioName: string;
}

export interface OTFWorkoutType {
    id: number;
    displayName: string;
    icon?: string;
}

interface OTFInStudioWorkoutDetailsHeartRateData {
    ClassTime: string,
    ClassType: string,
    BlackZone: number;
    BlueZone: number;
    GreenZone: number;
    OrangeZone: number;
    RedZone: number;
    Calories: number;
    SplatPoint: number;
    AverageHeartRate: number;
    AverageHeartRatePercent: number;
    MaxHeartRate: number;
    MaxPercentHr: number;
    StepCount: number;
}

interface OTFInStudioWorkoutStringDataWithUnit {
    Value: number;
    Unit: string;
}

interface OTFInStudioWorkoutNumericDataWithUnit {
    Value: string;
    Unit: string;
}

interface OTFInStudioWorkoutTreadmillDetails {
    AvgSpeed: OTFInStudioWorkoutNumericDataWithUnit;
    MaxSpeed: OTFInStudioWorkoutNumericDataWithUnit;
    AvgIncline: OTFInStudioWorkoutNumericDataWithUnit;
    MaxIncline: OTFInStudioWorkoutNumericDataWithUnit;
    AvgPace: OTFInStudioWorkoutStringDataWithUnit;
    MaxPace: OTFInStudioWorkoutStringDataWithUnit;
    TotalDistance: OTFInStudioWorkoutNumericDataWithUnit;
    // Format: mm:ss
    MovingTime: string;
    ElevationGained: OTFInStudioWorkoutNumericDataWithUnit;
}

interface OTFInStudioWorkoutRowerDetails {
    AvgPower: OTFInStudioWorkoutNumericDataWithUnit;
    MaxPower: OTFInStudioWorkoutNumericDataWithUnit;
    AvgSpeed: OTFInStudioWorkoutNumericDataWithUnit;
    MaxSpeed: OTFInStudioWorkoutNumericDataWithUnit;
    AvgPace: OTFInStudioWorkoutStringDataWithUnit;
    MaxPace: OTFInStudioWorkoutStringDataWithUnit;
    AvgCadence: OTFInStudioWorkoutNumericDataWithUnit;
    MaxCadence: OTFInStudioWorkoutNumericDataWithUnit;
    TotalDistance: OTFInStudioWorkoutNumericDataWithUnit;
    // Format: mm:ss
    MovingTime: string;
}

export interface OTFInStudioWorkoutDetails {
    HeartRateData: OTFInStudioWorkoutDetailsHeartRateData;
    TreadmillData: OTFInStudioWorkoutTreadmillDetails;
    RowerData: OTFInStudioWorkoutRowerDetails
}