import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

type CuesDataType = {
  id?: string | null;
  color?: string;
  content?: string;
  iconColor?: string;
  initquery?: string;
  match_score?: string;
  matched_query?: string;
  query?: string[];
  raw_modded_query?: string;
  sessionid?: string;
  similarity_query?: string;
  loading?: boolean;
  audiourl?: string;
  imageUrl?: string;
  common_id?: string;
  type?: string;
  audiofiletimestamp?: string;
  iconName?: string;
  value?: string;
  radio?: string;
  label?: string;
  replies?: string[];
  answer_quality?: string;
  isanswered: boolean;
};

let initialCuesObj: CuesDataType = {
  id: null,
  color: "#7D11E9",
  content: "",
  iconColor: "blue",
  initquery: " ",
  match_score: "0",
  matched_query: " ",
  query: [" "],
  raw_modded_query: " ",
  sessionid: "xyz",
  similarity_query: " ",
  loading: false,
  audiourl: "",
  imageUrl: "",
  common_id: "",
  type: "TextMsg",
  audiofiletimestamp: "",
  iconName: "",
  value: "",
  radio: "",
  label: "",
  replies: [],
  answer_quality: "",
  isanswered: false,
};

// Define the initial state for the Cues
type CuesState = {
  CuesList: Array<CuesDataType>;
  jobDescription: string;
  interviewGuide: string;
  jobTitle: string;
};

// let initialCuesLoadState: CuesState = {
//   jobTitle: "",
//   jobDescription: "",
//   interviewGuide: "",
//   CuesList: []
// };

let initialCuesState={
  CuesList: [],
  jobDescription: '',
  interviewGuide: '',
  jobTitle: ""
}

let initialCuesLoadState: CuesState = {
  jobTitle: "EDI Developer",
  jobDescription: "https://arxiv.org/pdf/2301.12652", //pdf
  interviewGuide: "https://arxiv.org/pdf/2410.08174", //pdf
  CuesList: [
    // {
    //   content: "Yes, you can configure asset-specific risk parameters under the 'Custom Risk Rules' section in the admin console. The setup typically requires defining factor models and setting exposure limits. Here’s a quick reference guide: <a style='text-decoration:underline; color:blue;'>Open Configuration Steps</a>.",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Can we configure the system to include custom risk parameters for different asset classes?",
    //   isanswered: true,
    // },
    // {
    //   content: "Yes, the system supports scheduled reporting automation via API and pre-configured templates. You can set up rule-based triggers to generate and distribute monthly reports to stakeholders. Would you like to see a template example? <a style='text-decoration:underline; color:blue;'>Show Report Template </a>.",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Can we automate monthly reporting for performance and exposure tracking?",
    //   isanswered: true,
    // },{
    //   content: "Yes, Aladdin has native integrations with Bloomberg, Reuters, and ICE. API configurations allow direct data ingestion. Here’s an overview of the integration architecture: <a style='text-decoration:underline; color:blue;'>Show Integration Diagram</a>.",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Can we integrate the system with Bloomberg and other market data providers?",
    //   isanswered: true,
    // },
    {
      content: `
        <strong>Action Items:</strong><br/><br/>1. 
        <strong>Consultant:</strong> 
        Provide a configuration document for risk parameter customization – 
        <strong>Due: Feb 7</strong><br/>2. <strong>
        Client Tech Team:</strong> 
        Share API specifications for Bloomberg integration – 
        <strong>Due: Feb 8</strong>
        <br/>3. 
        <strong>Consultant:</strong> 
        Validate compliance requirements for SEC & ESMA standards – <strong>
        Due: Feb 10</strong><br/>4. <strong>Client Business Team:</strong>
         Approve automated reporting workflow – <strong>Due: Feb 12</strong>
         </br><br/>
         <strong>Next Steps:</strong> 
         Follow-up scheduled for 
         <strong>Feb 14, 2024,</strong> 
         to review progress.
         <br/>`,
      sessionid: "1",
      audiofiletimestamp: "2022-01-01T00:00:00Z",
      common_id: "1",
      similarity_query: "Meeting Summary & Action Items – Call with ABC Asset Management",
      isanswered: true,
    },
    {
      content: `<strong>Changes Required in Implementation Checklist</strong>
              <br/><br/>
              <strong>Section: Portfolio Risk Parameter Configuration</strong>
              <br/>
              <strong>Add:</strong> Custom threshold settings for risk scoring models.
              <br/>
              <strong>Modify:</strong> 
              Default parameter values for alternative asset classes.
              <br/>
              <strong>Remove:</strong> 
              Unused predefined thresholds for standardized portfolios.
              <br/><br/>
              <strong>Section: API Integration & Market Data Feeds</strong>
              <br/>
              <strong>Add:</strong> 
              Bloomberg API integration module.
              <br/>
              <strong>Modify:</strong> 
              Scheduled data refresh frequency from weekly to daily.
              <br/><br/>
              <strong>Section: Compliance & Regulatory Updates</strong>
              <br/>
              <strong>Add:</strong> 
              Automated audit logging per 
              <strong>SEC 17a-4 compliance requirements.</strong>
              <br/><strong>Modify:</strong> 
              Encryption settings for data at rest per <strong>
              ESMA guidelines.
              </strong>
              <br/>`,
      sessionid: "1",
      audiofiletimestamp: "2022-01-01T00:00:00Z",
      common_id: "2",
      similarity_query: "Changes Required in Implementation Checklist",
      isanswered: true,
    },
    // {
    //   content: `<strong>AI Navigator:</strong> 
    //    Sure! Here’s the latest project status breakdown.
    //   <br/>
    //   <strong>Active Projects: 42</strong> 
    //    (+12% increase from last month), 
    //    <strong>Avg. Completion Time: 28 days, On-Time Delivery Rate: 94% ✅</strong> 
       
    //    <div style="text-align: left;">
    //    <img src="./graph1.png" style="height:250px;width:80%;object-fit: contain;"/>
    //    </div> 
    //    <br/>
      
    //    Would you like me to highlight any specific project?
    //   `,
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "give me a quick update on project progress?",
    //   isanswered: true,

    // },
    // {
    //   content: `<strong>AI Navigator:</strong> 

    //    John is a 130% workload capacity, at risk of burnout. Alex who is at 50% workload and available for new assignments. Sarah’s workload is optimum at 50% capacity.
      
    //   <div style="text-align: left;">
    //   <img src="./graph2.png" style="height:250px;width:80%;object-fit: contain;"/>
    //   </div>
    //   `,
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "How’s the workload on the team?",
    //   isanswered: true,

    // },
    // {
    //   content: `<strong>AI Navigator: Testing for Client ABC Investment Group starts on February 20, 2024. However, two configuration tasks are still pending, which may impact the start date. Dependencies Identified: Pending API validation</strong> 

    //   for risk model integration
    //   <br/>`,
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "When is testing starting for ABC",
    //   isanswered: true,

    // },
    // {
    //   content: "",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Ask about specific EDI protocols experience",
    //   isanswered: true,
    // },
    // {
    //   content: "",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "Discuss experience with mapping tools",
    //   isanswered: false,
    // },
    // {
    //   content: "",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "3",
    //   similarity_query: "Probe cloud integration knowledge",
    //   isanswered: false,
    // },
    // {
    //   content: "<strong>Date:</strong> February 5, 2024 | 🕒 <strong>Time:</strong> 10:00 AM - 11:00 AM <br/><strong>Participants:</strong> [Consultant Name], [Client Business Lead], [Client Tech Team]<br/><strong>Key Discussion Points:</strong><br/><br/>• Custom risk parameter configurations for different asset classes.<br/>• API integration for real-time data feed from Bloomberg.<br/>• Compliance validation for SEC and ESMA guidelines.<br/>• Automated reporting setup for performance tracking.<br/><br/><strong>Action Items:</strong><br/><br/>1. <strong>Consultant:</strong> Provide a configuration document for risk parameter customization – <strong>Due: Feb 7</strong><br/>2. <strong>Client Tech Team:</strong> Share API specifications for Bloomberg integration – <strong>Due: Feb 8</strong><br/>3. <strong>Consultant:</strong> Validate compliance requirements for SEC & ESMA standards – <strong>Due: Feb 10</strong><br/>4. <strong>Client Business Team:</strong> Approve automated reporting workflow – <strong>Due: Feb 12</strong></br><br/><strong>Next Steps:</strong> Follow-up scheduled for <strong>Feb 14, 2024,</strong> to review progress.<br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Meeting Summary & Action Items – Call with ABC Asset Management",
    //   isanswered: true,
    // },
    // {
    //   content: "<strong>Aladdin Tech Stack Implementation Checklist – Updated Based on Client Meeting</strong><br/><br/><strong>Section: Portfolio Risk Parameter Configuration</strong><br/><strong>Add:</strong> Custom threshold settings for risk scoring models.<br/><strong>Modify:</strong> Default parameter values for alternative asset classes.<br/><strong>Remove:</strong> Unused predefined thresholds for standardized portfolios.<br/><br/><strong>Section: API Integration & Market Data Feeds</strong><br/><strong>Add:</strong> Bloomberg API integration module.<br/><strong>Modify:</strong> Scheduled data refresh frequency from weekly to daily.<br/><br/><strong>Section: Compliance & Regulatory Updates</strong><br/><strong>Add:</strong> Automated audit logging per <strong>SEC 17a-4 compliance requirements.</strong><br/><strong>Modify:</strong> Encryption settings for data at rest per <strong>ESMA guidelines.</strong><br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "Changes Required in Implementation Checklist",
    //   isanswered: true,
    // },
    // {
    //   content: "<strong>Date:</strong> February 5, 2024 | 🕒 <strong>Time:</strong> 10:00 AM - 11:00 AM <br/><strong>Participants:</strong> [Consultant Name], [Client Business Lead], [Client Tech Team]<br/><strong>Key Discussion Points:</strong><br/><br/>• Custom risk parameter configurations for different asset classes.<br/>• API integration for real-time data feed from Bloomberg.<br/>• Compliance validation for SEC and ESMA guidelines.<br/>• Automated reporting setup for performance tracking.<br/><br/><strong>Action Items:</strong><br/><br/>1. <strong>Consultant:</strong> Provide a configuration document for risk parameter customization – <strong>Due: Feb 7</strong><br/>2. <strong>Client Tech Team:</strong> Share API specifications for Bloomberg integration – <strong>Due: Feb 8</strong><br/>3. <strong>Consultant:</strong> Validate compliance requirements for SEC & ESMA standards – <strong>Due: Feb 10</strong><br/>4. <strong>Client Business Team:</strong> Approve automated reporting workflow – <strong>Due: Feb 12</strong></br><br/><strong>Next Steps:</strong> Follow-up scheduled for <strong>Feb 14, 2024,</strong> to review progress.<br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Meeting Summary & Action Items – Call with ABC Asset Management",
    //   isanswered: true,
    // },
    // {
    //   content: "<strong>Aladdin Tech Stack Implementation Checklist – Updated Based on Client Meeting</strong><br/><br/><strong>Section: Portfolio Risk Parameter Configuration</strong><br/><strong>Add:</strong> Custom threshold settings for risk scoring models.<br/><strong>Modify:</strong> Default parameter values for alternative asset classes.<br/><strong>Remove:</strong> Unused predefined thresholds for standardized portfolios.<br/><br/><strong>Section: API Integration & Market Data Feeds</strong><br/><strong>Add:</strong> Bloomberg API integration module.<br/><strong>Modify:</strong> Scheduled data refresh frequency from weekly to daily.<br/><br/><strong>Section: Compliance & Regulatory Updates</strong><br/><strong>Add:</strong> Automated audit logging per <strong>SEC 17a-4 compliance requirements.</strong><br/><strong>Modify:</strong> Encryption settings for data at rest per <strong>ESMA guidelines.</strong><br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "Changes Required in Implementation Checklist",
    //   isanswered: true,
    // },
    // {
    //   content: "<strong>Date:</strong> February 5, 2024 | 🕒 <strong>Time:</strong> 10:00 AM - 11:00 AM <br/><strong>Participants:</strong> [Consultant Name], [Client Business Lead], [Client Tech Team]<br/><strong>Key Discussion Points:</strong><br/><br/>• Custom risk parameter configurations for different asset classes.<br/>• API integration for real-time data feed from Bloomberg.<br/>• Compliance validation for SEC and ESMA guidelines.<br/>• Automated reporting setup for performance tracking.<br/><br/><strong>Action Items:</strong><br/><br/>1. <strong>Consultant:</strong> Provide a configuration document for risk parameter customization – <strong>Due: Feb 7</strong><br/>2. <strong>Client Tech Team:</strong> Share API specifications for Bloomberg integration – <strong>Due: Feb 8</strong><br/>3. <strong>Consultant:</strong> Validate compliance requirements for SEC & ESMA standards – <strong>Due: Feb 10</strong><br/>4. <strong>Client Business Team:</strong> Approve automated reporting workflow – <strong>Due: Feb 12</strong></br><br/><strong>Next Steps:</strong> Follow-up scheduled for <strong>Feb 14, 2024,</strong> to review progress.<br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "1",
    //   similarity_query: "Meeting Summary & Action Items – Call with ABC Asset Management",
    //   isanswered: true,
    // },
    // {
    //   content: "<strong>Aladdin Tech Stack Implementation Checklist – Updated Based on Client Meeting</strong><br/><br/><strong>Section: Portfolio Risk Parameter Configuration</strong><br/><strong>Add:</strong> Custom threshold settings for risk scoring models.<br/><strong>Modify:</strong> Default parameter values for alternative asset classes.<br/><strong>Remove:</strong> Unused predefined thresholds for standardized portfolios.<br/><br/><strong>Section: API Integration & Market Data Feeds</strong><br/><strong>Add:</strong> Bloomberg API integration module.<br/><strong>Modify:</strong> Scheduled data refresh frequency from weekly to daily.<br/><br/><strong>Section: Compliance & Regulatory Updates</strong><br/><strong>Add:</strong> Automated audit logging per <strong>SEC 17a-4 compliance requirements.</strong><br/><strong>Modify:</strong> Encryption settings for data at rest per <strong>ESMA guidelines.</strong><br/>",
    //   sessionid: "1",
    //   audiofiletimestamp: "2022-01-01T00:00:00Z",
    //   common_id: "2",
    //   similarity_query: "Changes Required in Implementation Checklist",
    //   isanswered: true,
    // }
  ],
};

/*
let initialCuesLoadState: CuesState = {
  jobTitle: "EDI Developer",
  jobDescription: "https://arxiv.org/pdf/2301.12652", //pdf
  interviewGuide: "https://arxiv.org/pdf/2410.08174", //pdf
  CuesList: [
    {
      content: "<strong>Date:</strong> February 5, 2024 | 🕒 <strong>Time:</strong> 10:00 AM - 11:00 AM <br/><strong>Participants:</strong> [Consultant Name], [Client Business Lead], [Client Tech Team]<br/><strong>Key Discussion Points:</strong><br/><br/>• Custom risk parameter configurations for different asset classes.<br/>• API integration for real-time data feed from Bloomberg.<br/>• Compliance validation for SEC and ESMA guidelines.<br/>• Automated reporting setup for performance tracking.<br/><br/><strong>Action Items:</strong><br/><br/>1. <strong>Consultant:</strong> Provide a configuration document for risk parameter customization – <strong>Due: Feb 7</strong><br/>2. <strong>Client Tech Team:</strong> Share API specifications for Bloomberg integration – <strong>Due: Feb 8</strong><br/>3. <strong>Consultant:</strong> Validate compliance requirements for SEC & ESMA standards – <strong>Due: Feb 10</strong><br/>4. <strong>Client Business Team:</strong> Approve automated reporting workflow – <strong>Due: Feb 12</strong></br><br/><strong>Next Steps:</strong> Follow-up scheduled for <strong>Feb 14, 2024,</strong> to review progress.<br/>",
      sessionid: "1",
      audiofiletimestamp: "2022-01-01T00:00:00Z",
      common_id: "1",
      similarity_query: "Meeting Summary & Action Items – Call with ABC Asset Management",
      isanswered: true,
    },
    {
      content: "<strong>Aladdin Tech Stack Implementation Checklist – Updated Based on Client Meeting</strong><br/><br/><strong>Section: Portfolio Risk Parameter Configuration</strong><br/><strong>Add:</strong> Custom threshold settings for risk scoring models.<br/><strong>Modify:</strong> Default parameter values for alternative asset classes.<br/><strong>Remove:</strong> Unused predefined thresholds for standardized portfolios.<br/><br/><strong>Section: API Integration & Market Data Feeds</strong><br/><strong>Add:</strong> Bloomberg API integration module.<br/><strong>Modify:</strong> Scheduled data refresh frequency from weekly to daily.<br/><br/><strong>Section: Compliance & Regulatory Updates</strong><br/><strong>Add:</strong> Automated audit logging per <strong>SEC 17a-4 compliance requirements.</strong><br/><strong>Modify:</strong> Encryption settings for data at rest per <strong>ESMA guidelines.</strong><br/>",
      sessionid: "1",
      audiofiletimestamp: "2022-01-01T00:00:00Z",
      common_id: "2",
      similarity_query: "Changes Required in Implementation Checklist",
      isanswered: true,
    }
  ],
};
*/


// Create a slice for "cues"
const cuesSlice = createSlice({
  name: "cuesReducer",
  initialState: {...initialCuesState},
  reducers: {
    addCues: (state, action: PayloadAction<CuesDataType[]>) => {
      // Declare default value for state.CuesList
      let data: CuesDataType = { ...initialCuesObj };

      // Add if condition to check if state.CuesList exists and append to array in that case
      if (action.payload) {
        let newState = action.payload.map((passedState) => {
          passedState["id"] ?? (data["id"] = uuidv4());
          return { ...data, ...passedState };
        });
        state.CuesList = [...(state.CuesList ?? []), ...newState];
      }
      return state;
    },

    // Optionally, you can add actions like reset
    resetCue: (state) => {
      Object.assign(state, initialCuesLoadState);
    },

    setCues: (state, action: PayloadAction<CuesState>) => {
      // Declare default value for state.CuesList
      let data: CuesDataType = { ...initialCuesObj };

      state.CuesList = [];
      // Add if condition to check if state.CuesList exists and append to array in that case
      if (action.payload.CuesList) {
        let newState = action.payload.CuesList.map((passedState) => {
          passedState["id"] ?? (data["id"] = uuidv4());
          return { ...data, ...passedState };
        });
        state.CuesList = newState;
      }
      state.interviewGuide = action.payload.interviewGuide;
      state.jobDescription = action.payload.jobDescription;
      state.jobTitle = action.payload.jobTitle;
      return state;
    },

    updateCues: (state, action: PayloadAction<{CuesList: CuesDataType[]}>) => {
      // Declare default value for state.CuesList
      let data: CuesDataType = { ...initialCuesObj };

      return {...state,...action.payload}
    },
  },
});

export type { CuesState, CuesDataType };
// Export actions so they can be dispatched from components
export const { addCues, resetCue, setCues,updateCues } = cuesSlice.actions;

export { initialCuesObj };

// Export the reducer to be included in the store
export default {
  cuesReducer: cuesSlice.reducer,
};

