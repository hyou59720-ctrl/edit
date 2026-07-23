import React from "react";
import { AuroraText, ComicText, NeonText, ChromeText, FireText, FourColorText, Layered3DText, RetroVintageText, TwoColorText, GlassText, } from "./index";

interface TextEffectRendererProps {
  effect?: "AuroraText" | "NeonText" | "ChromeText" | "FireText" | "ComicText" | "Layered3DText" | "RetroVintageText" | "GlassText" | "TwoColorText" | "FourColorText" ;
  colors?: string[];
  children: React.ReactNode;
}

export const TextEffectRenderer: React.FC<TextEffectRendererProps> = ({
  effect,
  colors,
  children,
}) => {
  switch (effect) {
    case "AuroraText":
      return (
        <AuroraText colors={colors}>
          {children}
        </AuroraText>
      );

    case "NeonText":
      return (
        <NeonText colors={colors}>
          {children}
        </NeonText>
      );

    case "FireText":
      return (
        <FireText colors={colors}>
          {children}
        </FireText>
      );      
      
    case "ChromeText":
      return (
        <ChromeText colors={colors}>
          {children}
        </ChromeText>
      );      
      
    case "ComicText":
      return (
        <ComicText colors={colors}>
          {children}
        </ComicText>
      );

    case "Layered3DText":
      return (
        <Layered3DText colors={colors}>
          {children}
        </Layered3DText>
      );

    case "RetroVintageText":
      return (
        <RetroVintageText colors={colors}>
          {children}
        </RetroVintageText>
      );   

    case "GlassText":
      return (
        <GlassText colors={colors}>
          {children}
        </GlassText>
      );
      
    case "FourColorText":
      return (
        <FourColorText colors={colors}>
          {children}
        </FourColorText>
      );

    case "TwoColorText":
      return (
        <TwoColorText colors={colors}>
          {children}
        </TwoColorText>
      );      
            
    default:
      return <>{children}</>;
  }
};