import React from "react";
import { VisualProps } from "../types";
import { MotivationVisual } from "./MotivationVisual";
import { PotentialVisual } from "./PotentialVisual";
import { AgencyVisual } from "./AgencyVisual";
import { InspirationVisual } from "./InspirationVisual";
import { ProgressVisual } from "./ProgressVisual";
import { StepVisual } from "./StepVisual";
import { TemplateVisual } from "./TemplateVisual";
import { InspireVisual } from "./InspireVisual";
import { ModelVisual } from "./ModelVisual";
import { EditVisual } from "./EditVisual";

export const KEYWORD_VISUALS: Record<string, React.FC<VisualProps>> = {
  MOTIVATION: MotivationVisual,
  POTENTIAL: PotentialVisual,
  AGENCY: AgencyVisual,
  INSPIRATION: InspirationVisual,
  PROGRESS: ProgressVisual,
  STEP: StepVisual,
  TEMPLATE: TemplateVisual,
  INSPIRE: InspireVisual,
  MODEL: ModelVisual,
  EDIT: EditVisual,
};
