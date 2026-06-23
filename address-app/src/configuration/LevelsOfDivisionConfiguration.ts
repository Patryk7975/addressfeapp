import { Country } from "../enums/Country";
import { CountyRomania } from "../enums/CountyRomania";
import { DistrictItaly } from "../enums/DistrictItaly";
import { ProvinceItaly } from "../enums/ProvinceItaly";

type DivisionLevel = "firstLevelOfDivision" | "secondLevelOfDivision" | "thirdLevelOfDivision";

type LevelOfDivisionSection = {
  level: DivisionLevel;
  sectionName: string;
  meaningOptions: string[];
  valueType: "dropdown" | "textbox";
  valueOptions?: string[];
  defaultMeaning?: string;
  defaultValue?: string;
};

type LevelOfDivisionConfigurationType = {
  country: Country;
  sections: LevelOfDivisionSection[];
}[];

export const LevelofDivisionConfiguration: LevelOfDivisionConfigurationType = [
  {
    country: Country.Italy,
    sections: [
      {
        level: "firstLevelOfDivision",
        sectionName: "First level of division",
        meaningOptions: ["Region"],
        valueType: "dropdown",
        valueOptions: Object.keys(DistrictItaly).filter((key) => isNaN(Number(key))),
        defaultValue: "Lazio",
      },
      {
        level: "secondLevelOfDivision",
        sectionName: "Second level of division",
        meaningOptions: ["Province"],
        valueType: "dropdown",
        valueOptions: Object.keys(ProvinceItaly).filter((key) => isNaN(Number(key))),
        defaultValue: "RM",
      },
      {
        level: "thirdLevelOfDivision",
        sectionName: "Third level of division",
        meaningOptions: ["Municipality"],
        valueType: "textbox",
        defaultMeaning: "Municipality",
        defaultValue: "Comune di Roma",
      },
    ],
  },
  {
    country: Country.Romania,
    sections: [
      {
        level: "firstLevelOfDivision",
        sectionName: "First level of division",
        meaningOptions: ["County"],
        valueType: "dropdown",
        valueOptions: Object.keys(CountyRomania).filter((key) => isNaN(Number(key))),
        defaultValue: "Bucharest",
      },
      {
        level: "secondLevelOfDivision",
        sectionName: "Second level of division",
        meaningOptions: ["Municipality", "City", "Commune"],
        valueType: "textbox",
        defaultValue: "Municipality",
      },
      {
        level: "thirdLevelOfDivision",
        sectionName: "Third level of division",
        meaningOptions: ["Village", "Sector", "Locallity"],
        valueType: "textbox",
        defaultMeaning: "Sector",
        defaultValue: "2",
      },
    ],
  },
  {
    country: Country.Spain,
    sections: [
      {
        level: "firstLevelOfDivision",
        sectionName: "First level of division",
        meaningOptions: ["AutonomousCommunity"],
        valueType: "textbox",
        defaultMeaning: "AutonomousCommunity",
        defaultValue: "Test Community",
      },
      {
        level: "secondLevelOfDivision",
        sectionName: "Second level of division",
        meaningOptions: ["Province"],
        valueType: "textbox",
        defaultMeaning: "Province",
        defaultValue: "Test Province",
      },
      {
        level: "thirdLevelOfDivision",
        sectionName: "Third level of division",
        meaningOptions: ["Municipality"],
        valueType: "textbox",
        defaultMeaning: "Municipality",
        defaultValue: "Test Municipality",
      },
    ],
  },
  {
    country: Country.Poland,
    sections: [
      {
        level: "firstLevelOfDivision",
        sectionName: "First level of division",
        meaningOptions: ["Voivodship"],
        valueType: "textbox",
        defaultMeaning: "Voivodship",
        defaultValue: "",
      },
      {
        level: "secondLevelOfDivision",
        sectionName: "Second level of division",
        meaningOptions: ["Powiat"],
        valueType: "textbox",
        defaultMeaning: "Powiat",
        defaultValue: "",
      },
      {
        level: "thirdLevelOfDivision",
        sectionName: "Third level of division",
        meaningOptions: ["Gmina"],
        valueType: "textbox",
        defaultMeaning: "Gmina",
        defaultValue: "",
      },
    ],
  },
];