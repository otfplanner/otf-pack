import * as coda from "@codahq/packs-sdk";
import { ExecutionContext } from "@codahq/packs-sdk";
import { InStudioWorkoutDetailsSchema, InStudioWorkoutSummarySchema } from "./schemas";
import { OTFInStudioWorkoutSummary, OTFMemberSummary, OTFInStudioWorkoutDetails } from "./types";

export const pack = coda.newPack();


const CacheTtlSecs = 300;  // Set cache timeout to be 5 minutes
const LongCacheTtlSecs = 3600;  // API calls that will not be changed.

// Allow the Pack to Orangetheory endpoint
pack.addNetworkDomain("orangetheory.co");
const OTFInStudioWorkoutSummariesUrl = "https://api.orangetheory.co/virtual-class/in-studio-workouts";
const OTFInStudioWorkoutDetailsUrl = "https://performance.orangetheory.co/v2.4/member/workout/summary";


const DataTransformer = {
    formatInStudioWorkoutSummary: (inStudioWorkout: any, shouldShowStudioInfo: boolean): OTFInStudioWorkoutSummary => {
        const workoutData = {
            ...inStudioWorkout,
            classDate: inStudioWorkout.classDate,
            dateCreated: inStudioWorkout.dateCreated,
            dateUpdated: inStudioWorkout.dateUpdated,
            minuteByMinuteHr: JSON.parse(inStudioWorkout.minuteByMinuteHr),
        };

        // Null'ed out personal data
        delete workoutData.memberEmail;
        delete workoutData.memberName;
        delete workoutData.memberUuId;
        delete workoutData.memberPerformanceId;

        // Null out studio info (for privacy reason)
        if (!shouldShowStudioInfo) {
            delete workoutData.coach;
            delete workoutData.studioNumber;
            delete workoutData.studioName;
            delete workoutData.studioAccountUuId;
        }

        return workoutData;
    }
}

const OtfApiClient = {
    getEndpointHeaders: (idToken: string) => {
        return {
            "content-type": "application/json",
            "authorization": idToken,
            "Connection": "keep-alive",
            "accept": "appliction/json",
            "accept-language": "en-US,en;q=0.9",
            "origin": "https://otlive.orangetheory.com",
            "referer": "https://otlive.orangetheory.com",
            "sec-ch-ua": '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
            "sec-ch-ua-platform": '"macOS"',
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
        }
    },

    fetchMemberSummary: async (idToken: string, memberUuid: string, context: ExecutionContext): Promise<OTFMemberSummary> => {
        const summaryUrl = `https://api.orangetheory.co/member/members/${memberUuid}?include=memberClassSummary`;
        const response = await context.fetcher.fetch({
            url: summaryUrl,
            method: "GET",
            headers: OtfApiClient.getEndpointHeaders(idToken),
            cacheTtlSecs: CacheTtlSecs
        });

        return response.body?.data?.memberClassSummary;
    },

    fetchInStudioWorkoutSummaries: async (idToken: string, showStudioInfo: boolean = false, context: ExecutionContext): Promise<OTFInStudioWorkoutSummary[]> => {
        const response = await context.fetcher.fetch({
            url: OTFInStudioWorkoutSummariesUrl,
            method: "GET",
            headers: OtfApiClient.getEndpointHeaders(idToken),
            cacheTtlSecs: CacheTtlSecs
        });

        return response.body?.data.map(data => DataTransformer.formatInStudioWorkoutSummary(data, showStudioInfo));
    },

    fetchInStudioWorkoutHeartrateByMinute: async (idToken: string, classHistoryUuid: string, context: ExecutionContext): Promise<number[] | undefined> => {
        const workouts = (await OtfApiClient.fetchInStudioWorkoutSummaries(idToken, false, context)).filter(workout => workout.classHistoryUuId === classHistoryUuid);
        
        if (workouts.length === 0) {
            return undefined;
        }

        return workouts[0].minuteByMinuteHr;
    },

    fetchInStudioWorkoutDetails: async (idToken: string, memberUuid: string, classHistoryUuid: string, context: ExecutionContext): Promise<OTFInStudioWorkoutDetails> => {
        const response = await context.fetcher.fetch({
            url: OTFInStudioWorkoutDetailsUrl,
            method: "POST",
            headers: OtfApiClient.getEndpointHeaders(idToken),
            body: JSON.stringify({
                "ClassHistoryUUID": classHistoryUuid,
                "MemberUUId": memberUuid,
            }),
            // @NOTE: Likelihood of specific workout summary to change is low.
            cacheTtlSecs: LongCacheTtlSecs
        });

        return response.body;
    }
}

// Formula to fetch total classes attended
pack.addFormula({
    name: "GetTotalClassesAttended",
    description: "Get total number of classes you have taken.",
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "idToken",
            description: "API token to connect to Orangetheory API endpoint.",
        }),
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "memberUuid",
            description: "Orangetheory Member Unique ID",
        }),
    ],
    resultType: coda.ValueType.Number,
    execute: async function ([idToken, memberUuid], context) {
        return (await OtfApiClient.fetchMemberSummary(idToken, memberUuid, context)).totalClassesAttended;
    },
});

pack.addFormula({
    name: "GetTotalStudiosVisited",
    description: "Get total number of studies you've visited.",
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "idToken",
            description: "API token to connect to Orangetheory API endpoint.",
        }),
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "memberUuid",
            description: "Orangetheory Member Unique ID",
        }),
    ],
    resultType: coda.ValueType.Number,
    execute: async function ([idToken, memberUuid], context) {
        return (await OtfApiClient.fetchMemberSummary(idToken, memberUuid, context)).totalStudiosVisited;
    },
});

pack.addFormula({
    name: "GetLastInStudioClassSummary",
    description: "Get workout summary from the last in-studio class you've attended.",
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "idToken",
            description: "API token to connect to Orangetheory API endpoint.",
        }),
        coda.makeParameter({
            type: coda.ParameterType.Boolean,
            name: "Show studio info",
            description: "Default to False. If True, studio info will be included in the output.",
            suggestedValue: false,
        }),
    ],
    resultType: coda.ValueType.Object,
    schema: InStudioWorkoutSummarySchema,
    execute: async function ([idToken, shouldShowStudioInfo], context) {
        const inStudioWorkoutSummaries = await OtfApiClient.fetchInStudioWorkoutSummaries(idToken, shouldShowStudioInfo, context);
        return inStudioWorkoutSummaries[0];
    }
});

pack.addFormula({
    name: "GetInStudioWorkoutDetails",
    description: "Get workout details from an in-studio class.",
    parameters: [
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "idToken",
            description: "API token to connect to Orangetheory API endpoint.",
        }),
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "memberUuid",
            description: "Orangetheory Member Unique ID",
        }),
        coda.makeParameter({
            type: coda.ParameterType.String,
            name: "classHistoryUuid",
            description: "Class history UUID, obtained from workout summaries.",
        }),
    ],
    resultType: coda.ValueType.Object,
    schema: InStudioWorkoutDetailsSchema,
    execute: async function ([idToken, memberUuid, classHistoryUuId], context) {
        const workoutDetails: any = await OtfApiClient.fetchInStudioWorkoutDetails(idToken, memberUuid, classHistoryUuId, context);
        // @NOTE: Workout details call doesn't come with minute-by-minute heartrate.
        workoutDetails.HeartRateData.MinuteByMinuteHeartrate = await OtfApiClient.fetchInStudioWorkoutHeartrateByMinute(idToken, classHistoryUuId, context);

        return workoutDetails;
    }
});

pack.addSyncTable({
    name: "WorkoutSummaries",
    schema: InStudioWorkoutSummarySchema,
    identityName: "WorkoutSummary",
    formula: {
        name: "SyncWorkoutSummaries",
        description: "Retrieve all in-studio workout summary.",
        parameters: [
            coda.makeParameter({
                type: coda.ParameterType.String,
                name: "idToken",
                description: "API token to connect to Orangetheory API endpoint.",
            }),
            coda.makeParameter({
                type: coda.ParameterType.Boolean,
                name: "Show studio info",
                description: "Default to False. If True, studio info will be included in the output.",
                suggestedValue: false,
            }),
        ],
        execute: async function([idToken, memberUuid, shouldShowStudioInfo], context) {
            const workoutSummaries = await OtfApiClient.fetchInStudioWorkoutSummaries(idToken, shouldShowStudioInfo, context);
            return {
                result: workoutSummaries
            };
        },
    },
});