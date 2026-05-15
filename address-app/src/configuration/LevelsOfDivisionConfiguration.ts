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
      },
      {
        level: "secondLevelOfDivision",
        sectionName: "Second level of division",
        meaningOptions: ["Province"],
        valueType: "dropdown",
        valueOptions: Object.keys(ProvinceItaly).filter((key) => isNaN(Number(key))),
      },
      {
        level: "thirdLevelOfDivision",
        sectionName: "Third level of division",
        meaningOptions: ["Municipality"],
        valueType: "dropdown",
        valueOptions: Object.keys(ProvinceItaly).filter((key) => isNaN(Number(key))),
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
];