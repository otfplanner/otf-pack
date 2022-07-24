import * as coda from "@codahq/packs-sdk";

export const WorkoutTypeSchema = coda.makeObjectSchema({
    properties: {
        id: { type: coda.ValueType.Number },
        displayName: { type: coda.ValueType.String },
        icon: { type: coda.ValueType.String }
    }
});

export const InStudioWorkoutSummarySchema = coda.makeObjectSchema({
    type: coda.ValueType.Object,
    displayProperty: "classType",
    idProperty: "classHistoryUuId",
    properties: {
        classHistoryUuId: { type: coda.ValueType.String },
        dateCreated: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.DateTime,
        },
        dateUpdated: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.DateTime,
        },

        // Class info
        classDate: {
            type: coda.ValueType.String,
            codaType: coda.ValueHintType.DateTime,
        },
        // Dropped classId
        classType: { type: coda.ValueType.String },
        isIntro: { type: coda.ValueType.Boolean },
        isLeader: { type: coda.ValueType.Boolean },
        source: { type: coda.ValueType.String },
        version: { type: coda.ValueType.String },
        workoutType: WorkoutTypeSchema,
        
        // Workout Data
        activeTime: { type: coda.ValueType.Number },
        stepCount: { type: coda.ValueType.Number },
        totalCalories: { type: coda.ValueType.Number },
        minuteByMinuteHr: {
            type: coda.ValueType.Array, 
            items: { type: coda.ValueType.Number },
        },
        avgHr: { type: coda.ValueType.Number },
        maxHr: { type: coda.ValueType.Number },
        avgPercentHr: { type: coda.ValueType.Number },
        maxPercentHr: { type: coda.ValueType.Number },
        totalSplatPoints: { type: coda.ValueType.Number },
        redZoneTimeSecond: { type: coda.ValueType.Number },
        orangeZoneTimeSecond: { type: coda.ValueType.Number },
        greenZoneTimeSecond: { type: coda.ValueType.Number },
        blueZoneTimeSecond: { type: coda.ValueType.Number },
        blackZoneTimeSecond: { type: coda.ValueType.Number },

        // @NOTE: Excluded for privacy reason
        // Dropped memberEmail, memberName, memberPerformanceId, memberUuId

        // Studio Info - Excluded by default, but could be included.
        coach: { type: coda.ValueType.String },
        studioAccountUuId: { type: coda.ValueType.String },
        studioNumber: { type: coda.ValueType.String },
        studioName: { type: coda.ValueType.String },
    }
});

const InStudioWorkoutHeartRateDetailsSchema = coda.makeObjectSchema({
    properties: {
        ClassTime: { type: coda.ValueType.String },
        ClassType: { type: coda.ValueType.String },
        BlackZone: { type: coda.ValueType.Number },
        BlueZone: { type: coda.ValueType.Number },
        GreenZone: { type: coda.ValueType.Number },
        OrangeZone: { type: coda.ValueType.Number },
        RedZone: { type: coda.ValueType.Number },
        Calories: { type: coda.ValueType.Number },
        SplatPoint: { type: coda.ValueType.Number },
        AverageHeartRate: { type: coda.ValueType.Number },
        AverageHeartRatePercent: { type: coda.ValueType.Number },
        MaxHeartRate: { type: coda.ValueType.Number },
        MaxPercentHr: { type: coda.ValueType.Number },
        StepCount: { type: coda.ValueType.Number },
        MinuteByMinuteHeartrate: {
            type: coda.ValueType.Array,
            items: { type: coda.ValueType.Number },
        },
    },
});

const InStudioWorkoutStringUnitValueSchema = coda.makeObjectSchema({
    properties: {
        Value: { type: coda.ValueType.String },
        Unit: { type: coda.ValueType.String },
    },
});

const InStudioWorkoutNumericUnitValueSchema = coda.makeObjectSchema({
    properties: {
        Value: { type: coda.ValueType.Number },
        Unit: { type: coda.ValueType.String },
    },
})

const InStudioWorkoutTreadmillDetailsSchema = coda.makeObjectSchema({
    properties: {
        AvgSpeed: InStudioWorkoutNumericUnitValueSchema,
        MaxSpeed: InStudioWorkoutNumericUnitValueSchema,
        AvgIncline: InStudioWorkoutNumericUnitValueSchema,
        MaxIncline: InStudioWorkoutNumericUnitValueSchema,
        AvgPace: InStudioWorkoutStringUnitValueSchema,
        MaxPace: InStudioWorkoutStringUnitValueSchema,
        TotalDistance: InStudioWorkoutNumericUnitValueSchema,
        // @TODO: Cast this to seconds
        MovingTime: { type: coda.ValueType.String },
        ElevationGained: InStudioWorkoutNumericUnitValueSchema,
    },
});

const InStudioWorkoutRowerDetailsSchema = coda.makeObjectSchema({
    properties: {
        AvgPower: InStudioWorkoutNumericUnitValueSchema,
        MaxPower: InStudioWorkoutNumericUnitValueSchema,
        AvgSpeed: InStudioWorkoutNumericUnitValueSchema,
        MaxSpeed: InStudioWorkoutNumericUnitValueSchema,
        AvgPace: InStudioWorkoutStringUnitValueSchema,
        MaxPace: InStudioWorkoutStringUnitValueSchema,
        AvgCadence: InStudioWorkoutNumericUnitValueSchema,
        MaxCadence: InStudioWorkoutNumericUnitValueSchema,
        TotalDistance: InStudioWorkoutNumericUnitValueSchema,
        // @TODO: Cast this to seconds
        MovingTime: { type: coda.ValueType.String },
    },
});

export const InStudioWorkoutDetailsSchema = coda.makeObjectSchema({
    properties: {
        HeartRateData: InStudioWorkoutHeartRateDetailsSchema,
        TreadmillData: InStudioWorkoutTreadmillDetailsSchema,
        RowerData: InStudioWorkoutRowerDetailsSchema,
    },
});